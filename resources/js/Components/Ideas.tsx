import React from 'react';
import { CardHeader, CardBody, CardFooter, Heading, Text, Badge, CardRoot, Grid } from '@chakra-ui/react';
import {IdeasProps, Idea, Tag} from '@/types';
import { Link } from '@inertiajs/react';

const Ideas: React.FC<IdeasProps> = ({ ideas }) => {
	return (
		<Grid className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap={"6"}>
			{ideas.map((idea: Idea) => (
				<Link key={idea.id} href={`/idea/${idea.id}`}>
				<CardRoot key={idea.id} className={"border border-red-300"}>
					<CardHeader className={'flex justify-between'}>
						<Heading className={'text-2xl font-semibold'}>{idea.title}</Heading>
						<Text className={'text-sm'}>{idea.user.name}</Text>
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
			))}
		</Grid>
	);
};

export default Ideas;
