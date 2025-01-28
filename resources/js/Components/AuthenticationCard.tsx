import React, { PropsWithChildren } from 'react';

export default function AuthenticationCard({
  children,
}: PropsWithChildren<Record<string, unknown>>) {
  return (
    <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100 dark:bg-gray-900">
      <div>
        {/*<AuthenticationCardLogo />*/}
      </div>

      <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-card dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg border border-primary-500">
        {children}
      </div>
    </div>
  );
}
