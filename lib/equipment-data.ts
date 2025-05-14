export interface EquipmentItem {
  id: string
  name: string
  category: string
  maxQuantity: number
  requiresApproval?: boolean
  requiresReason?: boolean
  requiresImage?: boolean
  requiresSize?: boolean
  imageUrl?: string // הוספת שדה לתמונת המוצר
}

export interface EquipmentCategory {
  id: string
  name: string
  items: EquipmentItem[]
}

export const equipmentCategories: EquipmentCategory[] = [
  {
    id: "bandages",
    name: "תחבושות והלבשות",
    items: [
      { id: "rubber-tourniquet", name: "חסם עורקים גומי", category: "bandages", maxQuantity: 2 },
      { id: "bandaid", name: "פלסטר", category: "bandages", maxQuantity: 10 },
      { id: "gauze-roll", name: "אגד גזה (גלילים)", category: "bandages", maxQuantity: 5 },
      { id: "sterile-pad-10x10", name: "פד גזה סטרילי 10×10", category: "bandages", maxQuantity: 20 },
      { id: "asherman-bandage", name: "תחבושת אשרמן", category: "bandages", maxQuantity: 1 },
      { id: "emergency-blanket", name: "שמיכת מילוט", category: "bandages", maxQuantity: 1 },
      { id: "leukoplast", name: "לויקופלסט", category: "bandages", maxQuantity: 1 },
      { id: "elastic-bandage", name: "תחבושת אלסטית", category: "bandages", maxQuantity: 2 },
      { id: "medium-bandage", name: "תחבושת בינונית", category: "bandages", maxQuantity: 1 },
      { id: "cat-tourniquet", name: "חסם עורקים קאט", category: "bandages", maxQuantity: 1 },
      { id: "hemostatic-bandage", name: "תחבושת המוסטטית", category: "bandages", maxQuantity: 1 },
      { id: "personal-bandage", name: "תחבושת אישית", category: "bandages", maxQuantity: 3 },
      { id: "triangular-bandage", name: "משולש לקיבוע", category: "bandages", maxQuantity: 4 },
      { id: "israeli-bandage", name: "תחבושת ישראלית", category: "bandages", maxQuantity: 1 },
      { id: "sterile-pad-5x5", name: "פד גזה סטרילי 5×5", category: "bandages", maxQuantity: 10 },
    ],
  },
  {
    id: "oxygen",
    name: "ציוד חמצן ונשימה",
    items: [
      { id: "oxygen-regulator", name: "ווסת לבלון חמצן", category: "oxygen", maxQuantity: 1 },
      { id: "manual-suction", name: "סקשן ידני + 2 מחברים", category: "oxygen", maxQuantity: 1 },
      { id: "adult-bvm", name: "מפוח למבוגר", category: "oxygen", maxQuantity: 1 },
      { id: "child-bvm", name: "מפוח לילד", category: "oxygen", maxQuantity: 1 },
      { id: "mask-0-silicone", name: "מסכת הנשמה מס' 0 סיליקון", category: "oxygen", maxQuantity: 1 },
      { id: "adult-viral-filter", name: "מסנן ויראלי מבוגר", category: "oxygen", maxQuantity: 1 },
      { id: "child-viral-filter", name: "מסנן ויראלי ילד", category: "oxygen", maxQuantity: 1 },
      { id: "mask-2", name: "מסיכת הנשמה מס' 2", category: "oxygen", maxQuantity: 1 },
      { id: "mask-5", name: "מסיכת הנשמה מס' 5", category: "oxygen", maxQuantity: 1 },
      { id: "airway-00", name: "מנתב אויר מס' 00", category: "oxygen", maxQuantity: 1 },
      { id: "airway-0", name: "מנתב אויר מס' 0", category: "oxygen", maxQuantity: 1 },
      { id: "airway-1", name: "מנתב אויר מס' 1", category: "oxygen", maxQuantity: 1 },
      { id: "airway-2", name: "מנתב אויר מס' 2", category: "oxygen", maxQuantity: 1 },
      { id: "airway-3", name: "מנתב אויר מס' 3", category: "oxygen", maxQuantity: 2 },
      { id: "airway-4", name: "מנתב אויר מס' 4", category: "oxygen", maxQuantity: 1 },
      { id: "adult-oxygen-mask", name: "מסיכת חמצן מבוגר", category: "oxygen", maxQuantity: 2 },
      { id: "child-oxygen-mask", name: "מסיכת חמצן ילד", category: "oxygen", maxQuantity: 2 },
      { id: "suction-catheter-blue", name: "קטטר לסקשן (8) כחול", category: "oxygen", maxQuantity: 2 },
      { id: "suction-catheter-red", name: "קטטר לסקשן (18) אדום", category: "oxygen", maxQuantity: 2 },
      { id: "oxygen-tank-rubber", name: "גומיה לבלון חמצן", category: "oxygen", maxQuantity: 1 },
    ],
  },
  {
    id: "defibrillator",
    name: "אביזרי דפיברילטור",
    items: [
      { id: "defi-razor", name: "סכין גילוח לדפי'", category: "defibrillator", maxQuantity: 1 },
      { id: "defi-battery-v9", name: "סוללה V9 לדפי", category: "defibrillator", maxQuantity: 1 },
      {
        id: "defi-pads-g3",
        name: "מדבקות לדפיברילטור G3",
        category: "defibrillator",
        maxQuantity: 1,
        imageUrl: "/images/defi-pads-g3.png",
      },
      {
        id: "defi-pads-neon-coden",
        name: "מדבקות לדפיברילטור - ניאון קודן",
        category: "defibrillator",
        maxQuantity: 1,
        imageUrl: "/images/defi-pads-neon-coden.png",
      },
      {
        id: "defi-pads-philips",
        name: "מדבקות לדפיברילטור - פיליפס",
        category: "defibrillator",
        maxQuantity: 1,
        imageUrl: "/images/defi-pads-philips.png",
      },
      {
        id: "defi-pads-lifeline",
        name: "מדבקות לדפיברילטור - לייפליין",
        category: "defibrillator",
        maxQuantity: 1,
        imageUrl: "/images/defi-pads-lifeline.png",
      },
    ],
  },
  {
    id: "hygiene",
    name: "מניעת זיהומים והיגיינה",
    items: [
      { id: "spongitta", name: "ספונג'טה", category: "hygiene", maxQuantity: 10 },
      { id: "hand-sanitizer", name: "ג'ל לחיטוי ידיים", category: "hygiene", maxQuantity: 1 },
      { id: "surgical-masks", name: "מסכות כירורגיות", category: "hygiene", maxQuantity: 10 },
      { id: "disinfectant-wipe", name: "מגבון אישי לחיטוי", category: "hygiene", maxQuantity: 5 },
      { id: "povidone-iodine", name: "פולידין (סביעור)", category: "hygiene", maxQuantity: 1 },
      { id: "n95-mask", name: "מסכת הגנה N95", category: "hygiene", maxQuantity: 1 },
      { id: "gloves-s", name: "כפפות S", category: "hygiene", maxQuantity: 30 },
      { id: "gloves-m", name: "כפפות M", category: "hygiene", maxQuantity: 30 },
      { id: "gloves-l", name: "כפפות L", category: "hygiene", maxQuantity: 30 },
      { id: "gloves-xl", name: "כפפות XL", category: "hygiene", maxQuantity: 30 },
    ],
  },
  {
    id: "monitoring",
    name: "ניטור ואבחון",
    items: [
      { id: "glucose-strips-new", name: "סטיקים דגם חדש למד סוכר", category: "monitoring", maxQuantity: 10 },
      { id: "glucose-strips-regular", name: "סטיקים למד סוכר (רגיל)", category: "monitoring", maxQuantity: 10 },
      { id: "glucose-lancets", name: "דוקרנים למד סוכר", category: "monitoring", maxQuantity: 10 },
      { id: "glucose-battery", name: "סוללה למד סוכר", category: "monitoring", maxQuantity: 2 },
      { id: "stethoscope", name: "סטטוסקופ", category: "monitoring", maxQuantity: 1 },
      { id: "adult-bp-cuff", name: 'מדל"ד מבוגר', category: "monitoring", maxQuantity: 1 },
      { id: "saturation-battery", name: "סוללה למד סיטורציה", category: "monitoring", maxQuantity: 2 },
    ],
  },
  {
    id: "misc",
    name: "שונות",
    items: [
      { id: "birth-kit", name: "ערכת לידה", category: "misc", maxQuantity: 1 },
      { id: "aspirin", name: "כדורי אספירין", category: "misc", maxQuantity: 10 },
      { id: "glucogel", name: "גלוקוג'ל", category: "misc", maxQuantity: 2 },
      { id: "needle-container", name: "פח מחטים", category: "misc", maxQuantity: 1 },
      { id: "triage-tags", name: 'תגי אר"ן', category: "misc", maxQuantity: 5 },
      { id: "folding-stretcher", name: "אלונקה מתקפלת מבד", category: "misc", maxQuantity: 1 },
      { id: "saline-05l", name: "סליין 0.5 ליטר (לעירוי)", category: "misc", maxQuantity: 1 },
      { id: "iv-kit", name: "ערכה לפתיחת וריד (ללא סליין)", category: "misc", maxQuantity: 1 },
    ],
  },
  {
    id: "special",
    name: "ציוד לא מתכלה בהזמנה מיוחדת",
    items: [
      {
        id: "medic-bag",
        name: "תיק חובש",
        category: "special",
        maxQuantity: 1,
        requiresApproval: true,
        requiresReason: true,
        requiresImage: true,
      },
      {
        id: "medic-vest",
        name: "אפוד חובש",
        category: "special",
        maxQuantity: 1,
        requiresApproval: true,
        requiresReason: true,
        requiresImage: true,
        requiresSize: true,
      },
      {
        id: "saturation-meter",
        name: "מד סטורציה",
        category: "special",
        maxQuantity: 1,
        requiresApproval: true,
        requiresReason: true,
        requiresImage: true,
      },
      {
        id: "glucose-meter",
        name: "מד סוכר",
        category: "special",
        maxQuantity: 1,
        requiresApproval: true,
        requiresReason: true,
        requiresImage: true,
      },
      {
        id: "oxygen-tank-24l",
        name: "גליל חמצן 2.4 ליטר",
        category: "special",
        maxQuantity: 1,
        requiresApproval: true,
        requiresReason: true,
      },
      {
        id: "oxygen-tank-2l-motorcycle",
        name: "גליל חמצן 2 ליטר - אופנוע",
        category: "special",
        maxQuantity: 1,
        requiresApproval: true,
        requiresReason: true,
      },
      {
        id: "medic-jacket",
        name: "מעיל חובש",
        category: "special",
        maxQuantity: 1,
        requiresApproval: true,
        requiresReason: true,
        requiresSize: true,
      },
      {
        id: "ragger-clip",
        name: "קליפס לראגר",
        category: "special",
        maxQuantity: 1,
        requiresApproval: true,
        requiresReason: true,
      },
    ],
  },
]

// הוספת שדה הערות למנהל מרכז הציוד
export interface CartItem extends EquipmentItem {
  quantity: number
  reason?: string
  size?: string
  imageUrl?: string
  imageFile?: File
}

// הוספת ממשק חדש שכולל הערות
export interface OrderData {
  items: CartItem[]
  notes?: string
}

export function getEquipmentById(id: string): EquipmentItem | undefined {
  for (const category of equipmentCategories) {
    const item = category.items.find((item) => item.id === id)
    if (item) return item
  }
  return undefined
}
