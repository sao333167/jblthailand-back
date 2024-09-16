<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\Status;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use PhpParser\Node\Expr\FuncCall;

class StatusController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $status = Status::leftJoin('admins', 'statuses.admin_uuid', '=', 'admins.uuid')
            ->select('statuses.*', 'admins.name as admin_name')
            ->get();
        return response()->json($status);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $admin = Admin::where('uuid', Auth::user()->uuid)->first();
        if (!$admin) {
            return response()->json(['error' => 'Admin not authenticated'], 401);
        }
        $request->validate([
            'name' => 'required|string|max:255',
            // 'slug' => 'required|string|max:255|unique:statuses,slug',
            'admin_uuid' => 'nullable|string|exists:admins,uuid',
            'color' => 'required|string|max:7',
        ]);



        $status = Status::create([
            'uuid' => Str::uuid(),
            'admin_uuid' => $admin->uuid,
            'slug' => $request->slug,
            'name' => $request->name,
            'color' => $request->color,
            'ip_address' => $request->ip(),
        ]);

        return response()->json($status, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $status = Status::findOrFail($id);
        return response()->json($status);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $status = Status::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            // 'slug' => 'sometimes|required|string|max:255|unique:statuses,slug,' . $status->id,
            'admin_uuid' => 'nullable|string|exists:admins,uuid',
            'color' => 'required|string|max:8',
        ]);

        $admin = Admin::where('uuid', Auth::user()->uuid)->first();
        if (!$admin) {
            return response()->json(['error' => 'Admin not authenticated'], 401);
        }

        $status->admin_uuid = $admin->uuid ?? $status->admin_uuid;
        // $status->slug = $validatedData['slug'] ?? $status->slug;
        $status->name = $validatedData['name'] ?? $status->name;
        $status->color = $validatedData['color'] ?? $status->color;
        $status->ip_address = $request->ip();
        $status->save();

        return response()->json($status);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $status = Status::findOrFail($id);
        $status->delete();

        return response()->json(null, 204);
    }

    public function updateActiveStatus(Request $request, string $id)
{
    // Validate incoming request
    $validatedData = $request->validate([
        'actived' => 'required|boolean',
    ]);

    // Find the status by UUID
    $status = Status::where('uuid', $id)->firstOrFail();
    
     // Update the user's score
     $status->update([
        'actived' => $validatedData['actived'],
    ]);

    return response()->json(['message' => 'Status updated successfully!']);
}

}
