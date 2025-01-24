import { LuBadgeCheck, LuBadgeX, LuShip } from 'react-icons/lu';
import React from 'react';
import { Status } from '@/types';

type Props = {
	status: Status;
};

const StatusComponent: React.FC<Props> = ({status})  => {
		switch (status) {
			case 'to_do':
				return <LuBadgeX color={'red'} size={20}/>
			case 'in_progress':
				return <LuShip color={'orange'} size={20}/>
			case 'done':
				return <LuBadgeCheck color={'green'} size={20}/>
			default:
				return <LuBadgeCheck size={20}/>
		}

};

export default StatusComponent;






