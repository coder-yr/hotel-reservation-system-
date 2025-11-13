"use client";
import { useState, useEffect, useMemo } from 'react';

type Bus = {
  id: string;
  number: string;
  route: string;
  seats: number;
  operator?: string;
  departureTime?: string;
  arrivalTime?: string;
  amenities?: string[];
};

type BusBooking = {
  id: string;
  passengerInfo?: { name?: string };
  seats: string[] | string;
};
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function AdminBusesPage() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [bookings, setBookings] = useState<BusBooking[]>([]);
  const [form, setForm] = useState<{ number: string; route: string; seats: string; operator: string; departureTime: string; arrivalTime: string; amenities: string }>({ number: '', route: '', seats: '', operator: '', departureTime: '', arrivalTime: '', amenities: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchBuses = async () => {
      const snapshot = await getDocs(collection(db, 'buses'));
      setBuses(snapshot.docs.map(doc => {
        const data: any = doc.data();
        const amenities: string[] = Array.isArray(data.amenities)
          ? data.amenities
          : typeof data.amenities === 'string' && data.amenities.trim()
          ? data.amenities.split(',').map((s: string) => s.trim())
          : [];
        return {
          id: doc.id,
          number: data.number || '',
          route: data.route || '',
          seats: typeof data.seats === 'number' ? data.seats : Number(data.seats || 0),
          operator: data.operator || '',
          departureTime: data.departureTime || '',
          arrivalTime: data.arrivalTime || '',
          amenities,
        } as Bus;
      }));
      setLoading(false);
    };
    fetchBuses();
  }, []);

  const filteredBuses = useMemo(() => {
    const s = search.toLowerCase().trim();
    if (!s) return buses;
    return buses.filter(b => [b.number, b.route, b.operator].filter(Boolean).some(v => String(v).toLowerCase().includes(s)));
  }, [buses, search]);

  const handleAddBus = async () => {
    if (!form.number || !form.route || !form.seats) return;
    const docRef = await addDoc(collection(db, 'buses'), {
      number: form.number,
      route: form.route,
      seats: Number(form.seats),
      operator: form.operator,
      departureTime: form.departureTime,
      arrivalTime: form.arrivalTime,
      amenities: form.amenities
    });
    setBuses([...buses, {
      id: docRef.id,
      number: form.number,
      route: form.route,
      seats: Number(form.seats),
      operator: form.operator,
      departureTime: form.departureTime,
      arrivalTime: form.arrivalTime,
      amenities: form.amenities ? form.amenities.split(',').map(s => s.trim()).filter(Boolean) : [],
    }]);
    setForm({ number: '', route: '', seats: '', operator: '', departureTime: '', arrivalTime: '', amenities: '' });
  };

  const handleEditBus = async (bus: Bus) => {
    setForm({
      number: bus.number,
      route: bus.route,
      seats: String(bus.seats ?? ''),
      operator: bus.operator || '',
      departureTime: bus.departureTime || '',
      arrivalTime: bus.arrivalTime || '',
      amenities: (bus.amenities || []).join(', '),
    });
    setEditId(bus.id);
  };

  const handleUpdateBus = async () => {
    if (!editId) return;
    await updateDoc(doc(db, 'buses', editId), {
      number: form.number,
      route: form.route,
      seats: Number(form.seats),
      operator: form.operator,
      departureTime: form.departureTime,
      arrivalTime: form.arrivalTime,
      amenities: form.amenities
    });
    setBuses(buses.map(b => b.id === editId ? {
      ...b,
      number: form.number,
      route: form.route,
      seats: Number(form.seats),
      operator: form.operator,
      departureTime: form.departureTime,
      arrivalTime: form.arrivalTime,
      amenities: form.amenities ? form.amenities.split(',').map(s => s.trim()).filter(Boolean) : [],
    } : b));
    setForm({ number: '', route: '', seats: '', operator: '', departureTime: '', arrivalTime: '', amenities: '' });
    setEditId(null);
  };

  const handleDeleteBus = async (busId: string) => {
    await deleteDoc(doc(db, 'buses', busId));
    setBuses(buses.filter(b => b.id !== busId));
  };

  const handleViewBookings = async (busId: string) => {
    const bus = buses.find(b => b.id === busId) || null;
    setSelectedBus(bus);
    setModalOpen(true);
    const bookingsQuery = query(collection(db, 'bus_bookings'), where('busId', '==', busId));
    const snapshot = await getDocs(bookingsQuery);
    setBookings(snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        passengerInfo: data.passengerInfo,
        seats: data.seats || [],
      } as BusBooking;
    }));
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Admin Bus Management</h1>
      {/* Form */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <input type="text" placeholder="Bus Number" value={form.number} onChange={e => setForm(f => ({ ...f, number: e.target.value }))} className="border rounded px-3 py-2" />
        <input type="text" placeholder="Route" value={form.route} onChange={e => setForm(f => ({ ...f, route: e.target.value }))} className="border rounded px-3 py-2" />
        <input type="number" placeholder="Seats" value={form.seats} onChange={e => setForm(f => ({ ...f, seats: e.target.value }))} className="border rounded px-3 py-2" />
        <input type="text" placeholder="Operator" value={form.operator} onChange={e => setForm(f => ({ ...f, operator: e.target.value }))} className="border rounded px-3 py-2" />
        <input type="time" placeholder="Departure" value={form.departureTime} onChange={e => setForm(f => ({ ...f, departureTime: e.target.value }))} className="border rounded px-3 py-2" />
        <input type="time" placeholder="Arrival" value={form.arrivalTime} onChange={e => setForm(f => ({ ...f, arrivalTime: e.target.value }))} className="border rounded px-3 py-2" />
        <input type="text" placeholder="Amenities (CSV)" value={form.amenities} onChange={e => setForm(f => ({ ...f, amenities: e.target.value }))} className="border rounded px-3 py-2 md:col-span-3" />
        <div className="flex items-center gap-2">
          <Button onClick={editId ? handleUpdateBus : handleAddBus}>{editId ? 'Update Bus' : 'Add Bus'}</Button>
          {editId && (
            <Button variant="outline" onClick={() => { setEditId(null); setForm({ number: '', route: '', seats: '', operator: '', departureTime: '', arrivalTime: '', amenities: '' }); }}>Cancel</Button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 flex items-center gap-3">
        <input type="text" placeholder="Search by number, route, operator" value={search} onChange={e => setSearch(e.target.value)} className="border rounded px-3 py-2 w-full md:w-96" />
      </div>

      {/* Card list */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBuses.map(bus => (
            <div key={bus.id} className="border rounded-lg p-4 shadow-sm bg-white">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-xl font-semibold">{bus.number || 'Untitled Bus'}</h2>
                  <p className="text-sm text-gray-600">{bus.operator || '—'} • {bus.route || '—'}</p>
                </div>
                <span className="text-sm bg-gray-100 px-2 py-1 rounded">{bus.seats} seats</span>
              </div>
              <div className="text-sm text-gray-700 mb-3">
                <div>Departure: {bus.departureTime || '—'} • Arrival: {bus.arrivalTime || '—'}</div>
                {bus.amenities && bus.amenities.length > 0 && (
                  <div className="mt-1">Amenities: {bus.amenities.join(', ')}</div>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleEditBus(bus)}>Edit</Button>
                <Button variant="outline" onClick={() => handleViewBookings(bus.id)}>View Bookings</Button>
                <Button variant="destructive" onClick={() => handleDeleteBus(bus.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bookings for Bus {selectedBus?.number}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {bookings.length === 0 ? (
              <div>No bookings found for this bus.</div>
            ) : (
              <table className="min-w-full border">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Booking ID</th>
                    <th className="border px-4 py-2">Passenger Name</th>
                    <th className="border px-4 py-2">Seats</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id}>
                      <td className="border px-4 py-2">{b.id}</td>
                      <td className="border px-4 py-2">{b.passengerInfo?.name}</td>
                      <td className="border px-4 py-2">{Array.isArray(b.seats) ? b.seats.join(', ') : b.seats}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
