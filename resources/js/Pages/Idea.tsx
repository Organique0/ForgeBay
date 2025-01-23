import React, { ReactNode } from 'react';
import { Idea as IdeaType, Status } from '@/types';
import AppLayout from '@/Layouts/AppLayout';
import {
	For,
	Heading,
	Stack,
	Timeline,
	TimelineConnector,
	TimelineContent, TimelineDescription,
	TimelineItem,
	TimelineRoot,
	TimelineTitle,
	Text,
} from '@chakra-ui/react';
import {Button} from "@/ui/button";
import {Alert} from '@/ui/alert';
import { LuBadgeCheck, LuCheck, LuPackage, LuShip, LuPencil, LuRss, LuPlug, LuPlus, LuMinus, LuTerminal} from 'react-icons/lu';
import { Props } from '@headlessui/react/dist/types';
import { IconType } from 'react-icons';
import StatusComponent from '@/Components/StatusComponent';

const Idea = ({idea}: {idea: IdeaType})=> {
	console.log(idea);



	return (
		<AppLayout title={'Idea'}>
		<div className={'md:px-10 mt-[5%]'}>
			<Heading>Idea</Heading>
			<div className={'w-full mx-auto mt-[5%]'}>
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
							<TimelineContent>
								{task.description}
							</TimelineContent>
							{ (task.status == 'to_do' && index > 0 && idea.tasks[index-1]?.status == 'in_progress') ?
								<Alert status={"error"} title={'Previous task has not been completed yet.'}></Alert>
								: (task.status == 'to_do' ?
									<Button size={'md'} className={'md:float-start bg-red-500 md:!max-w-[14rem] mr-10'} >Apply</Button>
									: null)
							}
						</TimelineContent>
						{ (task.status == 'in_progress' && index > 0) ?
							<Alert title={"Currently in progress"}></Alert>
							: null
						}
					</TimelineItem>
				))}

			</TimelineRoot>
			</div>
		</div>
		</AppLayout>
		)};

export default Idea;
