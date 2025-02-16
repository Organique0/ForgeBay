import React, { useEffect, useState } from 'react';
import { IdeasProps, Idea, Tag } from '@/types';
import { Link, router } from '@inertiajs/react';

import StatusPretty from '@/Components/MyComponents/StatusPretty';
import { Card, CardContent, CardFooter, CardHeader } from '@/Components/Shadcn/ui/card';
import { Badge } from '@/Components/Shadcn/ui/badge';
import axios from 'axios';
import { PaginatedIdeas } from '@/Pages/Ideas/Index';
import { route } from 'ziggy-js';


const Ideas: React.FC<IdeasProps> = ({ ideas: initialIdeas }) => {
	const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);

	useEffect(() => {
		const handler = (e: Event) => {
			const event = (e as CustomEvent).detail;
			setIdeas(prevIdeas => {
				return prevIdeas.map(idea => {
					if (idea.id === event.ideaId) {
						return {
							...idea,
							tasks: idea.tasks.map(task =>
								task.id === event.taskId ? { ...task, status: event.status } : task
							)
						};
					}
					return idea;
				});
			});
		};
		window.addEventListener('taskStatusUpdate', handler);
		return () => {
			window.removeEventListener('taskStatusUpdate', handler);
		};
	}, []);

	const handleIdeaClick = (ideaId: number) => {
		localStorage.setItem('ideasScrollPosition', window.scrollY.toString());
	};

	return (
		<div className={''}>
			{ideas.map((idea: Idea) => {
				const totalValue = idea.tasks.reduce((acc, task) => acc + task.value, 0);
				return (
					<div key={idea.id} className='my-6' onClick={() => handleIdeaClick(idea.id)}>
						<Link href={`/idea/${idea.id}`} preserveScroll>
							<Card className={'min-h-[25em] flex flex-col'}>
								<CardHeader>
									<div className="flex justify-end mb-2">
										<StatusPretty idea={idea} className={'text-sm w-full sm:w-[7em] h-[2em] justify-center'} />
									</div>
									<h1 className='text-3xl font-semibold'>{idea.title}</h1>
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
	);
};

export default Ideas;
