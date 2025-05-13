"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Save, FileText, Trash2, AlertTriangle, InfoIcon } from "lucide-react"
import type { CartItem } from "@/lib/equipment-data"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

interface DraftManagerProps {
  items: CartItem[]
  loadDraft: (items: CartItem[]) => void
}

export function DraftManager({ items, loadDraft }: DraftManagerProps) {
  const [hasDraft, setHasDraft] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [draftInfo, setDraftInfo] = useState<{ date: string; count: number } | null>(null)

  useEffect(() => {
    // בדיקה אם יש טיוטה שמורה
    const draft = localStorage.getItem("equipmentDraft")
    if (draft) {
      try {
        const draftItems = JSON.parse(draft) as CartItem[]
        const draftDate = localStorage.getItem("equipmentDraftDate") || new Date().toISOString()
        setDraftInfo({
          date: new Date(draftDate).toLocaleDateString("he-IL"),
          count: draftItems.length,
        })
        setHasDraft(true)
      } catch (error) {
        console.error("Error parsing draft:", error)
      }
    } else {
      setHasDraft(false)
    }
  }, [])

  const saveDraft = () => {
    if (items.length === 0) {
      // הצגת הודעה מעוצבת כשאין פריטים בסל
      toast({
        title: "אין פריטים בסל",
        description: "הוסף פריטים לסל כדי לשמור טיוטה",
        variant: "default",
      })
      return
    }

    localStorage.setItem("equipmentDraft", JSON.stringify(items))
    localStorage.setItem("equipmentDraftDate", new Date().toISOString())

    setDraftInfo({
      date: new Date().toLocaleDateString("he-IL"),
      count: items.length,
    })

    setHasDraft(true)

    // הצגת הודעת הצלחה מעוצבת
    toast({
      title: "הטיוטה נשמרה בהצלחה",
      description: `${items.length} פריטים נשמרו בטיוטה. בפעם הבאה שתיכנס למערכת, תוכל לטעון את הטיוטה ולהמשיך מאיפה שהפסקת.`,
      variant: "default",
    })
  }

  const loadSavedDraft = () => {
    const draftStr = localStorage.getItem("equipmentDraft")
    if (draftStr) {
      try {
        const draftItems = JSON.parse(draftStr) as CartItem[]
        loadDraft(draftItems)
        setShowDialog(false)

        // הצגת הודעת הצלחה מעוצבת
        toast({
          title: "הטיוטה נטענה בהצלחה",
          description: `${draftItems.length} פריטים נטענו מהטיוטה`,
          variant: "default",
        })
      } catch (error) {
        console.error("Error loading draft:", error)

        // הצגת הודעת שגיאה מעוצבת
        toast({
          title: "שגיאה בטעינת הטיוטה",
          description: "אירעה שגיאה בטעינת הטיוטה. ייתכן שהטיוטה פגומה.",
          variant: "destructive",
        })
      }
    }
  }

  const deleteDraft = () => {
    localStorage.removeItem("equipmentDraft")
    localStorage.removeItem("equipmentDraftDate")
    setHasDraft(false)
    setDraftInfo(null)
    setShowDialog(false)

    // הצגת הודעת מחיקה מעוצבת
    toast({
      title: "הטיוטה נמחקה",
      description: "הטיוטה נמחקה בהצלחה",
      variant: "default",
    })
  }

  // פונקציה להצגת הסבר על טיוטות למשתמשים חדשים
  const showDraftInfo = () => {
    toast({
      title: "מה זו טיוטה?",
      description:
        "טיוטה מאפשרת לך לשמור את רשימת הציוד שלך ולחזור אליה מאוחר יותר. שמור טיוטה כדי לא לאבד את הפריטים שבחרת.",
      variant: "default",
      action: (
        <Button variant="outline" size="sm" onClick={saveDraft} disabled={items.length === 0}>
          שמור טיוטה
        </Button>
      ),
      duration: 10000, // 10 שניות
    })
  }

  const handleLoadDraftClick = () => {
    const draftStr = localStorage.getItem("equipmentDraft")
    if (!draftStr) {
      // אם אין טיוטה שמורה, הצג הודעה מעוצבת
      toast({
        title: "אין טיוטה שמורה",
        description: "לא נמצאה טיוטה שמורה. כדי לשמור טיוטה, הוסף פריטים לסל ולחץ על 'שמור טיוטה'.",
        variant: "default",
        action: (
          <Button variant="outline" size="sm" onClick={showDraftInfo}>
            למידע נוסף
          </Button>
        ),
        duration: 5000,
      })
    } else {
      // אם יש טיוטה, פתח את הדיאלוג
      setShowDialog(true)
    }
  }

  return (
    <div className="flex justify-end mb-4 animate-fade-in">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={saveDraft}
          title="שמור טיוטה"
          className="group relative overflow-hidden"
        >
          <span className="flex items-center gap-1 transition-transform group-hover:translate-y-[-2px]">
            <Save className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">שמור טיוטה</span>
          </span>
          <span className="absolute inset-0 bg-primary/5 transform translate-y-full group-hover:translate-y-0 transition-transform"></span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          title="טען טיוטה"
          className="group relative overflow-hidden"
          onClick={handleLoadDraftClick}
        >
          <span className="flex items-center gap-1 transition-transform group-hover:translate-y-[-2px]">
            <FileText className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">טען טיוטה</span>
            {hasDraft && draftInfo && (
              <Badge variant="secondary" className="mr-1 hidden sm:inline-flex">
                {draftInfo.count} פריטים
              </Badge>
            )}
          </span>
          <span className="absolute inset-0 bg-primary/5 transform translate-y-full group-hover:translate-y-0 transition-transform"></span>
        </Button>

        {/* כפתור מידע על טיוטות */}
        <Button
          variant="ghost"
          size="icon"
          onClick={showDraftInfo}
          title="מידע על טיוטות"
          className="h-8 w-8 rounded-full"
        >
          <InfoIcon className="h-4 w-4" />
        </Button>

        <Dialog open={showDialog && hasDraft} onOpenChange={setShowDialog}>
          <DialogContent className="glass-effect">
            <DialogHeader>
              <DialogTitle className="gradient-text">טעינת טיוטה שמורה</DialogTitle>
              <DialogDescription>
                נמצאה טיוטת הזמנה שמורה מתאריך {draftInfo?.date}. האם ברצונך לטעון אותה? פעולה זו תחליף את כל הפריטים
                הנוכחיים בסל.
              </DialogDescription>
            </DialogHeader>

            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md p-3 flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              <p className="text-sm text-amber-800 dark:text-amber-300">
                שים לב: טעינת הטיוטה תחליף את כל הפריטים הנוכחיים בסל ההזמנות.
              </p>
            </div>

            <DialogFooter className="flex justify-between">
              <Button variant="destructive" onClick={deleteDraft} className="group relative overflow-hidden">
                <span className="flex items-center gap-1 transition-transform group-hover:translate-y-[-2px]">
                  <Trash2 className="h-4 w-4 mr-1" />
                  מחק טיוטה
                </span>
              </Button>
              <Button onClick={loadSavedDraft} className="group relative overflow-hidden">
                <span className="flex items-center gap-1 transition-transform group-hover:translate-y-[-2px]">
                  <FileText className="h-4 w-4 mr-1" />
                  טען טיוטה
                </span>
                <span className="absolute inset-0 bg-primary/10 transform translate-y-full group-hover:translate-y-0 transition-transform"></span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
