"use client"

import { useState, useEffect, useRef } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { equipmentCategories, type CartItem, type EquipmentItem } from "@/lib/equipment-data"
import { CategoryTab } from "@/components/category-tab"
import { Cart } from "@/components/cart"
import { DraftManager } from "@/components/draft-manager"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

export function EquipmentSelector() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [activeTab, setActiveTab] = useState(equipmentCategories[0].id)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<EquipmentItem[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const observerRef = useRef<IntersectionObserver | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.findIndex((cartItem) => cartItem.id === item.id)

      if (existingItemIndex >= 0) {
        // Update existing item
        const newCart = [...prevCart]
        newCart[existingItemIndex] = item

        // הצג הודעת עדכון
        toast({
          title: "הכמות עודכנה",
          description: `${item.name}: ${item.quantity} יחידות`,
          variant: "default",
        })

        return newCart
      } else {
        // Add new item
        // הצג הודעת הוספה
        toast({
          title: "פריט נוסף לסל",
          description: `${item.name}: ${item.quantity} יחידות`,
          variant: "default",
          action: <ToastAction altText="הצג סל">הצג סל</ToastAction>,
        })

        return [...prevCart, item]
      }
    })
  }

  const removeFromCart = (itemId: string) => {
    // מצא את הפריט לפני מחיקתו כדי להציג הודעה
    const itemToRemove = cart.find((item) => item.id === itemId)

    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId))

    if (itemToRemove) {
      toast({
        title: "פריט הוסר מהסל",
        description: `${itemToRemove.name} הוסר מהסל`,
        variant: "destructive",
      })
    }
  }

  const updateCartItem = (updatedItem: CartItem) => {
    setCart((prevCart) => prevCart.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
  }

  const loadDraft = (items: CartItem[]) => {
    setCart(items)

    toast({
      title: "טיוטה נטענה",
      description: `${items.length} פריטים נטענו מהטיוטה`,
      variant: "default",
    })
  }

  // פונקציה לחיפוש פריטים
  const searchItems = (query: string) => {
    if (!query.trim()) {
      setIsSearching(false)
      setSearchResults([])
      return
    }

    setIsSearching(true)
    const normalizedQuery = query.trim().toLowerCase()

    const results: EquipmentItem[] = []

    // חיפוש בכל הקטגוריות
    equipmentCategories.forEach((category) => {
      const categoryResults = category.items.filter((item) => item.name.toLowerCase().includes(normalizedQuery))
      results.push(...categoryResults)
    })

    setSearchResults(results)
  }

  // עדכון תוצאות החיפוש כאשר שורת החיפוש משתנה
  useEffect(() => {
    searchItems(searchQuery)
  }, [searchQuery])

  const clearSearch = () => {
    setSearchQuery("")
    setIsSearching(false)
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  // גלילה לקטגוריה כאשר לוחצים על לשונית
  const scrollToCategory = (categoryId: string) => {
    const categoryElement = categoryRefs.current[categoryId]
    if (categoryElement) {
      // עדכון הלשונית הפעילה
      setActiveTab(categoryId)

      // הוספת אפקט הדגשה זמני לקטגוריה
      categoryElement.classList.add("active")

      // הסרת האפקט אחרי זמן קצר
      setTimeout(() => {
        categoryElement.classList.remove("active")
      }, 1000)

      // גלילה לקטגוריה עם מרווח מותאם
      const offset = 120 // מרווח מהחלק העליון
      const elementPosition = categoryElement.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - offset

      // גלילה למיקום המחושב
      scrollContainerRef.current?.scrollTo({
        top: offsetPosition - scrollContainerRef.current.offsetTop,
        behavior: "smooth",
      })
    }
  }

  // הגדרת Intersection Observer לזיהוי הקטגוריה הנוכחית בתצוגה
  useEffect(() => {
    if (isSearching) return

    // ניקוי Observer קודם אם קיים
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    // יצירת Observer חדש
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // מצא את הקטגוריה עם הנראות הגבוהה ביותר
        const visibleEntries = entries.filter((entry) => entry.isIntersecting)

        if (visibleEntries.length > 0) {
          // מיון לפי יחס הנראות (גבוה לנמוך)
          visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio)

          // קבל את הקטגוריה עם הנראות הגבוהה ביותר
          const mostVisibleEntry = visibleEntries[0]
          const categoryId = mostVisibleEntry.target.getAttribute("data-category-id")

          if (categoryId && categoryId !== activeTab) {
            // עדכון הלשונית הפעילה
            setActiveTab(categoryId)

            // גלילה אל הלשונית המתאימה אם היא מחוץ לתצוגה
            const tabsContainer = document.querySelector(".category-tabs .overflow-x-auto")
            const tabElement = document.querySelector(`[data-tab-value="${categoryId}"]`)

            if (tabElement && tabsContainer) {
              // בדיקה אם הלשונית נמצאת מחוץ לתצוגה
              const tabRect = tabElement.getBoundingClientRect()
              const containerRect = tabsContainer.getBoundingClientRect()

              if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
                // גלילה אל הלשונית
                tabElement.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
              }

              // הדגשת הלשונית הפעילה עם אנימציה
              tabElement.classList.add("tab-active-pulse")
              setTimeout(() => {
                tabElement.classList.remove("tab-active-pulse")
              }, 1000)
            }
          }
        }
      },
      {
        root: null, // viewport
        rootMargin: "-5% 0px -70% 0px", // מרווח מהשוליים מותאם
        threshold: [0.05, 0.1, 0.2, 0.3, 0.4, 0.5], // סף נראות מותאם
      },
    )

    // הוספת כל הקטגוריות ל-Observer
    Object.values(categoryRefs.current).forEach((ref) => {
      if (ref) {
        observerRef.current?.observe(ref)
      }
    })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [activeTab, isSearching])

  // פונקציה לזיהוי הגעה לסוף הרשימה והצגת כפתור חזרה למעלה
  useEffect(() => {
    if (isSearching || !scrollContainerRef.current) return

    const handleScroll = () => {
      const container = scrollContainerRef.current
      if (!container) return

      // בדיקה אם הגענו לסוף הרשימה (קרוב מאוד לסוף)
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 200

      // הצג או הסתר את כפתור החזרה למעלה
      const scrollTopButton = document.getElementById("scroll-top-button")
      if (scrollTopButton) {
        if (isNearBottom) {
          scrollTopButton.classList.add("visible")
        } else {
          scrollTopButton.classList.remove("visible")
        }
      }
    }

    const container = scrollContainerRef.current
    container.addEventListener("scroll", handleScroll)

    return () => {
      container.removeEventListener("scroll", handleScroll)
    }
  }, [isSearching])

  // פונקציה לגלילה לתחילת הרשימה
  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      })
      // עדכון הלשונית הפעילה
      setActiveTab(equipmentCategories[0].id)
    }
  }

  return (
    <div>
      <DraftManager items={cart} loadDraft={loadDraft} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          {/* שורת חיפוש צמודה */}
          <div className="sticky-search animate-fade-in">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="חפש פריט..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 pl-10 text-right rounded-full shadow-sm border-primary/20 focus-visible:ring-primary/30"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 h-7 w-7"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {isSearching ? (
            // תצוגת תוצאות חיפוש
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <span className="gradient-text">תוצאות חיפוש:</span>
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-sm">
                  {searchResults.length} פריטים
                </span>
              </h2>
              {searchResults.length > 0 ? (
                <CategoryTab
                  category={{
                    id: "search-results",
                    name: "תוצאות חיפוש",
                    items: searchResults,
                  }}
                  cart={cart}
                  addToCart={addToCart}
                />
              ) : (
                <div className="text-center text-muted-foreground py-12 bg-muted/50 rounded-lg border border-dashed">
                  <p className="mb-2">לא נמצאו פריטים התואמים לחיפוש.</p>
                  <Button variant="outline" size="sm" onClick={clearSearch}>
                    נקה חיפוש
                  </Button>
                </div>
              )}
            </div>
          ) : (
            // תצוגת קטגוריות רציפה עם Tabs
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* לשוניות קטגוריות */}
              <div className="category-tabs">
                <div className="overflow-x-auto pb-2">
                  <TabsList className="flex flex-nowrap h-auto mb-4 w-max min-w-full bg-muted/50 p-1">
                    {equipmentCategories.map((category) => (
                      <TabsTrigger
                        key={category.id}
                        value={category.id}
                        onClick={() => scrollToCategory(category.id)}
                        className="mb-1 text-xs sm:text-sm whitespace-nowrap tab-highlight transition-all"
                        data-tab-value={category.id}
                      >
                        {category.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              </div>

              {/* מיכל הגלילה */}
              <div
                ref={scrollContainerRef}
                className="smooth-scroll overflow-y-auto max-h-[calc(100vh-200px)] scroll-container relative"
                style={{ scrollbarWidth: "thin", scrollbarColor: "var(--primary) var(--secondary)" }}
              >
                {/* תצוגת כל הקטגוריות ברצף */}
                {equipmentCategories.map((category) => (
                  <div
                    key={category.id}
                    ref={(el) => (categoryRefs.current[category.id] = el)}
                    data-category-id={category.id}
                    className={`scroll-mt-32 category-section ${activeTab === category.id ? "active-category" : ""}`}
                    id={`category-${category.id}`}
                  >
                    <h2 className="text-xl font-semibold mb-4 gradient-text category-title">{category.name}</h2>
                    <CategoryTab category={category} cart={cart} addToCart={addToCart} />
                  </div>
                ))}

                {/* כפתור חזרה למעלה */}
                <button
                  id="scroll-top-button"
                  onClick={scrollToTop}
                  className="scroll-top-button"
                  title="חזרה לתחילת הרשימה"
                  aria-label="חזרה לתחילת הרשימה"
                >
                  <span className="scroll-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 19V5M5 12l7-7 7 7" />
                    </svg>
                  </span>
                </button>
              </div>

              {/* TabsContent נסתר לצורך תאימות עם רכיב Tabs */}
              <div className="hidden">
                {equipmentCategories.map((category) => (
                  <TabsContent key={category.id} value={category.id}>
                    {/* תוכן ריק - רק לצורך תאימות */}
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          )}
        </div>

        <div className="order-first lg:order-last mb-4 lg:mb-0">
          <Cart items={cart} updateItem={updateCartItem} removeItem={removeFromCart} />
        </div>
      </div>
    </div>
  )
}
