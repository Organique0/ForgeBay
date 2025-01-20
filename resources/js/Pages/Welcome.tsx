import { Link } from '@inertiajs/react';
import React from 'react';
import useRoute from '@/Hooks/useRoute';
import useTypedPage from '@/Hooks/useTypedPage';
import { Head } from '@inertiajs/react';
import HeroeSection from "@/Components/Heroes/HeroeSection";
import AppLayout from '@/Layouts/AppLayout';
import Messages from '@/Components/messages/Messages';

interface Props {
  canLogin: boolean;
  canRegister: boolean;
  laravelVersion: string;
  phpVersion: string;
}

export default function Welcome({
  canLogin,
  canRegister,
  laravelVersion,
  phpVersion,
}: Props) {
  const route = useRoute();
  const page = useTypedPage();

  return (
    <AppLayout title={'Welcome'}>
      <Head title="Welcome to ForgeHub" />

      <div className="max-w-7xl mx-auto p-6 lg:p-8">
				<HeroeSection />
			</div>
			<div>
				<Messages/>
			</div>

    </AppLayout>
  );
}
