import React, { createContext, useState, useContext, useEffect } from 'react';

type Notification = {
  id: string;
  message: string;
  action_url?: string;
  application_id?: number;
 	type: string;
};

type NotificationContextType = {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const addNotification = (notification: Notification) => {
    const newNotification = {
      ...notification,
      id: notification.id || Date.now().toString()
    };
    setNotifications((prev) => [...prev, newNotification]);

     setTimeout(() => {
       removeNotification(newNotification.id);
     }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

	const formatType = (type: string) => {
		switch (type) {
			case 'info':
				return 'info';
			case "App\\Notifications\\ApplicationAccepted":
				return "accepted";
			case 'App\\Notifications\\ApplicationDeclined':
				return "declined";
			default:
				return 'info';
		}
	};
  // Listen for notification events
  useEffect(() => {
    const handleNotification = (event: CustomEvent) => {
    const data = event.detail;

      addNotification({
        id: Date.now().toString(),
        message: data.message || 'New notification',
        action_url: data.action_url,
        application_id: data.application_id,
        type: formatType(data.type),
      });
    };

    window.addEventListener('notificationReceived', handleNotification as EventListener);
    return () => {
      window.removeEventListener('notificationReceived', handleNotification as EventListener);
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
