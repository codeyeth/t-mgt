<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

# models
use App\Models\TaskModel;
use App\Models\UploadedFiles;

# helpers
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class TaskController extends Controller
{
    public function index(Request $request){
        # user details
        $userId = $request->userId;

        # sorting
        $sort = 'DESC';
        if($request->sort){
            $sort = $request->sort;
        }
        # searching
        $search = $request->search;
        # get deleted items
        $isDeleted = false;
        if($request->isTrash == "true"){
            $isDeleted = true;
        }
        # all tasks for the current user sorted newest at top
        if($search != 'null'){
            $tasks = TaskModel::where('task', 'like', '%'.$search.'%')->where('is_deleted', $isDeleted)->where('cby_id', $userId)->orderBy('id', $sort)->get();
        }else{
            $tasks = TaskModel::where('is_deleted', $isDeleted)->where('cby_id', $userId)->orderBy('id', $sort)->get();
        }
        # return the data in json format for api consuming
        return response()->json([
            'tasks' => $tasks,
        ]);
    }

    public function saveTask(Request $request){
        try{
            $is_sub_task = ($request->is_sub_task == 'true') ? true : false;
            $main_task_id = ($request->main_task_id == 'null') ? null : $request->main_task_id;

            # save task
            $newTask = new TaskModel();
            $newTask->task = Str::title($request->task);
            $newTask->status = 'todo';
            $newTask->is_sub_task = $is_sub_task;
            $newTask->main_task_id = $main_task_id;
            $newTask->cby_id = $request->cby_id;
            $newTask->cby_name = $request->cby_name;
            $newTask->save();

            # save image
            $folderName = 'public/taskimages';
            if($request->image){
                foreach ($request->image as $photo) {
                    $orig_filename = $photo->getClientOriginalName();
                    $filesize = $photo->getSize();
                    $extension = $photo->getClientOriginalExtension();
                    $filename = Str::random(6) . "." . $extension;

                    $saveImage = new UploadedFiles();
                    $saveImage->belongs_to = $newTask->id;
                    $saveImage->orig_filename = $orig_filename;
                    $saveImage->filename = $filename;
                    $saveImage->filetype = $extension;
                    $saveImage->filesize = $filesize;
                    $saveImage->save();

                    $saveImageToFolder = $photo->storeAs($folderName, $filename);
                }
            }
            return response()->json([
                'message' => "Task Saved!",
            ], 200);
        }catch(Exception $e){
            return response()->json([
                'message' => "Something went really wrong!"
            ], 500);
        }
    }

    public function showSubTask(Request $request, $id){
        $task = TaskModel::where('is_sub_task', true)->where('main_task_id', $id)->get();
        if(!$task){
            return response()->json([
                'message'=>'Task not Found.'
            ], 404);
        }

        return response()->json([
            'task' => $task,
        ], 200);
    }

    public function getImage(Request $request, $id){
        $getImages = UploadedFiles::where('belongs_to', $id)->get();
        if(!$getImages){
            return response()->json([
                'message'=>'Image/s not Found.'
            ], 404);
        }

        return response()->json([
            'images' => $getImages,
        ], 200);
    }

    public function showTask(Request $request, $id){
        $task = TaskModel::find($id);
        if(!$task){
            return response()->json([
                'message'=>'Task not Found.'
            ], 404);
        }

        return response()->json([
            'task' => $task
        ], 200);
    }

    public function updateTask(Request $request, $id){
        try{
            if($request->mode == "update"){
                # update the task
                $updateTask = TaskModel::find($id);
                $updateTask->task = $request->task;
                $updateTask->status = $request->status;
                $updateTask->update();

                # save image
                $folderName = 'public/taskimages';
                if($request->image){
                    foreach ($request->image as $photo) {
                        $orig_filename = $photo->getClientOriginalName();
                        $filesize = $photo->getSize();
                        $extension = $photo->getClientOriginalExtension();
                        $filename = Str::random(6) . "." . $extension;

                        $saveImage = new UploadedFiles();
                        $saveImage->belongs_to = $updateTask->id;
                        $saveImage->orig_filename = $orig_filename;
                        $saveImage->filename = $filename;
                        $saveImage->filetype = $extension;
                        $saveImage->filesize = $filesize;
                        $saveImage->save();

                        $saveImageToFolder = $photo->storeAs($folderName, $filename);
                    }
                }
                return response()->json([
                    'message' => "Task Updated!"
                ], 200);
            }else{
                # restore deleted items by updateing its is_delete table field
                $updateTask = TaskModel::find($id);
                $updateTask->is_deleted = false;
                $updateTask->update();

                return response()->json([
                    'message' => "Task Restored!"
                ], 200);
            }
        }catch(Exception $e){
            return response()->json([
                'message' => "Something went really wrong!"
            ], 500);
        }
    }

    public function deleteTask(Request $request, $id){
        try{
            $requestType = $_REQUEST['_method'];

            if($requestType == "PUT"){
                $deleteTask = TaskModel::find($id);
                $deleteTask->is_deleted = true;
                $deleteTask->update();
            }
            if($requestType == "DELETE"){
                $deleteTask = TaskModel::find($id);
                $deleteTask->delete();
            }

            return response()->json([
                'message' => "Task Moved to Trash!",
                'requestType' => $requestType
            ], 200);
        }catch(Exception $e){
            return response()->json([
                'message' => "Something went really wrong!"
            ], 500);
        }
    }

    public function permaDeleteTask(Request $request){
        try{
            $deleteAllTask = TaskModel::where('is_deleted', true)->delete();
            return response()->json([
                'message' => "Trash Cleared!"
            ], 200);
        }catch(Exception $e){
            return response()->json([
                'message' => "Something went really wrong!"
            ], 500);
        }
    }

    public function deleteImage(Request $request, $id){
        try{
            $deleteImage = UploadedFiles::find($id);
            if(!$deleteImage){
                return response()->json([
                    'message' => "Image Not Found!"
                ], 400);
            }else{
                $deleteFile = Storage::delete('public/taskimages/' . $deleteImage->filename);
                $taskId = $deleteImage->belongs_to;
                $deleteImage->delete();
                return response()->json([
                    'message' => "Image Deleted!",
                    'taskId' => $taskId,
                    'deleteFile' => $deleteFile,
                ], 200);
            }
        }catch(Exception $e){
            return response()->json([
                'message' => "Something went really wrong!"
            ], 500);
        }
    }
}
