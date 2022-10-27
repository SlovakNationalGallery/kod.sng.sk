<?php

use App\Models\Code;
use App\Models\Collection;
use Illuminate\Http\Request;
use App\Http\Resources\CodeResource;
use App\Http\Resources\ItemResource;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Validator;

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

Route::get('/verify/{code}', function ($code) {
    return new CodeResource(Code::where('code', $code)->firstOrFail());
});

Route::get('/items/{id}', function (string $id) {
    $code = Code::where('item_id', $id)->first() ?: Code::factory()->make();
    $response = Http::webumenia()->get("/v2/items/$id");
    $item = $response->object()->data;
    if (!empty($code->description)) {
        $item->description = nl2br($code->description);
    }
    $item->code = $code->code;
    $item->offset_top = $code->offset_top;
    if (!empty($code->author_name)) {
        $item->authors = $code->author_name;
    }
    $item->author_description = $code->author_description;
    return new ItemResource($item);
});

Route::post('/collections', function (Request $request) {
    $validator = Validator::make($request->all(), [
        'items' => 'required|array|distinct',
    ]);

    if ($validator->fails()) {
        return response()->json(['success' => false, 'error_message' => $validator->errors()->first()], 422);
    }

    $collection = Collection::create($validator->validated());
    return response()->json([
        'success' => true,
        'url' => url('/', $collection->hashid()),
    ]);
});

Route::get('/collections/{hashid}', function ($hashid) {
    $collection = Collection::findByHashidOrFail($hashid);
    return $collection->items;
});
