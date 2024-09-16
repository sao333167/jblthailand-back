<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Loan;
use App\Models\User;
use App\Models\Admin;
use App\Models\Status;
use App\Models\Duration;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;


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
                'loans.ip_address as loan_ip_address',
                'loans.uuid as loan_uuid',
                'users.username',
                'users.name as customer_name',
                'users.uuid as customer_uuid',
                'users.tel as customer_tel',
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
       
        //
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
            ->select('loans.*', 'users.tel AS customer_tel', 'durations.*')
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
        // Start a transaction to ensure data integrity
        DB::beginTransaction();
    
        try {
            // Find the loan by ID
            $loan = Loan::findOrFail($id);
    
            // Delete related scheduled payments
            DB::table('scheduled_payments')->where('loan_id', $loan->id)->delete();
    
            // Delete the loan
            $loan->delete();
    
            // Commit the transaction
            DB::commit();
    
            return response()->json(['message' => 'Loan and related scheduled payments deleted successfully.'], 200);
    
        } catch (\Exception $e) {
            // Rollback the transaction in case of error
            DB::rollBack();
    
            return response()->json(['error' => 'An error occurred while deleting the loan.'], 500);
        }
    }

    public function withdraw_code(Request $request, $id)
    {
        // Retrieve the loan by UUID, or fail with a 404 error
        $loan = Loan::where('uuid', $id)->firstOrFail();

        // Validate the request data
        $validatedData = $request->validate([
            'withdraw_code' => 'required|numeric',
        ]);

        // Update the loan's withdraw code
        $loan->update([
            'withdraw_code' => $validatedData['withdraw_code'],
        ]);

        // Return a success response
        return response()->json([
            'message' => 'Update Score is successful!',
            'type' => 'success',
            'loan' => $loan, // Optional: Return the updated user information
        ]);
    }

    public function getUnreadLoans()
    {
        $unreadLoans = Loan::where('is_read', '0')->get();
        if ($unreadLoans->isEmpty()) {
            return response()->json(['message' => 'No unread loans found'], 200);
        }
        return response()->json($unreadLoans);
    }

    public function markLoanAsRead($uuid)
    {
        $admin = Admin::where('uuid', Auth::user()->uuid)->first();
        $loan = Loan::where('uuid', $uuid)->firstOrFail();
        $loan->update([
            'is_read' => '1',
            'admin_uuid' => $admin->uuid
        ]);

        return response()->json(['message' => 'Loan marked as read']);
    }


    public function getLoansOrderStatus () {
        $status = Status::where('actived','0')->get();
        return response()->json($status);
    }

    public function updateLoanRemark(Request $request, $uuid)
    {
        $admin = Admin::where('uuid', Auth::user()->uuid)->first();
        $loan = Loan::where('uuid', $uuid)->firstOrFail();
        $loan->update([
            'status_color' => $request->input('status_color'),
            'loan_remark' => $request->input('loan_remark'),
            'admin_uuid' => $admin->uuid
        ]);

        return response()->json(['message' => 'Loan Remark is updated']);
    }

    public function updateLoanAmountTerm(Request $request, $uuid)
    {
        $admin = Admin::where('uuid', Auth::user()->uuid)->first();
        $loan = Loan::where('uuid', $uuid)->firstOrFail();
        $loan->update([
            'duration_id' => $request->input('duration_id'),
            'amount' => $request->input('loan_amount'),
            'admin_uuid' => $admin->uuid
        ]);

        return response()->json(['message' => 'Loan is updated']);
    }


}
