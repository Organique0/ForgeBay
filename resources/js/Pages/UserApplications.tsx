import { Badge } from '@/Components/Shadcn/ui/badge';
import { Button } from '@/Components/Shadcn/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/Shadcn/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/Components/Shadcn/ui/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/Components/Shadcn/ui/dropdown-menu';
import AppLayout from '@/Layouts/AppLayout';
import { Application, Idea, Task } from '@/types';
import { Link } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { ChevronDown, ChevronUp, Clock, Filter } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

export type UserApplication = Application & {
	task: TaskWithIdea;
};

export type UserApplications = UserApplication[];


export default function UserApplications({ applications }: { applications: UserApplications }) {
	const highlight = useRef(window.location.search.split('=')[1]);

	const [filter, setFilter] = useState<"all" | "sent" | "approved" | "declined">("all");
	const highlightedCardRef = useRef<HTMLDivElement | null>(null);

	const filteredApplications = applications.filter((app) => filter === "all" || app.status.toLowerCase() === filter)

	useEffect(() => {
		if (highlight && highlightedCardRef.current) {
			highlightedCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}, [highlight, filteredApplications]);
	return (
		<AppLayout title='My Applications'>
			<div className="container mx-auto py-8 px-4">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
						<p className="text-muted-foreground mt-1">View and manage all your submitted applications</p>
					</div>
					<FilterDropdown currentFilter={filter} setFilter={setFilter} />
				</div>

				<div className="grid gap-6">
					{filteredApplications.length > 0 ? (
						filteredApplications.map((application) => (
							<div
								ref={application.id.toString() === highlight.current ? highlightedCardRef : null}
								key={application.id}
								className={application.id.toString() === highlight.current ? "ring-2 ring-purple-700 rounded-lg" : ""}
							>
								<ApplicationCard application={application} />
							</div>
						))
					) : (
						<div className="text-center py-12">
							<h3 className="text-lg font-medium">No applications found</h3>
							<p className="text-muted-foreground mt-1">
								{filter === "all" ? "You haven't submitted any applications yet." : `No ${filter} applications found.`}
							</p>
						</div>
					)}
				</div>
			</div>
		</AppLayout>
	)
}

function FilterDropdown({ currentFilter, setFilter }: { currentFilter: string; setFilter: (filter: "all" | "sent" | "approved" | "declined") => void }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="flex items-center gap-2">
					<Filter className="h-4 w-4" />
					Filter: {currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setFilter("all")}>All</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setFilter("sent")}>Sent</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setFilter("approved")}>Approved</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setFilter("declined")}>Declined</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

function ApplicationCard({ application }: { application: UserApplication }) {
	return (
		<Card>
			<CardHeader>
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
					<div>
						<CardTitle>{application.task.name}</CardTitle>
						<CardDescription className="flex items-center gap-1 mt-1">
							<Clock className="h-3 w-3" />
							Applied {formatDistanceToNow(new Date(application.created_at))} ago
						</CardDescription>
					</div>
					<StatusBadge status={application.status} />
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div>
						<h4 className="text-sm font-medium mb-1">Your Application Note</h4>
						<p className="text-sm text-muted-foreground">{application.description || "No description provided"}</p>
					</div>

					<TaskDetails task={application.task} />
				</div>
			</CardContent>
			<CardFooter className="flex justify-between border-t pt-4">
				<div className="text-xs text-muted-foreground">Application ID: {application.id}</div>
				<Link href={`/idea/${application.task.idea_id}`}>
					<Button variant="outline" size="sm">
						View details
					</Button>
				</Link>
			</CardFooter>
			<CardFooter className="flex justify-between border-t pt-4">
				<div/>
				<Link href={`/messages/${application.id}`}>
					<Button variant="outline" size="sm">
						Application Messages
					</Button>
				</Link>
			</CardFooter>
		</Card>
	)
}

interface Badge {
	label: string;
	variant?: "default" | "success" | "warning" | "secondary" | "outline" | "error" | "info" | null | undefined
}

function StatusBadge({ status }: { status: string }) {

	const getStatusConfig = (status: string): Badge => {
		switch (status.toLowerCase()) {
			case "sent":
				return { label: "Sent", variant: "default" }
			case "accepted":
				return { label: "Accepted", variant: "success" }
			case "rejected":
				return { label: "Rejected", variant: "error" }
			default:
				return { label: status, variant: "secondary" }
		}
	}

	const config = getStatusConfig(status);

	return (
		<Badge variant={config.variant} className="capitalize">
			{config.label}
		</Badge>
	)
}

function TaskStatusBadge({ status }: { status: string }) {
	type StatusValue = "success" | "error" | "warning" | "info";
	let value: StatusValue;

	switch (status) {
		case 'to_do':
			status = 'To Do';
			value = 'error';
			break;
		case 'in_progress':
			status = 'In Progress';
			value = 'warning';
			break;
		case 'done':
			status = 'Done';
			value = 'success';
			break;
		default:
			status = 'No Tasks';
			value = 'info';
	}

	return (
		<Badge variant={value}>
			{status}
		</Badge>
	);
}


export type TaskWithIdea = Task & {
	idea?: Idea;
}

function TaskDetails({ task }: { task: TaskWithIdea }) {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen} className="border rounded-md">
			<CollapsibleTrigger asChild>
				<div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50">
					<h4 className="text-sm font-medium">Task Details</h4>
					{isOpen ? (
						<ChevronUp className="h-4 w-4 " />
					) : (
						<ChevronDown className="h-4 w-4 " />
					)}
				</div>
			</CollapsibleTrigger>
			<CollapsibleContent className="px-4 pb-4">
				<div className="space-y-3">
					<div>
						<h5 className="text-xs font-medium  mb-1">Task Description</h5>
						<p className="text-sm">{task.description}</p>
					</div>

					<div>
						<h5 className="text-xs font-medium  mb-1">Task Status</h5>
						<TaskStatusBadge status={task.status} />

					</div>

					{task.idea && (
						<div>
							<h5 className="text-xs font-medium  mb-1">Related Idea</h5>
							<p className="text-sm font-medium">{task.idea.title}</p>
							<p className="text-xs  mt-1 line-clamp-3">{task.idea.description}</p>
						</div>
					)}
				</div>
			</CollapsibleContent>
		</Collapsible>
	)
}
