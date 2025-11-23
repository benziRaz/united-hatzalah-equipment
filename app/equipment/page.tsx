import { Header } from "@/components/header"
import { EquipmentSelector } from "@/components/equipment-selector"
import { VolunteerInfo } from "@/components/volunteer-info"
import { Footer } from "@/components/footer"
import { OfflineIndicator } from "@/components/offline-indicator"

export default function EquipmentPage() {
  return (
    <main className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8">
      <OfflineIndicator />
      <div className="max-w-6xl mx-auto">
        <Header />
        <div className="mt-2 sm:mt-4">
          <VolunteerInfo />
        </div>
        <div className="mt-4 sm:mt-6 md:mt-8">
          <EquipmentSelector />
        </div>
        <Footer />
      </div>
    </main>
  )
}
