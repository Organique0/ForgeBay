import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/Shadcn/ui/avatar';
import { Badge } from '@/Components/Shadcn/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/Shadcn/ui/card';
import AppLayout from '@/Layouts/AppLayout';
import { Idea, Tag } from '@/types';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/Components/Shadcn/ui/chart';
import { Bar, BarChart, CartesianGrid, Label, LabelList, Pie, PieChart, XAxis } from 'recharts';
import useTypedPage from '@/Hooks/useTypedPage';
import { format, parseISO } from 'date-fns';
import { CheckCircle, Lightbulb, XCircle, User, Wrench } from 'lucide-react';

interface PublicProfileProps {
	name: string;
	email: string;
	profile_photo_url: string;
	bio: string;
	ideas: Idea[];
	tags: Tag[];
	applications: Application[];
}

interface Application {
	status: 'sent' | 'approved' | 'declined';
	created_at: string,
}

export default function PublicProfile() {
	const { props } = useTypedPage<PublicProfileProps>();
	const { name, email, profile_photo_url, bio, ideas, tags, applications } = props;
	console.log(ideas);

	const totalApplications = React.useMemo(() => {
		return applications.length;
	}, []);

	const approvedApplications = React.useMemo(() => {
		return applications.filter((app: Application) => app.status == 'approved').length;
	}, []);

	const sentApplications = React.useMemo(() => {
		return applications.filter((app: Application) => app.status == 'sent').length;
	}, []);

	const declinedApplications = React.useMemo(() => {
		return applications.filter((app: Application) => app.status == 'declined').length;
	}, []);


	const chartData = [
		{ status: "sent", applications: sentApplications, fill: "var(--color-sent)" },
		{ status: "approved", applications: approvedApplications, fill: "var(--color-approved)" },
		{ status: "declined", applications: declinedApplications, fill: "var(--color-declined)" },
	]

	const chartConfig = {
		totalApplications: {
			label: "Total Applications",
		},
		sent: {
			label: "Sent",
			color: "hsl(var(--chart-3))",
		},
		approved: {
			label: "Approved",
			color: "hsl(var(--chart-2))",
		},
		declined: {
			label: "Declined",
			color: "hsl(var(--chart-1))",
		}
	} satisfies ChartConfig

	const applicationsByMonth = React.useMemo(() => {
		const today = new Date();
		const lastSixMonths = Array.from({ length: 6 }, (_, i) => {
			const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
			return format(date, 'MMMM yyyy');
		}).reverse();

		const months: { [key: string]: number } = {};

		applications.forEach(app => {
			if (app.created_at) {
				const monthKey = format(parseISO(app.created_at), 'MMMM yyyy');
				months[monthKey] = (months[monthKey] || 0) + 1;
			}
		});

		const chartData = lastSixMonths.map(month => ({
			month,
			applications: months[month] || 0
		}));

		return chartData;
	}, [applications]);

	const barChartData = applicationsByMonth;

	const barChartConfig = {
		applications: {
			label: "Applications",
			color: "hsl(var(--chart-5))",
		},
	} satisfies ChartConfig;

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
							<h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
								<User className="h-8 w-8 text-primary" />
								About
							</h2>
							<p>{bio}</p>
						</section>
						<section>
							<h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
								<Lightbulb className="h-8 w-8 text-primary" />
								Ideas
							</h2>
							{ideas.map((idea, index) => (
								<Link href={`/idea/${idea.id}`}>
									<Card key={index} className="transition-all hover:shadow-lg">
										<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
											<CardTitle className="text-lg font-semibold">{idea.title}</CardTitle>
											<Badge variant={idea.active ? "default" : "secondary"}>
												{idea.active ? <CheckCircle className="h-4 w-4 mr-1" /> : <XCircle className="h-4 w-4 mr-1" />}
												{idea.active ? "Active" : "Inactive"}
											</Badge>
										</CardHeader>
										<CardContent>
											<p className="text-sm text-muted-foreground">
												{idea.active
													? "This idea is currently active and being worked on."
													: "This idea is not currently active."}
											</p>
										</CardContent>
									</Card>
								</Link>
							))}
						</section>
						<section>
							{applications.length > 0 && (
								<div>
									<h2 className="text-xl font-semibold mb-2">Applications</h2>
									<ChartContainer
										config={chartConfig}
										className="mx-auto aspect-square max-h-[250px]"
									>
										<PieChart>
											<ChartTooltip
												cursor={false}
												content={<ChartTooltipContent hideLabel />}
											/>
											<Pie
												data={chartData}
												dataKey="applications"
												nameKey="status"
												innerRadius={60}
												strokeWidth={5}
											>
												<Label
													content={({ viewBox }) => {
														if (viewBox && "cx" in viewBox && "cy" in viewBox) {
															return (
																<text
																	x={viewBox.cx}
																	y={viewBox.cy}
																	textAnchor="middle"
																	dominantBaseline="middle"
																>
																	<tspan
																		x={viewBox.cx}
																		y={viewBox.cy}
																		className="fill-foreground text-3xl font-bold"
																	>
																		{totalApplications.toLocaleString()}
																	</tspan>
																	<tspan
																		x={viewBox.cx}
																		y={(viewBox.cy || 0) + 24}
																		className="fill-muted-foreground"
																	>
																		Applications
																	</tspan>
																</text>
															)
														}
													}}
												/>
											</Pie>
										</PieChart>
									</ChartContainer>
									<ChartContainer config={barChartConfig}>
										<BarChart
											accessibilityLayer
											data={barChartData}
											margin={{
												top: 20,
											}}
										>
											<CartesianGrid vertical={false} />
											<XAxis
												dataKey="month"
												tickLine={false}
												tickMargin={10}
												axisLine={false}
												tickFormatter={(value) => value.slice(0, 3)}
											/>
											<ChartTooltip
												cursor={false}
												content={<ChartTooltipContent hideLabel />}
											/>
											<Bar dataKey="applications" fill="var(--color-applications)" radius={8}>
												<LabelList
													position="top"
													offset={12}
													className="fill-foreground"
													fontSize={12}
												/>
											</Bar>
										</BarChart>
									</ChartContainer>
								</div>
							)}
						</section>
						<section>
							<h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
								<Wrench className="h-8 w-8 text-primary" />
								Skills & Interests
							</h2>
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
