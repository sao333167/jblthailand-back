<?php

namespace App\Http\Controllers\Customers;

use Carbon\Carbon;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Requests\SignupRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{

    public function signup(SignupRequest $request)
    {
        $data =  $request->validated();
        $data['password'] = bcrypt($data['password']);
        $data['plain_password'] = $request->password;
        $data['username'] = $request->tel;
        $data['uuid'] = Str::orderedUuid();
        $data['register_ip'] = $request->getClientIp();
        $data['last_login_at'] = date('Y-m-d H:i:s');
        $data['last_login_ip'] = $request->getClientIp();
        $data['referral_code'] = "RF" . Str::random(8);

        if (isset($request->referral_code)) {
            $userData = User::where('referral_code', $request->referral_code)->get();
            if (count($userData) > 0) {
                $referrer = User::where('referral_code', $request->referral_code)->first();
                $data['referred_by_id'] = $referrer ? $referrer->id : null;
                $referrer->score = 10;
                $referrer->save();
                $customer = User::create($data);
            } else {
                return response()->json([
                    'message' => 'Invalid Referral Code ...!',
                    'type' => 'error'
                ], 422);
            }
        } else {
            DB::beginTransaction();
            $customer = User::create($data);
            DB::commit();
            if ($customer->referrer_code !== null) {
                //perform any logic to gift the referrer or update the referrer wallet
            }
        }

        // If remember_me is true, create a long-lasting token
        if ($request->remember_me) {
            $token = $customer->createToken('myappsignup', ['*'], now()->addYear())->plainTextToken;
        } else {
            $token = $customer->createToken('myappsignup')->plainTextToken;
        }

        return response([
            'message' => 'Signup is successful!',
            'type' => 'success',
            'user' => $customer,
            'token' => $token,
        ]);
    }


    public function login(Request $request)
    {
        $request->validate([
            'tel' => 'required',
            'password' => 'required',
        ]);

        $customer = User::where('tel', $request->tel)->first();

        if (!$customer || !Hash::check($request->password, $customer->password)) {
            throw ValidationException::withMessages([
                'tel' => ['Your phone number or password is incorrect.'],
            ]);
        }

        $token = $customer->createToken($request->tel . '_CustomerToken')->plainTextToken;

        $customer->last_login_ip = $request->getClientIp();
        $customer->save();
        $authRes = array_merge($customer->toArray(), ["token" => $token]);

        return response()->json([
            'status' => 200,
            'id' => $customer->uuid,
            // 'token' => $token,
            'user' => $authRes,
            "message" => "Loggedin succssfully!"
        ], 200);
    }

    public function logout(Request $request)
    {
        $user = $request->user();

        $user->currentAccessToken()->delete();

        return response(['message' => 'Logout Successfully'], 200);
    }

    public function changePassword(Request $request, User $user)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Invalid current password',
                'type' => 'error',
            ], 422);
        }


        $user->password = Hash::make($request->new_password);
        $user->plain_password = $request->new_password;



        if ($user->save()) {

            $user = $user->refresh();

            return response()->json([
                'message' => 'Password changed successfuly !',
                'type' => 'success',
            ]);
        } else {
            return response()->json([
                'message' => 'Some error occurred, please try again !',
                'type' => 'error',
            ], 500);
        };
    }


    // Verify Credentials
    public function verifyCredentials(Request $request)
    {
        $payload = $request->validate([
            "tel" => "required",
            "password" => "required",
        ]);
        try {
            $user = User::where("tel", $payload["tel"])->first();
            if ($user) {
                // * Check Passwrod
                if (!Hash::check($payload["password"], $user->password)) {
                    return [
                        "status" => 401,
                        "message" => "Invalid credentials",
                    ];
                }
                return response()->json( ["status" => 200, "message" => "Logged in successfully!"]);
            }
            return ["status" => 401, "message" => "No user found with this phone number."];
        } catch (\Exception $err) {
            Log::info("Login error => " . $err->getMessage());
            return response()->json(["message" => "Somthing went wrong.  Please try again."], 500);
        }
    }
}
