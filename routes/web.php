<?php

use App\Http\Controllers\SavelocationController;
use App\Models\savelocation;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});

Route::post('/save', [SavelocationController::class, 'store'])->name('save.location');
Route::get('/lokasi', [SavelocationController::class, 'index'])->name('lokasi.index');
Route::get('/reset', [SavelocationController::class, 'reset'])->name('lokasi.reset');
