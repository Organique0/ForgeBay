import * as React from 'react';
import { cn } from '@/lib/utils';
import { InertiaLinkProps, Link } from '@inertiajs/react';

const Timeline = React.forwardRef<
	HTMLOListElement,
	React.HTMLAttributes<HTMLOListElement>
>(({ className, ...props }, ref) => (
	<ol
		ref={ref}
		className={cn(
			"relative border-s border-zinc-400 dark:border-gray-700",
			className
		)}
		{...props}
	/>
))
Timeline.displayName = "Timeline"

const TimelineItem = React.forwardRef<
	HTMLLIElement,
	React.HTMLAttributes<HTMLLIElement>
>(({ className, children, ...props }, ref) => (
	<li
		ref={ref}
		className={cn(
			"mb-10 ms-6",
			className
		)}
		{...props}
	>
		<div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
		{children}
	</li>
));
TimelineItem.displayName = "TimelineItem";

const TimelineIcon = React.forwardRef<
	HTMLSpanElement,
	React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
	<span
		ref={ref}
		className={cn(
			"absolute flex items-center justify-center w-8 h-8 bg-zinc rounded-full -start-4 dark:bg-blue-900",
			className
		)}
		{...props}
	/>
))
TimelineIcon.displayName = "TimelineIcon"

const TimelineTitle = React.forwardRef<
	HTMLHeadingElement,
	React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
	<h3
		ref={ref}
		className={cn(
			"flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white",
			className
		)}
		{...props}
	/>
))
TimelineTitle.displayName = "TimelineTitle"

const TimelineDescription = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			"block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500",
			className
		)}
		{...props}
	/>
))
TimelineDescription.displayName = "TimelineDescription"

const TimelineBody = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
	<p
		ref={ref}
		className={cn(
			"mb-4 text-base font-normal text-black dark:text-gray-300",
			className
		)}
		{...props}
	/>
))
TimelineBody.displayName = "TimelineBody"

const TimelineFooter = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			"",
			className
		)}
		{...props}
	/>
))
TimelineFooter.displayName = "TimelineFooter"

const TimelineLink = React.forwardRef<
	HTMLLinkElement,
	React.HTMLAttributes<HTMLLinkElement> & InertiaLinkProps
>(({ className, href, ...props }, ref) => (
	<Link
		href={href}
		ref={ref}
		className={cn(
			"inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-zinc border border-gray-200 rounded-lg hover:bg-indigo-200/80 hover:text-indigo-500 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700",
			className
		)}
		{...props}
	/>
))
TimelineLink.displayName = "TimelineLink"



export { Timeline, TimelineItem, TimelineIcon, TimelineTitle, TimelineDescription, TimelineBody, TimelineFooter, TimelineLink };
