<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Status extends Model
{
    use HasFactory;
    protected $guarded = [];
    
    public function admins()
    {
        return $this->belongsTo(Admin::class, 'admin_uuid', 'uuid');
    }

    public function loans()
    {
        return $this->hasMany(Loan::class, 'customer_uuid', 'uuid');
    }
}
