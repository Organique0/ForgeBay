import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface DraggableProps {
	id: string;
	children: React.ReactNode;
}

export const Draggable: React.FC<DraggableProps> = ({ id, children }) => {
	const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
		id,
	});

	const style = {
		transform: CSS.Translate.toString(transform),
		opacity: isDragging ? 0.5 : 1,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: '0.5rem 1rem',
		marginBottom: '0.5rem',
		backgroundColor: '#e0f7fa',
		borderRadius: '0.5rem',
		cursor: 'grab',
	};

	return (
		<div ref={setNodeRef} style={style} {...attributes}>
			{children}
			{/* Drag Handle */}
			<span {...listeners} style={{ cursor: 'grab', marginLeft: '0.5rem' }}>
        &#x2630; {/* Unicode for a hamburger icon */}
      </span>
		</div>
	);
};
