import React, { useEffect } from 'react';
import {
	Configure,
	InstantSearch,
	RefinementList,
	SearchBox,
	SortBy,
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
			<h1 className='mt-4'>Search by title, description, tags, user, date ...</h1>
			<InstantSearch
				indexName='ideas:created_at:desc'
				preserveSharedStateOnUnmount
				routing={true}
				//@ts-expect-error
				searchClient={searchClient}>
				<Configure
					filters="active = true" />
				<div className="md:flex mt-2 mb-4 gap-6">
					<SearchBox className='flex-grow' />
					<SortBy
						items={[
							{ label: 'Latest', value: 'ideas:created_at:desc' },
							{ label: 'Oldest', value: 'ideas:created_at:asc' },
							{ label: 'Recently Updated', value: 'ideas:updated_at:desc' },
							{ label: 'Least Recently Updated', value: 'ideas:updated_at:asc' },
							{ label: 'Highest Value', value: 'ideas:value:desc' },
							{ label: 'Lowest Value', value: 'ideas:value:asc' },
						]}
					/>
				</div>
				<div className='flex'>
					<RefinementList attribute="tags" className='' />
					<div className='flex-grow w-full' />
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

function NoResultsBoundary({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) {
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
