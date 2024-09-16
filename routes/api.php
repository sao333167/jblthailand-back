<?php

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Customers\AuthController;
use App\Http\Controllers\Customers\BankController;
use App\Http\Controllers\Customers\LoanController;
use App\Http\Controllers\TransactionLogController;
use App\Http\Controllers\Customers\CustomerController;
use App\Http\Controllers\Customers\DurationController;
use App\Http\Controllers\Customers\SignatureController;
use App\Http\Controllers\Customers\DocumentIdController;
use App\Http\Controllers\Customers\WithdrawLogController;
use App\Http\Controllers\Customers\ScheduledPaymentController;

Route::middleware(['auth:sanctum', 'is_online'])->group(function () {

    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    Route::get('/user', function (Request $request) {
        $user = $request->user()->load('banks', 'document_ids');
        $user->last_activity = now();
        $user->save();
        return response()->json($user)->with("banks");
    });

    Route::apiResource('/user', CustomerController::class)->only(['show', 'update']);
    Route::get('/user/{uuid}', [CustomerController::class, 'show']);
    Route::post('/user/{uuid}', [CustomerController::class, 'update']);
    Route::apiResource('/loan', LoanController::class)->only(['show', 'store']);
    Route::apiResource('/scheduled', ScheduledPaymentController::class)->only(['show', 'store']);
    Route::apiResource('/signature', SignatureController::class)->only(['show', 'store']);
    Route::apiResource('/auth/bank', BankController::class)->only(['show', 'store']);
    Route::apiResource('/document', DocumentIdController::class)->only(['show', 'store']);
    Route::apiResource('/transaction', TransactionLogController::class)->only(['index']);

    Route::apiResource('/withdraw', WithdrawLogController::class)->only(['show', 'store']);
    Route::get('/withdraws/{uuid}', [WithdrawLogController::class,'withdraws']);
});



Route::apiResource('/durations', DurationController::class);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'signup']);
Route::post('/auth/checkCredentials', [AuthController::class, 'verifyCredentials']);


require __DIR__ . '/admin.php';
require __DIR__ . '/companysystem.php';
