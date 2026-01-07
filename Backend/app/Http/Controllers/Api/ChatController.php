<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Application\Chat\ChatUseCase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    public function __construct(private readonly ChatUseCase $chat) {}

    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        $answer = $this->chat->ask($request->string('message'), Auth::id());

        return response()->json(['answer' => $answer]);
    }

    public function stream(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        $question = $request->string('message');
        $userId = Auth::id();

        return response()->stream(function () use ($question, $userId) {
            // SSE format: "data: ...\n\n"
            echo "event: open\n";
            echo "data: " . json_encode(['ok' => true]) . "\n\n";
            @ob_flush(); @flush();

            try {
                foreach ($this->chat->stream($question, $userId) as $chunk) {
                    echo "event: delta\n";
                    echo "data: " . json_encode(['text' => $chunk], JSON_UNESCAPED_UNICODE) . "\n\n";
                    @ob_flush(); @flush();
                }

                echo "event: done\n";
                echo "data: " . json_encode(['done' => true]) . "\n\n";
                @ob_flush(); @flush();

            } catch (\Throwable $e) {
                echo "event: error\n";
                echo "data: " . json_encode(['message' => $e->getMessage()], JSON_UNESCAPED_UNICODE) . "\n\n";
                @ob_flush(); @flush();
            }
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache, no-transform',
            'Connection' => 'keep-alive',
            'X-Accel-Buffering' => 'no', // nếu chạy nginx
        ]);
    }
}
