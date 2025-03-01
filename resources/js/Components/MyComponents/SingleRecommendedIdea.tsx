import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/Shadcn/ui/card';
import { CalendarIcon, LightbulbIcon, TrendingUpIcon, UsersIcon } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Badge } from '../Shadcn/ui/badge';
import { Button } from '../Shadcn/ui/button';
import { format, parseISO } from 'date-fns';

const SingleRecommendedIdea = ({ hit, className }: { hit: any, className?: string }) => (
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

export default SingleRecommendedIdea;
