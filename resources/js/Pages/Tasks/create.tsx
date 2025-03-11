import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/Components/Shadcn/ui/form'
import useRoute from '@/Hooks/useRoute';
import AppLayout from '@/Layouts/AppLayout';
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
import { AlertCircle, Calendar, CheckCircle2, ClipboardList, Euro, ListTodo, PlusCircle, Save, Trash2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/Components/Shadcn/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/Shadcn/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/Shadcn/ui/popover';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/Shadcn/ui/table';
import { Idea, Task } from '@/types';
import { Calendar as CalendarComponent } from "@/Components/Shadcn/ui/calendar";


export default function EditIdeaAndTasks({
	initialIdea,
	existingTasks = [],
}: { initialIdea: Idea; existingTasks?: Task[] }) {
	console.log(initialIdea);
	const route = useRoute()
	const [idea, setIdea] = useState<Idea>(initialIdea)
	const [tasks, setTasks] = useState<Task[]>(existingTasks)
	const [successMessage, setSuccessMessage] = useState<string | null>(null)
	const [availableTags, setAvailableTags] = useState<CleanTag[]>(initialIdea.tags)
	const [selectedTags, setSelectedTags] = useState<CleanTag[]>([])
	const [query, setQuery] = useState("")

	// Idea Edit Form
	const ideaFormSchema = z.object({
		title: z
			.string()
			.min(2, {
				message: "Title must be at least 2 characters.",
			})
			.max(100, {
				message: "Title cannot exceed 100 characters.",
			}),
		description: z.string().min(10, {
			message: "Description must be at least 10 characters.",
		}),
		tags: z.any(),
		status: z.boolean(),
		expirationDate: z.date(),
	})

	const ideaForm = useForm<z.infer<typeof ideaFormSchema>>({
		resolver: zodResolver(ideaFormSchema),
		defaultValues: {
			title: idea.title,
			description: idea.description,
			status: idea.active,
			expirationDate: new Date(idea.expires),
			tags: selectedTags,
		},
	})

	function onIdeaSubmit(values: z.infer<typeof ideaFormSchema>) {
		const payload = {
			...values,
			expirationDate: format(values.expirationDate, 'yyyy-MM-dd HH:mm:ss'),
		};
		axios
			.put(`/ideas/${idea.id}`, payload)
			.then((response) => {
				setIdea(response.data.idea)
				setSuccessMessage("Idea updated successfully!")
				setTimeout(() => setSuccessMessage(null), 3000)
			})
			.catch((error) => {
				if (error.response && error.response.data.errors) {
					const serverErrors = error.response.data.errors
					Object.keys(serverErrors).forEach((key) => {
						ideaForm.setError(key as any, {
							type: "server",
							message: serverErrors[key][0],
						})
					})
				}
			})
	}

	// Task Form
	const taskFormSchema = z.object({
		name: z
			.string()
			.min(2, {
				message: "Task name must be at least 2 characters.",
			})
			.max(100, {
				message: "Task name cannot exceed 100 characters.",
			}),
		description: z.string().optional(),
		value: z.coerce
			.number({
				required_error: "Value is required",
				invalid_type_error: "Value must be a number",
			})
			.min(0, {
				message: "Value cannot be negative.",
			})
			.refine((val) => !isNaN(val), {
				message: "Value must be a valid number.",
			}),
	})

	const taskForm = useForm<z.infer<typeof taskFormSchema>>({
		resolver: zodResolver(taskFormSchema),
		defaultValues: {
			name: "",
			description: "",
			value: 0,
		},
	})

	function onTaskSubmit(values: z.infer<typeof taskFormSchema>) {
		axios
			.post(`/ideas/${idea.id}/tasks`, values)
			.then((response) => {
				const newTask = response.data.task || {
					id: Date.now(),
					...values,
				}
				setTasks((prev) => [...prev, newTask])
				setSuccessMessage("Task added successfully!")
				taskForm.reset({
					name: "",
					description: "",
					value: 0,
				})
				setTimeout(() => setSuccessMessage(null), 3000)
			})
			.catch((error) => {
				if (error.response && error.response.data.errors) {
					const serverErrors = error.response.data.errors
					Object.keys(serverErrors).forEach((key) => {
						taskForm.setError(key as any, {
							type: "server",
							message: serverErrors[key][0],
						})
					})
				}
			})
	}

	const deleteTask = (taskId: number | undefined) => {
		if (!taskId) return

		axios
			.delete(`/ideas/${idea.id}/tasks/${taskId}`)
			.then(() => {
				setTasks((prev) => prev.filter((task) => task.id !== taskId))
				setSuccessMessage("Task deleted successfully!")
				setTimeout(() => setSuccessMessage(null), 3000)
			})
			.catch((error) => {
				console.error("Error deleting task:", error)
			})
	}

	const totalValue = tasks.reduce((sum, task) => sum + task.value, 0)

	return (
		<AppLayout title={`Edit Idea: ${idea.title}`}>
			<div className="container max-w-4xl py-10 m-auto">
				{successMessage && (
					<Alert className="mb-6 bg-green-50 border-green-200">
						<CheckCircle2 className="h-4 w-4 text-green-600" />
						<AlertTitle className="text-green-800">Success</AlertTitle>
						<AlertDescription className="text-green-700">{successMessage}</AlertDescription>
					</Alert>
				)}

				{/* Idea Edit Card */}
				<Card className="shadow-md mb-8">
					<CardHeader className="space-y-1 bg-muted/30">
						<CardTitle className="text-2xl font-bold">
							<span className="flex items-center gap-2">
								<ClipboardList className="h-5 w-5" />
								Edit Idea
							</span>
						</CardTitle>
						<CardDescription>Update your idea's details</CardDescription>
					</CardHeader>

					<CardContent className="pt-6">
						<Form {...ideaForm}>
							<form onSubmit={ideaForm.handleSubmit(onIdeaSubmit)} className="space-y-6">
								<FormField
									control={ideaForm.control}
									name="title"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-base">Title</FormLabel>
											<FormControl>
												<Input placeholder="Enter idea title" className="h-10" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={ideaForm.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-base">Description</FormLabel>
											<FormControl>
												<Textarea placeholder="Describe your idea" className="min-h-24 resize-y" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="grid gap-6 sm:grid-cols-2">
									<FormField
										control={ideaForm.control}
										name="status"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-base">Status</FormLabel>
												<Select
													onValueChange={(value) => field.onChange(value === 'true')}
													defaultValue={field.value.toString()}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select a status" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="false">Disabled</SelectItem>
														<SelectItem value="true">Active</SelectItem>
													</SelectContent>
												</Select>
												<FormDescription>
													Disabled ideas won't be visible to other users
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={ideaForm.control}
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

								<div className="flex justify-end">
									<Button type="submit" className="gap-2">
										<Save className="h-4 w-4" />
										Update Idea
									</Button>
								</div>
							</form>
						</Form>
					</CardContent>
				</Card>

				{/* Task Creation Card */}
				<Card className="shadow-md mb-8">
					<CardHeader className="space-y-1 bg-muted/30">
						<div className="flex items-center justify-between">
							<CardTitle className="text-2xl font-bold">
								<span className="flex items-center gap-2">
									<ListTodo className="h-5 w-5" />
									Tasks
								</span>
							</CardTitle>
							<div className="flex items-center gap-2 text-muted-foreground">
								<Euro className="h-4 w-4" />
								<span className="font-medium">Total Value: €{totalValue.toFixed(2)}</span>
							</div>
						</div>
						<CardDescription>Add and manage tasks for this idea</CardDescription>
					</CardHeader>

					<CardContent className="pt-6">
						<Form {...taskForm}>
							<form onSubmit={taskForm.handleSubmit(onTaskSubmit)} className="space-y-6">
								<div className="grid gap-6 sm:grid-cols-2">
									<FormField
										control={taskForm.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-base">Task Name</FormLabel>
												<FormControl>
													<Input placeholder="What needs to be done?" className="h-10" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={taskForm.control}
										name="value"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-base">Value (€)</FormLabel>
												<FormControl>
													<div className="relative">
														<Euro className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
														<Input
															type="number"
															step="0.01"
															min="0"
															placeholder="0.00"
															className="h-10 pl-10"
															{...field}
															onChange={(e) => {
																const value = e.target.value === "" ? "0" : e.target.value
																field.onChange(Number.parseFloat(value))
															}}
														/>
													</div>
												</FormControl>
												<FormDescription>Estimated value of this task in euros</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<FormField
									control={taskForm.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-base">Description</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Add details about this task..."
													className="min-h-24 resize-y"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="flex justify-end">
									<Button type="submit" className="gap-2">
										<PlusCircle className="h-4 w-4" />
										Add Task
									</Button>
								</div>
							</form>
						</Form>
					</CardContent>
				</Card>

				{/* Task List Card */}
				{tasks.length > 0 ? (
					<Card>
						<CardHeader>
							<CardTitle>Task List</CardTitle>
							<CardDescription>
								{tasks.length} task{tasks.length !== 1 ? "s" : ""} for this idea
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Task</TableHead>
										<TableHead>Description</TableHead>
										<TableHead className="text-right">Value (€)</TableHead>
										<TableHead className="w-[80px]"></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{tasks.map((task) => (
										<TableRow key={task.id}>
											<TableCell className="font-medium">{task.name}</TableCell>
											<TableCell className="max-w-xs truncate">
												{task.description || <span className="text-muted-foreground italic">No description</span>}
											</TableCell>
											<TableCell className="text-right">€{task.value.toFixed(2)}</TableCell>
											<TableCell>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
													onClick={() => deleteTask(task.id)}
												>
													<Trash2 className="h-4 w-4" />
													<span className="sr-only">Delete</span>
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
						<CardFooter className="flex justify-between border-t p-6">
							<div className="text-sm text-muted-foreground">
								Total Value: <span className="font-medium">€{totalValue.toFixed(2)}</span>
							</div>
							<Button
								variant="outline"
								type="button"
								onClick={() => (window.location.href = route("ideas.show", { id: idea.id }))}
							>
								Done
							</Button>
						</CardFooter>
					</Card>
				) : (
					<Alert variant="default" className="bg-muted/50">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>No tasks yet</AlertTitle>
						<AlertDescription>Add your first task using the form above.</AlertDescription>
					</Alert>
				)}
			</div>
		</AppLayout>
	)
}
