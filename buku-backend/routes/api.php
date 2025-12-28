<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\OrderController;

// ---------------------------------------------
//  PUBLIC ROUTES (TANPA TOKEN)
// ---------------------------------------------
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// ---------------------------------------------
//  PROTECTED ROUTES (WAJIB TOKEN SANCTUM)
// ---------------------------------------------
Route::middleware('auth:sanctum')->group(function () {

    // REST API otomatis
    Route::apiResource('products', ProductController::class);
    Route::apiResource('customers', CustomerController::class);
    Route::apiResource('orders', OrderController::class);

    // LOGOUT
    Route::post('/logout', [AuthController::class, 'logout']);
});
