import React from 'react';
import useRoute from '@/Hooks/useRoute';
import useTypedPage from '@/Hooks/useTypedPage';
import { Head } from '@inertiajs/react';
import HeroeSection from "@/Components/Heroes/HeroeSection";
import AppLayout from '@/Layouts/AppLayout';
import Ideas from '@/Components/MyComponents/Ideas';

interface Props {
  canLogin: boolean;
  canRegister: boolean;
  laravelVersion: string;
  phpVersion: string;
	ideas: any;
}

export default function Welcome({
  canLogin,
  canRegister,
  laravelVersion,
  phpVersion,
	ideas
}: Props) {
  const route = useRoute();
  const page = useTypedPage();

  return (
    <AppLayout title={'Welcome'}>
			<Head title="Welcome to ForgeHub" />

			<HeroeSection />

			<div>
				{/*<Messages/>*/}
			</div>

			<div>
				<h1 className={'text-3xl my-4'}>Latest Ideas</h1>
				<Ideas ideas={ideas} />
			</div>

    </AppLayout>
  );
}
