"use client"

import React, { useState } from 'react'
import BusBookingModal from './bus-booking-modal'
import BusSearchPanel from './bus-search-panel'

type Bus = {
  id: string
  operator: string
  depart: string
  arrive: string
  duration: string
  price: string
  seats: string
}

const MOCK_BUSES: Bus[] = [
  { id: 'b1', operator: 'Sunil Tour and Travels', depart: '21:30 Mumbai', arrive: '07:00 Basti', duration: '09h 30m', price: '₹ 2,210', seats: '8 seats' },
  { id: 'b2', operator: 'Betrawati Travels', depart: '21:25 Mumbai', arrive: '08:30 Basti', duration: '11h 05m', price: '₹ 3,199', seats: '4 seats' },
  { id: 'b3', operator: 'Hans Travels', depart: '21:30 Mumbai', arrive: '12:10 Basti', duration: '14h 40m', price: '₹ 3,100', seats: '9 seats' },
]

export default function BusResultsClient() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null)
  const [sort, setSort] = useState<'best'|'price'|'duration'>('best')
  const [searchOpen, setSearchOpen] = useState(false)
  const [from, setFrom] = useState('Mumbai')
  const [to, setTo] = useState('Basti')
  const [date, setDate] = useState(() => {
    // default display date (human readable)
    return '2025-11-14'
  })

  return (
  <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Bus Results</h1>
        <p className="text-sm text-muted-foreground mt-1">Mumbai → Basti • 11 Nov 2025</p>

        {/* Promotional banner similar to Goibibo */}
        <div className="mt-4">
          <div className="bg-white border rounded shadow-sm overflow-hidden">
            <img src="/images/bus-promo.svg" alt="Go Deals" className="w-full h-36 object-cover" />
          </div>
        </div>
        
        {/* Top blue search bar (moved from bottom) */}
        <div className="mt-6">
          <div
            onClick={() => setSearchOpen(true)}
            className="w-full bg-blue-600 rounded-lg shadow-lg p-3 flex items-center justify-between text-white cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="text-sm">FROM</div>
              <div className="bg-white text-blue-700 rounded px-4 py-2">{from}</div>
              <div className="text-sm">TO</div>
              <div className="bg-white text-blue-700 rounded px-4 py-2">{to}</div>
              <div className="text-sm">DEPARTURE DATE</div>
              <div className="bg-white text-blue-700 rounded px-4 py-2">{new Date(date).toLocaleDateString()}</div>
            </div>

            <div>
              <button onClick={(e) => { e.stopPropagation(); setSearchOpen(true) }} className="bg-white text-blue-700 px-4 py-2 rounded font-medium">UPDATE SEARCH</button>
            </div>
          </div>

          {searchOpen && (
            <BusSearchPanel
              initialFrom={from}
              initialTo={to}
              initialDate={date}
              onClose={() => setSearchOpen(false)}
              onApply={(nf, nt, nd) => {
                setFrom(nf)
                setTo(nt)
                setDate(nd)
                setSearchOpen(false)
                // TODO: trigger search/filtering with new params
              }}
            />
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
  {/* Filters / Left column */}
  <aside className="lg:col-span-1 bg-white border border-pink-200 rounded p-4 sticky top-24">
          <h3 className="text-lg font-medium mb-3">Filters</h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-muted-foreground">Bus Type</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button className="px-2 py-1 border rounded text-sm">AC</button>
                <button className="px-2 py-1 border rounded text-sm">Non-AC</button>
              </div>
            </div>

            <div>
              <label className="block text-xs text-muted-foreground">Departure</label>
              <div className="mt-2 text-sm">Anytime</div>
            </div>

            <div>
              <label className="block text-xs text-muted-foreground">Seats</label>
              <div className="mt-2 text-sm">Showing available seats</div>
            </div>
          </div>
        </aside>

        {/* Results list (Goibibo style) */}
        <section className="lg:col-span-3 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">Showing {MOCK_BUSES.length} buses</div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground mr-2">Sort by</div>
              <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="border rounded px-2 py-1 text-sm">
                <option value="best">BEST</option>
                <option value="price">PRICE</option>
                <option value="duration">DURATION</option>
              </select>
            </div>
          </div>

              <div className="space-y-4">
            {MOCK_BUSES.map((b) => (
              <article key={b.id} className="bg-white border border-pink-200 rounded p-4 shadow-sm hover:shadow-md">
                <div className="flex items-start justify-between">
                  {/* left: operator and details */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-20 h-20 bg-slate-50 rounded flex items-center justify-center text-xs text-muted-foreground">Logo</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-lg">{b.operator}</div>
                          <div className="text-sm text-muted-foreground mt-1">{b.depart} • {b.duration} • {b.arrive}</div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-xl font-bold">{b.price}</div>
                          <div className="text-sm text-muted-foreground">Taxes included</div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded">3.8</div>
                          <div className="text-sm text-muted-foreground">4 Ratings</div>
                          <div className="text-sm text-muted-foreground">• {b.seats}</div>
                        </div>

                        <div className="text-sm">
                          <button className="text-blue-600 underline mr-4">Boarding & Dropping Points</button>
                          <button className="text-blue-600 underline">Amenities, Policies & Bus Details</button>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Live Tracking</div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => { setSelectedBus(b); setModalOpen(true) }}
                      className="px-4 py-2 bg-orange-500 text-white rounded shadow hover:opacity-95 w-36"
                    >
                      SELECT SEAT
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* previously-sticky bottom bar removed (moved to top) */}
        </section>
      </div>

      <BusBookingModal
        bus={selectedBus}
        open={modalOpen}
        onOpenChangeAction={(v) => { setModalOpen(v); if (!v) setSelectedBus(null) }}
        onBookedAction={() => console.log('bus booked')}
      />
    </div>
  )
}
