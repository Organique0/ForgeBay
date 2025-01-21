import React from 'react';
import { Card, CardHeader, CardBody, CardFooter, Heading, Text, Badge, HStack } from '@chakra-ui/react';
interface IdeasProps {
	ideas: any;
};

const Ideas: React.FC<IdeasProps> = ({ ideas }) => {
	return (
		<div>
			{ideas.map((idea: any) => (
				<Card key={idea.id}>
					<CardHeader>
						<Heading size="md">{idea.title}</Heading>
					</CardHeader>
					<CardBody>
						<Text>{idea.description}</Text>
					</CardBody>
					<CardFooter>
							<Badge>{idea.user.name} </Badge>
					</CardFooter>
				</Card>
			))}
		</div>
	);
};

export default Ideas;
