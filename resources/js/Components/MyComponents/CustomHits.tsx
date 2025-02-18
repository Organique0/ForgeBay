//// filepath: /home/lukag/Documents/WEB_DEVELOPMENT/LaravelProjects/ForgeBay/resources/js/components/CustomHits.tsx
import React from 'react';
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
	console.log(hits); // This should log an array of Idea objects
	return <Ideas ideas={hits as Idea[]} />;
}
