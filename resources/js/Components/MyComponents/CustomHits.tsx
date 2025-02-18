import React, { useEffect, useState } from 'react';
import { useConnector, AdditionalWidgetProperties } from 'react-instantsearch';
import connectHits, {
	HitsConnectorParams,
	HitsWidgetDescription,
} from 'instantsearch.js/es/connectors/hits/connectHits';
import Ideas from '@/Components/MyComponents/Ideas';
import { Idea } from '@/types';

export function useHits(
	props: HitsConnectorParams,
	additionalWidgetProperties: AdditionalWidgetProperties = {
		$$widgetType: 'custom.hits',
	}
) {
	return useConnector<HitsConnectorParams, HitsWidgetDescription>(
		connectHits,
		props,
		additionalWidgetProperties
	);
}

export function CustomHits() {
	const { hits } = useHits({});
	const [localHits, setLocalHits] = useState<Idea[]>([]);

	// Update localHits whenever new hits arrive from MeiliSearch
	useEffect(() => {
		setLocalHits(hits as Idea[]);
	}, [hits]);

	// Listen for a custom event, then update the relevant item
	useEffect(() => {
		const handler = (e: Event) => {
			const event = (e as CustomEvent).detail;
			setLocalHits(prev =>
				prev.map(idea => {
					if (idea.id === event.ideaId) {
						return {
							...idea,
							tasks: idea.tasks.map(task => {
								if (task.id === event.taskId) {
									return { ...task, status: event.status };
								}
								return task;
							})
						};
					}
					return idea;
				})
			);
		};

		window.addEventListener('taskStatusUpdate', handler);
		return () => window.removeEventListener('taskStatusUpdate', handler);
	}, []);

	return <Ideas ideas={localHits} />;
}
