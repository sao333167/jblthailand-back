<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rules\Password;
use Illuminate\Foundation\Http\FormRequest;

class SignupRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // 'username' => 'required|string|max:55|unique:users,username',
            // 'name' => 'required|string|max:55',
            'tel' => 'required|numeric|regex:/^([0-9\s\-\+\(\)]*)$/|unique:users,tel',
            'password' => [
                'required',
                'confirmed',
                Password::min(6)
                    // ->letters()
                    // ->symbols()
            ]
        ];
    }
}