import React, { useMemo } from "react"
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
import { Application, ApplicationWithUserObject, DateTime, User } from "@/types"
import { formatDate } from "date-fns"
import { now } from "lodash"

type MessageType = {
	application_id: number;
	attachmentUrl?: string;
	created_at: DateTime;
	id: number;
	message: string;
	updated_at: DateTime;
	user: User;
	user_id: number;
};

export default function MessagingPage(
	{loadedMessages, application}:
	{ loadedMessages: MessageType[], application: ApplicationWithUserObject}


) {
	console.log(application);
	const [messages, setMessages] = useState(loadedMessages);

	const { auth } = useTypedPage().props;

	const applicationId = application.id + "";
	const currentUserId = auth.user?.id;
	const recipientUser = currentUserId === application.task.id ? application.user : application.task;


	// window.Echo.private(`messages.${applicationId}`)
	// 	.listen('MessageSent', (event: any) => {
	// 		//console.log('Received private message:', event);
	// 	});

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

	useEffect(() => {
		const timer = setTimeout(() => {
			messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
		}, 1000)
		return () => clearTimeout(timer)
	}, [messages])

	const handleSendMessage = () => {
		if (newMessage.trim() === "" && attachments.length === 0) return

		//so that it is in the same format as the response from the server
		//we could just make a request to messages.index to load new data
		//but to me that seems extra load on the server
		//so using react state seems a better idea
		//after you reload the page, only then it fetches data from the database.

		const formData = new FormData();
		formData.append('message', newMessage);
		formData.append('application_id', applicationId);

		attachments.forEach((attachment, index) => {
			formData.append(`attachments[${index}]`, attachment.file);
		});

		axios.post('/messages', formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		}).then((response) => {
			setMessages([...messages, response.data.message]);
			setNewMessage("");
			setAttachments([]);
		});
	}


	useEffect(() => {
		window.Echo.private(`messages.${applicationId}`)
			.listen('.MessageSent', (event: any) => {
				console.log('Received private message:', event);
				const messageObj = typeof event.message === "string"
					? JSON.parse(event.message)
					: event.message;
				setMessages(prevMessages => {
					if (prevMessages.find(m => m.id === messageObj.id)) return prevMessages;
					return [...prevMessages, messageObj];
				});
			});

		return () => {
			window.Echo.leave(`messages.${applicationId}`);
		};
	}, [applicationId]);

	const [isOnline, setIsOnline] = useState(false);

	useEffect(() => {
		if (!window.Echo) return;
		const currentUserIdNum = Number(currentUserId);
		const channelName = `chat.${applicationId}`;
		window.Echo.join(channelName)
			.here((members: any[]) => {
				console.log('Presence members:', members);
				console.log('Current user:', currentUserIdNum);
				setIsOnline(members.some(member => member.id !== currentUserIdNum));
			})
			.joining((member: any) => {
				if (member.id !== currentUserIdNum) {
					setIsOnline(true);
				}
			})
			.leaving((member: any) => {
				if (member.id !== currentUserIdNum) {
					setIsOnline(false);
				}
			});

		return () => {
			window.Echo.leave(channelName);
		};
	}, []);



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

	const formatTime = (input: string | Date): string => {
		const date = typeof input === "string" ? new Date(input) : input;
		return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	}

	return (
		<AppLayout title="Messages">
		<div className="flex flex-col h-[80vh] max-w-7xl mx-auto border rounded-lg overflow-hidden mt-12">
			<div className="flex items-center p-4 border-b bg-background">
				<Avatar className="h-10 w-10 mr-3">
					<AvatarImage src={application.user.profile_photo_url} alt="Contact" />
					<AvatarFallback>{application.user.name}</AvatarFallback>
				</Avatar>
				<div>
						<h2 className="text-sm font-medium">{recipientUser.name}</h2>
					<p className="flex items-center text-xs text-muted-foreground">
						<span className={`inline-block w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
						{isOnline ? 'Online' : 'Offline'}
					</p>
				</div>
			</div>

			<ScrollArea className="flex-1 p-4 h-72!">
				<div className="space-y-4">
					{messages.map((message) => (
						<div key={message.id} className={`flex ${message.user.id === auth.user!.id ? "justify-end" : "justify-start"}`}>
							<div
								className={`max-w-[80%] rounded-lg p-3 ${message.user.id === auth.user!.id ? "bg-primary text-primary-foreground" : "bg-muted"
									}`}
							>
								<div className="mb-1">{message.message}</div>

								{
									message.attachmentUrl && (() => {
										try {
											const attachments: string[] = JSON.parse(message.attachmentUrl);
											return attachments.map((url, index) => {
												const isImage = /\.(jpeg|jpg|gif|png|webp)$/i.test(url);
												const name = url.split('/').pop() || "Download file";
												return (
													<div key={index} className="mt-2">
														{isImage ? (
															<div className="rounded-md overflow-hidden">
																<img
																	src={url}
																	alt={`Attachment ${index}`}
																	className="max-w-full h-auto"
																/>
															</div>
														) : (
															<a
																href={url}
																target="_blank"
																rel="noopener noreferrer"
																className="text-blue-600 underline"
															>
																{name}
															</a>
														)}
													</div>
												);
											});
										} catch (error) {
											console.error("Error parsing attachments", error);
											return null;
										}
									})()
								}

								<div className="text-xs mt-1 opacity-70 text-right">{formatTime(message.created_at)}</div>
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
				/>

				<Button size="icon" className="h-9 w-9 rounded-full" onClick={handleSendMessage}>
					<Send className="h-5 w-5" />
				</Button>
			</div>
		</div>

		</AppLayout>
	)
}

