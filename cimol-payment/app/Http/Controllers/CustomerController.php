<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index()
    {
        return Customer::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required',
            'phone' => 'nullable',
            'address' => 'nullable',
        ]);

        return Customer::create($data);
    }

    public function show($id)
    {
        return Customer::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $customer = Customer::findOrFail($id);

        $customer->update($request->all());

        return $customer;
    }

    public function destroy($id)
    {
        Customer::destroy($id);

        return response()->json(['message' => 'Customer deleted']);
    }
}
