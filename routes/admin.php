<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\StatusController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Customers\BankController;
use App\Http\Controllers\Customers\DocumentIdController;
use App\Http\Controllers\WithdrawLogController;
use App\Http\Controllers\DurationController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\SystemsettingController;
use App\Http\Controllers\TransactionLogController;


Route::prefix('admin')->group(function () {

    Route::post('/login', [AdminController::class, 'login']);
    Route::group(['middleware' => ['auth:admin,api-admin', 'role:super|admin']], function () {


        Route::get('/profile', function (Request $request) {
            return $request->user();
        });


        Route::middleware('permission:admin-list|permission:admin-create|permission:admin-edit|permission:admin-delete')->group(function () {
            Route::apiResource('/admins', AdminController::class)->except(['create', 'edit']);
        });

        //User
        Route::apiResource('/users', UserController::class);
        Route::get('/users/{user:uuid}', [UserController::class, 'show']);
        Route::post('/update-status-user/{id}', [UserController::class, 'lockAndUnlockUser']);
        Route::put('/update-score/{user:uuid}', [UserController::class, 'updateScore']);
        Route::put('/update-pass/{user:uuid}', [UserController::class, 'updatePassword']);


        // Bank
        Route::apiResource('/banks', BankController::class);
        Route::put('/update-bank/{id}', [BankController::class, 'update']);
        //Document
        Route::put('/update-identify/{uuid}', [DocumentIdController::class, 'update']);

        //Transaction
        Route::apiResource('/transactions', TransactionLogController::class);
        //Order Status
        Route::apiResource('/order-status', StatusController::class);
        Route::put('/status-actived/{status:uuid}', [StatusController::class, 'updateActiveStatus']);

        //setting
        Route::apiResource('/systemsettings', SystemsettingController::class);

        //duration
        Route::apiResource('/durations', DurationController::class);
        Route::apiResource('/withdraws', WithdrawLogController::class);
        Route::put('/update-withdraw-remark/{withdraw_log:uuid}', [WithdrawLogController::class, 'updateWithdrawRemark']);

        //Loan
        Route::apiResource('/loans', LoanController::class);
        Route::put('/update-withdraw-code/{loan:uuid}', [LoanController::class, 'withdraw_code']);
        Route::get('/loans-unread', [LoanController::class, 'getUnreadLoans']);
        Route::get('/loan-orderstatus', [LoanController::class, 'getLoansOrderStatus']);
        Route::post('/loans/{uuid}/mark-read', [LoanController::class, 'markLoanAsRead']);
        Route::put('/update-loan-remark/{loan:uuid}', [LoanController::class, 'updateLoanRemark']);
        Route::put('/update-loan-amount/{loan:uuid}', [LoanController::class, 'updateLoanAmountTerm']);


        Route::post('/changepassword', [AdminController::class, 'changepassword']);
        Route::post('/logout', [AdminController::class, 'logout']);
    });
});
