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
        Schema::create('match_confirmations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('football_match_id')->constrained('football_matches')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->boolean('is_confirmed')->default(true);
            $table->string('confirmed_by')->nullable(); // 'player' or 'admin'
            $table->timestamps();

            $table->unique(['football_match_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('match_confirmations');
    }
};
