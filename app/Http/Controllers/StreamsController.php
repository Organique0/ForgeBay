<?php
// filepath: /home/lukag/Documents/WEB_DEVELOPMENT/LaravelProjects/ForgeBay/app/Http/Controllers/StreamsController.php
namespace App\Http\Controllers;

use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\StreamedResponse as HttpFoundationStreamedResponse;

class StreamsController extends Controller
{
	public function applicationStream(Request $request): HttpFoundationStreamedResponse
	{
		$ideaId = $request->query('idea');

		// Allow the script to run indefinitely and ignore user aborts.
		set_time_limit(0);
		ignore_user_abort(true);

		return response()->stream(function () use ($ideaId) {
			$previousDataHash = null;

			while (true) {
				try {
					echo "event: applicationUpdates\n";

					if ($ideaId) {
						// Try to retrieve cached applications for the idea.
						$cachedApplications = Cache::tags(['ideas'])->get("idea_{$ideaId}_applications");

						if (!is_null($cachedApplications)) {
							$applications = $cachedApplications;
						} else {
							// Fallback: query the database for applications related to this idea.
							$applications = Application::with('users', 'task')
								->whereHas('task', function ($q) use ($ideaId) {
									// Assuming your Task model has an 'idea_id' column.
									$q->where('idea_id', $ideaId);
								})
								->latest()
								->get();
						}
					} else {
						// No idea provided: fetch all applications.
						$applications = Application::with('users', 'task')->latest()->get();
					}

					// Compute a hash so we only send events on actual changes.
					$currentDataHash = md5(json_encode($applications));

					if ($currentDataHash !== $previousDataHash) {
						$previousDataHash = $currentDataHash;
						echo 'data: ' . json_encode($applications) . "\n\n";

						if (ob_get_level()) {
							ob_flush();
						}
						flush();
					}
				} catch (\Exception $e) {
					echo "event: error\n";
					echo 'data: {"error": "' . addslashes($e->getMessage()) . '"}' . "\n\n";
					flush();
				}

				if (connection_aborted()) {
					break;
				}

				usleep(500000); // Sleep for 500 ms before checking again.
			}
		}, 200, [
			'Cache-Control' => 'no-cache',
			'Content-Type'  => 'text/event-stream',
		]);
	}
}
