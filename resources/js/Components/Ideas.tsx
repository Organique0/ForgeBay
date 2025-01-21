import React from 'react';
import { Card, CardHeader, CardBody, CardFooter, Heading, Text, Badge } from '@chakra-ui/react';
interface IdeasProps {
	ideas: Idea[];
}

type Idea = {
	created_at: string;
	description: string;
	id: number;
	title: string;
	updated_at: string;
	user: User;
	user_id: number;
	tags: Tag[];
	tasks: Task[];
}

type User = {
	active: boolean;
	created_at: string;
	current_team_id: number;
	email: string;
	email_verified_at?: string;
	id: number;
	name: string;
	profile_photo_path?: string;
	profile_photo_url?: string;
	two_factor_confirmed_at?: string;
	updated_at: string;
}

type Tag = {
	created_at?: string;
	id: number;
	name: string;
	updated_at?: string;
}

type Task = {
	created_at?: string;
	description: string;
	id: number;
	idea_id: number;
	updated_at?: string;
	value: number;
}

const Ideas: React.FC<IdeasProps> = ({ ideas }) => {
	return (
		<div>
			{ideas.map((idea: Idea) => (
				<Card key={idea.id}>
					<CardHeader className={'flex justify-between'}>
						<Heading size="md">{idea.title}</Heading>
						<h3>{idea.user.name}</h3>
					</CardHeader>
					<CardBody>
						<Text>{idea.description}</Text>
					</CardBody>
					<CardFooter className={'gap-2'}>
								{idea.tags.map((tag: Tag) => (
									<Badge key={tag.id}>{tag.name}</Badge>
								))}
					</CardFooter>
				</Card>
			))}
		</div>
	);
};

export default Ideas;
