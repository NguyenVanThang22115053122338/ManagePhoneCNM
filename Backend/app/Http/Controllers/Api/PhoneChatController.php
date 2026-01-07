<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\PhoneSearchService;
use App\Services\OpenAIService;

class PhoneChatController extends Controller
{
    private PhoneSearchService $search;
    private OpenAIService $openai;

    public function __construct(
        PhoneSearchService $search,
        OpenAIService $openai
    ) {
        $this->search = $search;
        $this->openai = $openai;
    }

    public function chat(Request $request)
    {
        $message = $request->input('message');

        if ($this->isGeneralQuestion($message)) {
            return response()->json([
                'reply' => $this->openai->answerGeneral($message),
                'products' => []
            ]);
        }

        $phones = $this->search->search($message);
        $reply  = $this->openai->advise($message, $phones);

        return response()->json([
            'reply' => $reply,
            'products' => $phones
        ]);
    }

    private function isGeneralQuestion(string $message): bool
    {
        $keywords = [
            'bao nhiêu dòng',
            'mấy dòng',
            'gồm những',
            'là gì',
            'khác nhau',
            'so với',
            'các dòng',
            'phân biệt',
            'hiện tại có mấy',
        ];

        $text = mb_strtolower($message);

        foreach ($keywords as $k) {
            if (str_contains($text, $k)) {
                return true;
            }
        }

        return false;
    }
}
