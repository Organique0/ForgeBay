import React, { useEffect } from 'react';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import {
	Configure,
	InstantSearch,
	RefinementList,
	SearchBox,
	Pagination as InstantSearchPagination,
	useInstantSearch,
} from 'react-instantsearch';
import CustomHitsBase, { CustomHits } from '@/Components/MyComponents/CustomHits';
import AppLayout from '@/Layouts/AppLayout';
import { Idea, InertiaSharedProps } from '@/types';

export interface PaginationLink {
	active: boolean,
	label: string,
	url: string
}


export interface PaginatedIdeas {
	data: Idea[],
	first_page_url: string,
	from: number,
	last_page: number,
	last_page_url: string,
	links: PaginationLink[],
	next_page_url: string,
	path: string,
	per_page: number,
	prev_page_url?: string,
	to: number,
	total: number
}

interface Props extends InertiaSharedProps {
	ideas: PaginatedIdeas;
}

const Index: React.FC<Props> = () => {
	const { searchClient } = instantMeiliSearch('http://localhost:7700');

	// useEffect(() => {
	// 	const handler = (e: Event) => {
	// 		const event = (e as CustomEvent).detail;
	// 		console.log(ideas);
	// 		setIdeas(prevIdeas => {
	// 			const updatedData = prevIdeas.map(idea => {
	// 				if (idea.id === event.ideaId) {
	// 					const updatedTasks = idea.tasks.map(task => {
	// 						if (task.id === event.taskId) {
	// 							return { ...task, status: event.status };
	// 						}
	// 						return task;
	// 					});
	// 					return { ...idea, tasks: updatedTasks };
	// 				}
	// 				return idea;
	// 			});
	// 			return { ...prevIdeas, data: updatedData };
	// 		});
	// 	};
	// 	window.addEventListener('taskStatusUpdate', handler);
	// 	return () => {
	// 		window.removeEventListener('taskStatusUpdate', handler);
	// 	};
	// }, []);
	useEffect(() => {
		const savedPosition = localStorage.getItem('ideasScrollPosition');
		if (savedPosition) {
			window.scrollTo(0, parseInt(savedPosition));
			localStorage.removeItem('ideasScrollPosition');
		}
	}, []);
	return (
		<AppLayout title='Ideas'>
			<h1>All Ideas</h1>
			<InstantSearch
				indexName='ideas'
				//stalledSearchDelay={1000}
				preserveSharedStateOnUnmount
				routing={true}
				//@ts-expect-error
				searchClient={searchClient}>
				<SearchBox />
				<div className="flex">
					<RefinementList attribute="tags" />
					<RefinementList attribute="task_status" />
				</div>
				<NoResultsBoundary fallback={<NoResults />}>
					<CustomHitsBase />
				</NoResultsBoundary>
				<InstantSearchPagination />
			</InstantSearch>
		</AppLayout>
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

	// The `__isArtificial` flag makes sure not to display the No Results message
	// when no hits have been returned.
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
