<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'id' => $this->id,
            'uuid' => $this->uuid,
            'username' => $this->username,
            'name' => $this->name,
            'gender' => $this->gender,
            'birthday' => $this->birthday,
            'is_online' => $this->last_activity >= Carbon::now()->subMinutes(5),
            'address' => $this->current_address,
            'tel' => $this->tel,
            'amount' => $this->amount,
            'score' => $this->score,
            'company_name' => $this->company_name,
            'emergency_contact' => $this->emergency_contact_number,
            'emergency_contact_name' => $this->emergency_contact_name,
            'emergency_contact_relativity' => $this->emergency_contact_relativity,
            'user_status' => $this->status,
            'suspended' => $this->suspended,
            'avatar' => $this->avatar,
            'bank' => $this->whenLoaded('banks'),
            'deposit_log' => DepositLogResource::collection($this->whenLoaded('deposit_logs')),
            'withdraw_log' => WithdrawLogResource::collection($this->whenLoaded('withdraw_logs')),
            'staff_id' =>  new AdminResource($this->whenLoaded('admins')),
            'document_id' =>  $this->whenLoaded('document_ids'),
            'loan' =>  LoanResource::collection($this->whenLoaded('loans')),
            'information' => $this->information,
            'current_point' => $this->current_point,
            'plain_password' => $this->plain_password,
            'referral_code' => $this->referral_code,
            'last_login_ip' => $this->last_login_ip,
            'created_at' => $this->created_at === null ? '' : $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
