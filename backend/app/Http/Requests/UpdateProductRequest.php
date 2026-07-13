<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('products', 'slug')->ignore($this->route('product'))],
            'short_description' => ['sometimes', 'required', 'string', 'max:500'],
            'description' => ['sometimes', 'required', 'string'],
            'features' => ['nullable', 'array'],
            'thumbnail' => ['nullable', 'image', 'max:10240'],
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'license' => ['nullable', 'string', 'max:255'],
            'documentation_url' => ['nullable', 'url', 'max:255'],
            'demo_url' => ['nullable', 'url', 'max:255'],
            'is_featured' => ['boolean'],
            'status' => ['sometimes', 'required', 'in:draft,published'],
            'sort_order' => ['integer', 'min:0'],
            'images' => ['nullable', 'array'],
            'images.*.file' => ['required_with:images', 'image', 'max:10240'],
            'images.*.alt_text' => ['nullable', 'string', 'max:255'],
        ];
    }
}
