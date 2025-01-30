import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import { InertiaSharedProps } from '@/types';

interface Idea {
	id: string;
	title: string;
	description: string;
	// ...other fields...
}

interface Props extends InertiaSharedProps {
	ideas: Idea[];
}

const Index: React.FC<Props> = ({ ideas }) => {
	return (
		<div>
			<h1>All Ideas</h1>
			<ul>
				{ideas.map(idea => (
					<li key={idea.id}>
						<a href={`/ideas/${idea.id}`}>{idea.title}</a>
						<p>{idea.description}</p>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Index;
