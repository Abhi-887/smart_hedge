<?php

namespace App\Http\Controllers;

use App\Models\Broker;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BrokerController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:brokers,code',
            'base_api_url' => 'nullable|string|max:255',
        ]);
        $broker = Broker::create($validated);
        return response()->json($broker);
    }
}
