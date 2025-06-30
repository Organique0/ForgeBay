<?php

namespace App\Http\Middleware;

use App\Models\Application;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class InMessageGroup
{
	/**
	 * Handle an incoming request.
	 *
	 * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
	 */
	public function handle(Request $request, Closure $next): Response
	{
		// Sometimes it gets send as a post parameter, sometimes as a route parameter
		$applicationId = $request->route('applicationId') ?? $request->input('application_id');

		if (!$applicationId) {
			return redirect()->route('dashboard')->with('error', 'Invalid application ID');
		}

		$userId = auth()->id();

		if (!$userId) {
			return redirect()->route('login');
		}

		try {
			$application = Application::with('task.idea')->findOrFail($applicationId);

			if ((int) $userId === (int) $application->user_id) {
				return $next($request);
			}

			if ((int) $userId === (int) $application->task->idea->user_id) {
				return $next($request);
			}

			return redirect()->route('dashboard')->with('error', 'You are not authorized to access this conversation');
		} catch (\Exception $e) {
			return redirect()->route('dashboard')->with('error', 'Application not found');
		}
	}
}
