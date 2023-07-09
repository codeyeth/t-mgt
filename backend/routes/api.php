<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

# controllers
use App\Http\Controllers\TaskController;
use App\Http\Controllers\AuthApiController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('login', [AuthApiController::class,'login']);
Route::post('register', [AuthApiController::class,'register']);

Route::group(['middleware'=>'api'],function(){
    Route::post('logout', [AuthApiController::class,'logout']);
    Route::post('refresh', [AuthApiController::class,'refresh']);
    Route::post('me', [AuthApiController::class,'me']);
});

Route::get('tasks/{userId}/{sort}/{search}/{isTrash}', [TaskController::class, 'index']);
Route::post('save-task', [TaskController::class, 'saveTask']);
Route::get('task/{id}', [TaskController::class, 'showTask']);
Route::get('subtask/{id}', [TaskController::class, 'showSubTask']);
Route::get('get-image/{id}', [TaskController::class, 'getImage']);
Route::put('update-task/{id}', [TaskController::class, 'updateTask']);
Route::put('delete-task/{id}', [TaskController::class, 'deleteTask']);
Route::delete('delete-task/{id}', [TaskController::class, 'deleteTask']);
Route::delete('perma-delete-task', [TaskController::class, 'permaDeleteTask']);
Route::delete('delete-image/{id}', [TaskController::class, 'deleteImage']);
