import TrendingItems from '@/Components/MyComponents/TrendingItems';
import { Button } from '@/Components/Shadcn/ui/button';
import AppLayout from '@/Layouts/AppLayout';
import { Idea } from '@/types';
import { Link } from '@inertiajs/react';
import { ChevronRightIcon } from 'lucide-react';
import React from 'react';

interface LandingPageProps {
	latestIdeas: Idea[];
}


export default function LandingPage({ latestIdeas }: LandingPageProps) {
	return (
		<AppLayout title="Welcome to ForgeBay" fullWidth>
			{/* Hero Banner */}
			<div className="relative bg-linear-to-r from-primary/80 to-primary overflow-hidden">
				<div className="absolute inset-0">
					<svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
						<defs>
							<pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse" x="0" y="0">
								<path d="M0 32V.5H32" fill="none" stroke="rgba(255, 255, 255, 0.1)" />
							</pattern>
						</defs>
						<rect width="100%" height="100%" fill="url(#grid)" />
					</svg>
				</div>

				<div className="relative px-6 py-24 sm:py-32 lg:px-8 max-w-5xl mx-auto">
					<div className="mx-auto max-w-2xl text-center">
						<h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
							Collaborate, Innovate, Create
						</h1>
						<p className="mt-6 text-lg leading-8 text-white/90">
							ForgeBay connects creative minds with technical talent.
							Share your ideas, find collaborators, and bring your vision to life.
						</p>
						<div className="mt-10 flex items-center justify-center gap-x-6">
							<Button size="lg" className="rounded-full px-8">
								Get Started
							</Button>
							<Link href="/idea" className="text-white hover:text-white/80 flex items-center">
								Browse Ideas <ChevronRightIcon className="ml-1 h-4 w-4" />
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* Latest Ideas Section */}
			<div className="py-16 px-6 lg:px-8 bg-background">
				<div className="max-w-7xl mx-auto">
					<TrendingItems
						title='Latest ideas'
						description='	Check out the newest opportunities for collaboration'
						ideas={latestIdeas}
						orientation='horizontal'
						className=''
						itemClassName=''

					/>
				</div>
			</div>
		</AppLayout>
	);
}
