/usr/bin/zsh
sail up
sail npm run dev
sail artisan reverb:start
sail artisan pulse:check
sail artisan queue:work
sail artisan horizon
sail artisan scout:import "App\Models\Idea"
