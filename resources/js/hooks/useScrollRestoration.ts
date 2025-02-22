import { useEffect } from 'react';

export function useScrollRestoration(key: string, delay = 150) {
	useEffect(() => {
		const pos = localStorage.getItem(key);
		if (pos) {
			setTimeout(() => {
				window.scrollTo(0, parseFloat(pos));
			}, delay);
			localStorage.removeItem(key);
		}
	}, [key, delay]);
}
