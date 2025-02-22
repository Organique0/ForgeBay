import { Link, router } from '@inertiajs/react'
import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '../Shadcn/ui/card'
import { Badge } from '../Shadcn/ui/badge'
import { Idea } from '@/types'
import { HoverCard, HoverCardTrigger } from '@radix-ui/react-hover-card'
import { Button } from '../Shadcn/ui/button'
import { HoverCardContent } from '../Shadcn/ui/hover-card'
import { Avatar, AvatarFallback, AvatarImage } from '../Shadcn/ui/avatar'
import { CalendarIcon, Hammer } from 'lucide-react'

export default function SingleIdea({ hit }: { hit: Idea }) {

	const handleIdeaClick = () => {
		localStorage.setItem('ideasScrollPosition', window.scrollY.toString());
	};

	const handleUserLinkClick = (e: React.MouseEvent) => {
		localStorage.setItem('ideasScrollPosition', window.scrollY.toString());
		e.stopPropagation();
		router.visit(`/user/${hit.user.id}`);
	};

	return (
		<Link href={`/idea/${hit.id}`} onClick={handleIdeaClick}>
			<Card className={'min-h-[25em] flex flex-col'}>
				<CardHeader>
					<div className={'lg:flex lg:justify-between'}>
						<h1 className='text-2xl md:text-3xl font-semibold'>{hit.title}</h1>
						<Link as='button' href={`/user/${hit.user.id}`} className='lg:flex items-center gap-4 underline hidden text-right float-end' onClick={handleUserLinkClick}>
							<div className='block items-center gap-4'>
								<span className='block text-right'>Created By: </span>
								{hit.user.name}
							</div>
							<Hammer />
						</Link>
					</div>
					<p className="font-bold text-xl">${hit.value}</p>
				</CardHeader>
				<CardContent className={'grow'}>
					<p className={'grow text-lg md:text-xl'}>{hit.description}</p>
				</CardContent>
				<CardFooter className={'block lg:flex justify-between'}>
					<div className='flex gap-2 flex-wrap'>
						{hit.tags.map((tag: string) => (
							<Badge key={tag} className='text-lg'>{tag}</Badge>
						))}
					</div>

					<div className='mt-4 lg:mt-0 flex flex-wrap lg:block justify-between'>
						<div className='gap-4 flex items-center'>
							<div className='block'>
								{hit.created_at && (
									<time className='block'>
										Created{' '}
										{new Date(hit.created_at).toLocaleDateString()}
									</time>
								)}
								{hit.updated_at && (
									<time>
										Updated{' '}
										{new Date(hit.updated_at).toLocaleDateString()}
									</time>
								)}
							</div>
							<CalendarIcon />
						</div>
						<Link as={'button'} href={`/user/${hit.user.id}`} className='lg:hidden underline flex gap-4 items-center text-right float-end' onClick={handleUserLinkClick}>
							<div className='block'>
								<span className='block text-right'>Created By: </span>
								{hit.user.name}
							</div>
							<Hammer />
						</Link>
					</div>
				</CardFooter>
			</Card>
		</Link >
	)
}
