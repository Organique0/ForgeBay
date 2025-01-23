import { LuBadgeCheck, LuBadgeX, LuCheck, LuShip } from 'react-icons/lu';
import React from 'react';
import { IconType } from 'react-icons';
import { Status } from '@/types';

type Props = {
	status: Status;
};

const StatusComponent: React.FC<Props> = ({status})  => {
		switch (status) {
			case 'to_do':
				return <LuBadgeX />
			case 'in_progress':
				return <LuShip />
			case 'done':
				return <LuBadgeCheck />
			default:
				return <LuBadgeCheck />
		}

};

export default StatusComponent;






