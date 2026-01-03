<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use App\Domain\Chat\Contracts\AiResponder;
use App\Infrastructure\OpenAI\OpenAiChatResponder;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(AiResponder::class, OpenAiChatResponder::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
