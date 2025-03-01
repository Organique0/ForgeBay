import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/Shadcn/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/Shadcn/ui/card';
import { Badge } from '@/Components/Shadcn/ui/badge';
import { Idea } from '@/types';
import { CalendarIcon, ChevronRightIcon, LightbulbIcon, UsersIcon } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import { format, parseISO } from 'date-fns';
import SingleRecommendedIdea from '@/Components/MyComponents/SingleRecommendedIdea';
import { Carousel } from 'react-instantsearch';
import { CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/Components/Shadcn/ui/carousel';
import TrendingItems from '@/Components/MyComponents/TrendingItems';

interface LandingPageProps {
	latestIdeas: Idea[];
}


export default function LandingPage({ latestIdeas }: LandingPageProps) {
	console.log("latest: ", latestIdeas);
	return (
		<AppLayout title="Welcome to ForgeBay" fullWidth>
			{/* Hero Banner */}
			<div className="relative bg-gradient-to-r from-primary/80 to-primary overflow-hidden">
				<div className="absolute inset-0">
					<svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
						<defs>
							<pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse" x="0" y="0">
								<path d="M0 32V.5H32" fill="none" stroke="rgba(255, 255, 255, 0.1)" />
							</pattern>
						</defs>
						<rect width="100%" height="100%" fill="url(#grid)" />
					</svg>
				</div>

				<div className="relative px-6 py-24 sm:py-32 lg:px-8 max-w-5xl mx-auto">
					<div className="mx-auto max-w-2xl text-center">
						<h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
							Collaborate, Innovate, Create
						</h1>
						<p className="mt-6 text-lg leading-8 text-white/90">
							ForgeBay connects creative minds with technical talent.
							Share your ideas, find collaborators, and bring your vision to life.
						</p>
						<div className="mt-10 flex items-center justify-center gap-x-6">
							<Button size="lg" className="rounded-full px-8">
								Get Started
							</Button>
							<Link href="/idea" className="text-white hover:text-white/80 flex items-center">
								Browse Ideas <ChevronRightIcon className="ml-1 h-4 w-4" />
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* Latest Ideas Section */}
			<div className="py-16 px-6 lg:px-8 bg-background">
				<div className="max-w-5xl mx-auto">
					<TrendingItems
						title='Latest ideas'
						description='	Check out the newest opportunities for collaboration'
						ideas={latestIdeas}
						orientation='horizontal'
						className=''

					/>

					{/* <div className="grid grid-cols-1 lg:grid-cols-2 4xl:grid-cols-3 gap-6">
						{latestIdeas.map((idea) => (
							 <Card key={idea.id} className="transition-all hover:shadow-lg">
							 	<CardHeader>
							 		<CardTitle className="flex items-start gap-2">
							 			<LightbulbIcon className="h-5 w-5 text-primary mt-1" />
							 			<Link href={`/idea/${idea.id}`} className="hover:text-primary transition-colors">
							 				{idea.title}
							 			</Link>
							 		</CardTitle>
							 		<CardDescription className="flex items-center mt-2">
							 			<CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
							 			{format(parseISO(idea.created_at), 'PPP')}
							 		</CardDescription>
							 	</CardHeader>
							 	<CardContent>
							 		<p className="line-clamp-3 text-sm text-muted-foreground">
							 			{idea.description}
							 		</p>
							 		<div className="flex flex-wrap gap-2 mt-4">
							 			{idea.tags?.slice(0, 3).map((tag, i) => (
							 				<Badge key={i} variant="secondary" className="text-xs">
							 					{tag.name}
							 				</Badge>
							 			))}
							 			{idea.tags?.length > 3 && (
							 				<Badge variant="outline" className="text-xs">
							 					+{idea.tags.length - 3} more
							 				</Badge>
							 			)}
							 		</div>
								</CardContent>
							 	<CardFooter>
							 		<div className="flex justify-between items-center w-full">
							 			<div className="flex items-center text-sm text-muted-foreground">
							 				<UsersIcon className="h-3.5 w-3.5 mr-1.5" />
							 				{idea.applications_count || 0} applications
							 			</div>
							 			<Link href={`/idea/${idea.id}`}>
							 				<Button size="sm" variant="ghost">Learn more</Button>
							 			</Link>
							 		</div>
							 	</CardFooter>
							 </Card>

						))}
					</div> */}
				</div>
			</div>
		</AppLayout>
	);
}
