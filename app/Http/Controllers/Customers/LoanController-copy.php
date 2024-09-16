<?php

namespace App\Http\Controllers\Customers;

use Carbon\Carbon;
use App\Models\Loan;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Duration;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;


class LoanController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $user = User::where('uuid', Auth::user()->uuid)->first();

        $currentDate = Carbon::now()->toDateString();
        $loan = Loan::create([
            'uuid' => Str::orderedUuid(),
            'customer_uuid' => $user->uuid,
            'user_id' => $user->id,
            'duration_id' => $request->durationId,
            'amount' => $request->amount, // ex: 50000
            'interest' => $request->interest, // ex: 12.00
            'total' => $request->total,
            'pay_month' => $request->payMonth,
            'date' => $currentDate,
            'status' => '1',
        ]);

        $duration = Duration::where('id', $loan->duration_id)->first();
        $openingBalance = $request->amount; // ex: 50000
        $LoanPeriod = $duration->month; // ex: 12 term
        $AnnualInterestRate = $duration->percent * 12 ; // ex: 1.2% = 1.2 * 12 = 14.40% per year
        // $InterestCharged = $openingBalance *($AnnualInterestRate /12) / 100 ;
    

        // Provided total repayment amount per month
        $originalRepaymentAmount = $request->payMonth; // ex: 4442.44 per month

        $scheduledPayments = [];

        for ($i = 0; $i < $LoanPeriod; $i++) {
            $interestCharged = ($openingBalance * ($AnnualInterestRate / 12)) / 100;
            
            $capitalRepaid = $originalRepaymentAmount - $interestCharged;
            $closingBalance = $openingBalance - $capitalRepaid;
            $capitalOutstandingPercent = ($closingBalance / $openingBalance) * 100;

            $scheduledPayments[] = [
                'uuid' => Str::orderedUuid(),
                'customer_uuid' => $user->uuid,
                'loan_id' => $loan->id,
                'date' => Carbon::now()->addMonths($i)->format('Y-m-d'),
                'amount' => $originalRepaymentAmount,
                'loan_repayment' => $originalRepaymentAmount,
                'interest_charged' => $interestCharged,
                'capital_repaid' => $capitalRepaid,
                'closing_amount' => $closingBalance,
                'capital_outstanding_percent' => $capitalOutstandingPercent,
                'status' => '0',
                'created_at' => now(),
                'updated_at' => now(),
            ];

            $openingBalance = $closingBalance;
        }

        DB::table('scheduled_payments')->insert($scheduledPayments);

        return response()->json($loan);
    }




    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($uuid)
    {
        $loan = Loan::join('users', 'users.uuid', '=', 'loans.customer_uuid')
        ->join('durations', 'durations.id', '=', 'loans.duration_id')
        ->select('loans.*', 'users.tel AS customer_tel','durations.*')
        ->where('loans.customer_uuid', $uuid)->first();
        // $loan = Loan::where('id_customer', $id)->first();
        return response()->json($loan);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}