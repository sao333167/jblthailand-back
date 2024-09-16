<?php

namespace App\Http\Controllers;

use App\Models\Systemsetting;
use Illuminate\Http\Request;

class SystemsettingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $systemsetting = Systemsetting::all();
        return response()->json($systemsetting);
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
    public function show(Systemsetting $systemsetting)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Systemsetting $systemsetting)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Systemsetting $systemsetting)
    {
        //
    }
}
