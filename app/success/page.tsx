import { Header } from "@/components/header"
import { SuccessMessage } from "@/components/success-message"
import { Footer } from "@/components/footer"

export default function SuccessPage() {
  return (
    <main className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Header />
        <div className="mt-4 sm:mt-6 md:mt-8">
          <SuccessMessage />
        </div>
        <Footer />
      </div>
    </main>
  )
}
