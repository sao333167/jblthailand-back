<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminResource extends JsonResource
{

    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->uuid,
            'name' => $this->name,
            'phone' => $this->phone,
            'status' => $this->status,
            'email' => $this->email,
            'point' => $this->point,
            'role' => $this->getRoleNames(),
            'permission' => $this->getPermissionsViaRoles()->pluck('name'),
            'last_login_at' => $this->last_login_at,
            'last_login_ip' => $this->last_login_ip,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}