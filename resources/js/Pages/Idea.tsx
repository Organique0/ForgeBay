import React from 'react';
import { Idea as IdeaType } from '@/types';
import AppLayout from '@/Layouts/AppLayout';
import useTypedPage from '@/Hooks/useTypedPage';
import useRoute from '@/Hooks/useRoute';
import {
	Timeline, TimelineBody,
	TimelineDescription, TimelineFooter,
	TimelineItem,
	TimelineTitle,
	TimelineLink
} from '@/Components/MyComponents/timeline';
import StatusPretty from '@/Components/MyComponents/StatusPretty';
import { LuPencilRuler } from 'react-icons/lu';

const Idea = ({ idea }: { idea: IdeaType }) => {
  const firstToDoIndex = idea.tasks.findIndex(task => task.status === 'to_do');

  return (
    <AppLayout title={'Idea'}>
      <div className={'templateWidth mx-auto'}>
        <div className={'mt-12'}>
          <div className={'p-0'}>
            <h1 className={'text-4xl mb-12'}>{idea.title}</h1>
            <p className={'mb-12'}>{idea.description}</p>
          </div>

          <div className={'p-0'}>
            <Timeline className={'max-w-6xl'}>
							{idea.tasks.map((task, index) => (
								<TimelineItem>
									<TimelineTitle>
										{task.name}
										<div className={'flex flex-grow'}/>
										<StatusPretty initialStatus={task.status} />
									</TimelineTitle>

									<TimelineDescription className={'flex flex-col gap-3 mt-2'}>
										{task.created_at && <time>
											Created at {new Date(task.created_at).toLocaleDateString()}
										</time>}
										{task.updated_at && <time>
											Updated on {new Date(task.updated_at).toLocaleDateString()}
										</time>}
									</TimelineDescription>

									<TimelineBody>
										{task.description}
									</TimelineBody>

									{ task.status === 'to_do' && task.id === idea.tasks[firstToDoIndex].id && <TimelineFooter>
 										<TimelineLink
 											href="#"
 											className=""
 										>
 											<LuPencilRuler size={'15'} className={'mr-2'}/>
 											Apply
 										</TimelineLink>
 									</TimelineFooter>}
								</TimelineItem>
							))}
            </Timeline>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Idea;
