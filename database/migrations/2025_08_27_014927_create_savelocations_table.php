<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('savelocations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('latitude');
            $table->string('longitude');
            $table->enum('status', ['tercemar', 'sedikit_tercemar', 'tidak_tercemar'])->default('tidak_tercemar');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('savelocations');
    }
};
