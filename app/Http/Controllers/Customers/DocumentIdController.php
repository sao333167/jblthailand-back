<?php

namespace App\Http\Controllers\Customers;

use Carbon\Carbon;
use App\Models\User;
use App\Models\DocumentId;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;

class DocumentIdController extends Controller
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
        $image1 = $request->file('frontImage');
        $image2 = $request->file('backImage');
        $image3 = $request->file('fullImage');

        if (isset($image1) && isset($image2) && isset($image3)) {
            $currentDate = Carbon::now()->toDateString();

            $imageName1 = $currentDate . '-' . uniqid() . '.' . $image1->getClientOriginalExtension();
            $imageName2 = $currentDate . '-' . uniqid() . '.' . $image2->getClientOriginalExtension();
            $imageName3 = $currentDate . '-' . uniqid() . '.' . $image3->getClientOriginalExtension();

            if (!Storage::disk('public')->exists('customer')) {
                Storage::disk('public')->makeDirectory('customer');
            }

            // Ensure the public storage link is created and directory exists
            if (!file_exists(public_path('storage/customer'))) {
                mkdir(public_path('storage/customer'), 0777, true);
            }

            $image_public_path =  public_path('storage/customer');

            $img1 = Image::read($image1->path());
            $img1->resize(800, 600, function ($constraint) {
                $constraint->aspectRatio();
            })->save($image_public_path . '/' . $imageName1);

            $destinationPath = public_path('/customer');
            $image1->move($destinationPath, $imageName1);


            $img2 = Image::read($image2->path());
            $img2->resize(800, 600, function ($constraint) {
                $constraint->aspectRatio();
            })->save($image_public_path . '/' . $imageName2);

            $destinationPath = public_path('/customer');
            $image2->move($destinationPath, $imageName2);

            $img3 = Image::read($image3->path());
            $img3->resize(800, 600, function ($constraint) {
                $constraint->aspectRatio();
            })->save($image_public_path . '/' . $imageName3);

            $destinationPath = public_path('/customer');
            $image3->move($destinationPath, $imageName3);
        }

        $user = User::where('uuid', Auth::user()->uuid)->first();
        $currentMonth = Carbon::now()->startOfMonth(); // Get the start of the current month
        $nextMonth = Carbon::now()->startOfMonth()->addMonth(); // Get the start of the next month
    
        // Check if the user has a loan in the current month
        $existingLoan = DocumentId::where('customer_uuid', $user->uuid)
            ->whereBetween('date', [$currentMonth, $nextMonth])
            ->first();
    
        if ($existingLoan) {
            // Return a response indicating the user cannot take another loan this month
            return response()->json(['error' => 'You already completed !.'], 403);
        }

        $user->name = $request->name;
        $user->birthday = $request->birthday;
        $user->gender = $request->gender;
        $user->status = '1';
        $user->save();


        $currentDate = Carbon::now()->format('Y-m-d');
        $document = DocumentId::create([
            'uuid'      => Str::orderedUuid(),
            'user_id' => $user->id,
            'customer_uuid' => $user->uuid,
            'name' => $request->name,
            'id_number' => $request->idNumber,
            'front' => $imageName1,
            'back' => $imageName2,
            'full' => $imageName3,
            'date' => $currentDate,
            'status' => '1',
        ]);

        return response()->json([
            'document' => $document
        ]);
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
        $document = DocumentId::where('customer_uuid', $id)->first();

        if (!$document) {
            return response()->json(['error' => 'Document details not found'], 404);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'id_number' => 'required|string|max:255',
        ]);

        $document->update([
            'name' => $request->name,
            'id_number' => $request->id_number,
        ]);

        return response()->json($document);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
