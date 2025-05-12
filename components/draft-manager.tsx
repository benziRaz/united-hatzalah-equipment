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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Save, FileText, Trash2, AlertTriangle } from "lucide-react"
import type { CartItem } from "@/lib/equipment-data"
import { Badge } from "@/components/ui/badge"

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
      alert("אין פריטים בסל להזמנה")
      return
    }

    localStorage.setItem("equipmentDraft", JSON.stringify(items))
    localStorage.setItem("equipmentDraftDate", new Date().toISOString())

    setDraftInfo({
      date: new Date().toLocaleDateString("he-IL"),
      count: items.length,
    })

    setHasDraft(true)
    alert("הטיוטה נשמרה בהצלחה")
  }

  const loadSavedDraft = () => {
    const draftStr = localStorage.getItem("equipmentDraft")
    if (draftStr) {
      try {
        const draftItems = JSON.parse(draftStr) as CartItem[]
        loadDraft(draftItems)
        setShowDialog(false)
      } catch (error) {
        console.error("Error loading draft:", error)
        alert("אירעה שגיאה בטעינת הטיוטה")
      }
    }
  }

  const deleteDraft = () => {
    localStorage.removeItem("equipmentDraft")
    localStorage.removeItem("equipmentDraftDate")
    setHasDraft(false)
    setDraftInfo(null)
    setShowDialog(false)
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

        {hasDraft && (
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" title="טען טיוטה" className="group relative overflow-hidden">
                <span className="flex items-center gap-1 transition-transform group-hover:translate-y-[-2px]">
                  <FileText className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">טען טיוטה</span>
                  {draftInfo && (
                    <Badge variant="secondary" className="mr-1 hidden sm:inline-flex">
                      {draftInfo.count} פריטים
                    </Badge>
                  )}
                </span>
                <span className="absolute inset-0 bg-primary/5 transform translate-y-full group-hover:translate-y-0 transition-transform"></span>
              </Button>
            </DialogTrigger>
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
        )}
      </div>
    </div>
  )
}
