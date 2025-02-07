import React, { useEffect } from 'react';
import { IdeasProps, Idea, Tag } from '@/types';
import { Link } from '@inertiajs/react';

import StatusPretty from '@/Components/MyComponents/StatusPretty';
import { Card, CardContent, CardFooter, CardHeader } from '@/Components/Shadcn/ui/card';
import { Badge } from '@/Components/Shadcn/ui/badge';
import axios from 'axios';

const Ideas: React.FC<IdeasProps> = ({ ideas }) => {


	return (
		<div className={'grid gap-3 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'}>
			{ideas.map((idea: Idea) => {
				const totalValue = idea.tasks.reduce((acc, task) => acc + task.value, 0);
				return (
					<div key={idea.id}>
						<Link href={`/idea/${idea.id}`}>
							<Card className={'min-h-[25em] flex flex-col'}>
								<CardHeader>
									<StatusPretty idea={idea} />
									<div className={'text-2xl font-semibold'}>{idea.title}</div>
									<p>${totalValue}</p>
								</CardHeader>
								<CardContent className={'grow'}>
									<p className={'grow'}>{idea.description}</p>
								</CardContent>
								<CardFooter className={'gap-2'}>
									{idea.tags.map((tag: Tag) => (
										<Badge key={tag.id}>{tag.name}</Badge>
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
