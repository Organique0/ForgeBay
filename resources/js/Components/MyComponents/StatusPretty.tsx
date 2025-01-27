import React, { useState, useEffect } from 'react';
import { Idea } from '@/types';
import { Badge } from '@/Components/Shadcn/ui/badge';

type Props = {
	idea: Idea;
	[key: string]: any;
};
type StatusValue = "success" | "error" | "warning" | "info";
type TaskStatus = "to_do" | "in_progress" | "done" | "No Tasks";

const StatusPretty: React.FC<Props> = ({ idea, ...rest }) => {
	const startStatus: TaskStatus = idea.tasks.length > 0 ? idea.tasks[idea.tasks.length - 1].status : 'No Tasks';
	const [status, setStatus] = useState<string>('');
	const [value, setValue] = useState<StatusValue | undefined>(undefined);

	const className = rest.className;

	useEffect(() => {
		switch (startStatus) {
			case 'to_do':
				setStatus('To Do');
				setValue('error');
				break;
			case 'in_progress':
				setStatus('In Progress');
				setValue('warning');
				break;
			case 'done':
				setStatus('Done');
				setValue('success');
				break;
			default:
				setStatus('No Tasks');
				setValue('info');
		}
	}, [startStatus]);

	return (
		<Badge variant={value} className={className}>
			{status}
		</Badge>
	);
};

export default StatusPretty;
