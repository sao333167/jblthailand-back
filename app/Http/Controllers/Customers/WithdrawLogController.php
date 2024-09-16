<?php

namespace App\Http\Controllers\Customers;

use Carbon\Carbon;
use App\Models\Loan;
use App\Models\User;
use App\Models\WithdrawLog;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class WithdrawLogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $user = User::where('uuid',Auth::user()->uuid) ->first();
        // Validate the request
        $validated = $request->validate([
            'withdraw_code' => 'required|string',
            'withdraw_amount' => 'required|numeric',
        ]);
    
        // Find the loan using the loan code
        $loan = Loan::where('withdraw_code', $validated['withdraw_code'])->first();
    
        if (!$loan) {
            return response()->json(['message' => 'Invalid loan code!'], 400);
        }
    
        // Check if the amount matches
        if ($loan->amount != $validated['withdraw_amount']) {
            return response()->json(['message' => 'Invalid loan amount!'], 400);
        }
    
        // // Process withdrawal logic here
        // // Example: Mark loan as withdrawn and record the transaction
        // $loan->loan_remark = 'pending for verifying';
        // $loan->status_color = '#d0021b';
        // $loan->save();

        

        $currentDate = Carbon::now()->format('Y-m-d');


        // Generate 9 random digits
        $digits = mt_rand(100000000, 999999999); // Generates a 9-digit number

        // Generate 6 random letters
        $letters = Str::upper(Str::random(6)); // Generates a 6-letter uppercase string

        // Combine them
        $randomString = $letters . $digits;

        $afterAmount = $user->amount - $validated['withdraw_amount'];

        
        // Record the withdrawal in the withdraw log
        WithdrawLog::create([
            'uuid' => Str::orderedUuid(),
            'withdraw_order_number' => $randomString,
            'loan_id' => $loan->id,
            'loan_uuid' => $loan->uuid,
            'withdraw_amount' => $validated['withdraw_amount'],
            'before_amount' => $user->amount,
            'after_amount' => $afterAmount,
            'customer_uuid' => $user->uuid,
            'user_id' => $user->id,
            'withdraw_code' => $loan->withdraw_code,
            'withdraw_date' => $currentDate,
            'withdraw_remark' => 'pending for verifying',
            'ip_address' => $request->ip(),
            
        ]);

        $user->amount = $afterAmount;
        $user->save();    
    
        return response()->json(['message' => 'Withdrawal successful!'], 200);
    }
    

    /**
     * Display the specified resource.
     */
    public function show($uuid)
    {
        $withdraw = WithdrawLog::join('users', 'users.uuid', '=', 'withdraw_logs.customer_uuid')
    
            ->select(
                'withdraw_logs.withdraw_order_number',
                'withdraw_logs.withdraw_amount',
                'withdraw_logs.uuid AS withdraw_uuid',
                'withdraw_logs.customer_uuid',
                'withdraw_logs.withdraw_date',
                'withdraw_logs.withdraw_remark',
                'withdraw_logs.status_color',
                'withdraw_logs.created_at',
                'users.tel AS customer_tel',
                'users.amount AS customer_amount',
            )
            ->where('withdraw_logs.customer_uuid', $uuid)
            ->latest()->first();

        return response()->json($withdraw);
    }

    public function withdraws($uuid)
    {
        $withdraws = WithdrawLog::join('users', 'users.uuid', '=', 'withdraw_logs.customer_uuid')
            ->select(
                'withdraw_logs.withdraw_order_number',
                'withdraw_logs.withdraw_amount',
                'withdraw_logs.uuid AS withdraw_uuid',
                'withdraw_logs.customer_uuid',
                'withdraw_logs.withdraw_date',
                'withdraw_logs.withdraw_remark',
                'withdraw_logs.status_color',
                'withdraw_logs.created_at',
                'users.tel AS customer_tel',
                'users.amount AS customer_amount'
            )
            ->where('withdraw_logs.customer_uuid', $uuid)
            ->orderBy('withdraw_uuid','desc')->get(); 

        return response()->json($withdraws);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
