import {  useForm } from '@inertiajs/react';
import classNames from 'classnames';
import React, {  useState } from 'react';
import useRoute from '@/Hooks/useRoute';
import ActionMessage from '@/Components/ActionMessage';
import FormSection from '@/Components/FormSection';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { Tag, User } from '@/types';
import useTypedPage from '@/Hooks/useTypedPage';
import { Textarea } from '@/Components/Shadcn/ui/textarea';

interface Props {
	user: User;
}

export default function UpdateApplicationDataForm({ user }: Props) {
	const [tags, setTags] = useState<Tag[]>([]);
	const form = useForm({
		_method: 'PUT',
		bio: user.bio,
		tags: tags,
	});
	const route = useRoute();
	const page = useTypedPage();


	function updateProfileInformation() {
		form.post(route('user-profile-information.update'), {
			errorBag: 'updateProfileInformation',
			preserveScroll: true,
		});
	}

	return (
		<FormSection
			onSubmit={updateProfileInformation}
			title={'Application Information'}
			description={`Update your data used for applying to tasks.`}
			renderActions={() => (
				<>
					<ActionMessage on={form.recentlySuccessful} className="mr-3">
						Saved.
					</ActionMessage>

					<PrimaryButton
						className={classNames({ 'opacity-25': form.processing })}
						disabled={form.processing}
					>
						Save
					</PrimaryButton>
				</>
			)}
		>
			{/* <!-- Bio --> */}
			<div className="col-span-6 sm:col-span-4">
				<InputLabel htmlFor="bio" value="Bio" />
				<Textarea
					id="name"
					className="mt-1 block w-full"
					value={form.data.bio}
					onChange={e => form.setData('bio', e.currentTarget.value)}
					autoComplete="name"
				/>
				<InputError message={form.errors.bio} className="mt-2" />
			</div>

			{/* <!-- Tags --> */}
			<div className="col-span-6 sm:col-span-4">
				<InputLabel htmlFor="tags" value="Your skills" />

				<InputError message={form.errors.tags} className="mt-2" />
			</div>
		</FormSection>
	);
}
