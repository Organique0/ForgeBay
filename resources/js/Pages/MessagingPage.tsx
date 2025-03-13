import React from "react"
import { useState, useRef, useEffect } from "react"
import { Paperclip, ImageIcon, Send, File, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/Shadcn/ui/avatar"
import { ScrollArea } from "@/Components/Shadcn/ui/scroll-area"
import { Input } from "@/Components/Shadcn/ui/input"
import { Button } from "@/Components/Shadcn/ui/button"
import AppLayout from "@/Layouts/AppLayout"
import useTypedPage from "@/Hooks/useTypedPage"
import { useRoute } from "ziggy-js"
import axios from "axios"

type MessageType = {
	id: string
	content: string
	sender: "user" | "other"
	timestamp: Date
	attachments?: {
		type: "image" | "file"
		url: string
		name: string
	}[]
}

export default function MessagingPage({recipientId}) {
	const [messages, setMessages] = useState<MessageType[]>([
		{
			id: "1",
			content: "Hey there! How's it going?",
			sender: "other",
			timestamp: new Date(Date.now() - 3600000),
		},
		{
			id: "2",
			content: "I'm doing well, thanks for asking! Just finished a project.",
			sender: "user",
			timestamp: new Date(Date.now() - 3000000),
		},
		{
			id: "3",
			content: "That's great! Can you send me some photos of it?",
			sender: "other",
			timestamp: new Date(Date.now() - 2400000),
		},
		{
			id: "4",
			content: "Sure, here's a preview image:",
			sender: "user",
			timestamp: new Date(Date.now() - 1800000),
			attachments: [
				{
					type: "image",
					url: "/placeholder.svg?height=300&width=400",
					name: "project-preview.jpg",
				},
			],
		},
		{
			id: "5",
			content: "And here's the documentation file:",
			sender: "user",
			timestamp: new Date(Date.now() - 1200000),
			attachments: [
				{
					type: "file",
					url: "#",
					name: "project-documentation.pdf",
				},
			],
		},
		{
			id: "6",
			content: "Looks amazing! I'll review the docs and get back to you.",
			sender: "other",
			timestamp: new Date(Date.now() - 600000),
		},
	]);

	const { auth } = useTypedPage().props;

	window.Echo.private(`messages.${auth.user?.id}`)
		.listen('MessageSent', (event: any) => {
			console.log('Received private message:', event);
		});

	const [newMessage, setNewMessage] = useState("")
	const [attachments, setAttachments] = useState<
		{
			type: "image" | "file"
			file: File
			previewUrl?: string
		}[]
	>([])

	const fileInputRef = useRef<HTMLInputElement>(null)
	const imageInputRef = useRef<HTMLInputElement>(null)
	const messagesEndRef = useRef<HTMLDivElement>(null)

	// Scroll to bottom when messages change
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
	}, [messages])

	const handleSendMessage = () => {
		if (newMessage.trim() === "" && attachments.length === 0) return

		const newMessageObj: MessageType = {
			 id: Date.now().toString(),
			 content: newMessage,
			 sender: "user",
			 timestamp: new Date(),
			 attachments: attachments.map((attachment) => ({
			 	type: attachment.type,
			 	url: attachment.previewUrl || "#",
			 	name: attachment.file.name,
			 })),
		}
		const newMessageObj2 = {
			message: newMessage,
			recipientId: recipientId
		}

		axios.post('/messages', newMessageObj2)



		setMessages([...messages, newMessageObj])
		setNewMessage("")
		setAttachments([])

		// Simulate a reply after 1 second
		setTimeout(() => {
			const replyMessage: MessageType = {
				id: (Date.now() + 1).toString(),
				content: "Thanks for sharing! I'll take a look at these.",
				sender: "other",
				timestamp: new Date(),
			}
			setMessages((prev) => [...prev, replyMessage])
		}, 1000)
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "file") => {
		if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0]

			if (type === "image") {
				const reader = new FileReader()
				reader.onload = () => {
					setAttachments([
						...attachments,
						{
							type: "image",
							file,
							previewUrl: reader.result as string,
						},
					])
				}
				reader.readAsDataURL(file)
			} else {
				setAttachments([
					...attachments,
					{
						type: "file",
						file,
					},
				])
			}
		}

		// Reset the input
		e.target.value = ""
	}

	const removeAttachment = (index: number) => {
		setAttachments(attachments.filter((_, i) => i !== index))
	}

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
	}

	return (
		<AppLayout title="Messages">
		<div className="flex flex-col h-full max-w-7xl mx-auto border rounded-lg overflow-hidden mt-12">
			<div className="flex items-center p-4 border-b bg-background">
				<Avatar className="h-10 w-10 mr-3">
					<AvatarImage src="/placeholder.svg?height=40&width=40" alt="Contact" />
					<AvatarFallback>JD</AvatarFallback>
				</Avatar>
				<div>
					<h2 className="text-sm font-medium">Jane Doe</h2>
					<p className="text-xs text-muted-foreground">Online</p>
				</div>
			</div>

			<ScrollArea className="flex-1 p-4">
				<div className="space-y-4">
					{messages.map((message) => (
						<div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
							<div
								className={`max-w-[80%] rounded-lg p-3 ${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
									}`}
							>
								<div className="mb-1">{message.content}</div>

								{message.attachments?.map((attachment, index) => (
									<div key={index} className="mt-2">
										{attachment.type === "image" ? (
											<div className="rounded-md overflow-hidden">
												<img
													src={attachment.url || "/placeholder.svg"}
													alt={attachment.name}
													className="max-w-full h-auto"
												/>
											</div>
										) : (
											<div className="flex items-center gap-2 p-2 bg-background/50 rounded-md">
												<File className="h-4 w-4" />
												<span className="text-sm truncate">{attachment.name}</span>
											</div>
										)}
									</div>
								))}

								<div className="text-xs mt-1 opacity-70 text-right">{formatTime(message.timestamp)}</div>
							</div>
						</div>
					))}
					<div ref={messagesEndRef} />
				</div>
			</ScrollArea>

			{attachments.length > 0 && (
				<div className="p-2 border-t flex flex-wrap gap-2">
					{attachments.map((attachment, index) => (
						<div key={index} className="relative">
							{attachment.type === "image" && attachment.previewUrl ? (
								<div className="relative h-16 w-16 rounded-md overflow-hidden">
									<img
										src={attachment.previewUrl || "/placeholder.svg"}
										alt={attachment.file.name}
										className="h-full w-full object-cover"
									/>
									<Button
										variant="destructive"
										size="icon"
										className="h-5 w-5 absolute top-0 right-0 rounded-full"
										onClick={() => removeAttachment(index)}
									>
										<X className="h-3 w-3" />
									</Button>
								</div>
							) : (
								<div className="relative flex items-center gap-1 p-2 bg-muted rounded-md">
									<File className="h-4 w-4" />
									<span className="text-xs truncate max-w-[100px]">{attachment.file.name}</span>
									<Button
										variant="destructive"
										size="icon"
										className="h-5 w-5 ml-1 rounded-full"
										onClick={() => removeAttachment(index)}
									>
										<X className="h-3 w-3" />
									</Button>
								</div>
							)}
						</div>
					))}
				</div>
			)}

			<div className="p-3 border-t flex items-end gap-2">
				<div className="flex gap-1">
					<Button
						variant="outline"
						size="icon"
						className="h-9 w-9 rounded-full"
						onClick={() => imageInputRef.current?.click()}
					>
						<ImageIcon className="h-5 w-5" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="h-9 w-9 rounded-full"
						onClick={() => fileInputRef.current?.click()}
					>
						<Paperclip className="h-5 w-5" />
					</Button>
					<input
						type="file"
						ref={imageInputRef}
						className="hidden"
						accept="image/*"
						onChange={(e) => handleFileChange(e, "image")}
					/>
					<input type="file" ref={fileInputRef} className="hidden" onChange={(e) => handleFileChange(e, "file")} />
				</div>

				<Input
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					placeholder="Type a message..."
					className="flex-1"
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault()
							handleSendMessage()
						}
					}}
				/>

				<Button size="icon" className="h-9 w-9 rounded-full" onClick={handleSendMessage}>
					<Send className="h-5 w-5" />
				</Button>
			</div>
		</div>

		</AppLayout>
	)
}

