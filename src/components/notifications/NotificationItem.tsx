'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { Notification } from '@/lib/types';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

export default function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const getNotificationLink = () => {
    switch (notification.entityType) {
      case 'POST':
        return `/post/${notification.entityId}`;
      case 'COMMENT':
        return `/post/${notification.entityId}`;
      case 'USER':
        return `/profile/${notification.entityId}`;
      default:
        return '#';
    }
  };

  const getNotificationText = () => {
    switch (notification.type) {
      case 'LIKE':
        return 'liked your post';
      case 'COMMENT':
        return 'commented on your post';
      case 'FOLLOW':
        return 'started following you';
      default:
        return 'sent you a notification';
    }
  };

  return (
    <div className={`p-4 flex items-start gap-4 ${notification.isRead ? 'opacity-60' : ''}`}>
      <Avatar className="h-8 w-8 border">
        <AvatarImage src={notification.actor.profileImage} />
        <AvatarFallback>{notification.actor.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="text-sm">
          <Link href={getNotificationLink()} className="font-semibold">
            {notification.actor.name}
          </Link>{' '}          
          {getNotificationText()}
        </p>
        <p className="text-xs text-muted-foreground">
          {new Date(notification.createdAt).toLocaleTimeString()}
        </p>
      </div>
      {!notification.isRead && (
        <Button variant="outline" size="sm" onClick={() => onMarkAsRead(notification.id)}>
          Mark as Read
        </Button>
      )}
    </div>
  );
}
