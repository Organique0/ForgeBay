import './bootstrap';
import '../css/app.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { RouteContext } from '@/Hooks/useRoute';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ThemeProvider } from 'next-themes';
import 'instantsearch.css/themes/algolia.css';

const appName =
	window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

createInertiaApp({
	title: title => `${title} - ${appName}`,
	progress: {
		color: '#4B5563',
	},
	resolve: name =>
		resolvePageComponent(
			`./Pages/${name}.tsx`,
			import.meta.glob('./Pages/**/*.tsx'),
		),
	setup({ el, App, props }) {
		const root = createRoot(el);
		return root.render(
			<RouteContext.Provider value={(window as any).route}>
				<ThemeProvider>
					<App {...props} />
				</ThemeProvider>
			</RouteContext.Provider>,
		);
	},
});
