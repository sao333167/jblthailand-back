<?php

namespace App\Http\Controllers\Customers;

use App\Models\Duration;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class DurationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $duration = Duration::where('status', "0")->get();
        return response()->json($duration);
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
}