<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Admin;
use App\Models\WithdrawLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WithdrawLogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $withdraws = WithdrawLog::leftJoin('users', 'withdraw_logs.customer_uuid', '=', 'users.uuid')
        ->select(
            'withdraw_logs.*',
            'users.username',
            'users.name as customer_name',
        )->orderBy('uuid','desc')->get();;
    return response()->json($withdraws);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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


    public function updateWithdrawRemark(Request $request, $uuid)
    {
        $admin = Admin::where('uuid', Auth::user()->uuid)->first();
        $withdraw = WithdrawLog::where('uuid', $uuid)->firstOrFail();
    
      
    
        $withdraw->update([
            'status_color' => $request->input('status_color'),
            'withdraw_remark' => $request->input('withdraw_remark'),
            'admin_uuid' => $admin->uuid,
        ]);
    
        if($request->input('withdraw_remark') === "reject") {
            $user = User::where('uuid', $withdraw->customer_uuid)->first();
            $user->amount = $withdraw->withdraw_amount;
            $user->save();
        }

        return response()->json(['message' => 'Loan Remark is updated']);
    }

}
