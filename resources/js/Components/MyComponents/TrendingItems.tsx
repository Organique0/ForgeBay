import React from 'react';
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/Shadcn/ui/card';
import { Badge } from '@/Components/Shadcn/ui/badge';
import { Link } from '@inertiajs/react';
import { Button } from '@/Components/Shadcn/ui/button';
import { CalendarIcon, ChartBarIcon, ChevronRightIcon, LightbulbIcon, TrendingUpIcon, UsersIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Idea } from '@/types';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../Shadcn/ui/carousel';


const Item = ({ hit, className }: { hit: any, className?: string }) => (
	<Card className={"transition-all hover:shadow-lg h-1/2 " + className}>
		<CardHeader>
			<CardTitle className="flex items-start gap-2">
				<LightbulbIcon className="h-5 w-5 text-primary mt-1" />
				<Link href={`/idea/${hit.id}`} className="hover:text-primary transition-colors">
					{hit.title}
				</Link>
				<Badge className="ml-auto" variant="outline">
					<TrendingUpIcon className="h-3 w-3 mr-1" />
					{hit.trend_score}
				</Badge>
			</CardTitle>
			<CardDescription className="flex items-center mt-2">
				<CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
				{format(parseISO(hit.created_at), 'PPP')}
			</CardDescription>
		</CardHeader>
		<CardContent>
			<p className="line-clamp-3 text-sm text-muted-foreground">
				{hit.description}
			</p>
			<div className="flex flex-wrap gap-2 mt-4">
				{hit.tags?.slice(0, 3).map((tag, i) => (
					<Badge key={i} variant="secondary" className="text-xs">
						{tag.name}
					</Badge>
				))}
				{hit.tags?.length > 3 && (
					<Badge variant="outline" className="text-xs">
						+{hit.tags.length - 3} more
					</Badge>
				)}
			</div>
		</CardContent>
		<CardFooter>
			<div className="flex justify-between items-center w-full">
				<div className="flex items-center text-sm text-muted-foreground">
					<UsersIcon className="h-3.5 w-3.5 mr-1.5" />
					{hit.applications_count || 0} applications
				</div>
				<Link href={`/idea/${hit.id}`}>
					<Button size="sm" variant="ghost">Learn more</Button>
				</Link>
			</div>
		</CardFooter>
	</Card>
);

type TrendingItemsProps = {
	title?: string;
	description?: string;
	count?: number;
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
			<Carousel
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
							<Item hit={idea} className="mb-4" />
							<Item hit={idea} />
						</CarouselItem>
					))}
				</CarouselContent>

				<CarouselPrevious />
				<CarouselNext />
			</Carousel>
		</div>
	);
}
