import { Badge } from '@/Components/Shadcn/ui/badge'
import { Button } from '@/Components/Shadcn/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/Shadcn/ui/card'
import { Input } from '@/Components/Shadcn/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/Shadcn/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/Components/Shadcn/ui/tabs'
import AppLayout from '@/Layouts/AppLayout'
import { Idea } from '@/types'
import { Link } from '@inertiajs/react'
import { Calendar, Check, Clock, Filter, Search, Tag, X } from 'lucide-react'
import React, { useState } from 'react'
import { route } from 'ziggy-js'

export default function Mine({ ideas }: { ideas: Idea[] }) {
	const [searchQuery, setSearchQuery] = useState("")
	const [filterTag, setFilterTag] = useState<string | null>(null)
	const [sortBy, setSortBy] = useState("newest")

	// Get all unique tags from ideas
	const allTags = Array.from(new Set(ideas.flatMap((idea) => idea.tags.map((tag) => tag.name))))

	// Filter ideas based on search query and tag filter
	const filteredIdeas = ideas.filter((idea) => {
		const matchesSearch =
			searchQuery === "" ||
			idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			idea.description.toLowerCase().includes(searchQuery.toLowerCase())

		const matchesTag = filterTag === null || idea.tags.some((tag) => tag.name === filterTag)

		return matchesSearch && matchesTag
	})

	// Sort ideas based on selected sort option
	const sortedIdeas = [...filteredIdeas].sort((a, b) => {
		switch (sortBy) {
			case "newest":
				return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
			case "oldest":
				return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
			case "title":
				return a.title.localeCompare(b.title)
			case "expiring":
				return new Date(a.expires).getTime() - new Date(b.expires).getTime()
			default:
				return 0
		}
	})

	// Format date to a more readable format
	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		})
	}

	return (
		<AppLayout title='My Ideas'>
			<div className="container mx-auto py-8 px-4">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">My Ideas</h1>
						<p className="text-muted-foreground mt-1">Browse and manage all your creative ideas</p>
					</div>
					<Link href='/create-idea'>
						<Button className="self-start md:self-auto">Create New Idea</Button>
					</Link>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-6">
					{/* Filters sidebar */}
					<div className="space-y-6">
						<div className="space-y-3">
							<div className="relative">
								<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									type="search"
									placeholder="Search ideas..."
									className="pl-8"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>
						</div>

						<div className="space-y-3">
							<h3 className="font-medium flex items-center gap-2">
								<Filter className="h-4 w-4" />
								Filters
							</h3>
							<div className="space-y-2">
								<Select onValueChange={(value) => setFilterTag(value === "all" ? null : value)}>
									<SelectTrigger>
										<SelectValue placeholder="Filter by tag" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Tags</SelectItem>
										{allTags.map((tag) => (
											<SelectItem key={tag} value={tag}>
												{tag}
											</SelectItem>
										))}
									</SelectContent>
								</Select>

								<Select defaultValue="newest" onValueChange={setSortBy}>
									<SelectTrigger>
										<SelectValue placeholder="Sort by" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="newest">Newest First</SelectItem>
										<SelectItem value="oldest">Oldest First</SelectItem>
										<SelectItem value="title">Title (A-Z)</SelectItem>
										<SelectItem value="expiring">Expiring Soon</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="space-y-3">
							<h3 className="font-medium">Status</h3>
							<Tabs defaultValue="all">
								<TabsList className="grid grid-cols-2">
									<TabsTrigger value="all">All</TabsTrigger>
									<TabsTrigger value="active">Active</TabsTrigger>
								</TabsList>
							</Tabs>
						</div>
					</div>

					{/* Ideas grid */}
					<div>
						{sortedIdeas.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{sortedIdeas.map((idea) => (
									<Card key={idea.id} className="h-full">
										<CardHeader>
											<div className="flex justify-between items-start">
												<CardTitle className="line-clamp-1">{idea.title}</CardTitle>
												{idea.active ? (
													<Badge
														variant="outline"
														className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
													>
														<Check className="h-3 w-3" /> Active
													</Badge>
												) : (
													<Badge
														variant="outline"
														className="bg-gray-50 text-gray-700 border-gray-200 flex items-center gap-1"
													>
														<X className="h-3 w-3" /> Inactive
													</Badge>
												)}
											</div>
											<CardDescription className="line-clamp-2">{idea.description}</CardDescription>
										</CardHeader>
										<CardContent>
											<div className="flex flex-wrap gap-2 mb-4">
												{idea.tags.map((tag) => (
													<Badge key={tag.id} variant="secondary" className="flex items-center gap-1">
														<Tag className="h-3 w-3" />
														{tag.name}
													</Badge>
												))}
												{idea.tags.length === 0 && <span className="text-sm text-muted-foreground">No tags</span>}
											</div>
											<div className="space-y-2 text-sm text-muted-foreground">
												<div className="flex items-center gap-2">
													<Calendar className="h-4 w-4" />
													Created: {formatDate(idea.created_at)}
												</div>
												<div className="flex items-center gap-2">
													<Clock className="h-4 w-4" />
													Expires: {formatDate(idea.expires)}
												</div>
											</div>
										</CardContent>
										<CardFooter>
											<Link href={route('tasks.index', { ideaId: idea.id })} className='w-full'>
												<Button variant="outline" className="w-full">
													Modify Idea
												</Button>
											</Link>
										</CardFooter>
									</Card>
								))}
							</div>
						) : (
							<div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/10">
								<div className="mb-4 rounded-full bg-muted p-3">
									<Search className="h-6 w-6 text-muted-foreground" />
								</div>
								<h3 className="text-lg font-semibold">No ideas found</h3>
								<p className="text-muted-foreground mt-2">
									{searchQuery || filterTag
										? "Try adjusting your search or filters to find what you're looking for."
										: "You haven't created any ideas yet. Click 'Create New Idea' to get started."}
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</AppLayout>
	)
}
