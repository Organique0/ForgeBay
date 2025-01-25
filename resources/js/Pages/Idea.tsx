import React from 'react';
import { Idea as IdeaType } from '@/types';
import AppLayout from '@/Layouts/AppLayout';
import {
	Container, Flex,
	Heading, Stack, StackSeparator,
	Text,
} from '@chakra-ui/react';
import StatusComponent from '@/Components/StatusComponent';
import {TimelineItem, TimelineRoot, TimelineConnector, TimelineContent, TimelineDescription, TimelineTitle } from '@/ui/timeline';
import { Button } from '@/ui/button';
import { Link } from '@inertiajs/react';
import useTypedPage from '@/Hooks/useTypedPage';
import PrimaryButton from '@/Components/PrimaryButton';
import useRoute from '@/Hooks/useRoute';

const Idea = ({idea}: {idea: IdeaType})=> {
	const firstToDoIndex = idea.tasks.findIndex( task => task.status === 'to_do');
	const page = useTypedPage();
	const route = useRoute();

	return (
		<AppLayout title={'Idea'}>
			<Container>
				<Stack className={'mt-12'} separator={<StackSeparator/>} gap={'9'}>
					<Container className={'p-0'}>
						<Heading className={'text-4xl mb-12'}>{idea.title}</Heading>
						<Text>{idea.description}</Text>
					</Container>

					<Container className={'p-0'}>
						<TimelineRoot size={'xl'}>
							{idea.tasks.map( (task, index) => (
								<TimelineItem key={index}>
									<TimelineContent width={'15em'} className={'hidden lg:block'}>
										{task.created_at && <TimelineDescription display={'flex'}>Added: {new Date(task.created_at).toLocaleDateString()}</TimelineDescription>}
										{task.updated_at && <TimelineDescription display={'flex'}>Last updated: {new Date(task.updated_at).toLocaleDateString()}</TimelineDescription>}
									</TimelineContent>
									<TimelineConnector className={'bg-white'}>
										<StatusComponent status={task.status} />
									</TimelineConnector>
									<TimelineContent>
										<TimelineTitle textStyle="sm">{task.name}</TimelineTitle>


												<Text>
													{task.description}
												</Text>
										{
											task.status === 'to_do' &&
											task.id === idea.tasks[firstToDoIndex].id &&
											<Flex justify={'flex-end'}>
												{page.props.auth.user
													?
													<PrimaryButton className={'w-full md:w-1/3 lg:w-1/6' }>Apply</PrimaryButton>
													:
													<Link href={route('login')}  className={'w-full md:w-1/3 lg:w-1/6'}>
														<PrimaryButton>
															Login to apply
														</PrimaryButton>
													</Link>
												}
											</Flex>
										}

									</TimelineContent>
								</TimelineItem>
							))}

						</TimelineRoot>
					</Container>
				</Stack>
			</Container>


		</AppLayout>
		)};

export default Idea;
