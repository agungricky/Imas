<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class savelocation extends Model
{
    protected $table = 'savelocations';
    protected $fillable = [ 'id', 'name', 'latitude', 'longitude', 'status', 'created_at', 'updated_at' ];
}
