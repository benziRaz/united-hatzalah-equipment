"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { type CartItem, equipmentCategories } from "@/lib/equipment-data"
import { Trash2, ShoppingCart, ImageIcon, SendIcon, MessageSquare } from "lucide-react"
import { generatePDF } from "@/lib/pdf-generator"
import { Spinner } from "@/components/spinner"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface CartProps {
  items: CartItem[]
  updateItem: (item: CartItem) => void
  removeItem: (itemId: string) => void
}

export function Cart({ items, updateItem, removeItem }: CartProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [notes, setNotes] = useState<string>("")

  const getCategoryName = (categoryId: string): string => {
    const category = equipmentCategories.find((cat) => cat.id === categoryId)
    return category ? category.name : categoryId
  }

  const handleSubmitOrder = async () => {
    try {
      setIsSubmitting(true)
      setEmailStatus("sending")

      // בדיקת חיבור לאינטרנט
      if (!navigator.onLine) {
        alert("אין חיבור לאינטרנט. אנא בדוק את החיבור ונסה שנית.")
        setEmailStatus("error")
        return
      }

      // Get volunteer data
      const volunteerDataStr = sessionStorage.getItem("volunteerData")
      if (!volunteerDataStr) {
        alert("פרטי המתנדב חסרים. אנא חזור למסך הקודם.")
        router.push("/")
        return
      }

      const volunteerData = JSON.parse(volunteerDataStr)

      // שמירת ההערות ב-sessionStorage
      sessionStorage.setItem("orderNotes", notes)

      // Generate PDF and send email - always attach PDF (true)
      await generatePDF(volunteerData, items, true, true, notes)

      // בדיקת סטטוס המייל
      const emailStatus = sessionStorage.getItem("emailStatus")
      
      if (emailStatus === "failed") {
        // המייל נכשל אבל ה-PDF נוצר
        const shouldContinue = confirm(
          "קובץ ה-PDF נוצר בהצלחה, אך שליחת המייל נכשלה.\n\n" +
          "האם ברצונך להמשיך?\n" +
          "(תוכל לשלוח את קובץ ה-PDF ידנית למנהל הציוד)"
        )
        
        if (!shouldContinue) {
          setEmailStatus("error")
          return
        }
      }

      // Update email status
      setEmailStatus("success")

      // Navigate to success page
      router.push("/success")
    } catch (error) {
      console.error("Error submitting order:", error)
      setEmailStatus("error")
      
      // הודעת שגיאה משופרת
      let errorMessage = "אירעה שגיאה"
      
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          errorMessage = "בעיית תקשורת. אנא בדוק את החיבור לאינטרנט ונסה שנית."
        } else if (error.message.includes("quota")) {
          errorMessage = "אין מספיק מקום באחסון. אנא פנה מקום ונסה שנית."
        } else {
          errorMessage = error.message
        }
      }
      
      alert(`${errorMessage}\n\nאנא נסה שנית או פנה לתמיכה טכנית.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Group items by category
  const itemsByCategory: Record<string, CartItem[]> = {}
  items.forEach((item) => {
    if (!itemsByCategory[item.category]) {
      itemsByCategory[item.category] = []
    }
    itemsByCategory[item.category].push(item)
  })

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Card className="sticky top-4 glass-effect animate-slide-in-left">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg sm:text-xl gradient-text">סל הזמנה</CardTitle>
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            {items.length > 0 && (
              <Badge variant="secondary" className="animate-fade-in">
                {totalItems} פריטים
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="max-h-[calc(100vh-350px)] px-4">
          {items.length === 0 ? (
            <div className="text-center text-muted-foreground py-12 flex flex-col items-center gap-3">
              <ShoppingCart className="h-12 w-12 text-muted-foreground/50 animate-pulse-slow" />
              <p className="text-sm">הסל ריק. אנא הוסף פריטים להזמנה.</p>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              {Object.entries(itemsByCategory).map(([categoryId, categoryItems], index) => (
                <div key={categoryId} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <h3 className="font-medium text-sm mb-2 gradient-text">{getCategoryName(categoryId)}</h3>
                  <div className="space-y-2">
                    {categoryItems.map((item, itemIndex) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center py-2 px-2 border-b text-sm rounded-md hover:bg-muted/50 transition-colors"
                        style={{ animationDelay: `${index * 0.1 + itemIndex * 0.05}s` }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <p className="truncate font-medium">{item.name}</p>
                            {item.imageUrl && <ImageIcon className="h-3 w-3 text-muted-foreground" />}
                          </div>
                          {item.reason && <p className="text-xs text-muted-foreground truncate">סיבה: {item.reason}</p>}
                          {item.size && <p className="text-xs text-muted-foreground">מידה: {item.size}</p>}
                        </div>
                        <div className="flex items-center gap-1 mr-2 whitespace-nowrap">
                          <Badge variant="outline" className="bg-primary/10">
                            {item.quantity}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="h-6 w-6 rounded-full hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* שדה הערות למנהל מרכז הציוד */}
              <div className="pt-4 animate-fade-in">
                <div className="space-y-2">
                  <Label htmlFor="notes" className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    הערות למנהל מרכז הציוד
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="הוסף הערות או בקשות מיוחדות..."
                    className="resize-none"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-4">
        <Button
          className="w-full group relative overflow-hidden"
          disabled={items.length === 0 || isSubmitting}
          onClick={handleSubmitOrder}
          size="lg"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Spinner className="h-4 w-4" />
              {emailStatus === "sending" ? "שולח הזמנה..." : "מייצר PDF..."}
            </span>
          ) : (
            <>
              <span className="flex items-center gap-2">
                <SendIcon className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                שלח הזמנה
              </span>
              <span className="absolute inset-0 bg-primary/10 transform translate-y-full group-hover:translate-y-0 transition-transform"></span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
