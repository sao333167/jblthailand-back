<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Systemsetting extends Model
{
    use HasFactory;
    protected $guarded = [];
    public function admins()
    {
        return $this->hasMany(Admin::class, 'admin_uuid', 'uuid');
    }

    public function users()
    {
        return $this->hasMany(User::class, 'customer_uuid', 'uuid');
    }
}
