import React, { useEffect, useState } from 'react';
import { IdeasProps, Idea, Tag } from '@/types';
import { Link } from '@inertiajs/react';

import StatusPretty from '@/Components/MyComponents/StatusPretty';
import { Card, CardContent, CardFooter, CardHeader } from '@/Components/Shadcn/ui/card';
import { Badge } from '@/Components/Shadcn/ui/badge';
import axios from 'axios';
import SingleIdea from './SingleIdea';
//import { PaginatedIdeas } from '@/Pages/Ideas/Index';


const Ideas: React.FC<IdeasProps> = ({ ideas: initialIdeas }) => {
	// If initialIdeas is a paginator, use initialIdeas.data; otherwise, use it directly.
	const data = Array.isArray(initialIdeas) ? initialIdeas : initialIdeas.data;
	//const [ideas, setIdeas] = useState<Idea[]>(data);

	// useEffect(() => {
	// 	const handler = (e: Event) => {
	// 		const event = (e as CustomEvent).detail;
	// 		console.log(ideas);
	// 		setIdeas(prevIdeas =>
	// 			prevIdeas.map(idea => {
	// 				if (idea.id === event.ideaId) {
	// 					return {
	// 						...idea,
	// 						tasks: idea.tasks.map(task =>
	// 							task.id === event.taskId ? { ...task, status: event.status } : task
	// 						)
	// 					};
	// 				}
	// 				return idea;
	// 			})
	// 		);
	// 	};
	// 	window.addEventListener('taskStatusUpdate', handler);
	// 	return () => {
	// 		window.removeEventListener('taskStatusUpdate', handler);
	// 	};
	// }, []);

	useEffect(() => {
		console.log(data);

	}, []);


	const handleIdeaClick = (ideaId: number,) => {
		localStorage.setItem('ideasScrollPosition', window.scrollY.toString());
	};

	useEffect(() => {
		const shouldPreserve = localStorage.getItem('ideasScrollPosition');
		if (shouldPreserve === 'true') {
			const pos = localStorage.getItem('ideasScrollPosition');
			if (pos) window.scrollTo(0, parseInt(pos));
			localStorage.removeItem('ideasScrollPosition');
		}
	}, []);

	return (
		<div className={''}>
			{data ? data.map((idea: Idea) => {
				const totalValue = idea.tasks.reduce((acc, task) => acc + task.value, 0);
				return (
					<div key={idea.id} className='my-6'>
						<SingleIdea hit={idea} />
					</div>
				)
			}) : <p>no ideas</p>}
		</div>
	);
};

export default Ideas;
