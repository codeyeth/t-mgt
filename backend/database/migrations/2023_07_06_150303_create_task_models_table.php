<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTaskModelsTable extends Migration
{
    /**
    * Run the migrations.
    *
    * @return void
    */
    public function up()
    {
        Schema::create('task_models', function (Blueprint $table) {
            $table->id();
            $table->string('task');
            $table->string('status'); // todo, in progress, completed
            $table->boolean('is_sub_task')->nullable()->default(false);
            $table->integer('main_task_id')->nullable();
            $table->integer('cby_id')->nullable();
            $table->string('cby_name')->nullable();
            $table->boolean('is_deleted')->nullable()->default(false);
            $table->timestamps();
        });
    }

    /**
    * Reverse the migrations.
    *
    * @return void
    */
    public function down()
    {
        Schema::dropIfExists('task_models');
    }
}
