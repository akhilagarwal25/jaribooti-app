import { useEffect, useState } from 'react'
import * as Notifications from 'expo-notifications'
import {
  registerForPushNotificationsAsync,
  addNotificationListeners,
} from '@/lib/notifications'

export interface Notification {
  id: string
  title: string
  body: string
  data?: Record<string, unknown>
  date: Date
}

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string>('')
  const [notification, setNotification] = useState<Notifications.Notification | null>(null)
  const [permissionsGranted, setPermissionsGranted] = useState(false)

  useEffect(() => {
    async function setupNotifications() {
      // Request permissions
      const { status } = await Notifications.getPermissionsAsync()
      if (status === 'granted') {
        setPermissionsGranted(true)
      }

      // Get push token
      const token = await registerForPushNotificationsAsync()
      if (token) {
        setExpoPushToken(token.data)
        // Send token to your backend here
        console.log('Push token:', token.data)
      }

      // Add listeners
      const unsubscribe = addNotificationListeners(
        (notification) => setNotification(notification),
        (response) => {
          console.log('Notification response:', response)
          // Handle notification tap
          const data = response.notification.request.content.data
          if (data?.orderId) {
            // Navigate to order details
            console.log('Navigate to order:', data.orderId)
          }
        }
      )

      return unsubscribe
    }

    setupNotifications()
  }, [])

  return {
    expoPushToken,
    notification,
    permissionsGranted,
    requestPermissions: async () => {
      const { status } = await Notifications.requestPermissionsAsync()
      setPermissionsGranted(status === 'granted')
      return status === 'granted'
    },
  }
}
