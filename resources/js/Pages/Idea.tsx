import React from 'react';
import { Idea as IdeaType } from '@/types';
import AppLayout from '@/Layouts/AppLayout';
import StatusComponent from '@/Components/StatusComponent';
import { Link } from '@inertiajs/react';
import useTypedPage from '@/Hooks/useTypedPage';
import PrimaryButton from '@/Components/PrimaryButton';
import useRoute from '@/Hooks/useRoute';
import { Button } from '@/Components/Shadcn/ui/button';

const Idea = ({ idea }: { idea: IdeaType }) => {
  const firstToDoIndex = idea.tasks.findIndex(task => task.status === 'to_do');
  const page = useTypedPage();
  const route = useRoute();

  return (
    <AppLayout title={'Idea'}>
      <div className={'templateWidth mx-auto'}>
        <div className={'mt-12'}>
          <div className={'p-0'}>
            <h1 className={'text-4xl mb-12'}>{idea.title}</h1>
            <p className={'mb-12'}>{idea.description}</p>
          </div>

          <div className={'p-0'}>
            {/*<div className="relative space-y-0">*/}
            {/*	<div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>*/}
            {/*	{idea.tasks.map((task, index) => (*/}
            {/*		<div key={index} className="flex items-start">*/}
            {/*			<div className="hidden lg:block w-60">*/}
            {/*				{task.created_at && (*/}
            {/*					<p className="text-sm text-gray-500">Added: {new Date(task.created_at).toLocaleDateString()}</p>*/}
            {/*				)}*/}
            {/*				{task.updated_at && (*/}
            {/*					<p className="text-sm text-gray-500">Last updated: {new Date(task.updated_at).toLocaleDateString()}</p>*/}
            {/*				)}*/}
            {/*			</div>*/}
            {/*			<div className="relative flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center">*/}
            {/*				<StatusComponent status={task.status} />*/}
            {/*			</div>*/}
            {/*			<div className="flex-1">*/}
            {/*				<h3 className="text-lg font-medium">{task.name}</h3>*/}
            {/*				<p className="text-sm text-gray-500">{task.description}</p>*/}
            {/*				{task.status === 'to_do' && task.id === idea.tasks[firstToDoIndex].id && (*/}
            {/*					<div className="flex justify-end mt-4">*/}
            {/*						{page.props.auth.user ? (*/}
            {/*							<Button className={'w-full md:w-1/3 lg:w-1/6'}>Apply</Button>*/}
            {/*						) : (*/}
            {/*							<Link href={route('login')} className={'w-full md:w-1/3 lg:w-1/6'}>*/}
            {/*								<Button className={'w-full cursor-pointer'}>Login to apply</Button>*/}
            {/*							</Link>*/}
            {/*						)}*/}
            {/*					</div>*/}
            {/*				)}*/}
            {/*			</div>*/}
            {/*		</div>*/}
            {/*	))}*/}
            {/*</div>*/}

            <ol className="relative border-s border-gray-200 dark:border-gray-700">


              <li className="mb-10 ms-6">

                <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                  <svg
                    className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                  </svg>
                </span>

                <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                  Flowbite Application UI v2.0.0{' '}
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-blue-900 dark:text-blue-300 ms-3">
                    Latest
                  </span>
                </h3>

                <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                  Released on January 13th, 2022
                </time>

                <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                  Get access to over 20+ pages including a dashboard layout,
                  charts, kanban board, calendar, and pre-order E-commerce &
                  Marketing pages.
                </p>




                <a
                  href="#"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                >
                  <svg
                    className="w-3.5 h-3.5 me-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
                    <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                  </svg>
                  Download ZIP
                </a>
              </li>



              <li className="mb-10 ms-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                  <svg
                    className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                  </svg>
                </span>
                <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                  Flowbite Figma v1.3.0
                </h3>
                <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                  Released on December 7th, 2021
                </time>
                <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                  All of the pages and components are first designed in Figma
                  and we keep a parity between the two versions even as we
                  update the project.
                </p>
              </li>
              <li className="ms-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                  <svg
                    className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                  </svg>
                </span>
                <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                  Flowbite Library v1.2.2
                </h3>
                <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                  Released on December 2nd, 2021
                </time>
                <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                  Get started with dozens of web components and interactive
                  elements built on top of Tailwind CSS.
                </p>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Idea;
