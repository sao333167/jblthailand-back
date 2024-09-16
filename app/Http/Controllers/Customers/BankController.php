<?php

namespace App\Http\Controllers\Customers;

use Carbon\Carbon;
use App\Models\Bank;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class BankController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $userId = $request->get("customer_uuid");
        $bank = Bank::select('*')->where("customer_uuid", $userId)->with('users')->get();
        return response()->json($bank);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
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
        $request->validate([
            'bank_name' => 'required|string|max:255',
            'bank_acc' => 'required|string|max:255',
            'bank_brand' => 'required|string|max:255',
        ]);

        $user = User::where('uuid', Auth::user()->uuid)->first();

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $currentMonth = Carbon::now()->startOfMonth(); // Get the start of the current month
        $nextMonth = Carbon::now()->startOfMonth()->addMonth(); // Get the start of the next month
    
        // Check if the user has a  in the current month
        $existing = Bank::where('customer_uuid', $user->uuid)
            ->whereBetween('date', [$currentMonth, $nextMonth])
            ->first();
    
        if ($existing) {
            // Return a response indicating the user cannot take another  this month
            return response()->json(['error' => 'You already completed !.'], 403);
        }

        $currentDate = Carbon::now()->format('Y-m-d');

        try {
            $bank = Bank::create([
                'uuid' => Str::orderedUuid(),
                'user_id' => $user->id,
                'customer_uuid' => $user->uuid,
                'bank_name' => $request->bank_name,
                'bank_acc' => $request->bank_acc,
                'bank_brand' => $request->bank_brand,
                'date' => $currentDate,
                'status' => '1',
            ]);

            return response()->json($bank, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Bank $bank)
    {
        $user = User::where('uuid', Auth::user()->uuid)->first();
        $bank = Bank::where('customer_uuid', $user->uuid)->first();

        if (!$bank) {
            return response()->json(['error' => 'Bank details not found'], 404);
        }
        return response()->json($bank);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
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
        $bank = Bank::where('user_id', $id)->first();

        
        if (!$bank) {
            return response()->json(['error' => 'Bank details not found'], 404);
        }

        $request->validate([
            'bank_name' => 'required|string|max:255',
            'bank_acc' => 'required|string|max:255',
        ]);

        $bank->update([
            'bank_name' => $request->bank_name,
            'bank_acc' => $request->bank_acc,
        ]);

        return response()->json($bank);
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