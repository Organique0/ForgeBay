import { AlertCircle, CheckCircle, X } from 'lucide-react';
import React from 'react';
const  NotificationIcon = ({type}: {type:string}) => {
	switch (type) {
		case 'info':
			return <AlertCircle className="h-5 w-5 text-blue-500 shrink-0" />;
		case "accepted":
			return <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />;
		case 'declined':
			return <X className="h-5 w-5 text-red-500 shrink-0" />;
		default:
			return <AlertCircle className="h-5 w-5 text-blue-500 shrink-0" />;
	}
};

export default NotificationIcon;
