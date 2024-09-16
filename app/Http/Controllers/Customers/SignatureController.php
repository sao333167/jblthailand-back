<?php

namespace App\Http\Controllers\Customers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;
use Carbon\Carbon;
use App\Models\Signature;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class SignatureController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
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
        if ($request->signature) {
            $currentDate = Carbon::now()->toDateString();
            $imageExtension = explode('/', explode(':', substr($request->signature, 0, strpos($request->signature, ';')))[1])[1];
            $imageName = $currentDate . '-' . uniqid() . '.' . $imageExtension;

            if (!Storage::disk('public')->exists('signature')) {
                Storage::disk('public')->makeDirectory('signature');
            }

            $imageData = substr($request->signature, strpos($request->signature, ',') + 1);
            $imageData = base64_decode($imageData);

            $imagePath = public_path('storage/signature/') . $imageName;

            if (!file_exists(public_path('storage/signature'))) {
                mkdir(public_path('storage/signature'), 0777, true);
            }

            file_put_contents($imagePath, $imageData);

            $user = User::where('uuid', Auth::user()->uuid)->first();

            $currentMonth = Carbon::now()->startOfMonth(); // Get the start of the current month
            $nextMonth = Carbon::now()->startOfMonth()->addMonth(); // Get the start of the next month
        
            // Check if the user has a loan in the current month
            $existingLoan = Signature::where('customer_uuid', $user->uuid)
                ->whereBetween('date', [$currentMonth, $nextMonth])
                ->first();
        
            if ($existingLoan) {
                // Return a response indicating the user cannot take another loan this month
                return response()->json(['error' => 'You already completed !.'], 403);
            }

            $currentDate = Carbon::now()->format('Y-m-d');

            $signature = Signature::create([
                'uuid' => Str::orderedUuid(),
                'user_id' => $user->id,
                'customer_uuid' => $user->uuid,
                'sign' => $imageName,
                'date' => $currentDate,
                'status' => '1',
            ]);

            return response()->json([$signature]);
        }

        return response()->json(['error' => 'Signature not provided'], 400);
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($uuid)
    {
        $signature = Signature::where('customer_uuid', $uuid)->first();
        return response()->json($signature);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $uuid)
    {
        if ($request->signature) {
            $currentDate = Carbon::now()->toDateString();
            $image = time() . '.' . explode('/', explode(':', substr($request->signature, 0, strpos($request->signature, ';')))[1])[1];

            $imageName = $currentDate . '-' . uniqid() . '.' . $image;

            if (!Storage::disk('public')->exists('signature')) {
                Storage::disk('public')->makeDirectory('signature');
            }

            $postImage = Image::read($request->signature)->save(public_path('signature/') . $imageName);

            Storage::disk('public')->put('signature/' . $imageName, $postImage);
        }

        $signature = Signature::where('customer_uuid', $uuid)
            ->update([
                'sign' => $imageName,
                'status' => '1',
            ]);

        return response()->json([
            $signature
        ]);
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