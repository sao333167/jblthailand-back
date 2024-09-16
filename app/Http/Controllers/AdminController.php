<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\AdminResource;
use App\Http\Requests\AdminLoginRequest;
use App\Http\Requests\StoreAdminRequest;
use App\Http\Requests\UpdateAdminRequest;
use App\Http\Requests\ChangePasswordRequest;


class AdminController extends Controller
{




    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return AdminResource::collection(
            Admin::query()
                ->whereDoesntHave('roles', function ($query) {
                    $query->where('name', 'super');
                })
                ->orderBy('id', 'desc')
                ->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAdminRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Admin $admin)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAdminRequest $request, Admin $admin)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Admin $admin)
    {
        //
    }

    public function login(AdminLoginRequest $request)
    {
        // Authenticate the user
        if (!Auth::guard('admin')->attempt($request->only(['phone', 'password']))) {
            return response()->json(['message' => 'Invalid username or password'], 422);
        }

        // Retrieve the authenticated admin
        $admin = Auth::guard('admin')->user();

        // Check if the admin's status is 0
        if ($admin->status != 0) {
            // If the status is not 0, log the user out and return an error response
            Auth::guard('admin')->logout();
            return response()->json(['message' => 'Please Contact Supporter '], 422);
        }

        // Update last login information
        $admin->last_login_at = now();
        $admin->last_login_ip = $request->getClientIp();
        $admin->save();

        // Create a token for the admin
        $token = $admin->createToken('myapptoken')->plainTextToken;

        return response()->json([
            'user' => new AdminResource($admin),
            'token' => $token
        ], 200);
    }

    public function changepassword(ChangePasswordRequest $request)
    {
        // Retrieve the authenticated admin
        $admin = Auth::guard('admin')->user();


        // Debug statement to check if admin is retrieved
        if (!$admin) {
            return response()->json(['message' => 'Admin not authenticated'], 401);
        }

        // Verify the current password
        if (!Hash::check($request->current_password, $admin->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 422);
        }

        // Update the password
        $admin->password = Hash::make($request->new_password);
        $admin->plain_password = $request->new_password;
        $admin->save();

        return response()->json(['message' => 'Password changed successfully'], 200);
    }

    public function logout(Request $request)
    {
        $admin = $request->user();

        $admin->currentAccessToken()->delete();

        return response(['message' => 'Logout Successfully'], 200);
    }
}