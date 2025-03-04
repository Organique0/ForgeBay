import React, { useEffect, useRef } from 'react';
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
import { useImmediateScrollRestoration } from '@/hooks/useImmediateScrollRestoration';
import SingleIdea from '@/Components/MyComponents/SingleIdea';
import { inertia } from 'framer-motion';


const Index: React.FC = ({ ideas, filters }) => {
	console.log(ideas, filters);
	useImmediateScrollRestoration('ideasScrollPosition', true);
	const sentinelRef = useRef(null);
	const isLastPage = useRef(ideas.next_page_url);

	useEffect(() => {
		if (sentinelRef.current !== null) {
			const observer = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !ideas.next_page_url) {
						showMore();
					}
				});
			});

			observer.observe(sentinelRef.current);

			return () => {
				observer.disconnect();
			};
		}
	}, [isLastPage, showMore]);

	function showMore() {
		if (ideas.next_page_url) {
			inertia.visit(ideas.next_page_url, {
				method: 'get',
				preserveScroll: true,
				preserveState: true,
				onSuccess: (page) => {
					// Merge the new data into your local state
				}
			});
		}
	}

	return (
		<AppLayout title='Ideas'>
			<h1 className='mt-4'>Search by title, description, tags, user, date ...</h1>
			{/* <InstantSearch
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
			</InstantSearch> */}

			<div className="">
				<ul className="">
					{ideas.map((idea) => (
						<li key={idea.id} className='my-6'>
							<SingleIdea hit={idea} />
						</li>
					))}
					<li ref={sentinelRef} aria-hidden="true" className='h-10' />
				</ul>
			</div>
		</AppLayout >
	);
};



function NoResults() {
	//const { indexUiState } = useInstantSearch();
	return (
		<div>
			<p>
				No results for <q>{ }</q>.
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
