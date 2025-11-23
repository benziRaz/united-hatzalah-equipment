"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { WifiOff, Wifi } from "lucide-react"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    // בדיקה ראשונית
    setIsOnline(navigator.onLine)

    // מאזין לשינויים בסטטוס החיבור
    const handleOnline = () => {
      setIsOnline(true)
      setWasOffline(true)
      // הסתרת ההודעה על חזרה לחיבור אחרי 5 שניות
      setTimeout(() => setWasOffline(false), 5000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setWasOffline(false)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // אם אנחנו online ומעולם לא היינו offline, לא מציגים כלום
  if (isOnline && !wasOffline) {
    return null
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4 animate-fade-in">
      {!isOnline ? (
        <Alert variant="destructive" className="shadow-lg">
          <WifiOff className="h-4 w-4" />
          <AlertTitle>אין חיבור לאינטרנט</AlertTitle>
          <AlertDescription>
            לא ניתן לשלוח הזמנות ללא חיבור לאינטרנט. אנא בדוק את החיבור שלך.
          </AlertDescription>
        </Alert>
      ) : wasOffline ? (
        <Alert className="shadow-lg border-green-500 bg-green-50">
          <Wifi className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">חיבור שוחזר</AlertTitle>
          <AlertDescription className="text-green-700">
            החיבור לאינטרנט חזר. תוכל לשלוח הזמנות כעת.
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  )
}

