import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export interface PushNotificationToken {
  data: string
  type: 'expo' | 'fcm'
}

export async function registerForPushNotificationsAsync(): Promise<PushNotificationToken | null> {
  if (!Device.isDevice) {
    console.log('Push notifications require a physical device')
    return null
  }

  // Check existing permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  // Request permissions if not granted
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== 'granted') {
    console.log('Push notification permission not granted')
    return null
  }

  // Get Expo push token
  try {
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    })
    console.log('Expo Push Token:', tokenData.data)
    return { data: tokenData.data, type: 'expo' }
  } catch (error) {
    console.error('Error getting push token:', error)
    return null
  }
}

export async function sendPushNotification(
  expoPushToken: string,
  title: string,
  body: string,
  data?: Record<string, unknown>
) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title,
    body,
    data: data || {},
  }

  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })
    return response.json()
  } catch (error) {
    console.error('Error sending push notification:', error)
    throw error
  }
}

// Schedule a local notification
export async function scheduleLocalNotification(
  title: string,
  body: string,
  triggerSeconds: number = 1
) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: 'default' },
    trigger: { seconds: triggerSeconds },
  })
}

// Cancel all scheduled notifications
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync()
}

// Add notification listeners
export function addNotificationListeners(
  onReceived: (notification: Notifications.Notification) => void,
  onResponseReceived: (response: Notifications.NotificationResponse) => void
) {
  const receivedSubscription = Notifications.addNotificationReceivedListener(onReceived)
  const responseSubscription = Notifications.addNotificationResponseReceivedListener(onResponseReceived)

  return () => {
    receivedSubscription.remove()
    responseSubscription.remove()
  }
}
