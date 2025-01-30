import React from 'react';

export default function Tag({ value, isSelected, onClick }: { value:string ; isSelected: boolean; onClick: () => void }) {
	return (
		<div
			onClick={onClick}
			className={`px-3 py-1 rounded-full cursor-pointer transition-colors ${
				isSelected ? "bg-blue-500 hover:bg-blue-400 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
			}`}
		>
			{value}
		</div>
	)
}
