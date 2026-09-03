<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->text('short_description')->change();
        });

        Schema::table('products', function (Blueprint $table) {
            $table->text('short_description')->change();
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->string('short_description', 255)->change();
        });

        Schema::table('products', function (Blueprint $table) {
            $table->string('short_description', 255)->change();
        });
    }
};
