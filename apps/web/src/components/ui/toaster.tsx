'use client';

import { useEffect } from 'react';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';
import { useWorkspaceStore } from '@/lib/store/use-workspace-store';

export function Toaster() {
  const { notifications, removeNotification } = useWorkspaceStore();

  // Auto-remove notifications after 5 seconds
  useEffect(() => {
    const timers = notifications.map((notification) =>
      setTimeout(() => {
        removeNotification(notification.id);
      }, 5000)
    );

    return () => timers.forEach(clearTimeout);
  }, [notifications, removeNotification]);

  return (
    <ToastProvider>
      {notifications.map((notification) => {
        const variant = notification.type === 'error' ? 'destructive' : 'default';

        return (
          <Toast key={notification.id} variant={variant}>
            <div className="grid gap-1">
              <ToastTitle>{notification.title}</ToastTitle>
              {notification.message && <ToastDescription>{notification.message}</ToastDescription>}
            </div>
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
