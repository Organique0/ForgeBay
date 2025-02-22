import React from 'react';
import { usePage } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/Shadcn/ui/avatar';
import { Badge } from '@/Components/Shadcn/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/Shadcn/ui/card';
import AppLayout from '@/Layouts/AppLayout';
import { Idea, Tag } from '@/types';

export default function PublicProfile() {
	const { props } = usePage<any>();
	const { name, email, profile_photo_url, bio, ideas, tags } = props;

	return (
		<AppLayout title="Public profile">
			<main className="container mx-auto px-4 py-8">
				<Card className="max-w-2xl mx-auto">
					<CardHeader className="flex flex-col items-center space-y-4">
						<Avatar className="w-32 h-32">
							<AvatarImage src={profile_photo_url} alt={name} />
							<AvatarFallback>{name.charAt(0)}</AvatarFallback>
						</Avatar>
						<div className="text-center">
							<CardTitle className="text-2xl font-bold">{name}</CardTitle>
							<p className="text-muted-foreground">{email}</p>
						</div>
					</CardHeader>
					<CardContent className="space-y-6">
						<section>
							<h2 className="text-xl font-semibold mb-2">About</h2>
							<p>{bio}</p>
						</section>
						<section>
							<h2 className="text-xl font-semibold mb-2">Ideas</h2>
							<ul className="list-disc pl-5 space-y-1">
								{ideas.map((idea: Idea, index: number) => (
									<li key={index}>{idea.title}</li>
								))}
							</ul>
						</section>
						<section>
							<h2 className="text-xl font-semibold mb-2">Skills & Interests</h2>
							<div className="flex flex-wrap gap-2">
								{tags.map((tag: Tag, index: number) => (
									<Badge key={index} className='text-lg'>
										{tag}
									</Badge>
								))}
							</div>
						</section>
					</CardContent>
				</Card>
			</main>
		</AppLayout>
	);
}
