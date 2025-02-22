import React, { useEffect } from 'react';
import {
	Configure,
	InstantSearch,
	RefinementList,
	SearchBox,
	useInstantSearch,
} from 'react-instantsearch';
import AppLayout from '@/Layouts/AppLayout';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import InfiniteHits from '@/Components/MyComponents/InfiniteHits';


const Index: React.FC = () => {
	const { searchClient } = instantMeiliSearch(
		'http://localhost:7700'
	);


	return (
		<AppLayout title='Ideas'>
			<h1>All Ideas</h1>
			<InstantSearch
				indexName='ideas'
				preserveSharedStateOnUnmount
				routing={true}
				//@ts-expect-error
				searchClient={searchClient}>
				<Configure filters="active = true" />
				<SearchBox />
				<div className="flex">
					<RefinementList attribute="tags" />
				</div>
				<NoResultsBoundary fallback={<NoResults />}>
					<InfiniteHits />
				</NoResultsBoundary>
			</InstantSearch>
		</AppLayout >
	);
};

function NoResults() {
	const { indexUiState } = useInstantSearch();
	return (
		<div>
			<p>
				No results for <q>{indexUiState.query}</q>.
			</p>
		</div>
	);
}

function NoResultsBoundary({ children, fallback }) {
	const { results } = useInstantSearch();
	if (!results.__isArtificial && results.nbHits === 0) {
		return (
			<>
				{fallback}
				<div hidden>{children}</div>
			</>
		);
	}

	return children;
}



export default Index;
