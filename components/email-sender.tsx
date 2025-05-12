"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Mail } from "lucide-react"
import { Spinner } from "@/components/spinner"

interface EmailSenderProps {
  pdfFile?: File
  volunteerName: string
}

export function EmailSender({ pdfFile, volunteerName }: EmailSenderProps) {
  const [email, setEmail] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSendEmail = async () => {
    if (!email || !email.includes("@")) {
      setError("אנא הזן כתובת אימייל תקינה")
      return
    }

    if (!pdfFile) {
      setError("לא נמצא קובץ PDF לשליחה")
      return
    }

    setError(null)
    setIsSending(true)

    try {
      // כאן יש להוסיף את הקוד לשליחת המייל
      // לדוגמה, שימוש ב-EmailJS או שירות דומה

      // הדמיית שליחת מייל (יש להחליף בקוד אמיתי)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setSuccess(true)
      setTimeout(() => {
        setIsOpen(false)
        setSuccess(false)
      }, 2000)
    } catch (err) {
      console.error("Error sending email:", err)
      setError("אירעה שגיאה בשליחת המייל. אנא נסה שנית.")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-4">
          <Mail className="mr-2 h-4 w-4" />
          שלח במייל לרכז הציוד
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>שליחת הזמנה במייל</DialogTitle>
          <DialogDescription>הזן את כתובת המייל של רכז הציוד האזורי לשליחת ההזמנה.</DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-6 text-center">
            <p className="text-green-600 font-medium">המייל נשלח בהצלחה!</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">כתובת מייל</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="equipment@unitedhatzalah.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  dir="ltr"
                />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  קובץ ההזמנה של {volunteerName} יישלח לכתובת המייל שהזנת.
                </p>
              </div>

              {error && <p className="text-destructive text-sm">{error}</p>}
            </div>

            <DialogFooter>
              <Button onClick={handleSendEmail} disabled={isSending}>
                {isSending ? (
                  <span className="flex items-center gap-2">
                    <Spinner className="h-4 w-4" /> שולח...
                  </span>
                ) : (
                  "שלח"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
