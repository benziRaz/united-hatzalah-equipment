import { Header } from "@/components/header"
import { VolunteerForm } from "@/components/volunteer-form"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Header />
        <div className="mt-4 sm:mt-6 md:mt-8">
          <VolunteerForm />
        </div>
        <Footer />
      </div>
    </main>
  )
}
