import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import BusBookingFull from '@/components/bus-booking-full'

export default function BusBookingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <BusBookingFull />
      </main>
      <Footer />
    </div>
  )
}
