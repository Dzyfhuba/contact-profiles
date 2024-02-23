<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Validator;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = Contact::query()
            ->select('id', 'name');

        if ($request->query('sort') && $request->query('direction')) {
            $data = $data->orderBy($request->query('sort'), $request->query('direction'));
        } else {
            $data = $data->orderBy('name', 'asc');
        }

        if ($request->query('search')) {
            $data = $data->whereRaw("LOWER(REPLACE(name, ' ', '')) LIKE ?", ["%".strtolower(trim($request->query('search')))."%"]);
        }

        return inertia('Contacts', [
            'data' => $data->get()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required',
                'email' => "required|email|unique:contacts,email",
                'phone' => 'required',
                'address' => 'required',
            ]);

            if ($validator->fails()){
                return response([
                    'error' => $validator->getMessageBag()
                ], 400);
            }

            $payload = $validator->validated();

            Contact::create($payload);

            return response([
                'message' => 'Berhasil dibuat',
            ], 201);
        } catch (\Exception $e) {
            return response([
                'error' => $e
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Contact $contact)
    {
        try {
            return response([
                'item' => $contact
            ], 200);
        } catch (\Exception $e) {
            return response([
                'error' => $e
            ], 500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Contact $contact)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required',
                'email' => "required|email|unique:contacts,email,{$contact->id},id",
                'phone' => 'required',
                'address' => 'required',
            ]);

            if ($validator->fails()){
                return response([
                    'error' => $validator->getMessageBag()
                ], 400);
            }

            $payload = $validator->validated();

            $contact->update($payload);

            return response([
                'message' => 'Berhasil diedit',
            ], 201);
        } catch (\Exception $e) {
            return response([
                'error' => $e
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Contact $contact)
    {
        try {
            $contact->delete();
            return response([
                'message' => 'Delete success'
            ], 200);
        } catch (\Exception $e) {
            return response([
                'error' => $e
            ], 500);
        }
    }
}
