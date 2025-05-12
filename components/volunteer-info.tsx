"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { UserRoundIcon, CalendarIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface VolunteerData {
  firstName: string
  lastName: string
  volunteerId: string
}

export function VolunteerInfo() {
  const router = useRouter()
  const [volunteerData, setVolunteerData] = useState<VolunteerData | null>(null)

  useEffect(() => {
    // Get volunteer data from session storage
    const storedData = sessionStorage.getItem("volunteerData")

    if (storedData) {
      setVolunteerData(JSON.parse(storedData))
    } else {
      // Redirect to home if no data
      router.push("/")
    }
  }, [router])

  if (!volunteerData) {
    return null
  }

  return (
    <Card className="glass-effect animate-fade-in">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <UserRoundIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold gradient-text">פרטי מתנדב</h2>
              <p className="text-muted-foreground">
                {volunteerData.firstName} {volunteerData.lastName} |
                <Badge variant="outline" className="mr-1 bg-primary/5">
                  קוד כונן: {volunteerData.volunteerId}
                </Badge>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            {new Date().toLocaleDateString("he-IL")}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
