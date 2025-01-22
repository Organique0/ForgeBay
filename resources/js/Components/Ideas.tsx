import React from 'react';
import { CardHeader, CardBody, CardFooter, Heading, Text, Badge, CardRoot, Grid } from '@chakra-ui/react';
import {IdeasProps, Idea, Tag} from '@/types';

const Ideas: React.FC<IdeasProps> = ({ ideas }) => {
	return (
		<Grid templateColumns={"repeat(3, 1fr)"} gap={'6'}>
			{ideas.map((idea: Idea) => (
				<CardRoot key={idea.id} maxW="lg">
					<CardHeader className={'flex justify-between'}>
						<Heading className={'text-2xl font-semibold'}>{idea.title}</Heading>
						<Text className={'text-sm'}>{idea.user.name}</Text>
					</CardHeader>
					<CardBody>
						<Text>{idea.description}</Text>
					</CardBody>
					<CardFooter className={'gap-2'}>
								{idea.tags.map((tag: Tag) => (
									<Badge key={tag.id}>{tag.name}</Badge>
								))}
					</CardFooter>
				</CardRoot>
			))}
		</Grid>
	);
};

export default Ideas;
