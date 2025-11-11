"use client"

import React, { useState } from "react"
import FlightBookingModal from "./flight-booking-modal"

type Flight = {
  id: string
  airline: string
  depart: string
  arrive: string
  duration: string
  price: string
  stops: string
}

const MOCK_FLIGHTS: Flight[] = [
  { id: 'f1', airline: 'Air India Express', depart: '10:30 New Delhi', arrive: '20:10 Bengaluru', duration: '09h 40m', price: '₹ 5,672', stops: '1 stop' },
  { id: 'f2', airline: 'Akasa Air', depart: '22:45 New Delhi', arrive: '01:40 Bengaluru', duration: '02h 55m', price: '₹ 6,828', stops: 'Non stop' },
  { id: 'f3', airline: 'IndiGo', depart: '14:15 New Delhi', arrive: '16:55 Bengaluru', duration: '02h 40m', price: '₹ 6,849', stops: 'Non stop' },
  { id: 'f4', airline: 'SpiceJet', depart: '22:00 New Delhi', arrive: '00:50 Bengaluru', duration: '02h 50m', price: '₹ 6,883', stops: 'Non stop' },
  { id: 'f5', airline: 'Akasa Air', depart: '14:50 New Delhi', arrive: '17:45 Bengaluru', duration: '02h 55m', price: '₹ 7,018', stops: 'Non stop' },
]

export default function FlightResultsClient() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)

  return (
    <>
      <div className="space-y-3">
                {MOCK_FLIGHTS.map(f => (
          <div key={f.id} className="flex items-center justify-between border rounded bg-white p-4">
            <div>
              <div className="font-medium">{f.airline}</div>
              <div className="text-sm text-muted-foreground">{f.depart} • {f.duration} • {f.arrive} • {f.stops}</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">{f.price}</div>
                      <div className="mt-2">
                <button
                  onClick={() => { setSelectedFlight(f); setModalOpen(true); }}
                  className="px-4 py-2 border rounded bg-orange-500 text-white"
                >
                  Book
                </button>
                      </div>
            </div>
          </div>
        ))}
      </div>

      <FlightBookingModal
        flight={selectedFlight}
        open={modalOpen}
        onOpenChangeAction={(v) => { setModalOpen(v); if(!v) setSelectedFlight(null); }}
        onBookedAction={() => console.log('flight booked')}
      />
    </>
  )
}
