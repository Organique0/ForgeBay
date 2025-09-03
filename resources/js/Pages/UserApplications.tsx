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
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return 'border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20';
            case 'sent':
                return 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20';
            case 'declined':
            case 'rejected':
                return 'border-l-red-500 bg-red-50/50 dark:bg-red-950/20';
            default:
                return 'border-l-gray-300 bg-gray-50/50 dark:bg-gray-950/20';
        }
    };

    return (
        <Card className={`transition-all duration-300 hover:shadow-lg hover:shadow-black/5 border-l-4 ${getStatusColor(application.status)} group`}>
            <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-semibold mb-2 group-hover:text-primary/90 transition-colors">
                            {application.task.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 opacity-70" />
                            <span>Applied {formatDistanceToNow(new Date(application.created_at))} ago</span>
                        </CardDescription>
                    </div>
                    <div className="flex-shrink-0">
                        <StatusBadge status={application.status} />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pb-4">
                <div className="space-y-5">
                    <div className="bg-muted/30 rounded-lg p-4">
                        <h4 className="text-sm font-semibold mb-2 text-foreground/90">Your Application Note</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {application.description || "No description provided"}
                        </p>
                    </div>

                    <TaskDetails task={application.task} />
                </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 border-t pt-4 bg-muted/20">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 w-full">
                    <div className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                        ID: {application.id}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Link href={`/idea/${application.task.idea_id}`}>
                            <Button variant="outline" size="sm" className="w-full sm:w-auto hover:bg-primary/10">
                                View Project
                            </Button>
                        </Link>
                        <Link href={`/messages/${application.id}`}>
                            <Button variant="default" size="sm" className="w-full sm:w-auto">
                                View Messages
                            </Button>
                        </Link>
                    </div>
                </div>
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
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border rounded-lg overflow-hidden transition-all">
            <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-card/80 transition-colors bg-card border-b last:border-b-0">
                    <h4 className="text-sm font-semibold text-foreground/90">Task Details</h4>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{isOpen ? 'Hide' : 'Show'}</span>
                        {isOpen ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground transition-transform" />
                        ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
                        )}
                    </div>
                </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4 bg-muted/20">
                <div className="space-y-4 pt-2">
                    <div>
                        <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                            Task Description
                        </h5>
                        <p className="text-sm leading-relaxed bg-card/40 rounded-md p-3 border-l-2 border-l-primary/20">
                            {task.description}
                        </p>
                    </div>

                    <div>
                        <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                            Task Status
                        </h5>
                        <TaskStatusBadge status={task.status} />
                    </div>

                    {task.idea && (
                        <div className="pt-2 border-t border-border/50">
                            <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                                Related Project
                            </h5>
                            <div className="bg-card/40 rounded-md p-3 border-l-2 border-l-primary/20">
                                <p className="text-sm font-semibold text-foreground mb-1">{task.idea.title}</p>
                                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                                    {task.idea.description}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </CollapsibleContent>
        </Collapsible>
    )
}
