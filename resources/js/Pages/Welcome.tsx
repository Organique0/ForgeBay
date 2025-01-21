import { Link } from '@inertiajs/react';
import React from 'react';
import useRoute from '@/Hooks/useRoute';
import useTypedPage from '@/Hooks/useTypedPage';
import { Head } from '@inertiajs/react';
import HeroeSection from "@/Components/Heroes/HeroeSection";
import AppLayout from '@/Layouts/AppLayout';
import Messages from '@/Components/messages/Messages';
import Ideas from '@/Components/Ideas';

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

      <div>
				<HeroeSection />
			</div>
			<div>
				{/*<Messages/>*/}
			</div>
			<div>
				<h1>Latest Ideas</h1>
				<Ideas ideas={ideas} />
			</div>

    </AppLayout>
  );
}
