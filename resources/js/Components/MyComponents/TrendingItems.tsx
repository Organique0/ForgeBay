import React from 'react';
import Autoplay from "embla-carousel-autoplay"
import { Badge } from '@/Components/Shadcn/ui/badge';
import { Link } from '@inertiajs/react';
import { Button } from '@/Components/Shadcn/ui/button';
import { CalendarIcon, ChartBarIcon, ChevronRightIcon, LightbulbIcon, TrendingUpIcon, UsersIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Idea } from '@/types';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../Shadcn/ui/carousel';
import SingleIdea from './SingleIdea';


type TrendingItemsProps = {
	title?: string;
	description?: string;
	className?: string;
	ideas: Idea[];
	orientation: "vertical" | "horizontal";
	itemClassName?: string;
};

export default function TrendingItems({
	title = "Trending Now",
	description = "Discover what's popular in the community",
	className = "",
	ideas,
	orientation,
	itemClassName
}: TrendingItemsProps) {
	return (
		<div className={className}>
			<div className="flex justify-between items-center mb-10">
				<div>
					<h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
						<TrendingUpIcon className="h-6 w-6 text-primary" />
						{title}
					</h2>
					<p className="mt-2 text-muted-foreground">
						{description}
					</p>
				</div>
				<Link href="/idea">
					<Button variant="outline">
						View All <ChevronRightIcon className="ml-1 h-4 w-4" />
					</Button>
				</Link>
			</div>
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
				{ideas.map((idea) => (
					<SingleIdea hit={idea} itemClassName={itemClassName} />
				))}
			</div>
			{
				//Carousel is kinda problematic since all items don't have the same height
			}
			{/* <Carousel
				opts={{
					align: "start",
					loop: true
				}}
				orientation={orientation}
			>
				<CarouselContent
					className="mt-1"
				>
					{ideas.map((idea) => (
						<CarouselItem key={idea.id} className={itemClassName}>
							<SingleIdea hit={idea} />
							<SingleIdea hit={idea} />
						</CarouselItem>
					))}
				</CarouselContent>

				<CarouselPrevious />
				<CarouselNext />
			</Carousel> */}
		</div>
	);
}
