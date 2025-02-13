import React, { useEffect, useState } from 'react';
import { Idea as IdeaType, Task as TaskType } from '@/types';
import AppLayout from '@/Layouts/AppLayout';
import {
	Timeline,
	TimelineBody,
	TimelineDescription,
	TimelineFooter,
	TimelineItem,
	TimelineTitle,
	TimelineLink,
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

const Idea = ({ idea: initialIdea }: { idea: IdeaType }) => {
	const [idea, setIdea] = useState<IdeaType>(initialIdea);
	const firstToDoIndex = idea.tasks.findIndex(task => task.status === 'to_do');
	const page = useTypedPage();

	useEffect(() => {
		// Listen for the ApplicationStatusUpdated event
		window.Echo.channel(`task.updates`)
			.listen('TaskStatusUpdated', (event: any) => {
				console.log('Received TaskStatusUpdated event:', event);
				// Check if the event is for this idea
				if (event.ideaId === idea.id) {
					// Update the task status in the component's data
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
			});

		// Cleanup function to remove the listener when the component unmounts
		return () => {
			window.Echo.channel(`task.updates`).stopListening('TaskStatusUpdated');
		};
	}, [idea.id]);

	return (
		<AppLayout title={'Idea'}>
			<div className={'templateWidth mx-auto'}>
				<div className={'mt-12'}>
					<div className={'p-0'}>
						<h1 className={'text-4xl mb-12'}>{idea.title}</h1>
						<p className={'mb-12 text-lg'}>{idea.description}</p>
					</div>

					<div className={'p-0'}>
						<Timeline className={'max-w-7xl mx-auto'}>
							{idea.tasks.map((task, index) => (
								<TimelineItem key={task.id}>
									<TimelineIcon>
										<StatusComponent status={task.status} />
									</TimelineIcon>
									<div className='ml-4'>
										<TimelineTitle>
											{task.name}
											<div className={'flex flex-grow'} />
											<StatusPretty initialStatus={task.status} className='text-lg' />
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
										//this is so complicated I have no idea how it works anymore
										task.status === 'to_do' &&
										task.id === idea.tasks[firstToDoIndex].id && (
											page.props.auth.user ? (
												task.applications?.some(app => app.user_id === page.props.auth.user.id) ? (
													<TimelineFooter className='ml-4'>
														<Button disabled>Already Applied</Button>
													</TimelineFooter>
												) : (
													<TimelineFooter className='ml-4'>
														<Accordion type='single' collapsible className='w-full'>
															<AccordionItem value='item-1' className='border-none'>
																<Button className='text-xl max-w-1/5' asChild>
																	<AccordionTrigger>
																		<LuPencilRuler size={'18'} className={'mr-2'} />
																		<span className='mr-1'>Apply</span>
																	</AccordionTrigger>
																</Button>
																<AccordionContent className='bg-indigo-100 mt-4 p-4 rounded-lg'>
																	<ApplicationForm idea={idea} task={task} />
																</AccordionContent>
															</AccordionItem>
														</Accordion>
													</TimelineFooter>
												)
											) : (
												<Link href='/login'>
													<Button>Login to apply</Button>
												</Link>
											)
										)}
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
