import React from 'react';
import {
	CardHeader,
	CardBody,
	CardFooter,
	Heading,
	Text,
	Badge,
	CardRoot,
	SimpleGrid,
} from '@chakra-ui/react';
import {IdeasProps, Idea, Tag} from '@/types';
import { Link } from '@inertiajs/react';

import StatusPretty from '@/Components/StatusPretty';

const Ideas: React.FC<IdeasProps> = ({ ideas } ) => {
	return (
		<SimpleGrid gap={'20px'} className={'grid-cols-1 lg:grid-cols-2'}>
			{ideas.map((idea: Idea) => {
				const totalValue = idea.tasks.reduce((acc, task) => acc + task.value, 0);
				return (
					<Link key={idea.id} href={`/idea/${idea.id}`}>
						<CardRoot key={idea.id} className={"border border-red-300 min-h-52"}>
							<CardHeader className={''}>
								<Heading className={'text-2xl font-semibold'}>{idea.title}</Heading>
								<StatusPretty idea={idea} className={"absolute top-3 right-2"}/>
								<Text>${totalValue}</Text>
							</CardHeader>
							<CardBody>
								<Text>{idea.description}</Text>
							</CardBody>
							<CardFooter className={'gap-2'}>
								{idea.tags.map((tag: Tag) => (
									<Badge key={tag.id} variant={'solid'}>{tag.name}</Badge>
								))}
							</CardFooter>
						</CardRoot>
					</Link>
				)
})}
		</SimpleGrid>
	);
};

export default Ideas;
