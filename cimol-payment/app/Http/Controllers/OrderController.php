<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        return Order::with(['product', 'customer'])->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'product_id'  => 'required|exists:products,id',
            'customer_id' => 'required|exists:customers,id',
            'qty'         => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($data['product_id']);

        // CEK STOK
        if ($product->stock < $data['qty']) {
            return response()->json([
                'message' => 'Stok tidak cukup!'
            ], 400);
        }

        // KURANGI STOK
        $product->stock -= $data['qty'];
        $product->save();

        // HITUNG TOTAL
        $data['total_price'] = $product->price * $data['qty'];

        return Order::create($data);
    }

    public function show($id)
    {
        return Order::with(['product', 'customer'])->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $data = $request->validate([
            'product_id'  => 'exists:products,id',
            'customer_id' => 'exists:customers,id',
            'qty'         => 'integer|min:1',
        ]);

        // Jika ada perubahan qty → atur ulang stok
        if (isset($data['qty'])) {

            $product = Product::find($data['product_id'] ?? $order->product_id);

            // Kembalikan stok lama
            $product->stock += $order->qty;

            // Cek stok baru
            if ($product->stock < $data['qty']) {
                return response()->json(['message' => 'Stok tidak cukup!'], 400);
            }

            // Kurangi stok baru
            $product->stock -= $data['qty'];
            $product->save();

            // Update total price
            $data['total_price'] = $product->price * $data['qty'];
        }

        $order->update($data);

        return $order;
    }

    public function destroy($id)
    {
        $order = Order::findOrFail($id);

        // Kembalikan stok ketika order dihapus
        $product = Product::find($order->product_id);
        $product->stock += $order->qty;
        $product->save();

        $order->delete();

        return response()->json(['message' => 'Order deleted']);
    }
}
