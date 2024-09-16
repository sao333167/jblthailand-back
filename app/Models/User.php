<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;


    protected $table = 'users';
    protected $guarded = [];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    // protected $fillable = [
    //     'name',
    //     'email',
    //     'password',
    // ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }



    public function deposit_logs()
    {
        return $this->hasMany(DepositLog::class, 'customer_uuid', 'uuid');
    }

    public function withdraw_logs()
    {
        return $this->hasMany(WithdrawLog::class, 'customer_uuid', 'uuid');
    }
    public function document_ids()
    {
        return $this->hasMany(DocumentId::class, 'customer_uuid', 'uuid');
    }
    public function signatures()
    {
        return $this->hasMany(Signature::class, 'customer_uuid', 'uuid');
    }
    public function loans()
    {
        return $this->hasMany(Loan::class, 'customer_uuid', 'uuid');
    }
    public function scheduled_payments()
    {
        return $this->hasMany(ScheduledPayment::class, 'customer_uuid', 'uuid');
    }
    public function admins()
    {
        return $this->belongsTo(Admin::class, 'admin_uuid', 'uuid');
    }
    public function banks()
    {
        return $this->hasMany(Bank::class, 'customer_uuid', 'uuid');
    }
    public function transaction_logs()
    {
        return $this->hasMany(TransactionLog::class, 'customer_uuid', 'uuid');
    }
}