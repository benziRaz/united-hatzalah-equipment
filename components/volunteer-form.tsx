"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { UserRoundIcon, ArrowRightIcon } from "lucide-react"

export function VolunteerForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    volunteerId: "",
  })

  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    volunteerId: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: false,
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {
      firstName: !formData.firstName.trim(),
      lastName: !formData.lastName.trim(),
      volunteerId: !formData.volunteerId.trim(),
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some(Boolean)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      // Store volunteer data in session storage
      sessionStorage.setItem("volunteerData", JSON.stringify(formData))

      // Navigate to equipment selection page
      router.push("/equipment")
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto glass-effect animate-fade-in card-hover">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse-slow">
            <UserRoundIcon className="h-8 w-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-xl sm:text-2xl text-center gradient-text">פרטי מתנדב</CardTitle>
        <CardDescription className="text-center">אנא הזן את פרטיך האישיים להזמנת ציוד</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">שם פרטי</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`transition-all ${errors.firstName ? "border-destructive shadow-sm shadow-destructive/10" : "focus:border-primary/50"}`}
              placeholder="הכנס שם פרטי"
            />
            {errors.firstName && <p className="text-destructive text-sm">שדה חובה</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">שם משפחה</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`transition-all ${errors.lastName ? "border-destructive shadow-sm shadow-destructive/10" : "focus:border-primary/50"}`}
              placeholder="הכנס שם משפחה"
            />
            {errors.lastName && <p className="text-destructive text-sm">שדה חובה</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="volunteerId">קוד כונן</Label>
            <Input
              id="volunteerId"
              name="volunteerId"
              value={formData.volunteerId}
              onChange={handleChange}
              className={`transition-all ${errors.volunteerId ? "border-destructive shadow-sm shadow-destructive/10" : "focus:border-primary/50"}`}
              placeholder="הכנס קוד כונן"
            />
            {errors.volunteerId && <p className="text-destructive text-sm">שדה חובה</p>}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full group relative overflow-hidden" size="lg">
            <span className="flex items-center gap-2 transition-transform group-hover:translate-x-2">
              המשך להזמנת ציוד
              <ArrowRightIcon className="h-4 w-4" />
            </span>
            <span className="absolute inset-0 bg-primary/10 transform translate-y-full group-hover:translate-y-0 transition-transform"></span>
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
