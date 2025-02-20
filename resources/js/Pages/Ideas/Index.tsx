import React, { useEffect, useState } from 'react';
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/Components/Shadcn/ui/pagination";
import {
	Configure,
	InstantSearch,
	RefinementList,
	SearchBox,
	Pagination as InstantSearchPagination,
	useInstantSearch,
} from 'react-instantsearch';
import CustomHitsBase, { CustomHits } from '@/Components/MyComponents/CustomHits';
import { Idea, InertiaSharedProps } from '@/types';
import AppLayout from '@/Layouts/AppLayout';
import Ideas from '@/Components/MyComponents/Ideas';

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

const Index: React.FC<Props> = ({ ideas: initialIdeas }) => {
	const [threeLinks, setThreeLinks] = useState<PaginationLink[]>([]);
	const [ideas, setIdeas] = useState<PaginatedIdeas>(initialIdeas);

	useEffect(() => {
		const activeIndex = ideas.links.findIndex(link => link.active);
		if (activeIndex !== -1) {
			const start = Math.max(0, activeIndex - 1);
			const end = Math.min(ideas.links.length - 1, activeIndex + 1);
			const sliced = ideas.links.slice(start, end + 1);
			const filtered = sliced.filter(link => link.url !== null);
			setThreeLinks(filtered);
		}
	}, [ideas.links]);

	// useEffect(() => {
	// 	const handler = (e: Event) => {
	// 		const event = (e as CustomEvent).detail;
	// 		setIdeas(prevIdeas => {
	// 			const updatedData = prevIdeas.data.map(idea => {
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



	const nextUrl = ideas.next_page_url ?? ideas.first_page_url;
	const prevUrl = ideas.prev_page_url ?? ideas.last_page_url;

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
		</AppLayout >
	);
};

export default Index;
