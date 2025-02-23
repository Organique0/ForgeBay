/usr/bin/zsh
sail up
sail npm run dev
sail artisan reverb:start
sail artisan pulse:check
sail artisan queue:work
sail artisan horizon
sail artisan schedule:work
sail artisan scout:import "App\Models\Idea"
sail artisan scout:flush "App\Models\Idea"
sail artisan scout:sync "App\Models\Idea"
