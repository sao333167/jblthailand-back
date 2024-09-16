<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LoanResource extends JsonResource
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
            'loan_order_number' => $this->loan_order_number,
            'customer_uuid' => $this->customer_uuid,
            'duration_id' => $this->duration_id,
            'loan_amount' => $this->amount,
            'interest' => $this->interest,
            'loan_total' => $this->loan_total,
            'pay_month' => $this->pay_month,
            'loan_date' => $this->date,
            'loan_status' => $this->status,
            'loan_withdraw_code' => $this->withdraw_code,
            'loan_remark' => $this->loan_remark,
            'status_color' => $this->status_color,
            'ip_address' => $this->ip_address,
            'is_read' => $this->is_read,
        
        ];
    }
}
