"use client"

import emailjs from "@emailjs/browser"
import { type CartItem, equipmentCategories } from "./equipment-data"

interface VolunteerData {
  firstName: string
  lastName: string
  volunteerId: string
}

// הגדרות EmailJS קבועות - מוגדרות מראש במערכת
const EMAIL_CONFIG = {
  serviceId: "service_429z6xj",
  templateId: "template_263uwdg",
  publicKey: "mXibAReK_9fRLrck3",
  coordinatorEmail: "equipment@unitedhatzalah.org",
}

// פונקציה ליצירת רשימת פריטים בפורמט טקסט פשוט
function createSimpleItemsList(items: CartItem[]): string {
  // קיבוץ פריטים לפי קטגוריה
  const itemsByCategory: Record<string, CartItem[]> = {}
  items.forEach((item) => {
    if (!itemsByCategory[item.category]) {
      itemsByCategory[item.category] = []
    }
    itemsByCategory[item.category].push(item)
  })

  let orderItemsText = ""
  Object.entries(itemsByCategory).forEach(([categoryId, categoryItems]) => {
    const category = equipmentCategories.find((cat) => cat.id === categoryId)
    const categoryName = category ? category.name : categoryId

    orderItemsText += `\n${categoryName}:\n`
    categoryItems.forEach((item) => {
      orderItemsText += `- ${item.name}: ${item.quantity}`
      if (item.reason) orderItemsText += `, סיבה: ${item.reason}`
      if (item.size) orderItemsText += `, מידה: ${item.size}`
      orderItemsText += "\n"
    })
  })

  return orderItemsText
}

// פונקציה עם retry mechanism
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 2,
  delay: number = 1000,
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error")
      console.warn(`Attempt ${attempt + 1} failed:`, lastError.message)

      if (attempt < maxRetries) {
        // המתן לפני ניסיון נוסף
        await new Promise((resolve) => setTimeout(resolve, delay * (attempt + 1)))
      }
    }
  }

  throw lastError || new Error("Operation failed after retries")
}

// פונקציה לבדיקת חיבור לאינטרנט
function isOnline(): boolean {
  if (typeof window === "undefined") return true
  return navigator.onLine
}

// פונקציה לשליחת מייל עם פורמט פשוט יותר
export async function sendOrderEmail(
  volunteerData: VolunteerData,
  items: CartItem[],
  notes?: string,
  pdfBase64?: string | null,
): Promise<{ success: boolean; message: string }> {
  try {
    // בדיקת חיבור לאינטרנט
    if (!isOnline()) {
      return {
        success: false,
        message: "אין חיבור לאינטרנט. אנא בדוק את החיבור ונסה שנית.",
      }
    }

    // אתחול EmailJS עם המפתח הקבוע
    emailjs.init(EMAIL_CONFIG.publicKey)

    // יצירת רשימת פריטים בפורמט טקסט פשוט
    const simpleItemsList = createSimpleItemsList(items)

    // הכנת נתוני המייל - עם משתנים מינימליים ופשוטים
    const emailData: Record<string, any> = {
      to_email: EMAIL_CONFIG.coordinatorEmail,
      from_name: `${volunteerData.firstName} ${volunteerData.lastName}`,
      volunteer_id: volunteerData.volunteerId,
      order_date: new Date().toLocaleDateString("he-IL"),
      items_list: simpleItemsList, // משתנה פשוט יותר
    }

    // הוספת הערות אם יש
    if (notes && notes.trim()) {
      emailData.notes = notes
    }

    // הוספת הודעה לגבי ה-PDF
    emailData.pdf_note = "* קובץ PDF נוצר אצל המתנדב ולא צורף למייל בשל מגבלות טכניות *"

    // שליחת המייל עם retry mechanism
    const response = await retryOperation(
      () => emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, emailData),
      2, // 2 ניסיונות חוזרים
      1500, // 1.5 שניות בין ניסיונות
    )

    console.log("Email sent successfully:", response)
    return {
      success: true,
      message: "המייל נשלח בהצלחה (ללא צירוף ה-PDF)",
    }
  } catch (error) {
    console.error("Failed to send email:", error)

    // זיהוי סוג השגיאה
    let errorMessage = "שגיאה לא ידועה"

    if (error instanceof Error) {
      if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
        errorMessage = "בעיית תקשורת עם שרת המייל. אנא בדוק את החיבור לאינטרנט."
      } else if (error.message.includes("CORS")) {
        errorMessage = "בעיית הרשאות. אנא נסה מדפדפן אחר."
      } else {
        errorMessage = error.message
      }
    }

    return {
      success: false,
      message: `שגיאה בשליחת המייל: ${errorMessage}`,
    }
  }
}
