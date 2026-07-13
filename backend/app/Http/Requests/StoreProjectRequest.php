<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['nullable', 'exists:categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:projects,slug'],
            'short_description' => ['required', 'string', 'max:500'],
            'description' => ['required', 'string'],
            'features' => ['nullable', 'array'],
            'challenges' => ['nullable', 'string'],
            'solutions' => ['nullable', 'string'],
            'thumbnail' => ['nullable', 'image', 'max:10240'],
            'demo_url' => ['nullable', 'url', 'max:255'],
            'repo_url' => ['nullable', 'url', 'max:255'],
            'demo_video_url' => ['nullable', 'url', 'max:255'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'is_purchasable' => ['boolean'],
            'is_featured' => ['boolean'],
            'status' => ['required', 'in:draft,published'],
            'sort_order' => ['integer', 'min:0'],
            'technology_ids' => ['nullable', 'array'],
            'technology_ids.*' => ['exists:technologies,id'],
            'images' => ['nullable', 'array'],
            'images.*.file' => ['required_with:images', 'image', 'max:10240'],
            'images.*.alt_text' => ['nullable', 'string', 'max:255'],
        ];
    }
}
