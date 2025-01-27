import * as React from 'react';
import { cn } from '@/lib/utils';

const Timeline = React.forwardRef<
	HTMLOListElement,
	React.HTMLAttributes<HTMLOListElement>
>(({ className, ...props }, ref) => (
	<ol
		ref={ref}
		className={cn(
			"rounded-lg border bg-card text-card-foreground shadow-xs",
			className
		)}
		{...props}
	/>
))
Timeline.displayName = "Timeline"

const TimelineItem = React.forwardRef<
	HTMLLIElement,
	React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
	<li
		ref={ref}
		className={cn(
			"rounded-lg border bg-card text-card-foreground shadow-xs",
			className
		)}
		{...props}
	/>
))
TimelineItem.displayName = "TimelineItem"

const TimelineIcon = React.forwardRef<
	HTMLSpanElement,
	React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
	<span
		ref={ref}
		className={cn(
			"rounded-lg border bg-card text-card-foreground shadow-xs",
			className
		)}
		{...props}
	/>
))
TimelineIcon.displayName = "TimelineIcon"

const TimelineIcon = React.forwardRef<
	HTMLSpanElement,
	React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
	<span
		ref={ref}
		className={cn(
			"rounded-lg border bg-card text-card-foreground shadow-xs",
			className
		)}
		{...props}
	/>
))
TimelineIcon.displayName = "TimelineIcon"
