import React from 'react';
import {IdeasProps, Idea, Tag} from '@/types';
import { Link } from '@inertiajs/react';

import StatusPretty from '@/Components/StatusPretty';

const Ideas: React.FC<IdeasProps> = ({ ideas } ) => {
	return (
		<div className={'grid-cols-1 lg:grid-cols-2'}>
			{ideas.map((idea: Idea) => {
				const totalValue = idea.tasks.reduce((acc, task) => acc + task.value, 0);
				return (
					<Link key={idea.id} href={`/idea/${idea.id}`}>
						<div key={idea.id} className={"border border-red-300 min-h-52"}>
							<div className={''}>
								<div className={'text-2xl font-semibold'}>{idea.title}</div>
								<StatusPretty idea={idea} className={"absolute top-3 right-2"}/>
								<p>${totalValue}</p>
							</div>
							<div>
								<p>{idea.description}</p>
							</div>
							<div className={'gap-2'}>
								{idea.tags.map((tag: Tag) => (
									<span key={tag.id}>{tag.name}</span>
								))}
							</div>
						</div>
					</Link>
				)
})}
		</div>
	);
};

export default Ideas;
