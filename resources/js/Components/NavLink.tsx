import { Link } from '@inertiajs/react';
import React, { PropsWithChildren } from 'react';

interface Props {
	href: string;
	active?: boolean;
	onClick?: () => null | void;
}

export default function NavLink({
	active,
	href,
	children,
	onClick
}: PropsWithChildren<Props>) {
	const classes = active
		? 'inline-flex items-center px-1 pt-1 border-b-2 border-indigo-400 dark:border-indigo-600 text-sm font-medium leading-5 text-gray-900 dark:text-gray-100 focus:outline-hidden focus:border-indigo-700 transition duration-150 ease-in-out'
		: 'inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 focus:outline-hidden focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-700 transition duration-150 ease-in-out';

	return (
		<Link href={href} className={classes} onClick={onClick}>
			{children}
		</Link>
	);
}
