import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import SingleIdea from '@/Components/MyComponents/SingleIdea';
import { Button } from '@/Components/Shadcn/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { router } from '@inertiajs/react';

const Index: React.FC = ({ ideas, filters }) => {
	console.log(ideas);
	const [searchQuery, setSearchQuery] = useState(filters.query || '');

	// Generate navigation URLs from cursor data
	const nextPageUrl = ideas.next_cursor
		? `/idea?cursor=${encodeURIComponent(ideas.next_cursor)}${filters.query ? `&query=${encodeURIComponent(filters.query)}` : ''}`
		: null;

	const prevPageUrl = ideas.prev_cursor
		? `/idea?cursor=${encodeURIComponent(ideas.prev_cursor)}${filters.query ? `&query=${encodeURIComponent(filters.query)}` : ''}`
		: null;

	const goToNextPage = () => {
		if (ideas.next_cursor) {
			router.get(nextPageUrl, {}, {
				preserveState: true,
				preserveScroll: true
			});
		}
	};

	const goToPrevPage = () => {
		if (ideas.prev_cursor) {
				router.get(prevPageUrl, {}, {
				preserveState: true,
				preserveScroll: true
			});
		}
	};

	const submitSearch = (e) => {
		e.preventDefault();

		// Only trigger navigation if there's an actual query
		router.get('/idea', { query: searchQuery }, {
			preserveState: true,
			onSuccess: () => {
				setPreviousCursors([]);
			}
		});
	};

	return (
		<AppLayout title='Ideas'>
			<h1 className='mt-4'>Search by title, description, tags, user, date ...</h1>

			<div className="space-y-6">
				{/* Search form  */}
				<form onSubmit={submitSearch} className="flex gap-2">
					<input
						type="text"
						placeholder="Search ideas..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full p-2 border rounded"
					/>
					<Button
						type="submit"
						variant="default"
					>
						Search
					</Button>
				</form>

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
