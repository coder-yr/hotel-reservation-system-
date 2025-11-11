import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import BusResultsClient from '@/components/bus-results-client'

export default function BusPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <BusResultsClient />
      </main>
      <Footer />
    </div>
  )
}
