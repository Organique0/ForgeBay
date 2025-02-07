import { useForm, usePage } from '@inertiajs/react';
import React from 'react';
import useRoute from '@/Hooks/useRoute';
import { Button } from "@/Components/Shadcn/ui/button";
import { Label } from '@/Components/Shadcn/ui/label';
import Checkbox from '@/Components/Checkbox';
import InputLabel from '@/Components/InputLabel';
import { Textarea } from '@/Components/Shadcn/ui/textarea';
import { Idea } from '@/types';
import { Idea as IdeaType, Task as TaskType } from '@/types';
import useTypedPage from '@/Hooks/useTypedPage';

export default function ApplicationForm({ idea, task }: { idea: IdeaType, task: TaskType }) {
	const route = useRoute();
	const page = useTypedPage();
	const form = useForm({
		application: "",
		include_profile: true,
		userId: page.props.auth.user!.id,
		taskId: task.id
	});

	function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		form.post(route('application.new'));
	}

	return (
		<form onSubmit={onSubmit}>
			<Label className='text-lg' htmlFor='application'>
				Describe why you think you are a good candidate
			</Label>
			<Textarea
				required
				id="application"
				placeholder='Your strengths, experience ...'
				className='mt-4 mb-1'
				onChange={e => form.setData('application', e.currentTarget.value)}
			/>
			<InputLabel htmlFor="include_profile">
				<div className="flex items-center">
					<Checkbox
						name="include_profile"
						id="include_profile"
						checked={form.data.include_profile}
						//@ts-ignore
						onChange={e => form.setData('include_profile', e.currentTarget.checked)}
					/>

					<div className="ml-2">
						Include your profile
					</div>
				</div>
			</InputLabel>
			<Button type='submit' className='mt-4'>
				Send
			</Button>
		</form>
	)
};
