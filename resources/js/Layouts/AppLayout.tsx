import { router } from '@inertiajs/core';
import { Link, Head } from '@inertiajs/react';
import classNames from 'classnames';
import React, { JSX, PropsWithChildren, useEffect, useState } from 'react';
import useRoute from '@/Hooks/useRoute';
import useTypedPage from '@/Hooks/useTypedPage';
import ApplicationMark from '@/Components/ApplicationMark';
import Banner from '@/Components/Banner';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Team } from '@/types';
import { ModeToggle } from '@/Components/MyComponents/mode-toggle';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/Components/Shadcn/ui/dropdown-menu";
import { Button } from '@/Components/Shadcn/ui/button';
import NavLink from '@/Components/NavLink';
interface Props {
	title: string;
	renderHeader?(): JSX.Element;
	fullWidth?: boolean;
}

export default function AppLayout({
	title,
	renderHeader,
	children,
	fullWidth
}: PropsWithChildren<Props>) {
	const page = useTypedPage();
	const route = useRoute();
	const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);


	function switchToTeam(e: React.FormEvent, team: Team) {
		e.preventDefault();
		router.put(
			route('current-team.update'),
			{
				team_id: team.id,
			},
			{
				preserveState: false,
			},
		);
	}

	function logout(e: React.FormEvent) {
		e.preventDefault();
		router.post(route('logout'));
	}

	return (
		<div>
			<Head title={title} />

			<Banner />

			<div className="min-h-screen bg-white dark:bg-gray-900 pb-32">
				<ModeToggle />
				<nav className="bg-white dark:bg-gray-800 border-b-2 border-gray-300 dark:border-gray-700">
					{/* <!-- Primary Navigation Menu --> */}
					<div className={'templateWidth mx-auto'}>
						<div className="flex justify-between h-16">
							<div className="flex">
								{/* <!-- Logo --> */}
								<div className="shrink-0 flex items-center">
									<Link
										href={route('home')}
										onClick={() => {
											localStorage.removeItem('ideasScrollPosition');
										}}
									>
										<ApplicationMark className="block h-9 w-auto" />
									</Link>
								</div>

								{/* <!-- Navigation Links --> */}
								<div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
									<NavLink
										href={route('ideas.index')}
										active={route().current('ideas.index')}
										onClick={() => {
											localStorage.removeItem('ideasScrollPosition');
										}}
									>
										Ideas
									</NavLink>

									{page.props.auth.user && (
										<>
											<NavLink
												href={route('ideas.create')}
												active={route().current('ideas.create')}
												onClick={() => {
													localStorage.removeItem('ideasScrollPosition');
												}}
											>
												Create
											</NavLink>

											<NavLink
												href={route('applications.show')}
												active={route().current('applications.show')}
												onClick={() => {
													localStorage.removeItem('ideasScrollPosition');
												}}
											>
												My Applications
											</NavLink>
										</>
									)

									}

								</div>
							</div>

							<div className={'flex'}>
								{page.props.auth.user && (
									<div className="hidden sm:flex sm:items-center sm:ml-6">
										<div className="ml-3 relative">
											{/* <!-- Teams Dropdown --> */}
											{page.props.jetstream.hasTeamFeatures ? (
												<DropdownMenu>
													<span className="inline-flex rounded-md">
														<DropdownMenuTrigger
															className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-hidden focus:bg-gray-50 dark:focus:bg-gray-700 active:bg-gray-50 dark:active:bg-gray-700 transition ease-in-out duration-150"
														>
															{page.props.auth.user?.current_team?.name}

															<svg
																className="ml-2 -mr-0.5 h-4 w-4"
																xmlns="http://www.w3.org/2000/svg"
																viewBox="0 0 20 20"
																fill="currentColor"
															>
																<path
																	fillRule="evenodd"
																	d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
																	clipRule="evenodd"
																/>
															</svg>
														</DropdownMenuTrigger>
													</span>
													<DropdownMenuContent className="w-60">
														{/* <!-- Team Management --> */}
														{page.props.jetstream.hasTeamFeatures ? (
															<>
																<DropdownMenuLabel className="block px-4 py-2 text-xs text-gray-400">
																	Manage Team
																</DropdownMenuLabel>

																{/* <!-- Team Settings --> */}
																<Link href={route('teams.show', [
																	page.props.auth.user?.current_team!,
																])} className={'group cursor-pointer'}>
																	<DropdownMenuItem className={'cursor-pointer'}>
																		Team Settings
																	</DropdownMenuItem>
																</Link>

																{page.props.jetstream.canCreateTeams ? (
																	<Link href={route('teams.create')} className={'group cursor-pointer'}>
																		<DropdownMenuItem className={'cursor-pointer'}>
																			Create New Team
																		</DropdownMenuItem>
																	</Link>
																) : null}

																<DropdownMenuSeparator className="border-t border-gray-200 dark:border-gray-600" />

																{/* <!-- Team Switcher --> */}
																<DropdownMenuLabel className="block px-4 py-2 text-xs text-gray-400">
																	Switch Teams
																</DropdownMenuLabel>

																{page.props.auth.user?.all_teams?.map(team => (
																	<form
																		onSubmit={e => switchToTeam(e, team)}
																		key={team.id}
																	>
																		<DropdownMenuItem>
																			<div className="flex items-center">
																				{team.id ==
																					page.props.auth.user
																						?.current_team_id && (
																						<svg
																							className="mr-2 h-5 w-5 text-green-400"
																							fill="none"
																							strokeLinecap="round"
																							strokeLinejoin="round"
																							strokeWidth="2"
																							stroke="currentColor"
																							viewBox="0 0 24 24"
																						>
																							<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
																						</svg>
																					)}
																				<div>{team.name}</div>
																			</div>
																		</DropdownMenuItem>
																	</form>
																))}
															</>
														) : null}
													</DropdownMenuContent>
												</DropdownMenu>
											) : null}
										</div>

										{/* <!-- Settings Dropdown --> */}
										<div className="ml-3 relative z-100">
											<DropdownMenu>
												{page.props.jetstream.managesProfilePhotos ? (
													<DropdownMenuTrigger className="flex text-sm border-2 border-transparent rounded-full focus:outline-hidden focus:border-gray-300 transition">
														<img
															className="h-8 w-8 rounded-full object-cover"
															src={page.props.auth.user?.profile_photo_url}
															alt={page.props.auth.user?.name}
														/>
													</DropdownMenuTrigger>
												) : (
													<DropdownMenuTrigger
														className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-hidden focus:bg-gray-50 dark:focus:bg-gray-700 active:bg-gray-50 dark:active:bg-gray-700 transition ease-in-out duration-150"
													>
														<span className="inline-flex rounded-md">
															{page.props.auth.user?.name}

															<svg
																className="ml-2 -mr-0.5 h-4 w-4"
																xmlns="http://www.w3.org/2000/svg"
																viewBox="0 0 20 20"
																fill="currentColor"
															>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	d="M19.5 8.25l-7.5 7.5-7.5-7.5"
																/>
															</svg>
														</span>
													</DropdownMenuTrigger>
												)}
												{/* <!-- Account Management --> */}
												<DropdownMenuContent>
													<DropdownMenuLabel className="block px-4 py-2 text-xs text-gray-400">
														Manage Account
													</DropdownMenuLabel>

													<Link href={route('profile.show')} className={'group cursor-pointer'}>
														<DropdownMenuItem >
															Profile
														</DropdownMenuItem>
													</Link>

													{page.props.jetstream.hasApiFeatures ? (
														<Link href={route('api-tokens.index')} className={'group cursor-pointer'}>
															<DropdownMenuItem>
																API Tokens
															</DropdownMenuItem>
														</Link>
													) : null}

													<Link href={route('dashboard')} className={'group cursor-pointer'}>
														<DropdownMenuItem>
															Dashboard
														</DropdownMenuItem>
													</Link>

													<DropdownMenuSeparator className="border border-zinc dark:border-gray-600"></DropdownMenuSeparator>

													{/* <!-- Authentication --> */}
													<form onSubmit={logout}>
														<DropdownMenuItem>
															<Button
																type="submit"
																variant={'link'}
																className={'p-0 m-0 h-5 cursor-pointer flex flex-grow'}
															>
																Log Out
															</Button>
														</DropdownMenuItem>
													</form>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									</div>
								)}

								<div className="p-6 text-right hidden sm:block">
									{!page.props.auth.user && (
										<>
											<Link
												href={route('login')}
												className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
											>
												Login
											</Link>

											<Link
												href={route('register')}
												className="ml-4 font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
											>
												Register
											</Link>
										</>
									)}
								</div>

								{/* <!-- Hamburger --> */}
								<div className="-mr-2 flex items-center sm:hidden">
									<button
										onClick={() =>
											setShowingNavigationDropdown(!showingNavigationDropdown)
										}
										className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-hidden focus:bg-gray-100 dark:focus:bg-gray-900 focus:text-gray-500 dark:focus:text-gray-400 transition duration-150 ease-in-out"
									>
										<svg
											className="h-6 w-6"
											stroke="currentColor"
											fill="none"
											viewBox="0 0 24 24"
										>
											<path
												className={classNames({
													hidden: showingNavigationDropdown,
													'inline-flex': !showingNavigationDropdown,
												})}
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M4 6h16M4 12h16M4 18h16"
											/>
											<path
												className={classNames({
													hidden: !showingNavigationDropdown,
													'inline-flex': showingNavigationDropdown,
												})}
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									</button>
								</div>
							</div>
						</div>
					</div>

					{/* <!-- Responsive Navigation Menu --> */}
					<div
						className={classNames('sm:hidden', {
							block: showingNavigationDropdown,
							hidden: !showingNavigationDropdown,
						})}
					>
						<div className="pt-2 pb-3 space-y-1">

							{!page.props.auth.user ? (
								<>
									<ResponsiveNavLink
										href={route('login')}
									>
										Login
									</ResponsiveNavLink>

									<ResponsiveNavLink
										href={route('register')}
									>
										Register
									</ResponsiveNavLink>
								</>
							) : <ResponsiveNavLink
								href={route('dashboard')}
								active={route().current('dashboard')}
							>
								Dashboard
							</ResponsiveNavLink>}

						</div>

						{/* <!-- Responsive Settings Options --> */}
						{page.props.auth.user &&
							<div className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
								<div className="flex items-center px-4">
									{page.props.jetstream.managesProfilePhotos ? (
										<div className="shrink-0 mr-3">
											<img
												className="h-10 w-10 rounded-full object-cover"
												src={page.props.auth.user?.profile_photo_url}
												alt={page.props.auth.user?.name}
											/>
										</div>
									) : null}

									<div>
										<div className="font-medium text-base text-gray-800 dark:text-gray-200">
											{page.props.auth.user?.name}
										</div>
										<div className="font-medium text-sm text-gray-500">
											{page.props.auth.user?.email}
										</div>
									</div>
								</div>

								<div className="mt-3 space-y-1">
									<ResponsiveNavLink
										href={route('profile.show')}
										active={route().current('profile.show')}
									>
										Profile
									</ResponsiveNavLink>

									{page.props.jetstream.hasApiFeatures ? (
										<ResponsiveNavLink
											href={route('api-tokens.index')}
											active={route().current('api-tokens.index')}
										>
											API Tokens
										</ResponsiveNavLink>
									) : null}

									{/* <!-- Authentication --> */}
									<form method="POST" onSubmit={logout}>
										<ResponsiveNavLink as="button">Log Out</ResponsiveNavLink>
									</form>

									{/* <!-- Team Management --> */}
									{page.props.jetstream.hasTeamFeatures ? (
										<>
											<div className="border-t border-gray-200 dark:border-gray-600"></div>

											<div className="block px-4 py-2 text-xs text-gray-400">
												Manage Team
											</div>

											{/* <!-- Team Settings --> */}
											<ResponsiveNavLink
												href={route('teams.show', [
													page.props.auth.user?.current_team!,
												])}
												active={route().current('teams.show')}
											>
												Team Settings
											</ResponsiveNavLink>

											{page.props.jetstream.canCreateTeams ? (
												<ResponsiveNavLink
													href={route('teams.create')}
													active={route().current('teams.create')}
												>
													Create New Team
												</ResponsiveNavLink>
											) : null}

											<div className="border-t border-gray-200 dark:border-gray-600"></div>

											{/* <!-- Team Switcher --> */}
											<div className="block px-4 py-2 text-xs text-gray-400">
												Switch Teams
											</div>
											{page.props.auth.user?.all_teams?.map(team => (
												<form onSubmit={e => switchToTeam(e, team)} key={team.id}>
													<ResponsiveNavLink as="button">
														<div className="flex items-center">
															{team.id ==
																page.props.auth.user?.current_team_id && (
																	<svg
																		className="mr-2 h-5 w-5 text-green-400"
																		fill="none"
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		strokeWidth="2"
																		stroke="currentColor"
																		viewBox="0 0 24 24"
																	>
																		<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
																	</svg>
																)}
															<div>{team.name}</div>
														</div>
													</ResponsiveNavLink>
												</form>
											))}
										</>
									) : null}
								</div>
							</div>}
					</div>
				</nav>

				{/* <!-- Page Heading --> */}
				{renderHeader ? (
					<header className="bg-white dark:bg-gray-800 shadow-sm">
						<div className="mx-auto py-6 px-4 sm:px-6 lg:px-8">
							{renderHeader()}
						</div>
					</header>
				) : null}

				{/* <!-- Page Content --> */}
				<main className={fullWidth ? '' : 'templateWidth mx-auto'}>{children}</main>
			</div>
		</div>
	);
}
