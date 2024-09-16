<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function users()
    {
        return $this->belongsTo(User::class, 'customer_uuid', 'uuid');
    }

    public function scheduled_payments()
    {
        return $this->hasMany(ScheduledPayment::class, 'loan_id', 'id');
    }

    public function document_ids()
    {
        return $this->hasMany(DocumentId::class, 'customer_uuid');
    }

    public function statuses()
    {
        return $this->belongsTo(Status::class, 'admin_uuid', 'uuid');
    }
}