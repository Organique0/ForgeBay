import React, { useState, useEffect, FormEvent } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import SingleIdea from '@/Components/MyComponents/SingleIdea';
import { Button } from '@/Components/Shadcn/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { router } from '@inertiajs/react';
import { Idea, PaginatedIdea, PaginationInstance } from '@/types';
import Checkbox from '@/Components/Checkbox';
import useDebounce from '@/Hooks/useDebounce';

const Index = ({ ideas, filters }: { ideas: PaginationInstance, filters: {query: string} }) => {
	console.log(ideas);
	const [searchQuery, setSearchQuery] = useState(filters.query || '');
	const [selectedTags, setSelectedTags] = useState([]);
	const [orderBy, setOrderBy] = useState(filters.orderBy || 'latest_created');

	const debouncedSearchQuery = useDebounce(searchQuery, 500);

	// Generate navigation URLs from cursor data
	const nextPageUrl = ideas.next_cursor
		? `/idea?cursor=${encodeURIComponent(ideas.next_cursor)}${filters.query ? `&query=${encodeURIComponent(filters.query)}` : ''}&tags=${selectedTags.join(',')}`
		: null;

	const prevPageUrl = ideas.prev_cursor
		? `/idea?cursor=${encodeURIComponent(ideas.prev_cursor)}${filters.query ? `&query=${encodeURIComponent(filters.query)}` : ''}&tags=${selectedTags.join(',')}`
		: null;

	const goToNextPage = () => {
		if (nextPageUrl) {
			router.get(nextPageUrl, {}, {
				preserveState: true,
				preserveScroll: true
			});
		}
	};

	const goToPrevPage = () => {
		if (prevPageUrl) {
			router.get(prevPageUrl, {}, {
				preserveState: true,
				preserveScroll: true
			});
		}
	};

	// const submitSearch = (e: FormEvent) => {
	// 	e.preventDefault();
	//
	// 	router.get('/idea', { query: searchQuery }, {
	// 		preserveState: true,
	// 	});
	// };

	const toggleTag = (tagId: number) => {
		if (selectedTags.includes(tagId)) {
			setSelectedTags(selectedTags.filter(id => id !== tagId));
		} else {
			setSelectedTags([...selectedTags, tagId]);
		}
	};

	const handleOrderByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setOrderBy(e.target.value);
	};


	useEffect(() => {
		router.get('/idea', { query: debouncedSearchQuery, tags: selectedTags.join(','), orderBy: orderBy }, {
			preserveState: true,
		});
	}, [orderBy, selectedTags, debouncedSearchQuery]);

	return (
		<AppLayout title='Ideas'>

			<div className="space-y-6">
				{/* Search form  */}
				<h1 className='mt-4'>Search by title or description</h1>
					<input
						type="text"
						placeholder="Search ideas..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full p-2 border rounded"
					/>
					<div className='flex flex-wrap gap-4'>
						{ideas.tags && ideas.tags.map((tag) => (
							<div key={tag.id} className="flex items-center space-x-2ear>
								<Checkbox
									id={`tag-${tag.id}`}
									checked={selectedTags.includes(tag.id)}
									onChange={() => toggleTag(tag.id)}
								/>
								<label htmlFor={`tag-${tag.id}`}>
									{tag.name}
								</label>
							</div>
						))}
					</div>


				<select
					value={orderBy}
					onChange={handleOrderByChange}
					className="border rounded p-2"
				>
					<option value="latest_created">Latest Created</option>
					<option value="oldest_created">Oldest Created</option>
					<option value="latest_updated">Latest Updated</option>
					<option value="oldest_updated">Oldest Updated</option>
					<option value="highest_value">Highest Value</option>
					<option value="lowest_value">Lowest Value</option>
					<option value="most_applications">Most Applications</option>
					<option value="least_applications">Least Applications</option>
					<option value="most_tasks">Most Tasks</option>
					<option value="least_tasks">Least Tasks</option>
				</select>

				{/* Ideas list */}
				<div className="">
					<ul className="">
						{ideas.data && ideas.data.length > 0 ? (
							ideas.data.map((idea) => (
								<li key={idea.id} className='my-6'>
									<SingleIdea hit={idea} />
								</li>
							))
						) : (
							<p>No ideas found.</p>
						)}
					</ul>
				</div>

				{/* Pagination */}
				<div className="flex items-center justify-between">
					<Button
						variant="outline"
						disabled={!ideas.prev_cursor}
						onClick={goToPrevPage}
					>
						<ChevronLeft className="h-4 w-4 mr-2" />
						Previous
					</Button>


					<Button
						variant="outline"
						disabled={!ideas.next_cursor}
						onClick={goToNextPage}
					>
						Next
						<ChevronRight className="h-4 w-4 ml-2" />
					</Button>
				</div>
			</div>
		</AppLayout>
	);
};

export default Index;
