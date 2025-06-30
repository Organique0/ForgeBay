import { Link, router } from '@inertiajs/react'
import React, { FormEvent } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/Shadcn/ui/card';
import { Badge } from '../Shadcn/ui/badge'
import { Idea, Tag } from '@/types'
import { Button } from '../Shadcn/ui/button'
import { CalendarIcon, ClipboardList, Hammer, LightbulbIcon, UsersIcon } from 'lucide-react'
import { format, parseISO } from 'date-fns';

export default function SingleIdea({ hit, itemClassName }: { hit: Idea, itemClassName?: string }) {

	const handleIdeaClick = (e: FormEvent) => {
		e.stopPropagation();
		localStorage.setItem('ideasScrollPosition', window.scrollY.toString());
		router.visit(`/idea/${hit.id}`)
	};

	const handleUserLinkClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		localStorage.setItem('ideasScrollPosition', window.scrollY.toString());
		router.visit(`/user/${hit.user.id}`);
	};

	return (
		<Card className={'transition-all hover:shadow-l ' + itemClassName} id={hit.id + ""}>
			<CardHeader>
				<CardTitle className="block lg:flex items-start gap-2">

					<div className='flex gap-4'>
						<LightbulbIcon className="h-5 w-5 text-primary mt-1" />
						<Link href={`/idea/${hit.id}`} onClick={handleIdeaClick}>
							{hit.title}
						</Link>
					</div>

					<div className='gap-4 ml-auto flex mt-2 lg:mt-0'>
						<Hammer className="h-5 w-5 text-primary mt-1" />
						<div className='flex lg:block'>
							<span className='block text-left text-lg lg:text-xl mr-1'>Created By: </span>
							<Link href={`/user/${hit.user.id}`} className='text-lg lg:text-xl underline' onClick={handleUserLinkClick}>
								{hit.user.name}
							</Link>
						</div>
					</div>

				</CardTitle>
				<CardDescription className='text-extrabold text-lg'>
					Combined Value: {hit.total_value} $
				</CardDescription>
				<CardDescription className="flex items-center mt-2">
					<CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
					<span className='mr-1'>Created: </span>
					{format(parseISO(hit.created_at), 'PPP')}
				</CardDescription>
				<CardDescription className="flex items-center">
					<CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
					<span className='mr-1'>Updated: </span>
					{format(parseISO(hit.updated_at), 'PPP')}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<p className="line-clamp-3 text-sm text-muted-foreground">
					{hit.description}
				</p>
				<div className="flex flex-wrap gap-2 mt-4">
					{
						//@ts-ignore
						hit.tags.map((tag: Tag, index) => (
							<Badge id={index + ""} key={tag.id} className='text-xs'>{tag.name}</Badge>
						))
					 }
				</div>
			</CardContent>
			<CardFooter>
				<div className="flex justify-between items-center w-full">
					<div className="flex items-center text-sm text-muted-foreground">
						<ClipboardList className="h-3.5 w-3.5 mx-1.5" />
						{hit.tasks_count || 0} tasks
						<UsersIcon className="h-3.5 w-3.5 mx-1.5 ml-3" />
						{hit.applications_count || 0} applications
					</div>
					<Link href={`/idea/${hit.id}`}>
						<Button size="sm" variant="ghost">Learn more</Button>
					</Link>
				</div>
			</CardFooter>
		</Card>
		// <Link href={`/idea/${hit.id}`} onClick={handleIdeaClick}>
		// 	<Card className={'min-h-[25em] flex flex-col transition-all hover:shadow-lg'}>
		// 		<CardHeader>
		// 			<div className={'lg:flex lg:justify-between'}>
		// 				<div className='flex'>
		// 					<LightbulbIcon className="h-5 w-5 text-primary mt-1" />
		// 					<h1 className='text-2xl md:text-3xl font-semibold'>{hit.title}</h1>
		// 				</div>
		// 				<Link as='button' href={`/user/${hit.user.id}`} className='lg:flex items-center gap-4 underline hidden text-right float-end' onClick={handleUserLinkClick}>
		// 					<div className='block items-center gap-4'>
		// 						<span className='block text-right'>Created By: </span>
		// 						{hit.user.name}
		// 					</div>
		// 					<Hammer />
		// 				</Link>
		// 			</div>
		// 			<p className="font-bold text-xl">${hit.value}</p>
		// 		</CardHeader>
		// 		<CardContent className={'grow'}>
		// 			<p className={'grow text-lg md:text-xl'}>{hit.description}</p>
		// 		</CardContent>
		// 		<CardFooter className={'block lg:flex justify-between'}>
		// 			<div className='flex gap-2 flex-wrap'>
		// 				{hit.tags.map((tag: string) => (
		// 					<Badge key={tag} className='text-lg'>{tag}</Badge>
		// 				))}
		// 			</div>

		// 			<div className='mt-4 lg:mt-0 flex flex-wrap lg:block justify-between'>
		// 				<div className='gap-4 flex items-center'>
		// 					<div className='block'>
		// 						{hit.created_at && (
		// 							<time className='block'>
		// 								Created{' '}
		// 								{new Date(hit.created_at).toLocaleDateString()}
		// 							</time>
		// 						)}
		// 						{hit.updated_at && (
		// 							<time>
		// 								Updated{' '}
		// 								{new Date(hit.updated_at).toLocaleDateString()}
		// 							</time>
		// 						)}
		// 					</div>
		// 					<CalendarIcon />
		// 				</div>
		// 				<Link as={'button'} href={`/user/${hit.user.id}`} className='lg:hidden underline flex gap-4 items-center text-right float-end' onClick={handleUserLinkClick}>
		// 					<div className='block'>
		// 						<span className='block text-right'>Created By: </span>
		// 						{hit.user.name}
		// 					</div>
		// 					<Hammer />
		// 				</Link>
		// 			</div>
		// 		</CardFooter>
		// 	</Card>
		// </Link >
	)
}
