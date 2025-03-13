import { Avatar, AvatarFallback, AvatarImage } from '@/Components/Shadcn/ui/avatar';
import { Badge } from '@/Components/Shadcn/ui/badge';
import { Button } from '@/Components/Shadcn/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/Shadcn/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/Components/Shadcn/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/Shadcn/ui/select';
import AppLayout from '@/Layouts/AppLayout';
import { RegularPaginationInstance, Team } from '@/types';
import { MessageSquare, UserPlus } from 'lucide-react';
import React, { useState } from 'react'
import { Link, router, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';


type DateTime = string

export default function ReceivedApplications({ applications, team }: { applications: RegularPaginationInstance, team: Team }) {
	const addTeamMemberForm = useForm({
		email: '',
		role: 'editor',
	});
	const pathSegments = window.location.pathname.split('/');
	const ideaId = pathSegments[2];

	function handleAddToTeam(email: string) {
		addTeamMemberForm.setData({ email, role: 'editor' });
		addTeamMember();
	}

	function addTeamMember() {
		addTeamMemberForm.post(route('team-members.store', [team]), {
			errorBag: 'addTeamMember',
			preserveScroll: true,
			onSuccess: () => addTeamMemberForm.reset('email'),
		});
	}

	const formatDate = (dateString: DateTime) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		})
	}

	const getStatusColor = (status: "sent" | "approved" | "declined") => {
		switch (status) {
			case "sent":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
			case "approved":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
			case "declined":
				return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
		}
	}

	return (
		<AppLayout title='received-applications'>
		<div className="container mx-auto py-8">
			<h1 className="text-3xl font-bold mb-6">Received Applications</h1>

			<div className='mb-6 flex gap-6 items-center'>
				<p>Status:</p>
				<Select defaultValue="sent" onValueChange={(value) => {
						router.get(`/ideas/${ideaId}/received-applications`, { status: value }, {
							preserveState: true,
							preserveScroll: true,
						});
					}}>
						<SelectTrigger className="w-[200px]">
							<SelectValue placeholder="Application Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="sent">Sent</SelectItem>
							<SelectItem value="approved">Approved</SelectItem>
							<SelectItem value="declined">Declined</SelectItem>
						</SelectContent>
					</Select>

			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{applications.data.map((application) => (
					<Card key={application.id} className="h-full flex flex-col">
						<CardHeader>
							<div className="flex justify-between items-start">
								<div>
									<CardTitle className="text-xl">{application.task.name}</CardTitle>
									<CardDescription className="mt-1">Task ID: {application.task_id}</CardDescription>
								</div>
								<Badge className={getStatusColor(application.status)}>
									{application.status.charAt(0).toUpperCase() + application.status.slice(1)}
								</Badge>
							</div>
						</CardHeader>

						<CardContent className="flex-grow">
							<div className="space-y-4">
								<div>
									<h3 className="text-sm font-medium text-muted-foreground">Application</h3>
									<p className="mt-1">{application.description}</p>
									<div className="flex justify-between mt-2 text-xs text-muted-foreground">
										<span>Created: {formatDate(application.created_at)}</span>
										<span>Updated: {formatDate(application.updated_at)}</span>
									</div>
								</div>

								<div className="pt-2 border-t">
									<h3 className="text-sm font-medium text-muted-foreground">Idea</h3>
									<p className="mt-1">{application.task.idea.title}</p>
									<div className="flex justify-between mt-2 text-xs text-muted-foreground">
										<span>Active: {application.task.idea.active ? "Yes" : "No"}</span>
										<span>Expires: {formatDate(application.task.idea.expires)}</span>
									</div>
								</div>

								<div className="pt-2 border-t">
									<h3 className="text-sm font-medium text-muted-foreground">Applicant</h3>
									<div className="flex items-center mt-2">
										<Avatar className="h-10 w-10">
											<AvatarImage src={application.task.idea.user.profile_photo_url} alt={application.task.idea.user.name} />
											<AvatarFallback>{application.task.idea.user.name.charAt(0)}</AvatarFallback>
										</Avatar>
										<div className="ml-3">
											<p className="text-sm font-medium">{application.task.idea.user.name}</p>
											<p className="text-xs text-muted-foreground">{application.task.idea.user.email}</p>
										</div>
									</div>
									{application.include_profile && (
										<div className="mt-2">
											<p className="text-sm">{application.task.idea.user.bio}</p>
										</div>
									)}
								</div>
							</div>
						</CardContent>

						<CardFooter className="border-t pt-4">
							<div className="flex space-x-2 w-full">
								<Link href={`/messages/${application.task.idea.user.id}`} className="flex-1">
										<Button variant="outline" className='w-full'  size="sm">
											<MessageSquare className="h-4 w-4 mr-2" />
											Message
										</Button>
								</Link>
								<Button className="flex-1" size="sm" onClick={()=>handleAddToTeam(application.task.idea.user.email)}>
									<UserPlus className="h-4 w-4 mr-2" />
									Send team invitation
								</Button>
								</div>
						</CardFooter>
					</Card>
				))}
			</div>
				<Pagination className='mt-6'>
					<PaginationContent>
						<PaginationItem>
							<PaginationLink href={applications.first_page_url}>First</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationPrevious href={applications.prev_page_url} />
						</PaginationItem>
						{applications.current_page > 1 && (
							<PaginationItem>
								<PaginationLink href={`?page=${applications.current_page - 1}`}>
									{applications.current_page - 1}
								</PaginationLink>
							</PaginationItem>
						)}
						<PaginationItem>
							<PaginationLink href={`?page=${applications.current_page}`} isActive>
								{applications.current_page}
							</PaginationLink>
						</PaginationItem>
						{applications.current_page < applications.last_page && (
							<PaginationItem>
								<PaginationLink href={`?page=${applications.current_page + 1}`}>
									{applications.current_page + 1}
								</PaginationLink>
							</PaginationItem>
						)}
						<PaginationItem>
							<PaginationNext href={applications.next_page_url} />
						</PaginationItem>
						<PaginationItem>
							<PaginationLink href={applications.last_page_url}>Last</PaginationLink>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
		</div>
		</AppLayout>
	)
}
