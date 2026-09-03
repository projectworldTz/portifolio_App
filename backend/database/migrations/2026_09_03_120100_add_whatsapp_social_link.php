<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('social_links')->updateOrInsert(
            ['platform' => 'whatsapp'],
            [
                'url' => 'https://wa.me/255620224372',
                'icon' => null,
                'is_active' => true,
                'sort_order' => 0,
                'updated_at' => now(),
                'created_at' => now(),
            ],
        );
    }

    public function down(): void
    {
        DB::table('social_links')
            ->where('platform', 'whatsapp')
            ->where('url', 'https://wa.me/255620224372')
            ->delete();
    }
};
