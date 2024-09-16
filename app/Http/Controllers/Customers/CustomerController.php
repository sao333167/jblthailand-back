<?php

namespace App\Http\Controllers\Customers;

use App\Models\Bank;
use App\Models\User;
use App\Models\Customer;
use App\Models\DocumentId;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class CustomerController extends Controller
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
        $user = DB::table('users')
            ->leftJoin('banks', 'banks.customer_uuid', '=', 'users.uuid')
            ->leftJoin('document_ids', 'document_ids.customer_uuid', '=', 'users.uuid')
            ->leftJoin('signatures', 'signatures.customer_uuid', '=', 'users.uuid')
            ->select(
                'users.*',
                'banks.*',
                'document_ids.*',
                'signatures.*',
                DB::raw('COALESCE(users.status, 0) AS user_status'), // handle null user status
                DB::raw('COALESCE(banks.status, 0) AS bank_status'), // handle null bank status
                DB::raw('COALESCE(document_ids.status, 0) AS doc_status'), // handle null document status
                DB::raw('COALESCE(document_ids.name, 0) AS real_name'),
                DB::raw('COALESCE(signatures.status, "0") AS sign_status') // handle null signature status
            )
            ->where('users.uuid', '=', $uuid)
            ->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user);
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $uuid)
    {

        $user = User::where('uuid', Auth::user()->uuid)->first();
        $user->current_occupation = $request->currentWork;
        $user->company_name = $request->companyName;
        $user->monthly_income = $request->income;
        $user->contact_number = $request->contactNumber;
        $user->current_address = $request->currentAddress;
        $user->emergency_contact_number = $request->otherContact;
        $user->emergency_contact_name = $request->otherName;
        $user->emergency_contact_relativity = $request->otherRelativity;
        $user->status = '1';
        $user->save();

        return response()->json([
            'user' => $user,
        ]);
    }





    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
