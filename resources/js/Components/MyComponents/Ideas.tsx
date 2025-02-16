import React, { useEffect, useState } from 'react';
import { IdeasProps, Idea, Tag } from '@/types';
import { Link } from '@inertiajs/react';
import { Link } from '@inertiajs/react';

import StatusPretty from '@/Components/MyComponents/StatusPretty';
import { Card, CardContent, CardFooter, CardHeader } from '@/Components/Shadcn/ui/card';
import { Badge } from '@/Components/Shadcn/ui/badge';
import axios from 'axios';
import { PaginatedIdeas } from '@/Pages/Ideas/Index';



<<<<<<< HEAD
const Ideas: React.FC<IdeasProps> = ({ ideas }) => {
=======
	useEffect(() => {
		const handler = (e: Event) => {
			const event = (e as CustomEvent).detail;
			console.log(ideas);
			console.log(ideas);
			setIdeas(prevIdeas => {
				const updatedData = prevIdeas.map(idea => {
				const updatedData = prevIdeas.map(idea => {
					if (idea.id === event.ideaId) {
						const updatedTasks = idea.tasks.map(task => {
							if (task.id === event.taskId) {
								return { ...task, status: event.status };
							}
							return task;
						});
						return { ...idea, tasks: updatedTasks };
						const updatedTasks = idea.tasks.map(task => {
							if (task.id === event.taskId) {
								return { ...task, status: event.status };
							}
							return task;
						});
						return { ...idea, tasks: updatedTasks };
					}
					return idea;
				});
				return { ...prevIdeas, data: updatedData };
				return { ...prevIdeas, data: updatedData };
			});
		};
		window.addEventListener('taskStatusUpdate', handler);
		return () => {
			window.removeEventListener('taskStatusUpdate', handler);
		};
	}, []);

>>>>>>> 02e74de (better preserve scroll and reset when needed)
	const handleIdeaClick = (ideaId: number,) => {
		localStorage.setItem('ideasScrollPosition', window.scrollY.toString());
	};

	useEffect(() => {
<<<<<<< HEAD
		console.log(ideas);

	}, []);


	return (
		< div className={''} >
			{
				ideas.map((idea: Idea) => {
					const totalValue = idea.tasks.reduce((acc, task) => acc + task.value, 0);
					return (
						<div key={idea.id} className='my-6'>
							<Link href={`/idea/${idea.id}`} onClick={() => handleIdeaClick(idea.id)}>
								<Card className={'min-h-[25em] flex flex-col'}>
									<CardHeader>
										<div className={'flex justify-between'}>
											<h1 className='text-3xl font-semibold f'>{idea.title}</h1>
											<StatusPretty idea={idea} className={'text-lg'} />
										</div>
										<p className="font-bold text-xl">${totalValue}</p>
									</CardHeader>
									<CardContent className={'grow'}>
										<p className={'grow'}>{idea.description}</p>
									</CardContent>
									<CardFooter className={'gap-2'}>
										{idea.tags.map((tag) => (
											<Badge key={tag} className='text-lg'>{tag}</Badge>
										))}
									</CardFooter>
								</Card>
							</Link>
						</div>
					)
				})
			}
		</ div>
=======
		const shouldPreserve = localStorage.getItem('ideasScrollPosition');
		if (shouldPreserve === 'true') {
			const pos = localStorage.getItem('ideasScrollPosition');
			if (pos) window.scrollTo(0, parseInt(pos));
			localStorage.removeItem('ideasScrollPosition');
		}
	}, []);

	return (
		<div className={''}>
			{ideas.map((idea: Idea) => {
				const totalValue = idea.tasks.reduce((acc, task) => acc + task.value, 0);
				return (
					<div key={idea.id} className='my-6'>
						<Link href={`/idea/${idea.id}`} onClick={() => handleIdeaClick(idea.id)}>
					<div key={idea.id} className='my-6'>
						<Link href={`/idea/${idea.id}`} onClick={() => handleIdeaClick(idea.id)}>
							<Card className={'min-h-[25em] flex flex-col'}>
								<CardHeader>
									<div className={'flex justify-between'}>
										<h1 className='text-3xl font-semibold f'>{idea.title}</h1>
										<StatusPretty idea={idea} className={'text-lg'} />
									<div className={'flex justify-between'}>
										<h1 className='text-3xl font-semibold f'>{idea.title}</h1>
										<StatusPretty idea={idea} className={'text-lg'} />
									</div>
									<p className="font-bold text-xl">${totalValue}</p>
								</CardHeader>
								<CardContent className={'grow'}>
									<p className={'grow'}>{idea.description}</p>
								</CardContent>
								<CardFooter className={'gap-2'}>
									{idea.tags.map((tag: Tag) => (
										<Badge key={tag.id} className='text-lg'>{tag.name}</Badge>
									))}
								</CardFooter>
							</Card>
						</Link>
					</div>
				)
			})}
		</div>
>>>>>>> 02e74de (better preserve scroll and reset when needed)
	);
};

export default Ideas;
