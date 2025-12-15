<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('match_confirmations', function (Blueprint $table) {
            $table->string('status')->default('confirmed')->after('is_confirmed');
            // status: 'confirmed', 'waiting', 'declined'
        });

        // Atualizar registros existentes
        DB::table('match_confirmations')
            ->where('is_confirmed', true)
            ->update(['status' => 'confirmed']);

        DB::table('match_confirmations')
            ->where('is_confirmed', false)
            ->update(['status' => 'waiting']);
    }

    public function down(): void
    {
        Schema::table('match_confirmations', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
