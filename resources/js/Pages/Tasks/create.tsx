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
import { AlertCircle, CheckCircle2, Euro, ListTodo, PlusCircle, Trash2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/Components/Shadcn/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/Shadcn/ui/table';

type Idea = {
	id: number
	title: string
	description: string
}

type Task = {
	id?: number
	name: string
	description: string
	value: number
}

export default function CreateTasks({ idea, existingTasks = [] }: { idea: Idea; existingTasks?: Task[] }) {
	const route = useRoute()
	const [tasks, setTasks] = useState<Task[]>(existingTasks)
	const [successMessage, setSuccessMessage] = useState<string | null>(null)

	const formSchema = z.object({
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

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			description: "",
			value: 0,
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		// Add task to the idea
		axios
			.post(`/ideas/${idea.id}/tasks`, {
				name: values.name,
				description: values.description || "",
				value: values.value,
			})
			.then((response) => {
				// Add the new task to the list
				const newTask = response.data.task || {
					id: Date.now(), // Temporary ID if not provided by API
					...values,
				}

				setTasks((prev) => [...prev, newTask])
				setSuccessMessage("Task added successfully!")

				// Reset the form
				form.reset({
					name: "",
					description: "",
					value: 0,
				})

				// Clear success message after 3 seconds
				setTimeout(() => {
					setSuccessMessage(null)
				}, 3000)
			})
			.catch((error) => {
				// Handle validation errors
				if (error.response && error.response.data.errors) {
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

	const deleteTask = (taskId: number | undefined) => {
		if (!taskId) return

		axios
			.delete(`/ideas/${idea.id}/tasks/${taskId}`)
			.then(() => {
				setTasks((prev) => prev.filter((task) => task.id !== taskId))
				setSuccessMessage("Task deleted successfully!")

				// Clear success message after 3 seconds
				setTimeout(() => {
					setSuccessMessage(null)
				}, 3000)
			})
			.catch((error) => {
				console.error("Error deleting task:", error)
			})
	}

	const totalValue = tasks.reduce((sum, task) => sum + task.value, 0)

	return (
		<AppLayout title={`Tasks for ${idea.title}`}>
			<div className="container max-w-4xl py-10">
				{successMessage && (
					<Alert className="mb-6 bg-green-50 border-green-200">
						<CheckCircle2 className="h-4 w-4 text-green-600" />
						<AlertTitle className="text-green-800">Success</AlertTitle>
						<AlertDescription className="text-green-700">{successMessage}</AlertDescription>
					</Alert>
				)}

				<Card className="shadow-md mb-8">
					<CardHeader className="space-y-1 bg-muted/30">
						<div className="flex items-center justify-between">
							<CardTitle className="text-2xl font-bold">
								<span className="flex items-center gap-2">
									<ListTodo className="h-5 w-5" />
									Tasks for Idea
								</span>
							</CardTitle>
							<div className="flex items-center gap-2 text-muted-foreground">
								<Euro className="h-4 w-4" />
								<span className="font-medium">Total Value: €{totalValue.toFixed(2)}</span>
							</div>
						</div>
						<CardDescription>
							{idea.title} - {idea.description.substring(0, 100)}
							{idea.description.length > 100 ? "..." : ""}
						</CardDescription>
					</CardHeader>

					<CardContent className="pt-6">
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
								<div className="grid gap-6 sm:grid-cols-2">
									<FormField
										control={form.control}
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
										control={form.control}
										name="value"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-base">Value (€)</FormLabel>
												<FormControl>
													<div className="relative">
														<Euro className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
														<Input
															type="number"
															step="1"
															min="0"
															placeholder="0.00"
															className="h-10 pl-10"
															{...field}
															onChange={(e) => {
																const value = e.target.value
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
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-base">Description (Optional)</FormLabel>
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

