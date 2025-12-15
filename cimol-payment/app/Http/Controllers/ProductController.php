<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Menampilkan daftar semua produk.
     * PENTING: Mengembalikan array JSON murni.
     */
    public function index()
    {
        // Product::all() mengembalikan Collection, yang diubah menjadi Array JSON
        return response()->json(Product::all(), 200);
    }

    /**
     * Menyimpan produk baru (Create). Memerlukan Token.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:products,name',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
        ]);

        $product = Product::create($request->all());

        return response()->json([
            'message' => 'Produk berhasil ditambahkan.',
            'data' => $product
        ], 201);
    }

    public function show(Product $product)
    {
        return response()->json($product, 200);
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:products,name,'.$product->id, 
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
        ]);

        $product->update($request->all());

        return response()->json(['message' => 'Produk berhasil diperbarui.', 'data' => $product], 200);
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(['message' => 'Produk berhasil dihapus.'], 200);
    }
}