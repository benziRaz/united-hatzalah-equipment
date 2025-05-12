"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { EquipmentCategory, CartItem } from "@/lib/equipment-data"
import { PlusCircle, MinusCircle, ShoppingCart, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface CategoryTabProps {
  category: EquipmentCategory
  cart: CartItem[]
  addToCart: (item: CartItem) => void
}

export function CategoryTab({ category, cart, addToCart }: CategoryTabProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [reasons, setReasons] = useState<Record<string, string>>({})
  const [sizes, setSizes] = useState<Record<string, string>>({})
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({})

  const getItemQuantityInCart = (itemId: string): number => {
    const cartItem = cart.find((item) => item.id === itemId)
    return cartItem ? cartItem.quantity : 0
  }

  const handleQuantityChange = (itemId: string, change: number) => {
    const item = category.items.find((item) => item.id === itemId)
    if (!item) return

    const currentQuantity = quantities[itemId] || 0
    const cartQuantity = getItemQuantityInCart(itemId)
    const totalQuantity = currentQuantity + cartQuantity

    // אם זו לחיצה על פלוס והכמות המבוקשת תקינה, הוסף ישירות לסל
    if (change > 0 && totalQuantity < item.maxQuantity) {
      // בדוק אם יש דרישות נוספות שצריך למלא
      if ((item.requiresReason && !reasons[itemId]) || (item.requiresSize && !sizes[itemId])) {
        // אם יש דרישות שלא מולאו, רק הגדל את הכמות בתיבה
        let newQuantity = currentQuantity + change
        if (newQuantity < 0) newQuantity = 0
        if (totalQuantity + change > item.maxQuantity) {
          newQuantity = item.maxQuantity - cartQuantity
          if (newQuantity < 0) newQuantity = 0
        }

        setQuantities({
          ...quantities,
          [itemId]: newQuantity,
        })
      } else {
        // אם כל הדרישות מולאו, הוסף ישירות לסל
        const cartItem: CartItem = {
          ...item,
          quantity: 1, // מוסיף יחידה אחת בכל לחיצה
          reason: reasons[itemId],
          size: sizes[itemId],
        }

        addToCart(cartItem)

        // הצג אנימציית הוספה
        setAddedItems({
          ...addedItems,
          [itemId]: true,
        })

        // איפוס אנימציה אחרי השהייה
        setTimeout(() => {
          setAddedItems({
            ...addedItems,
            [itemId]: false,
          })
        }, 1500)
      }
    } else {
      // אם זו לחיצה על מינוס, רק עדכן את הכמות בתיבה
      let newQuantity = currentQuantity + change
      if (newQuantity < 0) newQuantity = 0
      if (totalQuantity + change > item.maxQuantity) {
        newQuantity = item.maxQuantity - cartQuantity
        if (newQuantity < 0) newQuantity = 0
      }

      setQuantities({
        ...quantities,
        [itemId]: newQuantity,
      })
    }
  }

  const handleReasonChange = (itemId: string, reason: string) => {
    setReasons({
      ...reasons,
      [itemId]: reason,
    })
  }

  const handleSizeChange = (itemId: string, size: string) => {
    setSizes({
      ...sizes,
      [itemId]: size,
    })
  }

  const handleAddToCart = (itemId: string) => {
    const item = category.items.find((item) => item.id === itemId)
    if (!item) return

    const quantity = quantities[itemId] || 0
    if (quantity <= 0) return

    const cartItem: CartItem = {
      ...item,
      quantity,
      reason: reasons[itemId],
      size: sizes[itemId],
    }

    addToCart(cartItem)

    // Show added animation
    setAddedItems({
      ...addedItems,
      [itemId]: true,
    })

    // Reset animation after delay
    setTimeout(() => {
      setAddedItems({
        ...addedItems,
        [itemId]: false,
      })
    }, 1500)

    // Reset quantity after adding to cart
    setQuantities({
      ...quantities,
      [itemId]: 0,
    })
  }

  const isAddButtonDisabled = (itemId: string) => {
    const quantity = quantities[itemId] || 0
    const item = category.items.find((item) => item.id === itemId)

    if (!item) return true
    if (quantity <= 0) return true

    // Check if reason is required but missing
    if (item.requiresReason && !reasons[itemId]) return true

    // Check if size is required but missing
    if (item.requiresSize && !sizes[itemId]) return true

    return false
  }

  return (
    <div className="space-y-4">
      {category.items.map((item, index) => {
        const cartQuantity = getItemQuantityInCart(item.id)
        const currentQuantity = quantities[item.id] || 0
        const remainingQuantity = item.maxQuantity - cartQuantity
        const isAdded = addedItems[item.id]

        return (
          <Card
            key={item.id}
            className={`card-hover overflow-hidden transition-all duration-300 ${
              isAdded ? "border-primary/50 bg-primary/5" : ""
            }`}
            style={{
              animationDelay: `${index * 0.05}s`,
              animationFillMode: "both",
            }}
          >
            <CardContent className="p-4">
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm sm:text-base">{item.name}</h3>
                    {item.requiresApproval && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <AlertCircle className="h-4 w-4 text-amber-500" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>דורש אישור מיוחד</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  <Badge variant="outline" className="bg-secondary/50">
                    מקסימום: {item.maxQuantity}
                  </Badge>
                </div>

                {cartQuantity > 0 && (
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-primary animate-fade-in">
                    <ShoppingCart className="h-3.5 w-3.5" />
                    <span>בסל: {cartQuantity}</span>
                    <span className="text-muted-foreground">|</span>
                    <span>נותר: {remainingQuantity}</span>
                  </div>
                )}

                {item.requiresReason && (
                  <div className="mt-1 animate-fade-in">
                    <Label htmlFor={`reason-${item.id}`} className="text-xs sm:text-sm">
                      סיבת החלפה/בקשה
                    </Label>
                    <Textarea
                      id={`reason-${item.id}`}
                      value={reasons[item.id] || ""}
                      onChange={(e) => handleReasonChange(item.id, e.target.value)}
                      className="mt-1 text-sm resize-none"
                      rows={2}
                    />
                  </div>
                )}

                {item.requiresSize && (
                  <div className="mt-1 animate-fade-in">
                    <Label htmlFor={`size-${item.id}`} className="text-xs sm:text-sm">
                      מידה
                    </Label>
                    <Select value={sizes[item.id] || ""} onValueChange={(value) => handleSizeChange(item.id, value)}>
                      <SelectTrigger id={`size-${item.id}`} className="text-sm">
                        <SelectValue placeholder="בחר מידה" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="S">S</SelectItem>
                        <SelectItem value="M">M</SelectItem>
                        <SelectItem value="L">L</SelectItem>
                        <SelectItem value="XL">XL</SelectItem>
                        <SelectItem value="XXL">XXL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(item.id, -1)}
                    disabled={currentQuantity <= 0}
                    className="h-8 w-8 rounded-full"
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>

                  <Input
                    type="number"
                    min="0"
                    max={remainingQuantity}
                    value={currentQuantity}
                    onChange={(e) => {
                      const value = Number.parseInt(e.target.value) || 0
                      setQuantities({
                        ...quantities,
                        [item.id]: Math.min(value, remainingQuantity),
                      })
                    }}
                    className="w-14 text-center h-8 text-sm"
                  />

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(item.id, 1)}
                    disabled={currentQuantity >= remainingQuantity}
                    className="h-8 w-8 rounded-full"
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>

                  <Button
                    onClick={() => handleAddToCart(item.id)}
                    disabled={isAddButtonDisabled(item.id)}
                    size="sm"
                    className={`text-xs sm:text-sm transition-all ${isAdded ? "bg-green-600 hover:bg-green-700" : ""}`}
                  >
                    {isAdded ? "נוסף לסל" : "הוסף"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
