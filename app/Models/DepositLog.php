<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DepositLog extends Model
{
    use HasFactory;
    protected $guarded = [];


    public function users()
    {
        return $this->belongsTo(User::class,'customer_uuid', 'uuid');
    }
}