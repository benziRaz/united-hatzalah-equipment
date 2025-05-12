"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Mail, Download, Printer, HomeIcon, MessageSquare } from "lucide-react"
import Link from "next/link"

export function SuccessMessage() {
  const [volunteerName, setVolunteerName] = useState("")
  // הוסף משתנה state חדש לעקוב אחר סטטוס שליחת המייל
  const [emailSent, setEmailSent] = useState(true)
  const [notes, setNotes] = useState<string | null>(null)

  useEffect(() => {
    // קבלת פרטי המתנדב מה-sessionStorage
    const volunteerDataStr = sessionStorage.getItem("volunteerData")
    if (volunteerDataStr) {
      const volunteerData = JSON.parse(volunteerDataStr)
      setVolunteerName(`${volunteerData.firstName} ${volunteerData.lastName}`)
    }

    // בדיקה אם המייל נשלח בהצלחה
    const emailStatus = sessionStorage.getItem("emailStatus")
    if (emailStatus === "failed") {
      setEmailSent(false)
    }

    // קבלת ההערות מה-sessionStorage
    const orderNotes = sessionStorage.getItem("orderNotes")
    if (orderNotes) {
      setNotes(orderNotes)
    }

    // ניקוי סטטוס המייל מה-sessionStorage
    sessionStorage.removeItem("emailStatus")
  }, [])

  const handlePrint = () => {
    window.print()
  }

  return (
    <Card className="text-center max-w-md mx-auto glass-effect animate-fade-in">
      <CardHeader>
        <div className="flex justify-center mb-2 sm:mb-4">
          <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center animate-pulse-slow">
            <CheckCircle className="h-12 w-12 sm:h-14 sm:w-14 text-green-500" />
          </div>
        </div>
        <CardTitle className="text-xl sm:text-2xl gradient-text">ההזמנה נשלחה בהצלחה!</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div
            className="bg-muted/50 p-4 rounded-md border border-border animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex items-center gap-2 justify-center mb-2">
              <Mail className={`h-5 w-5 ${emailSent ? "text-primary" : "text-yellow-500"}`} />
              <p className="font-medium">{emailSent ? "פרטי ההזמנה נשלחו במייל לרכז הציוד" : "לא נשלח במייל"}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              {emailSent
                ? "פרטי ההזמנה נשלחו באופן אוטומטי לרכז הציוד האזורי. קובץ ה-PDF נשמר במכשיר שלך."
                : "לא ניתן היה לשלוח את ההזמנה במייל. אנא צור קשר עם רכז הציוד באופן ידני."}
            </p>
          </div>

          {notes && notes.trim() && (
            <div
              className="bg-muted/50 p-4 rounded-md border border-border animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="flex items-center gap-2 justify-center mb-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <p className="font-medium">הערות למנהל מרכז הציוד</p>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-line text-right">{notes}</p>
            </div>
          )}

          <div
            className="bg-muted/50 p-4 rounded-md border border-border animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex items-center gap-2 justify-center mb-2">
              <Download className="h-5 w-5 text-primary" />
              <p className="font-medium">הורדת PDF</p>
            </div>
            <p className="text-sm text-muted-foreground">קובץ PDF של ההזמנה הורד למכשיר שלך לצורך גיבוי.</p>
          </div>

          <Button
            variant="outline"
            className="w-full group relative overflow-hidden animate-fade-in"
            style={{ animationDelay: "0.6s" }}
            onClick={handlePrint}
          >
            <span className="flex items-center gap-2 transition-transform group-hover:translate-y-[-2px]">
              <Printer className="h-4 w-4" />
              הדפס הזמנה
            </span>
            <span className="absolute inset-0 bg-primary/5 transform translate-y-full group-hover:translate-y-0 transition-transform"></span>
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center animate-fade-in" style={{ animationDelay: "0.8s" }}>
        <Link href="/">
          <Button className="group relative overflow-hidden">
            <span className="flex items-center gap-2 transition-transform group-hover:translate-x-1">
              <HomeIcon className="h-4 w-4" />
              חזרה לדף הראשי
            </span>
            <span className="absolute inset-0 bg-primary/10 transform translate-y-full group-hover:translate-y-0 transition-transform"></span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
