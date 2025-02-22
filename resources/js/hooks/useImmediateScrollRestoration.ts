import { useEffect, useLayoutEffect } from 'react';

export function useImmediateScrollRestoration(key: string, isLoaded: boolean = false) {
	useEffect(() => {
		if (!isLoaded) return;

		const pos = localStorage.getItem(key);
		if (pos) {
			setTimeout(() => {
				window.scrollTo(0, parseFloat(pos));
				localStorage.removeItem(key);
			}, 0);
		}
	}, [key, isLoaded]);
}
