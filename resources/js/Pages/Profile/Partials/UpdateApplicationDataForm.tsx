import { useForm } from '@inertiajs/react';
import classNames from 'classnames';
import React, { ChangeEvent, useEffect, useState } from 'react';
import ActionMessage from '@/Components/ActionMessage';
import FormSection from '@/Components/FormSection';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { User } from '@/types';
import { Textarea } from '@/Components/Shadcn/ui/textarea';
import Tag from '@/Components/MyComponents/Tag';
import useTypedPage from '@/Hooks/useTypedPage';
import { Input } from '@/Components/Shadcn/ui/input';

interface Props {
	user: User;
	allTags: CleanTag[];
	skills: CleanTag[];
}

export type CleanTag = {
	id: number;
	name: string;
};

export default function UpdateApplicationDataForm({
	user,
	allTags,
	skills,
}: Props) {
	const [availableTags, setAvailableTags] = useState<CleanTag[]>(allTags);
	const [selectedTags, setSelectedTags] = useState<CleanTag[]>(skills);
	const [skillIds, setSkillIds] = useState<number[]>(
		skills.map((skill: any) => skill.id),
	);
	const [query, setQuery] = useState("");

	const typedPage = useTypedPage();

	const form = useForm({
		_method: 'POST',
		bio: user.bio,
		skills: skillIds,
	});

	function updateProfileInformation() {
		form.post('/skills', {
			preserveScroll: true,
		});
	}

	useEffect(() => {
		const newSkillIds = selectedTags.map(tag => tag.id);
		setSkillIds(newSkillIds);

		form.setData('skills', newSkillIds);
	}, [selectedTags]);

	const handleTagClick = (tag: CleanTag) => {
		if (selectedTags.some(t => t.id === tag.id)) {
			setSelectedTags(prev => prev.filter(t => t.id !== tag.id));
			setAvailableTags(prev => [...prev, tag]);
		} else {
			setSelectedTags(prev => [...prev, tag]);
			setAvailableTags(prev => prev.filter(t => t.id !== tag.id));
		}
	};

	function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
		const search = event.target.value.toLocaleLowerCase();
		setQuery(search);

		const filteredItems = allTags.filter((tag) => tag.name.toLocaleLowerCase().includes(search))

		setAvailableTags(filteredItems);
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
			<div className="col-span-12">
				<InputLabel htmlFor="bio" value="Bio" />
				<Textarea
					id="bio"
					maxLength={2048}
					className="mt-1 block w-full"
					value={form.data.bio}
					onChange={e => form.setData('bio', e.currentTarget.value)}
					autoComplete="bio"
				/>
				<InputError message={form.errors.bio} className="mt-2" />
			</div>

			{/* <!-- Tags --> */}
			<div className="col-span-12">
				<InputLabel htmlFor="tags" value="Your skills" />

				<div className="w-full">
					<div className="mb-8">
						<div className="p-4 rounded-lg flex flex-wrap gap-2 ">
							{selectedTags.map(tag => (
								<Tag
									key={tag.id}
									value={tag.name}
									isSelected={true}
									onClick={() => handleTagClick(tag)}
								/>
							))}
						</div>
					</div>

					<div>
						<InputLabel htmlFor="tags" value="Available skills" />
						<Input
							value={query}
							onChange={handleInputChange}
							className='mt-1 max-w-xs'
							placeholder='Search...'
						/>
						<div className="min-h-16 p-4 rounded-lg flex flex-wrap gap-2">
							{availableTags.map(tag => (
								<Tag
									key={tag.id}
									value={tag.name}
									isSelected={false}
									onClick={() => handleTagClick(tag)}
								/>
							))}
						</div>
					</div>
				</div>

				<InputError message={typedPage.props.errors.skills} className="mt-2" />

			</div>
		</FormSection>
	);
}
