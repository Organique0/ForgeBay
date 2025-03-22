import { Link, useForm, Head, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import useRoute from '@/Hooks/useRoute';
import AuthenticationCard from '@/Components/AuthenticationCard';
import InputError from '@/Components/InputError';
import { Input } from '@/Components/Shadcn/ui/input';

import { GalleryVerticalEnd } from "lucide-react"
import { Button } from "@/Components/Shadcn/ui/button";
import { Label } from '@/Components/Shadcn/ui/label';
import Checkbox from '@/Components/Checkbox';
import InputLabel from '@/Components/InputLabel';
import { LuGithub } from 'react-icons/lu';

interface Props {
	canResetPassword: boolean;
	status: string;
}

export default function Login({ canResetPassword, status }: Props) {
	const { errors } = usePage().props as { errors: { [key: string]: string } };
	const route = useRoute();
	const form = useForm({
		email: '',
		password: '',
		remember: false,
	});
	const [step, setStep] = useState<"email" | "password">("email")

	function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (step === "email") {
			setStep("password")
		}

		if (step === "password") {
			form.post(route('login'), {
				onFinish: () => form.reset('password'),
				onError: () => {
					form.reset('email');
					form.reset('remember');
					setStep('email');
				},
			});
		}
	}
	return (
		<AuthenticationCard>
			<Head title="login" />

			<form onSubmit={onSubmit}>
				<div className="flex flex-col gap-6">
					<div className="flex flex-col items-center gap-2">
						<Link href="#" className="flex flex-col items-center gap-2 font-medium">
							<div className="flex h-8 w-8 items-center justify-center rounded-md">
								<GalleryVerticalEnd className="size-6" />
							</div>
							<span className="sr-only">ForgeBay Login</span>
						</Link>
						<h1 className="text-xl font-bold">Welcome to ForgeBay</h1>
						<div className="text-center text-sm">
							Don&apos;t have an account?{" "}
							<Link href="/register" className="underline underline-offset-4">
								Sign up
							</Link>
						</div>
					</div>
					<div className="flex flex-col gap-6">
						{step === "email" ? (
							<div className="grid gap-2">
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
						) : (
							<div className="grid gap-2">
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
						)}
						<Button type="submit" className="w-full" disabled={form.processing}>
							{form.processing ? "Processing..." : step === "email" ? "Next" : "Login"}
						</Button>
					</div>
					<InputLabel htmlFor="remember">
						<div className="flex items-center mt-[-15px]">
							<Checkbox
								name="remember"
								id="remember"
								checked={form.data.remember}
								//@ts-ignore
								onChange={e => form.setData('remember', e.currentTarget.checked)}
							/>

							<div className="ml-2">
								Remember me
							</div>
						</div>
					</InputLabel>
					{errors.provider && (
						<div className="mb-4 font-medium text-sm text-red-600 dark:text-red-400">
							{errors.provider}
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

			{status && (
				<div className="mb-4 font-medium text-sm text-green-600 dark:text-green-400">
					{status}
				</div>
			)}

		</AuthenticationCard>
	);
}
