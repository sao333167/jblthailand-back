<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class WithdrawLog extends Model
{
    use HasApiTokens, HasFactory;
    protected $guarded = [];

    public function users()
    {
        return $this->belongsTo(User::class,'customer_uuid', 'uuid');
    }
}