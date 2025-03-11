import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/Components/Shadcn/ui/form'
import useRoute from '@/Hooks/useRoute';
import AppLayout from '@/Layouts/AppLayout'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import React, { ChangeEvent, useState } from 'react'
import { Label } from '@/Components/Shadcn/ui/label';
import { Input } from '@/Components/Shadcn/ui/input';
import InputError from '@/Components/InputError';
import { Textarea } from '@/Components/Shadcn/ui/textarea';
import UpdateApplicationDataForm, { CleanTag } from '../Profile/Partials/UpdateApplicationDataForm';
import useTypedPage from '@/Hooks/useTypedPage';
import Tag from '@/Components/MyComponents/Tag';
import { Badge } from '@/Components/Shadcn/ui/badge';
import { Button } from '@/Components/Shadcn/ui/button';
import { z } from "zod"
import axios from 'axios';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/Shadcn/ui/card';
import { Calendar, PlusCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/Shadcn/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/Shadcn/ui/popover';
import { Calendar as CalendarComponent } from "@/Components/Shadcn/ui/calendar";
import { format } from 'date-fns';


export default function Create({ allTags }: { allTags: CleanTag[] }) {
	const route = useRoute()

	const [availableTags, setAvailableTags] = useState<CleanTag[]>(allTags)
	const [selectedTags, setSelectedTags] = useState<CleanTag[]>([])
	const [query, setQuery] = useState("")

	const formSchema = z.object({
		title: z
			.string()
			.min(2, {
				message: "Title must be at least 2 characters.",
			})
			.max(50, {
				message: "Title cannot exceed 50 characters.",
			}),
		description: z.string().min(10, {
			message: "Description must be at least 10 characters.",
		}),
		tags: z.any(),
		expirationDate: z.date(),
	})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
			tags: selectedTags,
			expirationDate: new Date(new Date().setMonth(new Date().getMonth() + 3))

		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		// Extract tag IDs from selected tags
		//const tagIds = selectedTags.map((tag) => tag.id)
		const payload = {
			...values,
			expirationDate: format(values.expirationDate, 'yyyy-MM-dd HH:mm:ss'),
		};
		axios
			.post("/ideas/new", payload)
			.then((response) => {
				// Handle successful submission
				if (response.data.redirect) {
					window.location.href = response.data.redirect;
				} else {
					// Redirect to the ideas list or show success message
					window.location.href = route('ideas.index');
				}
			})
			.catch((error) => {
				// Handle validation errors
				if (error.response && error.response.data.errors) {
					// Set errors in the form
					const serverErrors = error.response.data.errors
					Object.keys(serverErrors).forEach((key) => {
						form.setError(key as any, {
							type: "server",
							message: serverErrors[key][0],
						})
					})
				}
			})
	}

	function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
		const search = event.target.value.toLocaleLowerCase()
		setQuery(search)

		const filteredItems = allTags.filter(
			(tag) => tag.name.toLocaleLowerCase().includes(search) && !selectedTags.some((t) => t.id === tag.id),
		)

		setAvailableTags(filteredItems)
	}

	const handleTagClick = (tag: CleanTag) => {
		if (selectedTags.some((t) => t.id === tag.id)) {
			setSelectedTags((prev) => prev.filter((t) => t.id !== tag.id))
			setAvailableTags((prev) => [...prev, tag].sort((a, b) => a.name.localeCompare(b.name)))
		} else {
			setSelectedTags((prev) => [...prev, tag].sort((a, b) => a.name.localeCompare(b.name)))
			setAvailableTags((prev) => prev.filter((t) => t.id !== tag.id))
		}
	}

	return (
		<AppLayout title="Create New Idea">
			<div className="container max-w-3xl py-10 mx-auto">
				<Card className="shadow-md">
					<CardHeader className="space-y-1">
						<CardTitle className="text-2xl font-bold">Create a New Idea</CardTitle>
						<CardDescription>Share your innovative idea with the community</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
								<FormField
									control={form.control}
									name="title"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-base">Title</FormLabel>
											<FormControl>
												<Input placeholder="Enter a catchy title for your idea" className="h-10" {...field} />
											</FormControl>
											<FormDescription>
												A clear, concise title helps others understand your idea quickly
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-base">Description</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Describe your idea in detail..."
													className="min-h-32 resize-y"
													{...field}
												/>
											</FormControl>
											<FormDescription>
												Provide enough details so others can understand and contribute to your idea
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="tags"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-base">Tags</FormLabel>
											<FormControl>
												<div className="space-y-4">
													<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
														<Input
															value={query}
															onChange={handleInputChange}
															className="max-w-xs"
															placeholder="Search for tags..."
														/>
														<p className="text-sm text-muted-foreground">{selectedTags.length} tags selected</p>
													</div>

													{selectedTags.length > 0 && (
														<div className="bg-muted/50 p-3 rounded-md">
															<h4 className="text-sm font-medium mb-2">Selected Tags</h4>
															<div className="flex flex-wrap gap-2">
																{selectedTags.map((tag) => (
																	<Tag
																		key={tag.id}
																		value={tag.name}
																		isSelected={true}
																		onClick={() => handleTagClick(tag)}
																	/>
																))}
															</div>
														</div>
													)}

													{availableTags.length > 0 && (
														<div className="bg-background border rounded-md p-3">
															<h4 className="text-sm font-medium mb-2">Available Tags</h4>
															<div className="flex flex-wrap gap-2">
																{availableTags.map((tag) => (
																	<Tag
																		key={tag.id}
																		value={tag.name}
																		isSelected={false}
																		onClick={() => handleTagClick(tag)}
																	/>
																))}
															</div>
														</div>
													)}
												</div>
											</FormControl>
											<FormDescription>Tags help categorize your idea and make it discoverable</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className="grid gap-6 sm:grid-cols-2">
									<FormField
										control={form.control}
										name="expirationDate"
										render={({ field }) => (
											<FormItem className="flex flex-col">
												<FormLabel className="text-base">Expiration Date</FormLabel>
												<Popover>
													<PopoverTrigger asChild>
														<FormControl>
															<Button
																variant={"outline"}
																className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
															>
																{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
																<Calendar className="ml-auto h-4 w-4 opacity-50" />
															</Button>
														</FormControl>
													</PopoverTrigger>
													<PopoverContent className="w-auto p-0" align="start">
														<CalendarComponent
															mode="single"
															selected={field.value || undefined}
															onSelect={(date) => field.onChange(date)}
															disabled={(date) => date < new Date() || date > new Date("2100-01-01")}
															initialFocus
														/>
													</PopoverContent>
												</Popover>
												<FormDescription>Set an expiration date for your idea</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</form>
						</Form>
					</CardContent>
					<CardFooter className="flex justify-between border-t p-6">
						<Button variant="outline" type="button" onClick={() => window.history.back()}>
							Cancel
						</Button>
						<Button type="submit" onClick={form.handleSubmit(onSubmit)} className="gap-2">
							<PlusCircle className="h-4 w-4" />
							Create Idea
						</Button>
					</CardFooter>
				</Card>
			</div>
		</AppLayout>
	)
}
