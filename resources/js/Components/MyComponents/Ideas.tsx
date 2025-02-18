import React, { useEffect, useState } from 'react';
import { IdeasProps, Idea, Tag } from '@/types';
import { Link } from '@inertiajs/react';

import StatusPretty from '@/Components/MyComponents/StatusPretty';
import { Card, CardContent, CardFooter, CardHeader } from '@/Components/Shadcn/ui/card';
import { Badge } from '@/Components/Shadcn/ui/badge';
import axios from 'axios';
import { PaginatedIdeas } from '@/Pages/Ideas/Index';


const Ideas: React.FC<IdeasProps> = ({ ideas }) => {

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
	);
};

export default Ideas;
