import { Link, useForm, Head } from '@inertiajs/react';
import React from 'react';
import useRoute from '@/Hooks/useRoute';
import useTypedPage from '@/Hooks/useTypedPage';
import AuthenticationCard from '@/Components/AuthenticationCard';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { Input } from '@/Components/Shadcn/ui/input';
import Checkbox from '@/Components/Checkbox';
import { Button } from '@/Components/Shadcn/ui/button';
import { Label } from '@/Components/Shadcn/ui/label';
import { GalleryVerticalEnd } from 'lucide-react';
import { LuGithub } from 'react-icons/lu';

export default function Register() {
	const page = useTypedPage();
	const route = useRoute();
	const form = useForm({
		name: '',
		email: '',
		password: '',
		password_confirmation: '',
		terms: false,
	});

	function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		form.post(route('register'), {
			onFinish: () => form.reset('password', 'password_confirmation'),
		});
	}
	return (
		<AuthenticationCard>
			<Head title="Register" />

			<form onSubmit={onSubmit}>
				<div className="flex flex-col gap-6">
					<div className="flex flex-col items-center gap-2">
						<Link href="#" className="flex flex-col items-center gap-2 font-medium">
							<div className="flex h-8 w-8 items-center justify-center rounded-md">
								<GalleryVerticalEnd className="size-6" />
							</div>
							<span className="sr-only">ForgeBay Register</span>
						</Link>
						<h1 className="text-xl font-bold">Welcome to ForgeBay</h1>
						<div className="text-center text-sm">
							Already have an account?{" "}
							<Link href="/login" className="underline underline-offset-4">
								Login
							</Link>
						</div>
					</div>

					<div className="">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="m@example.com"
							value={form.data.email}
							onChange={e => form.setData('email', e.currentTarget.value)}
							required
						/>
						<InputError className="mt-2" message={form.errors.email} />
					</div>

					<div className="">
						<Label htmlFor="email">Name</Label>
						<Input
							id="name"
							type="text"
							value={form.data.name}
							onChange={e => form.setData('name', e.currentTarget.value)}
							required
						/>
						<InputError className="mt-2" message={form.errors.email} />
					</div>

					<div className="">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							value={form.data.password}
							onChange={e => form.setData('password', e.currentTarget.value)}
							required
						/>
						<InputError className="mt-2" message={form.errors.password} />
					</div>

					<div className="">
						<InputLabel htmlFor="password_confirmation">
							Confirm Password
						</InputLabel>
						<Input
							id="password_confirmation"
							type="password"
							className="mt-1 block w-full"
							value={form.data.password_confirmation}
							onChange={e =>
								form.setData('password_confirmation', e.currentTarget.value)
							}
							required
							autoComplete="new-password"
						/>
						<InputError
							className="mt-2"
							message={form.errors.password_confirmation}
						/>
					</div>

					<div className="flex flex-col gap-6">
						<Button type="submit" className="w-full" disabled={form.processing}>
							{form.processing ? "Processing..." : "Register"}
						</Button>
					</div>

					{page.props.jetstream.hasTermsAndPrivacyPolicyFeature && (
						<div className="">
							<InputLabel htmlFor="terms">
								<div className="flex items-center">
									<Checkbox
										name="terms"
										id="terms"
										checked={form.data.terms}
										//@ts-ignore
										onChange={e => form.setData('terms', e.currentTarget.checked)}
										required
									/>

									<div className="ml-2">
										I agree to the
										<a
											target="_blank"
											href={route('terms.show')}
											className="ml-1 underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
										>
											Terms of Service
										</a>
										<span className='mx-1'>
											and
										</span>
										<a
											target="_blank"
											href={route('policy.show')}
											className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
										>
											Privacy Policy
										</a>
									</div>
								</div>
								<InputError className="mt-2" message={form.errors.terms} />
							</InputLabel>
							{page.props.errors.provider && (
								<div className="mb-4 font-medium text-sm text-red-600 dark:text-red-400">
									{page.props.errors.provider}
								</div>
							)}
						</div>
					)}
				</div>
			</form>

			<div className="my-6 relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
				<span className="relative z-10 bg-background px-2 text-muted-foreground">Or</span>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<a href="/auth/github">
					<Button variant="outline" className="w-full">
						<LuGithub />
						Continue with Github
					</Button>
				</a>
				<a href="/auth/google">
					<Button variant="outline" className="w-full">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
							<path
								d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
								fill="currentColor"
							/>
						</svg>
						Continue with Google
					</Button>
				</a>
			</div>

		</AuthenticationCard>
	);
}
