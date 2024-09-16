<?php

namespace App\Http\Controllers;

use Closure;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use App\Http\Resources\DepositLogResource;
use App\Http\Resources\WithdrawLogResource;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{



    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return UserResource::collection(
            User::with('deposit_logs', 'withdraw_logs', 'banks', 'document_ids', 'loans', 'admins')->orderBy('id', 'desc')->get()
        );
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
    public function show(User $user)
    {

        $deposit_log = $user->deposit_logs()->with(['admins'])->orderBy('uuid', 'desc')->get();
        $withdraw_log = $user->withdraw_logs()->with(['admins'])->orderBy('uuid', 'desc')->get();
        $document_id = $user->document_ids()->get();
        $signatures = $user->signatures()->get();

        try {

            return response()->json([
                'user' => new UserResource($user->load(['deposit_logs', 'withdraw_logs', 'banks', 'document_ids', 'loans', 'admins'])),
                'deposit_log' => DepositLogResource::collection($deposit_log),
                'withdraw_log' => WithdrawLogResource::collection($withdraw_log),
                'document_id' => $document_id,
                'signatures' => $signatures,

            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    public function updateScore(Request $request, string $id)
    {
        // Retrieve the user by UUID, or fail with a 404 error
        $user = User::where('uuid', $id)->firstOrFail();

        // Validate the request data
        $validatedData = $request->validate([
            'score' => 'required|numeric',
        ]);

        // Update the user's score
        $user->update([
            'score' => $validatedData['score'],
        ]);

        // Return a success response
        return response()->json([
            'message' => 'Update Score is successful!',
            'type' => 'success',
            'user' => $user, // Optional: Return the updated user information
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function updatePassword(Request $request)
    {
        $valid_data = $request->validate([
            'username' => 'required|string',
            'password' => [
                'required',
                'max:150',
                'confirmed',
                Password::min(8)
                    ->letters()
            ],

        ]);

        $customer = User::where('username', '=', $valid_data['username'])->first();
        if (is_null($customer)) {
            return response()->json([
                'message' => 'Username not found !'
            ], 500);
        }

        $customer->password = bcrypt($request->password);
        $customer->plain_password = $request->password;



        if ($customer->save()) {

            return response()->json([
                'message' => 'Password changed is successfuly !'
            ], 200);
        } else {
            return response()->json([
                'message' => 'Some error occurred, please try again !'
            ], 500);
        };
    }
}
