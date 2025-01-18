import { Link } from '@inertiajs/react';
import React from 'react';
import useRoute from '@/Hooks/useRoute';
import useTypedPage from '@/Hooks/useTypedPage';
import { Head } from '@inertiajs/react';
import HeroeSection from "@/Components/Heroes/HeroeSection";
import AppLayout from '@/Layouts/AppLayout';

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

      <div className="relative sm:flex sm:justify-center sm:items-center min-h-screen bg-gray-100 bg-center dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <HeroeSection />
        </div>
      </div>
    </AppLayout>
  );
}
