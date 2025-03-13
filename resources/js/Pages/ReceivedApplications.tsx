import { Avatar, AvatarFallback, AvatarImage } from '@/Components/Shadcn/ui/avatar';
import { Badge } from '@/Components/Shadcn/ui/badge';
import { Button } from '@/Components/Shadcn/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/Shadcn/ui/card';
import { Application, ReceivedApplicationsType } from '@/types';
import { MessageSquare, UserPlus } from 'lucide-react';
import React from 'react'
type DateTime = string
export default function ReceivedApplications({applications}: {applications: ReceivedApplicationsType}) {
	console.log(applications);

	// Format date to be more readable
	const formatDate = (dateString: DateTime) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		})
	}

	// Get status badge color based on application status
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
		<div className="container mx-auto py-8">
			<h1 className="text-3xl font-bold mb-6">Received Applications</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{applications.map((application) => (
					<Card key={application.id} className="h-full flex flex-col">
						<CardHeader>
							<div className="flex justify-between items-start">
								<div>
									<CardTitle className="text-xl">{application.task.idea.title}</CardTitle>
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
									<h3 className="text-sm font-medium text-muted-foreground">Idea Details</h3>
									<p className="mt-1">{application.task.idea.description}</p>
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
								<Button variant="outline" className="flex-1" size="sm">
									<MessageSquare className="h-4 w-4 mr-2" />
									Message
								</Button>
								<Button className="flex-1" size="sm">
									<UserPlus className="h-4 w-4 mr-2" />
									Add to Team
								</Button>
							</div>
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	)
}
