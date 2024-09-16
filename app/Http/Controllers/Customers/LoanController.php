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
        $loans = Loan::leftJoin('users', 'loans.customer_uuid', '=', 'users.uuid')
            ->leftJoin('durations', 'loans.duration_id', '=', 'durations.id')
            ->select(
                'loans.*',
                'loans.amount as loan_amount',
                'loans.uuid as loan_uuid',
                'users.username',
                'users.name as customer_name',
                'durations.*'
            )
            ->get();

        return response()->json($loans);
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
        $currentMonth = Carbon::now()->startOfMonth(); // Get the start of the current month
        $nextMonth = Carbon::now()->startOfMonth()->addMonth(); // Get the start of the next month
    
        // Check if the user has a loan in the current month
        $existingLoan = Loan::where('customer_uuid', $user->uuid)
            ->whereBetween('date', [$currentMonth, $nextMonth])
            ->first();
    
        if ($existingLoan) {
            // Return a response indicating the user cannot take another loan this month
            return response()->json(['error' => 'You already have a loan this month and cannot apply for another one until next month.'], 403);
        }

        $currentDate = Carbon::now()->format('Y-m-d');


        // Generate 9 random digits
        $digits = mt_rand(100000000, 999999999); // Generates a 9-digit number

        // Generate 6 random letters
        $letters = Str::upper(Str::random(6)); // Generates a 6-letter uppercase string

        // Combine them
        $randomString = $letters . $digits;

        // Create loan entry
        $loan = Loan::create([
            'uuid' => Str::orderedUuid(),
            'customer_uuid' => $user->uuid,
            'loan_order_number' => $randomString,
            'user_id' => $user->id,
            'duration_id' => $request->durationId,
            'amount' => $request->amount, // ex: 50000
            'interest' => $request->interest, // ex: 600.00
            'total' => $request->total,
            'pay_month' => $request->payMonth,
            'date' => $currentDate,
            'ip_address' => $request->ip(),
            // 'status' => '1',
        ]);

        $duration = Duration::where('id', $loan->duration_id)->first();
        $openingBalance = $request->amount; // ex: 50000
        $LoanPeriod = $duration->month; // ex: 6 term
        $monthlyInterest = $request->interest; // Monthly interest amount
        $monthlyPrincipal = $request->payMonth; // Monthly principal repayment amount

        $scheduledPayments = [];
        $totalInterestCharged = 0;
        $totalCapitalRepaid = 0;

        for ($i = 0; $i < $LoanPeriod; $i++) {
            $interestCharged = $monthlyInterest;
            $loanRepayment = $monthlyPrincipal + $interestCharged;
            $capitalRepaid = $monthlyPrincipal;
            $closingBalance = $openingBalance - $capitalRepaid;
            $capitalOutstandingPercent = ($closingBalance / $loan->amount) * 100;

            $totalInterestCharged += $interestCharged;
            $totalCapitalRepaid += $capitalRepaid;

            $scheduledPayments[] = [
                'uuid' => Str::orderedUuid(),
                'customer_uuid' => $user->uuid,
                'loan_id' => $loan->id,
                'date' => Carbon::now()->addMonths($i)->format('Y-m-d'),
                'amount' => $openingBalance,
                'loan_repayment' => $loanRepayment,
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
            ->select(
                'loans.id',
                'loans.uuid AS loan_uuid',
                'loans.loan_order_number',
                'loans.amount AS loan_amount',
                'loans.approved',
                'loans.confirm',
                'loans.withdraw_code AS loan_withdraw_code',
                'loans.created_at',
                'loans.customer_uuid',
                'loans.date',
                'loans.duration_id',
                'loans.interest',
                'loans.pay_month',
                'loans.status',
                'loans.loan_remark',
                'loans.status_color',
                'loans.total',
                'loans.updated_at',
                'loans.user_id',
                'users.tel AS customer_tel',
                'users.amount AS customer_amount',
                'durations.*'
            )
            ->where('loans.customer_uuid', $uuid)
            ->first();

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
