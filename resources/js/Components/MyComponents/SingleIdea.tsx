import { Link } from '@inertiajs/react'
import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '../Shadcn/ui/card'
import { Badge } from '../Shadcn/ui/badge'
import { Idea } from '@/types'

export default function SingleIdea({ hit }: { hit: Idea }) {

	const handleIdeaClick = () => {
		localStorage.setItem('ideasScrollPosition', window.scrollY.toString());
	};

	return (
		<Link href={`/idea/${hit.id}`} onClick={handleIdeaClick}>
			<Card className={'min-h-[25em] flex flex-col'}>
				<CardHeader>
					<div className={'flex justify-between'}>
						<h1 className='text-3xl font-semibold f'>{hit.title}</h1>
						{/* <StatusPretty idea={idea} className={'text-lg'} /> */}
					</div>
					<p className="font-bold text-xl">${hit.value}</p>
				</CardHeader>
				<CardContent className={'grow'}>
					<p className={'grow'}>{hit.description}</p>
				</CardContent>
				<CardFooter className={'gap-2'}>
					{hit.tags.map((tag: string) => (
						<Badge className='text-lg'>{tag}</Badge>
					))}
				</CardFooter>
			</Card>
		</Link>
	)
}
