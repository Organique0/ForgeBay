// resources/js/Components/NotificationAlert.tsx
import React from 'react';
import { useNotification } from '@/Context/NotificationContext';
import { router } from '@inertiajs/react';
import NotificationIcon from '@/Components/MyComponents/NotificationIcon';
import { X } from 'lucide-react';

export function NotificationAlert() {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) {
    return null;
  }



  return (
    <div className="fixed bottom-18 right-3 z-50 flex flex-col space-y-2 max-w-md">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 animate-in fade-in slide-in-from-top-5"
        >
          <div className="flex items-start gap-3">
            <NotificationIcon type={notification.type} />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {notification.message}
              </p>
              {notification.action_url && (
                <button
                  onClick={() => {
                    removeNotification(notification.id);
                    router.visit(notification.action_url!);
                  }}
                  className="mt-2 text-xs text-purple-600 dark:text-purple-400 hover:underline"
                >
                  View details
                </button>
              )}
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
