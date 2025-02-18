import React from 'react';
import { Idea } from '@/types';
import { Badge } from '@/Components/Shadcn/ui/badge';

type Props = {
	idea?: Idea;
	initialStatus?: TaskStatus;
	[key: string]: any;
};
type StatusValue = "success" | "error" | "warning" | "info";
type TaskStatus = "to_do" | "in_progress" | "done" | "No Tasks";

const StatusPretty: React.FC<Props> = ({ idea, initialStatus, ...rest }) => {
	const startStatus: TaskStatus = initialStatus || (idea && idea.task_status.length > 0 ? idea.task_status[idea.task_status.length - 1] : 'No Tasks');

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
		<Badge variant={value} className={rest.className}>
			{status}
		</Badge>
	);
};

export default StatusPretty;
