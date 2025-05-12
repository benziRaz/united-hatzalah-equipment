"use client"

import { useState, useEffect, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

  // Track the last added/updated/removed item for toast notifications
  const [lastCartAction, setLastCartAction] = useState<{
    type: 'add' | 'update' | 'remove' | 'load'
    item?: CartItem
    items?: CartItem[]
  } | null>(null)

  // Handle toast notifications after cart changes
  useEffect(() => {
    if (!lastCartAction) return

    switch (lastCartAction.type) {
      case 'add':
        if (lastCartAction.item) {
          toast({
            title: "פריט נוסף לסל",
            description: `${lastCartAction.item.name}: ${lastCartAction.item.quantity} יחידות`,
            variant: "default",
            action: <ToastAction altText="הצג סל">הצג סל</ToastAction>,
          })
        }
        break
      case 'update':
        if (lastCartAction.item) {
          toast({
            title: "הכמות עודכנה",
            description: `${lastCartAction.item.name}: ${lastCartAction.item.quantity} יחידות`,
            variant: "default",
          })
        }
        break
      case 'remove':
        if (lastCartAction.item) {
          toast({
            title: "פריט הוסר מהסל",
            description: `${lastCartAction.item.name} הוסר מהסל`,
            variant: "destructive",
          })
        }
        break
      case 'load':
        if (lastCartAction.items) {
          toast({
            title: "טיוטה נטענה",
            description: `${lastCartAction.items.length} פריטים נטענו מהטיוטה`,
            variant: "default",
          })
        }
        break
    }
  }, [lastCartAction])

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((cartItem) => cartItem.id === item.id)

      if (existingItemIndex >= 0) {
        const newCart = [...prevCart]
        newCart[existingItemIndex] = item
        setLastCartAction({ type: 'update', item })
        return newCart
      } else {
        setLastCartAction({ type: 'add', item })
        return [...prevCart, item]
      }
    })
  }

  const removeFromCart = (itemId: string) => {
    const itemToRemove = cart.find((item) => item.id === itemId)
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId))
    if (itemToRemove) {
      setLastCartAction({ type: 'remove', item: itemToRemove })
    }
  }

  const updateCartItem = (updatedItem: CartItem) => {
    setCart((prevCart) => prevCart.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
    setLastCartAction({ type: 'update', item: updatedItem })
  }

  const loadDraft = (items: CartItem[]) => {
    setCart(items)
    setLastCartAction({ type: 'load', items })
  }

  const searchItems = (query: string) => {
    if (!query.trim()) {
      setIsSearching(false)
      setSearchResults([])
      return
    }

    setIsSearching(true)
    const normalizedQuery = query.trim().toLowerCase()

    const results: EquipmentItem[] = []
    equipmentCategories.forEach((category) => {
      const categoryResults = category.items.filter((item) => item.name.toLowerCase().includes(normalizedQuery))
      results.push(...categoryResults)
    })

    setSearchResults(results)
  }

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

  return (
    <div>
      <DraftManager items={cart} loadDraft={loadDraft} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearSearch}
                  >
                    נקה חיפוש
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="category-tabs">
                <div className="overflow-x-auto pb-2">
                  <TabsList className="flex flex-nowrap h-auto mb-4 w-max min-w-full bg-muted/50 p-1">
                    {equipmentCategories.map((category) => (
                      <TabsTrigger
                        key={category.id}
                        value={category.id}
                        className="mb-1 text-xs sm:text-sm whitespace-nowrap tab-highlight transition-all"
                      >
                        {category.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              </div>

              {equipmentCategories.map((category) => (
                <TabsContent key={category.id} value={category.id} className="animate-fade-in">
                  <CategoryTab category={category} cart={cart} addToCart={addToCart} />
                </TabsContent>
              ))}
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