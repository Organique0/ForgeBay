import { useForm } from '@inertiajs/react';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import useRoute from '@/Hooks/useRoute';
import ActionMessage from '@/Components/ActionMessage';
import FormSection from '@/Components/FormSection';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { User } from '@/types';
import useTypedPage from '@/Hooks/useTypedPage';
import { Textarea } from '@/Components/Shadcn/ui/textarea';
import { Droppable } from '@/Components/MyComponents/Droppable';
import { Draggable } from '@/Components/MyComponents/Draggable';
import { DndContext, closestCenter } from '@dnd-kit/core';

interface Props {
	user: User;
}

export default function UpdateApplicationDataForm({ user }: Props) {
	const [tags, setTags] = useState<string[]>(['laravel', 'next.js', 'react']);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const form = useForm({
		_method: 'PUT',
		bio: user.bio,
		tags: selectedTags,
	});
	const route = useRoute();
	const page = useTypedPage();

	function updateProfileInformation() {
		form.post(route('user-profile-information.update'), {
			errorBag: 'updateProfileInformation',
			preserveScroll: true,
		});
	}

	function handleDragEnd(event: any) {
		const { active, over } = event;
		if (over) {
			if (over.id === 'selected-droppable') {
				if (!selectedTags.includes(active.id)) {
					setSelectedTags((prev) => [...prev, active.id]);
					setTags((prev) => prev.filter((tag) => tag !== active.id));
				}
			} else if (over.id === 'available-droppable') {
				if (!tags.includes(active.id)) {
					setTags((prev) => [...prev, active.id]);
					setSelectedTags((prev) => prev.filter((tag) => tag !== active.id));
				}
			}
		}
	}

	function handleRemoveTag(tag: string) {
		setSelectedTags((prev) => prev.filter((t) => t !== tag));
		setTags((prev) => [...prev, tag]);
	}

	useEffect(() => {
		form.setData('tags', selectedTags);
	}, [selectedTags]);

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
					id="bio"
					className="mt-1 block w-full"
					value={form.data.bio}
					onChange={(e) => form.setData('bio', e.currentTarget.value)}
					autoComplete="bio"
				/>
				<InputError message={form.errors.bio} className="mt-2" />
			</div>

			{/* <!-- Tags --> */}
			<div className="col-span-6 sm:col-span-4">
				<InputLabel htmlFor="tags" value="Your skills" />
				<DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
					{/* Selected Tags Droppable */}
					<Droppable id="selected-droppable">
						<div className="min-h-32 border-2 border-dashed border-gray-300 p-2 mb-4">
							{selectedTags.length === 0 ? (
								<p className="text-gray-500">Drag tags here to select your skills.</p>
							) : (
								selectedTags.map((tag) => (
									<Draggable key={tag} id={tag}>
										<div className="flex items-center justify-between w-full">
											<span>{tag}</span>
											<button
												type="button"
												onClick={() => handleRemoveTag(tag)}
												className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
												aria-label={`Remove ${tag}`}
											>
												&times;
											</button>
										</div>
									</Draggable>
								))
							)}
						</div>
					</Droppable>

					{/* Available Tags Droppable (Optional) */}
					<Droppable id="available-droppable">
						<div className="min-h-32 border-2 border-dashed border-gray-300 p-2">
							{tags.length === 0 ? (
								<p className="text-gray-500">No available tags.</p>
							) : (
								tags.map((tag) => (
									<Draggable key={tag} id={tag}>
										<div className="p-2 mb-2 bg-gray-100 rounded cursor-move">{tag}</div>
									</Draggable>
								))
							)}
						</div>
					</Droppable>
				</DndContext>
				<InputError message={form.errors.tags} className="mt-2" />
			</div>
		</FormSection>
	);
}
