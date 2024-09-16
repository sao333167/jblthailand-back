<?php

namespace App\Http\Controllers\Customers;

use App\Models\Loan;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\ScheduledPayment;
use App\Http\Controllers\Controller;

class ScheduledPaymentController extends Controller
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($uuid)
    {

        $loan = Loan::where('loans.customer_uuid', $uuid)
            ->join('durations', 'durations.id', '=', 'loans.duration_id')
            ->join('users', 'users.uuid', '=', 'loans.customer_uuid')
            ->select(
                'loans.*',
                'loans.status AS loan_status',
                'users.*',
                'users.status AS users_status',
                'durations.*'
            )
            ->first();

        $ScheduledPayment = ScheduledPayment::join('loans', 'scheduled_payments.loan_id', '=',  'loans.id')
            ->join('durations', 'durations.id', '=', 'loans.duration_id')
            ->select(
                'scheduled_payments.*',
                'scheduled_payments.status AS schedule_status',
                'scheduled_payments.amount AS schedule_amount',
                'scheduled_payments.date AS schedule_pay_date',
                'loans.*',
                'loans.status AS loan_status',
                'durations.*',
                'loans.date AS loan_date',
                'durations.*'
            )
            ->where('scheduled_payments.customer_uuid', $uuid)->get();
        return response()->json([
            'scheduled' => $ScheduledPayment,
            'loan' => $loan
        ]);
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