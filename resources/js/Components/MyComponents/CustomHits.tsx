import React, { useEffect, useState } from 'react';
import { connectHits } from 'react-instantsearch-dom';
import Ideas from '@/Components/MyComponents/Ideas';
import axios from 'axios';
import { Idea } from '@/types';
import { useHits } from 'react-instantsearch';

function CustomHitsBase() {
	const { hits } = useHits();
	// localHits will eventually hold the merged search results with statuses
	const [localHits, setLocalHits] = useState<Idea[]>(hits);

	// Whenever new search results arrive, update localHits
	useEffect(() => {
		setLocalHits(hits);
	}, [hits]);

	// Async load status data for each idea and update localHits accordingly
	useEffect(() => {
		const fetchStatuses = async () => {
			const updatedHits = await Promise.all(
				hits.map(async (idea) => {
					try {
						const response = await axios.get(`/api/cached-task-statuses/${idea.id}`);
						const statuses = response.data;
						const updatedTasks = idea.tasks.map(task => {
							const cached = statuses.find((s: { id: number; status: string }) => s.id === task.id);
							return cached ? { ...task, status: cached.status } : task;
						});
						return { ...idea, tasks: updatedTasks };
					} catch (error) {
						console.error('Error fetching statuses for idea:', idea.id, error);
						return idea;
					}
				})
			);
			// Always update state with a new array to trigger re-render
			setLocalHits(updatedHits);
		};

		fetchStatuses();
	}, [hits]);

	return <Ideas ideas={localHits} />;
}

export default CustomHitsBase;
