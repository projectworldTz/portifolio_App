<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTestimonialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'client_name' => ['sometimes', 'required', 'string', 'max:255'],
            'client_photo' => ['nullable', 'image', 'max:10240'],
            'company' => ['nullable', 'string', 'max:255'],
            'review' => ['sometimes', 'required', 'string'],
            'rating' => ['sometimes', 'required', 'integer', 'min:1', 'max:5'],
            'is_featured' => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
        ];
    }
}
