import { useInfiniteHits } from 'react-instantsearch';
import React, { useEffect, useRef } from 'react';
import SingleIdea from './SingleIdea';
import { useImmediateScrollRestoration } from '@/hooks/useImmediateScrollRestoration';
import { Idea } from '@/types';

export default function InfiniteHits(props) {
	const { items, isLastPage, showMore } = useInfiniteHits(props);
	const sentinelRef = useRef(null);

	useImmediateScrollRestoration('ideasScrollPosition', items.length > 0);


	//infinite pagination
	useEffect(() => {
		if (sentinelRef.current !== null) {
			const observer = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !isLastPage) {
						showMore();
					}
				});
			});

			observer.observe(sentinelRef.current);

			return () => {
				observer.disconnect();
			};
		}
	}, [isLastPage, showMore]);

	return (
		<div className="">
			<ul className="">
				{items.map((hit) => (
					<li key={hit.id} className='my-6'>
						<SingleIdea hit={hit} />
					</li>
				))}
				<li ref={sentinelRef} aria-hidden="true" className='h-10' />
			</ul>
		</div>
	);
}
