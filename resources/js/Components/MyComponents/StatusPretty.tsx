import React from 'react';
import { Badge } from '@/Components/Shadcn/ui/badge';

type Props = {
	initialStatus: TaskStatus;
	className?: string;
};
type StatusValue = "success" | "error" | "warning" | "info";
type TaskStatus = "to_do" | "in_progress" | "done" | "No Tasks";

const StatusPretty: React.FC<Props> = ({ initialStatus, className }) => {
	const startStatus: TaskStatus = initialStatus;
	// || (idea && idea.tasks.length > 0 ? idea.tasks[idea.tasks.length - 1].status : 'No Tasks');

	let status: string;
	let value: StatusValue;

	switch (startStatus) {
		case 'to_do':
			status = 'To Do';
			value = 'error';
			break;
		case 'in_progress':
			status = 'In Progress';
			value = 'warning';
			break;
		case 'done':
			status = 'Done';
			value = 'success';
			break;
		default:
			status = 'No Tasks';
			value = 'info';
	}

	return (
		<Badge variant={value} className={className}>
			{status}
		</Badge>
	);
};

export default StatusPretty;
