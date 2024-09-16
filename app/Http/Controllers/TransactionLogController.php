<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\TransactionLog;
use Illuminate\Support\Facades\Auth;

class TransactionLogController extends Controller
{
    // Display a listing of the resource.
    public function index()
    {
        $transactions = TransactionLog::leftJoin('users', 'transaction_logs.customer_uuid', '=', 'users.uuid')
            ->select(
                'transaction_logs.*',
                'users.username',
                'users.name as customer_name',
            )->get();
        return response()->json($transactions);
    }

    // Store a newly created resource in storage.
    public function store(Request $request)
    {
        $request->validate([
            'customer_uuid' => 'required',
            'user_id' => 'required|exists:users,id',
            'amount' => 'required|numeric',
            'before_amount' => 'required|numeric',
            // 'after_amount' => 'required|numeric',
            // 'status' => 'required|in:0,1',
        ]);
        // Retrieve the authenticated admin
        $admin = Admin::where('uuid', Auth::user()->uuid)->first();
        if (!$admin) {
            return response()->json(['error' => 'Admin not authenticated'], 401);
        }

        $user = User::where('uuid', $request->customer_uuid)->first();

        $afterAmount = $request->amount + $request->before_amount;

        $transaction = TransactionLog::create([
            'uuid' =>  Str::orderedUuid(),
            'customer_uuid' => $request->customer_uuid,
            'admin_uuid' => $admin->uuid,
            'user_id' => $request->user_id,
            'amount' => $request->amount,
            'before_amount' => $request->before_amount,
            'after_amount' => $afterAmount,
            'remake' => $request->remake,
            'transaction_date' => $request->deposit_date ?? now(),
            // 'status' => $request->status,
        ]);

        $user->update([
            'amount' => $afterAmount,
        ]);

        return response()->json($transaction, 201);
    }

    // Display the specified resource.
    public function show(TransactionLog $transactionLog)
    {
        return response()->json($transactionLog);
    }

    // Update the specified resource in storage.
    public function update(Request $request, TransactionLog $transactionLog)
    {
        $request->validate([
            'amount' => 'nullable|numeric',
            'before_amount' => 'nullable|numeric',
            'after_amount' => 'nullable|numeric',
            'status' => 'nullable|in:0,1',
        ]);

        $transactionLog->update($request->only([
            'admin_uuid',
            'amount',
            'before_amount',
            'after_amount',
            'remake',
            'status'
        ]));

        return response()->json($transactionLog);
    }

    // Remove the specified resource from storage.
    public function destroy(TransactionLog $transactionLog)
    {
        $transactionLog->delete();
        return response()->json(null, 204);
    }
}
