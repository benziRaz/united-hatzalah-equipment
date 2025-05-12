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

// פונקציה ליצירת טבלת פריטים בפורמט טקסט פשוט
function createOrderItemsTextTable(items: CartItem[]): string {
  // קיבוץ פריטים לפי קטגוריה
  const itemsByCategory: Record<string, CartItem[]> = {}
  items.forEach((item) => {
    if (!itemsByCategory[item.category]) {
      itemsByCategory[item.category] = []
    }
    itemsByCategory[item.category].push(item)
  })

  let textTable = ""

  Object.entries(itemsByCategory).forEach(([categoryId, categoryItems]) => {
    const category = equipmentCategories.find((cat) => cat.id === categoryId)
    const categoryName = category ? category.name : categoryId

    textTable += `\n== ${categoryName} ==\n\n`
    textTable += "פריט                  | כמות | סיבה                | מידה\n"
    textTable += "----------------------|------|---------------------|------\n"

    categoryItems.forEach((item) => {
      const name = item.name.padEnd(22, " ")
      const quantity = String(item.quantity).padEnd(6, " ")
      const reason = (item.reason || "-").padEnd(21, " ")
      const size = item.size || "-"

      textTable += `${name}| ${quantity}| ${reason}| ${size}\n`
    })

    textTable += "\n"
  })

  return textTable
}

// פונקציה ליצירת רשימת פריטים בפורמט טקסט
function createOrderItemsList(items: CartItem[]): string {
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

// עדכון שירות המייל כך שיכלול את ההערות
export async function sendOrderEmail(
  volunteerData: VolunteerData,
  items: CartItem[],
  notes?: string,
  pdfBase64?: string, // נשאיר את הפרמטר אבל לא נשתמש בו
): Promise<{ success: boolean; message: string }> {
  try {
    // אתחול EmailJS עם המפתח הקבוע
    emailjs.init(EMAIL_CONFIG.publicKey)

    // יצירת טבלת פריטים בפורמט טקסט פשוט
    const orderItemsTextTable = createOrderItemsTextTable(items)

    // יצירת רשימת פריטים בפורמט טקסט
    const orderItemsList = createOrderItemsList(items)

    // הכנת נתוני המייל - ללא צירוף ה-PDF
    const emailData: Record<string, any> = {
      to_email: EMAIL_CONFIG.coordinatorEmail,
      from_name: `${volunteerData.firstName} ${volunteerData.lastName}`,
      volunteer_id: volunteerData.volunteerId,
      order_date: new Date().toLocaleDateString("he-IL"),
      order_items_text: orderItemsTextTable,
      order_items_list: orderItemsList,
      pdf_note: "* קובץ PDF נוצר אצל המתנדב ולא צורף למייל בשל מגבלות גודל *",
    }

    // הוספת הערות אם יש
    if (notes && notes.trim()) {
      emailData.notes = notes
    }

    // שליחת המייל - ללא צירוף ה-PDF
    const response = await emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, emailData)

    console.log("Email sent successfully:", response)
    return { success: true, message: "המייל נשלח בהצלחה (ללא צירוף ה-PDF)" }
  } catch (error) {
    console.error("Failed to send email:", error)
    return {
      success: false,
      message: `שגיאה בשליחת המייל: ${error instanceof Error ? error.message : "שגיאה לא ידועה"}`,
    }
  }
}
