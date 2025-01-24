import { LuBadgeCheck, LuBadgeX, LuShip } from 'react-icons/lu';
import React from 'react';
import { Status } from '@/types';

type Props = {
	status: Status;
};

const StatusComponent: React.FC<Props> = ({status})  => {
		switch (status) {
			case 'to_do':
				return <LuBadgeX color={'red'}/>
			case 'in_progress':
				return <LuShip color={'orange'}/>
			case 'done':
				return <LuBadgeCheck color={'green'}/>
			default:
				return <LuBadgeCheck />
		}

};

export default StatusComponent;






