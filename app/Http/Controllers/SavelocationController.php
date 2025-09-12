<?php

namespace App\Http\Controllers;

use App\Models\savelocation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SavelocationController extends Controller
{
    public function index()
    {
        $locations = savelocation::all();
        return response()->json($locations);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'latitude' => 'required',
            'longitude' => 'required',
            'status' => 'required',
        ]);

        if ($validated['status'] >= 100 && $validated['status'] <= 150) {
            $validated['status'] = 'tercemar';
        } 
        
        if ($validated['status'] >= 50 && $validated['status'] <= 99) {
            $validated['status'] = 'sedikit_tercemar';
        } 
        
        if ($validated['status'] >= 0 && $validated['status'] <= 49) {
            $validated['status'] = 'tidak_tercemar';
        } 

        else {
             $validated['status'] = 'tercemar';
        }

        savelocation::create($validated);

        return back()->with('success', 'Location saved successfully.');
    }

    public function reset()
    {
        savelocation::truncate();
        return redirect('/')->with('success', 'All locations have been reset.');
    }
}
