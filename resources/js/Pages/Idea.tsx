import React from 'react';
import { Idea as IdeaType } from '@/types';
import AppLayout from '@/Layouts/AppLayout';
import {
	Heading,
	TimelineConnector,
	TimelineContent, TimelineDescription,
	TimelineItem,
	TimelineRoot,
	TimelineTitle,
	Text,
} from '@chakra-ui/react';
import StatusComponent from '@/Components/StatusComponent';

const Idea = ({idea}: {idea: IdeaType})=> {
	console.log(idea);



	return (
		<AppLayout title={'Idea'}>
		<div className={'md:px-10 mt-[5%]'}>
			<Heading>Idea</Heading>
			<div className={'w-1/3 mx-auto mt-[5%]'}>
			<TimelineRoot size={'sm'}>
				{idea.tasks.map( (task, index) => (
					<TimelineItem key={index} className={''}>
						<TimelineConnector>
							<StatusComponent status={task.status} />
						</TimelineConnector>
						<TimelineContent>
							<TimelineTitle textStyle="sm">{task.name}</TimelineTitle>
							{task.created_at && <TimelineDescription display={'flex'}>Added: {new Date(task.created_at).toLocaleDateString()}</TimelineDescription>}
							{task.updated_at && <TimelineDescription display={'flex'}>Last updated: {new Date(task.updated_at).toLocaleDateString()}</TimelineDescription>}
							<Text>
								{task.description}
							</Text>

						</TimelineContent>
					</TimelineItem>
				))}

			</TimelineRoot>
			</div>
		</div>
		</AppLayout>
		)};

export default Idea;
