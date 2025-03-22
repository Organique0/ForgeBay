import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axios from 'axios';

type PusherEcho = Echo<'reverb'>;
window.Pusher = Pusher;

declare global {
	interface Window {
		Pusher: typeof Pusher;
		Echo: PusherEcho;
	}
}

window.Echo = new Echo({
	broadcaster: 'reverb',
	key: import.meta.env.VITE_REVERB_APP_KEY,
	wsHost: import.meta.env.VITE_REVERB_HOST,
	wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
	wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
	forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
	enabledTransports: ['ws', 'wss'],
});

// window.Echo.channel(`task.updates`)
// 	.listen('ApplicationStatusUpdated', (event: any) => {
// 		console.log('Received ApplicationStatusUpdated event:', event);
// 	});
//
// window.Echo.channel('task.updates')
// 	.listen('TaskStatusUpdated', (event: any) => {
// 		window.dispatchEvent(new CustomEvent('taskStatusUpdate', { detail: event }));
// 		console.log('Global task update dispatched:', event);
// 	});


let user = null;
axios.get('/user').then(response => {
    user = response.data;

    window.Echo.private(`App.Models.User.${user.id}`)
        .notification((notification: any) => {
            console.log('New notification received:', notification);
            window.dispatchEvent(new CustomEvent('notificationReceived', { detail: notification }));
        });
});
