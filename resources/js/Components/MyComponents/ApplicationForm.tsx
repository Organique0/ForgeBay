import { useForm, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import useRoute from '@/Hooks/useRoute';
import { Button } from "@/Components/Shadcn/ui/button";
import { Label } from '@/Components/Shadcn/ui/label';
import Checkbox from '@/Components/Checkbox';
import InputLabel from '@/Components/InputLabel';
import { Textarea } from '@/Components/Shadcn/ui/textarea';
import { Idea } from '@/types';
import { Idea as IdeaType, Task as TaskType } from '@/types';
import useTypedPage from '@/Hooks/useTypedPage';
import { Alert, AlertDescription, AlertTitle } from '../Shadcn/ui/alert';
import { CircleCheck, CircleCheckBig, CircleCheckBigIcon, Terminal } from 'lucide-react';

export default function ApplicationForm({ idea, task }: { idea: IdeaType, task: TaskType }) {
	const route = useRoute();
	const page = useTypedPage();
	const [displayForm, setDisplayForm] = useState(true);
	const { reset, processing, submit, setData, data } = useForm({
		application: "",
		include_profile: true,
		userId: page.props.auth.user!.id,
		taskId: task.id
	});

	function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		submit('post', route('application.new'), {
			onFinish: () => setDisplayForm(false),
			onError: () => {

			}
		});
		reset();
	}


	return (
		<>
			{displayForm ? (
				<form onSubmit={onSubmit}>
					<Label className='text-lg' htmlFor='application'>
						Describe why you think you are a good candidate
					</Label>
					<Textarea
						required
						id="application"
						placeholder='Your strengths, experience ...'
						className='mt-4 mb-1'
						onChange={e => setData('application', e.currentTarget.value)}
					/>
					<InputLabel htmlFor="include_profile">
						<div className="flex items-center">
							<Checkbox
								name="include_profile"
								id="include_profile"
								checked={data.include_profile}
								//@ts-ignore
								onChange={e => form.setData('include_profile', e.currentTarget.checked)}
							/>

							<div className="ml-2">
								Include your profile
							</div>
						</div>
					</InputLabel>
					<Button type='submit' className='mt-4' disabled={processing}>
						Send
					</Button>
				</form>
			) : <div className='flex items-center justify-center my-10'>
				<div>
					<CircleCheckBigIcon color='green' size={100} className='mx-auto mb-6' />
					<h1 className='text-3xl'>Application submitted!</h1>
				</div>
			</div>}
		</>
	)
};
