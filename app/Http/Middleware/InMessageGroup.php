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
		$applicationId = $request->route('applicationId');

		if (!$applicationId) {
			return redirect()->route('dashboard')->with('error', 'Invalid application ID');
		}

		$userId = auth()->id();

		if (!$userId) {
			return redirect()->route('login');
		}

		try {
			$application = Application::with('task.idea')->findOrFail($applicationId);

			// Allow if user is the applicant
			if ((int) $userId === (int) $application->user_id) {
				return $next($request);
			}

			// Allow if user is the idea creator
			if ((int) $userId === (int) $application->task->idea->user_id) {
				return $next($request);
			}

			// User is not authorized to access this chat
			return redirect()->route('dashboard')->with('error', 'You are not authorized to access this conversation');
		} catch (\Exception $e) {
			return redirect()->route('dashboard')->with('error', 'Application not found');
		}
	}
}
