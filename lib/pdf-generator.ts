"use client"

import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { type CartItem, equipmentCategories } from "./equipment-data"
import { sendOrderEmail } from "./email-service"

interface VolunteerData {
  firstName: string
  lastName: string
  volunteerId: string
}

// עדכון פונקציית יצירת ה-PDF כך שתכלול את ההערות
export async function generatePDF(
  volunteerData: VolunteerData,
  items: CartItem[],
  sendEmail = true,
  attachPDF = true, // פרמטר זה לא בשימוש יותר בגלל מגבלות טכניות
  notes?: string,
): Promise<void> {
  // יצירת אלמנט HTML זמני
  const element = document.createElement("div")
  element.style.width = "210mm" // A4 width
  element.style.padding = "10mm"
  element.style.backgroundColor = "white"
  element.style.position = "absolute"
  element.style.left = "-9999px"
  element.style.top = "-9999px"
  element.style.fontFamily = "Arial, sans-serif"
  element.style.direction = "rtl"
  element.style.textAlign = "right"

  // הוספת תוכן ה-PDF
  element.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <h1 style="color: #ff6600; font-size: 24px; margin-bottom: 5px;">טופס הזמנת ציוד - איחוד הצלה</h1>
    </div>
    
    <div style="margin-bottom: 20px;">
      <p style="text-align: right;"><strong>שם מלא:</strong> ${volunteerData.firstName} ${volunteerData.lastName}</p>
      <p style="text-align: right;"><strong>קוד כונן:</strong> ${volunteerData.volunteerId}</p>
      <p style="text-align: right;"><strong>תאריך:</strong> ${new Date().toLocaleDateString("he-IL")}</p>
    </div>
  `

  // קיבוץ פריטים לפי קטגוריה
  const itemsByCategory: Record<string, CartItem[]> = {}
  items.forEach((item) => {
    if (!itemsByCategory[item.category]) {
      itemsByCategory[item.category] = []
    }
    itemsByCategory[item.category].push(item)
  })

  // הוספת טבלאות לפי קטגוריה
  Object.entries(itemsByCategory).forEach(([categoryId, categoryItems]) => {
    const category = equipmentCategories.find((cat) => cat.id === categoryId)
    const categoryName = category ? category.name : categoryId

    // הוספת כותרת קטגוריה
    element.innerHTML += `
      <div style="margin-top: 20px; margin-bottom: 10px;">
        <h2 style="color: #ff6600; font-size: 18px; text-align: right;">${categoryName}</h2>
    `

    // יצירת טבלה
    let tableHtml = `
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px; direction: rtl;">
        <thead>
          <tr style="background-color: #ff6600; color: white;">
            <th style="border: 1px solid #ddd; padding: 8px; text-align: right; width: 40%;">פריט</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: center; width: 15%;">כמות</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: right; width: 25%;">סיבה</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: right; width: 20%;">מידה</th>
          </tr>
        </thead>
        <tbody>
    `

    // הוספת שורות לטבלה
    categoryItems.forEach((item) => {
      tableHtml += `
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.name}</td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.quantity}</td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.reason || "-"}</td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.size || "-"}</td>
        </tr>
      `

      // אם יש תמונה, הוסף שורה נוספת עם התמונה
      if (item.imageUrl) {
        tableHtml += `
          <tr>
            <td colspan="4" style="border: 1px solid #ddd; padding: 8px; text-align: center;">
              <p style="margin-bottom: 5px; font-weight: bold;">תמונה מצורפת:</p>
              <img src="${item.imageUrl}" style="max-width: 300px; max-height: 200px; display: block; margin: 0 auto;" />
            </td>
          </tr>
        `
      }
    })

    // סגירת הטבלה
    tableHtml += `
        </tbody>
      </table>
    </div>
    `

    // הוספת הטבלה לאלמנט
    element.innerHTML += tableHtml
  })

  // הוספת הערות אם יש
  if (notes && notes.trim()) {
    element.innerHTML += `
      <div style="margin-top: 20px; border: 1px solid #ddd; padding: 10px; background-color: #f9f9f9;">
        <h3 style="color: #ff6600; font-size: 16px; margin-bottom: 5px;">הערות למנהל מרכז הציוד:</h3>
        <p style="white-space: pre-line;">${notes}</p>
      </div>
    `
  }

  // הוספת כותרת תחתונה
  element.innerHTML += `
    <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #666;">
      <p>איחוד הצלה - מערכת הזמנת ציוד</p>
      <p>המערכת נבנתה ע"י טק טק</p>
    </div>
  `

  // הוספת האלמנט לגוף המסמך
  document.body.appendChild(element)

  try {
    // המרת ה-HTML ל-Canvas
    const canvas = await html2canvas(element, {
      scale: 2, // רזולוציה גבוהה יותר
      useCORS: true,
      logging: false,
      backgroundColor: "white",
    })

    // יצירת PDF מה-Canvas
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    // הוספת התמונה ל-PDF
    const imgWidth = 210 // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)

    // בדיקה אם צריך להוסיף עמודים נוספים (אם התוכן ארוך מדי)
    if (imgHeight > 297) {
      // A4 height in mm
      let currentHeight = 0
      const pageHeight = 297

      while (currentHeight < imgHeight) {
        currentHeight += pageHeight
        if (currentHeight < imgHeight) {
          pdf.addPage()
          // הוספת התמונה לעמוד הבא, עם הזזה כלפי מעלה
          pdf.addImage(imgData, "PNG", 0, -(currentHeight - pageHeight), imgWidth, imgHeight)
        }
      }
    }

    // שמירת ה-PDF
    const filename = `הזמנת_ציוד_${volunteerData.firstName}_${volunteerData.lastName}_${new Date().toISOString().split("T")[0]}.pdf`
    pdf.save(filename)

    // שליחת המייל ללא ה-PDF
    if (sendEmail) {
      try {
        // שליחת המייל ללא צירוף ה-PDF
        const emailResult = await sendOrderEmail(volunteerData, items, notes)

        if (!emailResult.success) {
          console.warn("Email sending failed:", emailResult.message)
          if (typeof window !== "undefined") {
            alert(`הערה: ${emailResult.message} הקובץ PDF נוצר בהצלחה.`)
          }
          sessionStorage.setItem("emailStatus", "failed")
        } else {
          sessionStorage.setItem("emailStatus", "success")
          // תמיד מגדירים שה-PDF לא צורף כי אנחנו לא מצרפים אותו יותר
          sessionStorage.setItem("pdfAttached", "false")
        }
      } catch (error) {
        console.error("Error sending email:", error)
        if (typeof window !== "undefined") {
          alert("הערה: שליחת המייל נכשלה, אך קובץ ה-PDF נוצר בהצלחה.")
        }
        sessionStorage.setItem("emailStatus", "failed")
      }
    }
  } finally {
    // הסרת האלמנט הזמני
    document.body.removeChild(element)
  }
}
