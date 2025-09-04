import React, { useEffect, useState } from 'react';
import { Idea, IdeaWithTasks } from '@/types';
import AppLayout from '@/Layouts/AppLayout';
import {
	Timeline,
	TimelineBody,
	TimelineDescription,
	TimelineFooter,
	TimelineItem,
	TimelineTitle,
	TimelineIcon,
} from '@/Components/MyComponents/timeline';
import StatusPretty from '@/Components/MyComponents/StatusPretty';
import { LuPencilRuler } from 'react-icons/lu';
import StatusComponent from '@/Components/MyComponents/StatusComponent';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '@/Components/Shadcn/ui/accordion';
import { Button } from '@/Components/Shadcn/ui/button';
import ApplicationForm from '@/Components/MyComponents/ApplicationForm';
import useTypedPage from '@/Hooks/useTypedPage';
import { Link } from '@inertiajs/react';
import TrendingItems from '@/Components/MyComponents/TrendingItems';

const IdeaPage = ({ idea: initialIdea, recommendations }: { idea: IdeaWithTasks, recommendations: Idea[] }) => {
	const [idea, setIdea] = useState<IdeaWithTasks>(initialIdea);
	const firstToDoIndex = idea.tasks.findIndex(task => task.status === 'to_do');
	const page = useTypedPage();

	 useEffect(() => {
	 	const handler = (e: Event) => {
	 		const event = (e as CustomEvent).detail;
	 		if (event.ideaId === initialIdea.id) {
	 			setIdea(prevIdea => ({
	 				...prevIdea,
	 				tasks: prevIdea.tasks.map(task => {
	 					if (task.id === event.taskId) {
	 						return { ...task, status: event.status };
	 					}
	 					return task;
	 				})
	 			}));
	 		}
	 	};
	 	window.addEventListener('taskStatusUpdate', handler);
	 	return () => {
	 		window.removeEventListener('taskStatusUpdate', handler);
	 	};
	 }, [initialIdea.id]);

	return (
		<AppLayout title={'Idea'}>
			<div className={'mt-12'}>
				<div className={'p-0'}>
					<h1 className={'text-4xl mb-12'}>{idea.title}</h1>
					<p className={'mb-12 text-lg'}>{idea.description}</p>
				</div>

				<div className={'px-6'}>
					<Timeline className={'max-w-7xl mx-auto'}>
						{idea.tasks.map((task, index) => (
							<TimelineItem key={task.id}>
								<TimelineIcon>
									<StatusComponent status={task.status} />
								</TimelineIcon>
								<div className='ml-4'>
									<div className="flex justify-end mb-2">
										<StatusPretty initialStatus={task.status} className={'text-sm w-full sm:w-[7em] h-[2em] justify-center'} />
									</div>
									<TimelineTitle>
										{task.name}
									</TimelineTitle>

									<TimelineDescription className={'flex flex-col gap-3 mt-2'}>
										{task.created_at && (
											<time>
												Created at{' '}
												{new Date(task.created_at).toLocaleDateString()}
											</time>
										)}
										{task.updated_at && (
											<time>
												Updated on{' '}
												{new Date(task.updated_at).toLocaleDateString()}
											</time>
										)}
									</TimelineDescription>

									<TimelineBody>{task.description}</TimelineBody>
								</div>

								{
									//if task's status is to_od and it is the first task with that status
									//then check if has_applied is true and display different ui based on that condition
									//has_applied is calculated on the server and is unique to each user and task.
									task.status === 'to_do' &&
									task.id === idea.tasks[firstToDoIndex].id && (
										page.props.auth.user ? (
											task.has_applied ? (
												<TimelineFooter className='ml-4'>
													<Button disabled>Already Applied</Button>
												</TimelineFooter>
											) : (
												<TimelineFooter className='ml-4'>
													<Accordion type='single' collapsible className='w-full'>
														<AccordionItem value='item-1' className='border-none'>
															<AccordionTrigger className='bg-primary text-primary-foreground rounded-md p-3 w-full md:max-w-1/2 lg:max-w-1/3 xl:max-w-1/5'>
																<LuPencilRuler size={'18'} className={'mr-2'} />
																<span className='mr-1'>Apply</span>
															</AccordionTrigger>
															<AccordionContent className='bg-indigo-100 mt-4 p-4 rounded-lg'>
																<ApplicationForm idea={idea} task={task} />
															</AccordionContent>
														</AccordionItem>
													</Accordion>
												</TimelineFooter>
											)
										) : (
											<Link href='/login'>
												<Button >Login to apply</Button>
											</Link>
										)
									)}
							</TimelineItem>
						))}
					</Timeline>
				</div>

				{recommendations.length > 0 && <TrendingItems
					ideas={recommendations}
					title='Similar ideas'
					description='Ideas you might find relevant.'
					orientation="horizontal"
					className='mt-32'

				/>}
			</div>
		</AppLayout>
	);
};

export default IdeaPage;
