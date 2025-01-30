import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

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

window.Echo.channel('messages').listen('MessageSent', (e: any) => {
  console.log(e);
});
