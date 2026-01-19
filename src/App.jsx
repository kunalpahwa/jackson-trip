import { useState, useEffect } from 'react';

const SUPABASE_URL = 'https://ocxbuqbwwsymxspqguxf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jeGJ1cWJ3d3N5bXhzcHFndXhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3OTczODMsImV4cCI6MjA4NDM3MzM4M30.skhs6tUZMwrtMREePmaEndeN6-QJlUFY7uvfDz8k3hM';

const saveData = async (data) => {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/trips?id=eq.jackson-2026`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ data, updated_at: new Date().toISOString() })
    });
  } catch (e) { console.error('Save failed:', e); }
};

const loadData = async () => {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/trips?id=eq.jackson-2026&select=data`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    const rows = await res.json();
    return rows[0]?.data || null;
  } catch (e) { return null; }
};

const generateId = () => Math.random().toString(36).substr(2, 9);


// Phone formatting helper
const formatPhone = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
};

const AIRLINES = [
  { code: 'AS', name: 'Alaska Airlines' }, { code: 'AA', name: 'American Airlines' },
  { code: 'DL', name: 'Delta Air Lines' }, { code: 'F9', name: 'Frontier Airlines' },
  { code: 'B6', name: 'JetBlue Airways' }, { code: 'WN', name: 'Southwest Airlines' },
  { code: 'NK', name: 'Spirit Airlines' }, { code: 'UA', name: 'United Airlines' },
  { code: 'OTHER', name: 'Other' }
];

const TIME_OPTIONS = [];
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 30) {
    const hour = h % 12 || 12, ampm = h < 12 ? 'AM' : 'PM', minute = m.toString().padStart(2, '0');
    TIME_OPTIONS.push({ display: `${hour}:${minute} ${ampm}`, value: `${h.toString().padStart(2, '0')}:${minute}` });
  }
}

const HOUSING = [
  { id: 'grand-view-3110', name: 'Grand View 3110', address: '531 Snow King Loop, Unit 3110, Jackson, WY 83001', code: '', parkingSpot: '', websiteUrl: '', notes: '' },
  { id: 'grand-view-2710', name: 'Grand View 2710', address: '527 Snow King Loop, Unit 2710, Jackson, WY 83001', code: '', parkingSpot: '', websiteUrl: '', notes: '' }
];

// Mountain info with snow reports, trail maps, hours, location
const DEFAULT_LOCATIONS = [
  { id: 'jackson', name: 'Jackson Hole', snowUrl: 'https://www.onthesnow.com/wyoming/jackson-hole/skireport', trailMapUrl: '', hours: '', mapsUrl: '', siteUrl: '', webcams: [] },
  { id: 'targhee', name: 'Grand Targhee', snowUrl: 'https://www.onthesnow.com/wyoming/grand-targhee-resort/skireport', trailMapUrl: '', hours: '', mapsUrl: '', siteUrl: '', webcams: [] }
];

const SPOT_CATEGORIES = ['Coffee', 'Food', 'Groceries', 'Alcohol', 'Gear', 'Events', 'Other'];

const defaultTrip = { 
  name: "Jackson Hole 2026", 
  dates: "Jan 22-26, 2026", 
  people: [], 
  housing: HOUSING, 
  sharedInfo: { meetingSpot: "", meetingDate: "", meetingTime: "", mapsUrl: "", notes: "" },
  weatherLocations: DEFAULT_LOCATIONS,
  vehicles: [],
  localSpots: []
};

const MountainCard = ({ mountain }) => (
  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
    <div className="flex items-center gap-3 mb-3">
      <span className="text-2xl">⛷️</span>
      <div>
        <div className="text-white font-bold">{mountain.name}</div>
        {mountain.hours && <div className="text-sm text-gray-400">🕐 {mountain.hours}</div>}
      </div>
    </div>
    <div className="flex flex-wrap gap-2">
      {mountain.siteUrl && (
        <a href={mountain.siteUrl} target="_blank" rel="noopener noreferrer" className="bg-purple-600 hover:bg-purple-500 text-white text-sm px-3 py-1 rounded">
          🏠 Main Site
        </a>
      )}
      {mountain.snowUrl && (
        <a href={mountain.snowUrl} target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-3 py-1 rounded">
          ❄️ Snow Report
        </a>
      )}
      {mountain.trailMapUrl && (
        <a href={mountain.trailMapUrl} target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-500 text-white text-sm px-3 py-1 rounded">
          🗺️ Trail Map
        </a>
      )}
      {mountain.mapsUrl && (
        <a href={mountain.mapsUrl} target="_blank" rel="noopener noreferrer" className="bg-orange-600 hover:bg-orange-500 text-white text-sm px-3 py-1 rounded">
          📍 Directions
        </a>
      )}
    </div>
    {mountain.webcams?.length > 0 && (
      <div className="mt-3 pt-3 border-t border-gray-700">
        <div className="text-xs text-gray-400 mb-2">📹 Webcams</div>
        <div className="flex flex-wrap gap-2">
          {mountain.webcams.map((cam, i) => (
            <a key={i} href={cam.url} target="_blank" rel="noopener noreferrer" className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-3 py-1 rounded">
              {cam.name}
            </a>
          ))}
        </div>
      </div>
    )}
  </div>
);

const formatTime = (v) => { if (!v) return ''; const o = TIME_OPTIONS.find(t => t.value === v); return o ? o.display : v; };
const formatDate = (d) => { if (!d) return ''; return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }); };
const getAirlineName = (code, custom) => { if (code === 'OTHER') return custom || 'Other'; const a = AIRLINES.find(x => x.code === code); return a ? a.name : code; };

// Build Google search URL for flight status
const getFlightSearchUrl = (airline, flightNumber, customAirline) => {
  const airlineName = airline === 'OTHER' ? (customAirline || '') : (AIRLINES.find(a => a.code === airline)?.name || airline);
  const query = `${airlineName} ${flightNumber} flight`.trim();
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
};

const AirlineSelect = ({ value, customValue, onChange, onCustomChange }) => (
  <div className="space-y-2">
    <select value={value || ''} onChange={e => onChange(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white">
      <option value="">Select airline...</option>
      {AIRLINES.map(a => <option key={a.code} value={a.code}>{a.name}</option>)}
    </select>
    {value === 'OTHER' && <input type="text" value={customValue || ''} onChange={e => onCustomChange(e.target.value)} placeholder="Airline name" className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white" />}
  </div>
);

const PhoneInput = ({ value, onChange }) => (
  <input 
    type="tel" 
    value={value || ''} 
    onChange={e => onChange(formatPhone(e.target.value))} 
    placeholder="555-123-4567" 
    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white" 
  />
);

const PersonCard = ({ person, trip, onEdit, onDelete, onCopyLink }) => {
  const housing = trip.housing.find(h => h.id === person.housingId);
  const url = person.slug 
    ? `${window.location.origin}${window.location.pathname}?p=${person.slug}`
    : `${window.location.origin}${window.location.pathname}?person=${person.id}`;
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="text-lg font-bold text-white">{person.name}</div>
          {person.slug && <div className="text-xs text-gray-500">?p={person.slug}</div>}
          {person.contact?.phone && <div className="text-sm text-gray-400">📱 {person.contact.phone}</div>}
          {housing && <div className="text-sm text-blue-400">🏠 {housing.name}</div>}
        </div>
        <div className="flex gap-2">
          <button onClick={() => { navigator.clipboard.writeText(url); onCopyLink(); }} className="text-green-400 text-xs bg-gray-700 px-2 py-1 rounded">📋 Link</button>
          <button onClick={() => onEdit(person)} className="text-blue-400 text-xs">Edit</button>
          <button onClick={() => onDelete(person.id)} className="text-red-400 text-xs">Delete</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-900 rounded p-3">
          <div className="text-xs text-gray-400 mb-1">✈️ IN → JAC</div>
          {person.inbound?.airline ? (<>
            <div className="text-white font-medium">{getAirlineName(person.inbound.airline, person.inbound.customAirline)} {person.inbound.flightNumber}</div>
            <div className="text-sm text-gray-300">{formatDate(person.inbound.date)}</div>
            <div className="text-xs text-gray-500 mt-1">Arrives</div>
            <div className="text-lg text-green-400 font-mono">{formatTime(person.inbound.time)}</div>
            <a 
              href={getFlightSearchUrl(person.inbound.airline, person.inbound.flightNumber, person.inbound.customAirline)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block mt-2 text-xs text-blue-400 hover:text-blue-300"
            >
              Check Latest Status →
            </a>
          </>) : <div className="text-gray-500 text-sm italic">No flight</div>}
        </div>
        <div className="bg-gray-900 rounded p-3">
          <div className="text-xs text-gray-400 mb-1">✈️ OUT ← JAC</div>
          {person.outbound?.airline ? (<>
            <div className="text-white font-medium">{getAirlineName(person.outbound.airline, person.outbound.customAirline)} {person.outbound.flightNumber}</div>
            <div className="text-sm text-gray-300">{formatDate(person.outbound.date)}</div>
            <div className="text-xs text-gray-500 mt-1">Departs</div>
            <div className="text-lg text-orange-400 font-mono">{formatTime(person.outbound.time)}</div>
            <a 
              href={getFlightSearchUrl(person.outbound.airline, person.outbound.flightNumber, person.outbound.customAirline)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block mt-2 text-xs text-blue-400 hover:text-blue-300"
            >
              Check Latest Status →
            </a>
          </>) : <div className="text-gray-500 text-sm italic">No flight</div>}
        </div>
      </div>
    </div>
  );
};

const PersonView = ({ person, trip, onUpdate }) => {
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({});
  const [grocery, setGrocery] = useState('');
  // eslint-disable-next-line no-unused-vars
  const housing = trip.housing.find(h => h.id === person.housingId);

  const startEdit = (type) => {
    if (type === 'contact') setEditData(person.contact || { phone: '' });
    else setEditData(person[type] || { airline: '', customAirline: '', flightNumber: '', date: '', time: '' });
    setEditing(type);
  };

  const saveEdit = () => {
    const u = { ...person };
    if (editing === 'contact') u.contact = editData;
    else u[editing] = editData;
    onUpdate(u);
    setEditing(null);
  };

  const addGrocery = () => { if (!grocery.trim()) return; onUpdate({...person, groceryRequests: [...(person.groceryRequests||[]), grocery.trim()]}); setGrocery(''); };
  const removeGrocery = (i) => onUpdate({...person, groceryRequests: person.groceryRequests.filter((_, idx) => idx !== i)});

  // All groceries from all people
  const allGroceries = (trip.people || []).flatMap(p => (p.groceryRequests || []).map((item, idx) => ({ item, personName: p.name, personId: p.id, idx })));

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-6">
        <div className="max-w-lg mx-auto flex items-center gap-4">
          <span className="text-5xl">🦬</span>
          <div>
            <h1 className="text-2xl font-bold">Hey, {person.name}</h1>
            <div className="text-blue-200 mt-1">{trip.name} • {trip.dates}</div>
          </div>
        </div>
      </div>
      <div className="max-w-lg mx-auto p-4 space-y-6">
        
        {/* 1. Mountain Info */}
        {(trip.weatherLocations?.length > 0) && (
          <section>
            <h2 className="text-lg font-semibold mb-3 text-gray-300">Mountain Info</h2>
            <div className="space-y-3">
              {trip.weatherLocations.map(loc => (
                <MountainCard key={loc.id} mountain={loc} />
              ))}
            </div>
          </section>
        )}

        {/* 2. Everyone's Flights - Yours at top, editable */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-300">Everyone's Flights</h2>
          <div className="space-y-3">
            {/* Your flights - highlighted and editable */}
            <div className="bg-blue-900 rounded-lg p-4 border border-blue-700">
              <div className="flex justify-between items-center mb-2">
                <div className="text-white font-bold">{person.name}</div>
                <span className="text-xs bg-blue-700 text-blue-200 px-2 py-1 rounded">You</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-900 rounded p-2">
                  <div className="text-xs text-gray-400">IN → JAC</div>
                  {person.inbound?.airline ? (<>
                    <div className="text-sm text-white">{getAirlineName(person.inbound.airline, person.inbound.customAirline)} {person.inbound.flightNumber}</div>
                    <div className="text-xs text-gray-400">{formatDate(person.inbound.date)}</div>
                    <div className="text-green-400 font-mono">{formatTime(person.inbound.time)}</div>
                    <a href={getFlightSearchUrl(person.inbound.airline, person.inbound.flightNumber, person.inbound.customAirline)} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-xs text-blue-400 hover:text-blue-300">Check Status →</a>
                  </>) : <div className="text-gray-500 text-sm italic">Not added</div>}
                  <button onClick={() => startEdit('inbound')} className="mt-2 text-blue-400 text-xs block">{person.inbound?.airline ? 'Edit' : '+ Add'}</button>
                </div>
                <div className="bg-gray-900 rounded p-2">
                  <div className="text-xs text-gray-400">OUT ← JAC</div>
                  {person.outbound?.airline ? (<>
                    <div className="text-sm text-white">{getAirlineName(person.outbound.airline, person.outbound.customAirline)} {person.outbound.flightNumber}</div>
                    <div className="text-xs text-gray-400">{formatDate(person.outbound.date)}</div>
                    <div className="text-orange-400 font-mono">{formatTime(person.outbound.time)}</div>
                    <a href={getFlightSearchUrl(person.outbound.airline, person.outbound.flightNumber, person.outbound.customAirline)} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-xs text-blue-400 hover:text-blue-300">Check Status →</a>
                  </>) : <div className="text-gray-500 text-sm italic">Not added</div>}
                  <button onClick={() => startEdit('outbound')} className="mt-2 text-blue-400 text-xs block">{person.outbound?.airline ? 'Edit' : '+ Add'}</button>
                </div>
              </div>
            </div>
            
            {/* Others' flights */}
            {(trip.people || []).filter(p => p.id !== person.id).map(p => (
              <div key={p.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-white font-bold">{p.name}</div>
                    {p.contact?.phone && <div className="text-sm text-gray-400">📱 {p.contact.phone}</div>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-900 rounded p-2">
                    <div className="text-xs text-gray-400">IN → JAC</div>
                    {p.inbound?.airline ? (<>
                      <div className="text-sm text-white">{getAirlineName(p.inbound.airline, p.inbound.customAirline)} {p.inbound.flightNumber}</div>
                      <div className="text-xs text-gray-400">{formatDate(p.inbound.date)}</div>
                      <div className="text-green-400 font-mono">{formatTime(p.inbound.time)}</div>
                      <a href={getFlightSearchUrl(p.inbound.airline, p.inbound.flightNumber, p.inbound.customAirline)} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-xs text-blue-400 hover:text-blue-300">Check Status →</a>
                    </>) : <div className="text-gray-500 text-sm italic">TBD</div>}
                  </div>
                  <div className="bg-gray-900 rounded p-2">
                    <div className="text-xs text-gray-400">OUT ← JAC</div>
                    {p.outbound?.airline ? (<>
                      <div className="text-sm text-white">{getAirlineName(p.outbound.airline, p.outbound.customAirline)} {p.outbound.flightNumber}</div>
                      <div className="text-xs text-gray-400">{formatDate(p.outbound.date)}</div>
                      <div className="text-orange-400 font-mono">{formatTime(p.outbound.time)}</div>
                      <a href={getFlightSearchUrl(p.outbound.airline, p.outbound.flightNumber, p.outbound.customAirline)} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-xs text-blue-400 hover:text-blue-300">Check Status →</a>
                    </>) : <div className="text-gray-500 text-sm italic">TBD</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Housing - Yours highlighted */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-300">Housing</h2>
          <div className="space-y-3">
            {trip.housing.map(h => {
              const residents = (trip.people || []).filter(p => p.housingId === h.id);
              const isYours = h.id === person.housingId;
              const houseVehicles = (trip.vehicles || []).filter(v => v.housingId === h.id);
              return (
                <div key={h.id} className={`rounded-lg p-4 border ${isYours ? 'bg-blue-900 border-blue-700' : 'bg-gray-800 border-gray-700'}`}>
                  <div className="flex justify-between items-start">
                    <div className="text-lg font-bold text-white">🏠 {h.name}</div>
                    {isYours && <span className="text-xs bg-blue-700 text-blue-200 px-2 py-1 rounded">Your housing</span>}
                  </div>
                  <div className="text-sm text-gray-300 mt-1">{h.address}</div>
                  
                  {residents.length > 0 && (
                    <div className="text-sm text-blue-400 mt-2">👥 {residents.map(r => r.name).join(', ')}</div>
                  )}
                  
                  {h.code && (
                    <div className="bg-gray-900 rounded p-3 mt-3">
                      <div className="text-xs text-gray-400">Access Code</div>
                      <div className="text-xl font-mono text-green-400">{h.code}</div>
                    </div>
                  )}
                  
                  {h.parkingSpot && (
                    <div className="mt-2 text-sm">
                      <span className="text-gray-400">🅿️ Parking:</span>
                      <span className="text-white ml-2">{h.parkingSpot}</span>
                    </div>
                  )}
                  
                  {houseVehicles.length > 0 && (
                    <div className="mt-2 text-sm">
                      <span className="text-gray-400">🚗 Vehicles:</span>
                      <span className="text-white ml-2">{houseVehicles.map(v => `${v.driver}'s ${v.vehicle}`).join(', ')}</span>
                    </div>
                  )}
                  
                  {h.websiteUrl && (
                    <a href={h.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-blue-400 hover:text-blue-300 text-sm">
                      🔗 View Property →
                    </a>
                  )}
                  
                  {h.notes && <div className="text-gray-400 text-sm mt-2">{h.notes}</div>}
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Your Contact */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-300">Your Contact</h2>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            {person.contact?.phone ? (
              <div className="flex justify-between items-center">
                <div className="text-white">{person.contact.phone}</div>
                <button onClick={() => startEdit('contact')} className="text-blue-400 text-sm">Edit</button>
              </div>
            ) : <button onClick={() => startEdit('contact')} className="text-blue-400">+ Add contact info</button>}
          </div>
        </section>

        {/* Group Contacts */}
        {(trip.people || []).filter(p => p.id !== person.id && p.contact?.phone).length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3 text-gray-300">Group Contacts</h2>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="space-y-2">
                {(trip.people || []).filter(p => p.id !== person.id && p.contact?.phone).map(p => (
                  <div key={p.id} className="flex justify-between items-center">
                    <span className="text-white">{p.name}</span>
                    <a href={`tel:${p.contact.phone.replace(/\D/g, '')}`} className="text-blue-400">📱 {p.contact.phone}</a>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 5. Meetup Spot */}
        {trip.sharedInfo?.meetingSpot && (
          <section>
            <h2 className="text-lg font-semibold mb-3 text-gray-300">Meetup Spot</h2>
            <div className="bg-gradient-to-r from-amber-900 to-orange-900 rounded-lg p-4 border border-amber-700">
              <div className="text-xl font-bold text-white">📍 {trip.sharedInfo.meetingSpot}</div>
              {(trip.sharedInfo.meetingDate || trip.sharedInfo.meetingTime) && (
                <div className="text-amber-200 mt-1">
                  {trip.sharedInfo.meetingDate && formatDate(trip.sharedInfo.meetingDate)}
                  {trip.sharedInfo.meetingDate && trip.sharedInfo.meetingTime && ' • '}
                  {trip.sharedInfo.meetingTime}
                </div>
              )}
              {trip.sharedInfo.mapsUrl && (
                <a href={trip.sharedInfo.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 bg-amber-800 hover:bg-amber-700 text-white px-4 py-2 rounded text-sm">
                  🗺️ Open in Google Maps
                </a>
              )}
              {trip.sharedInfo.notes && <div className="text-amber-100 mt-3 text-sm">{trip.sharedInfo.notes}</div>}
            </div>
          </section>
        )}

        {/* 6. Vehicles */}
        {(trip.vehicles?.length > 0) && (
          <section>
            <h2 className="text-lg font-semibold mb-3 text-gray-300">Vehicles</h2>
            <div className="space-y-2">
              {trip.vehicles.map(v => {
                const house = trip.housing.find(h => h.id === v.housingId);
                return (
                  <div key={v.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-white">🚗 {v.driver}'s {v.vehicle}</span>
                      {house && <span className="text-sm text-gray-400">{house.name}</span>}
                    </div>
                    {v.parkingSpot && <div className="text-sm text-gray-400 mt-1">🅿️ {v.parkingSpot}</div>}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 7. Local Spots & Events */}
        {(trip.localSpots?.length > 0) && (
          <section>
            <h2 className="text-lg font-semibold mb-3 text-gray-300">Local Spots & Events</h2>
            <div className="space-y-2">
              {SPOT_CATEGORIES.map(cat => {
                const spots = (trip.localSpots || []).filter(s => s.category === cat);
                if (spots.length === 0) return null;
                return (
                  <div key={cat} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                    <div className="text-xs text-gray-400 mb-2">{cat}</div>
                    {spots.map(s => (
                      <div key={s.id} className="flex justify-between items-start mb-1 last:mb-0">
                        <div>
                          <span className="text-white">{s.name}</span>
                          {s.why && <span className="text-gray-400 text-sm ml-2">— {s.why}</span>}
                        </div>
                        <div className="flex gap-2 ml-2">
                          {s.siteUrl && <a href={s.siteUrl} target="_blank" rel="noopener noreferrer" className="text-purple-400 text-sm">Site →</a>}
                          {s.url && <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm">Map →</a>}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 8. Grocery List */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-300">Grocery List ({allGroceries.length} items)</h2>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            {/* Add your items */}
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                value={grocery} 
                onChange={e => setGrocery(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && addGrocery()} 
                placeholder="Add item (e.g., Beer, Chips)" 
                className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white" 
              />
              <button onClick={addGrocery} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-white">+</button>
            </div>
            
            {/* All items */}
            {allGroceries.length > 0 ? (
              <ul className="space-y-2">
                {allGroceries.map((g, i) => {
                  const isOwn = g.personId === person.id;
                  return (
                    <li key={i} className="flex justify-between items-center bg-gray-900 rounded px-3 py-2">
                      <div>
                        <span className="text-gray-300">{g.item}</span>
                        <span className={`text-xs ml-2 ${isOwn ? 'text-blue-400' : 'text-gray-500'}`}>({g.personName})</span>
                      </div>
                      {isOwn && (
                        <button onClick={() => removeGrocery(g.idx)} className="text-red-400 hover:text-red-300 text-sm ml-2">✕</button>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : <div className="text-gray-500 italic text-center py-2">No items yet — add something!</div>}
          </div>
        </section>

      </div>

      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-4">{editing === 'contact' ? 'Edit Contact' : `Edit ${editing === 'inbound' ? 'Arrival' : 'Departure'} Flight`}</h3>
            {editing === 'contact' ? (
              <div className="space-y-3">
                <PhoneInput value={editData.phone} onChange={v => setEditData({...editData, phone: v})} />
              </div>
            ) : (
              <div className="space-y-3">
                <AirlineSelect value={editData.airline} customValue={editData.customAirline} onChange={v => setEditData({...editData, airline: v})} onCustomChange={v => setEditData({...editData, customAirline: v})} />
                <input type="text" value={editData.flightNumber || ''} onChange={e => setEditData({...editData, flightNumber: e.target.value})} placeholder="Flight #" className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white" />
                <input type="date" value={editData.date || ''} onChange={e => setEditData({...editData, date: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white" />
                <div>
                  <label className="block text-xs text-gray-400 mb-1">{editing === 'inbound' ? 'Arrival Time (at JAC)' : 'Departure Time (from JAC)'}</label>
                  <select value={editData.time || ''} onChange={e => setEditData({...editData, time: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white">
                    <option value="">Select time...</option>{TIME_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.display}</option>)}
                  </select>
                </div>
              </div>
            )}
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditing(null)} className="flex-1 bg-gray-700 py-2 rounded text-white">Cancel</button>
              <button onClick={saveEdit} className="flex-1 bg-blue-600 py-2 rounded text-white">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminView = ({ trip, onUpdate }) => {
  const [editingPerson, setEditingPerson] = useState(null);
  const [editingHousing, setEditingHousing] = useState(null);
  const [editingShared, setEditingShared] = useState(false);
  const [editingSnow, setEditingSnow] = useState(false);
  const [editingVehicles, setEditingVehicles] = useState(false);
  const [editingSpots, setEditingSpots] = useState(false);
  const [form, setForm] = useState({});
  const [copied, setCopied] = useState(false);
  const [newLoc, setNewLoc] = useState({ name: '', snowUrl: '', trailMapUrl: '', hours: '', mapsUrl: '', siteUrl: '' });
  const [editingMtn, setEditingMtn] = useState(null);
  const [newVehicle, setNewVehicle] = useState({ driver: '', vehicle: '', housingId: '', parkingSpot: '' });
  const [newSpot, setNewSpot] = useState({ name: '', category: '', why: '', url: '', siteUrl: '' });

  const addPerson = () => { setForm({ id: generateId(), name: '', slug: '', inbound: {}, outbound: {}, contact: {}, housingId: '', groceryRequests: [] }); setEditingPerson('new'); };
  const editPerson = (p) => { setForm({...p}); setEditingPerson(p.id); };
  const savePerson = () => {
    const u = {...trip};
    if (editingPerson === 'new') u.people = [...(u.people || []), form];
    else u.people = (u.people || []).map(p => p.id === form.id ? form : p);
    onUpdate(u);
    setEditingPerson(null);
  };
  const deletePerson = (id) => { onUpdate({...trip, people: (trip.people || []).filter(p => p.id !== id)}); };

  const editHousing = (h) => { setForm({...h}); setEditingHousing(h.id); };
  const saveHousing = () => { onUpdate({...trip, housing: trip.housing.map(h => h.id === form.id ? form : h)}); setEditingHousing(null); };
  const saveShared = () => { onUpdate({...trip, sharedInfo: form}); setEditingShared(false); };

  const addMountain = () => {
    if (!newLoc.name) return;
    const loc = { id: generateId(), ...newLoc };
    onUpdate({...trip, weatherLocations: [...(trip.weatherLocations || []), loc]});
    setNewLoc({ name: '', snowUrl: '', trailMapUrl: '', hours: '', mapsUrl: '', siteUrl: '' });
  };
  const editMountain = (mtn) => { setEditingMtn(mtn.id); setForm({...mtn}); };
  const saveMountain = () => {
    onUpdate({...trip, weatherLocations: trip.weatherLocations.map(m => m.id === form.id ? form : m)});
    setEditingMtn(null);
  };
  const removeMountain = (id) => {
    onUpdate({...trip, weatherLocations: (trip.weatherLocations || []).filter(l => l.id !== id)});
  };

  const addVehicle = () => {
    if (!newVehicle.driver || !newVehicle.vehicle) return;
    const v = { id: generateId(), ...newVehicle };
    onUpdate({...trip, vehicles: [...(trip.vehicles || []), v]});
    setNewVehicle({ driver: '', vehicle: '', housingId: '', parkingSpot: '' });
  };
  const removeVehicle = (id) => {
    onUpdate({...trip, vehicles: (trip.vehicles || []).filter(v => v.id !== id)});
  };

  const addSpot = () => {
    if (!newSpot.name || !newSpot.category) return;
    const s = { id: generateId(), ...newSpot };
    onUpdate({...trip, localSpots: [...(trip.localSpots || []), s]});
    setNewSpot({ name: '', category: '', why: '', url: '', siteUrl: '' });
  };
  const removeSpot = (id) => {
    onUpdate({...trip, localSpots: (trip.localSpots || []).filter(s => s.id !== id)});
  };

  const allGroceries = (trip.people || []).flatMap(p => (p.groceryRequests || []).map(item => ({ item, person: p.name })));

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-6">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <span className="text-5xl">🦬</span>
          <div>
            <div className="text-purple-300 text-sm">Admin Dashboard</div>
            <h1 className="text-2xl font-bold mt-1">{trip.name}</h1>
            <div className="text-purple-200 mt-1">{trip.dates}</div>
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto p-4 space-y-8">
        {/* Mountain Info Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Mountain Info</h2>
            <button onClick={() => setEditingSnow(true)} className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded text-sm">⚙️ Manage Links</button>
          </div>
          {(trip.weatherLocations?.length > 0) ? (
            <div className="grid md:grid-cols-2 gap-4">
              {trip.weatherLocations.map(loc => (
                <MountainCard key={loc.id} mountain={loc} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-8 text-center text-gray-500">
              No snow report links added. Click "Manage Links" to add some.
            </div>
          )}
        </section>

        {/* People Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">People ({(trip.people || []).length})</h2>
            <button onClick={addPerson} className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded text-sm">+ Add Person</button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {(trip.people || []).map(p => <PersonCard key={p.id} person={p} trip={trip} onEdit={editPerson} onDelete={deletePerson} onCopyLink={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }} />)}
          </div>
          {(trip.people || []).length === 0 && <div className="text-gray-500 italic text-center py-8 bg-gray-800 rounded-lg">No people added yet</div>}
          {copied && <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">✓ Link copied!</div>}
        </section>

        {/* Housing Section */}
        <section>
          <h2 className="text-xl font-bold mb-4">Housing</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {trip.housing.map(h => {
              const residents = (trip.people || []).filter(p => p.housingId === h.id);
              const houseVehicles = (trip.vehicles || []).filter(v => v.housingId === h.id);
              return (
                <div key={h.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-lg font-bold text-white">🏠 {h.name}</div>
                      <div className="text-sm text-gray-400">{h.address}</div>
                    </div>
                    <button onClick={() => editHousing(h)} className="text-blue-400 text-sm">Edit</button>
                  </div>
                  
                  {residents.length > 0 && (
                    <div className="text-sm text-blue-400 mt-2">👥 {residents.map(r => r.name).join(', ')}</div>
                  )}
                  
                  {h.code && (
                    <div className="bg-gray-900 rounded p-3 mt-3">
                      <div className="text-xs text-gray-400">Access Code</div>
                      <div className="text-xl font-mono text-green-400">{h.code}</div>
                    </div>
                  )}
                  
                  {h.parkingSpot && (
                    <div className="mt-2 text-sm">
                      <span className="text-gray-400">🅿️ Parking:</span>
                      <span className="text-white ml-2">{h.parkingSpot}</span>
                    </div>
                  )}
                  
                  {houseVehicles.length > 0 && (
                    <div className="mt-2 text-sm">
                      <span className="text-gray-400">🚗 Vehicles:</span>
                      <span className="text-white ml-2">{houseVehicles.map(v => `${v.driver}'s ${v.vehicle}`).join(', ')}</span>
                    </div>
                  )}
                  
                  {h.websiteUrl && (
                    <a href={h.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-blue-400 hover:text-blue-300 text-sm">
                      🔗 View Property →
                    </a>
                  )}
                  
                  {h.notes && <div className="text-gray-400 text-sm mt-2">{h.notes}</div>}
                </div>
              );
            })}
          </div>
        </section>

        {/* Meeting Spot */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Meetup Spot</h2>
            <button onClick={() => { setForm({...trip.sharedInfo}); setEditingShared(true); }} className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded text-sm">Edit</button>
          </div>
          <div className="bg-gradient-to-r from-amber-900 to-orange-900 rounded-lg p-4 border border-amber-700">
            {trip.sharedInfo?.meetingSpot ? (<>
              <div className="text-xl font-bold text-white">📍 {trip.sharedInfo.meetingSpot}</div>
              {(trip.sharedInfo.meetingDate || trip.sharedInfo.meetingTime) && (
                <div className="text-amber-200 mt-1">
                  {trip.sharedInfo.meetingDate && formatDate(trip.sharedInfo.meetingDate)}
                  {trip.sharedInfo.meetingDate && trip.sharedInfo.meetingTime && ' • '}
                  {trip.sharedInfo.meetingTime}
                </div>
              )}
              {trip.sharedInfo.mapsUrl && (
                <a href={trip.sharedInfo.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 bg-amber-800 hover:bg-amber-700 text-white px-4 py-2 rounded text-sm">
                  🗺️ Open in Google Maps
                </a>
              )}
              {trip.sharedInfo.notes && <div className="text-amber-100 mt-3 text-sm">{trip.sharedInfo.notes}</div>}
            </>) : <div className="text-amber-200 italic">No meeting spot set</div>}
          </div>
        </section>

        {/* Grocery Requests */}
        {/* Vehicles Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Vehicles ({(trip.vehicles || []).length})</h2>
            <button onClick={() => setEditingVehicles(true)} className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded text-sm">⚙️ Manage</button>
          </div>
          {(trip.vehicles?.length > 0) ? (
            <div className="grid md:grid-cols-2 gap-4">
              {trip.vehicles.map(v => {
                const house = trip.housing.find(h => h.id === v.housingId);
                return (
                  <div key={v.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="text-lg font-bold text-white">🚗 {v.vehicle}</div>
                    <div className="text-sm text-gray-300">Driver: {v.driver}</div>
                    {house && <div className="text-sm text-blue-400 mt-1">📍 {house.name}</div>}
                    {v.parkingSpot && <div className="text-sm text-gray-400">🅿️ {v.parkingSpot}</div>}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-8 text-center text-gray-500">
              No vehicles added. Click "Manage" to add SUV rentals.
            </div>
          )}
        </section>

        {/* Local Spots & Events Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Local Spots & Events ({(trip.localSpots || []).length})</h2>
            <button onClick={() => setEditingSpots(true)} className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded text-sm">⚙️ Manage</button>
          </div>
          {(trip.localSpots?.length > 0) ? (
            <div className="space-y-2">
              {SPOT_CATEGORIES.map(cat => {
                const spots = (trip.localSpots || []).filter(s => s.category === cat);
                if (spots.length === 0) return null;
                return (
                  <div key={cat} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="text-sm text-gray-400 mb-2">{cat}</div>
                    <div className="space-y-2">
                      {spots.map(s => (
                        <div key={s.id} className="flex justify-between items-start">
                          <div>
                            <span className="text-white font-medium">{s.name}</span>
                            {s.why && <span className="text-gray-400 text-sm ml-2">— {s.why}</span>}
                          </div>
                          <div className="flex gap-2 ml-2">
                            {s.siteUrl && (
                              <a href={s.siteUrl} target="_blank" rel="noopener noreferrer" className="text-purple-400 text-sm">Site →</a>
                            )}
                            {s.url && (
                              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm">Map →</a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-8 text-center text-gray-500">
              No local spots added. Click "Manage" to add coffee, food, gear shops, etc.
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">Grocery List ({allGroceries.length} items)</h2>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            {allGroceries.length > 0 ? (
              <ul className="space-y-2">
                {allGroceries.map((g, i) => (
                  <li key={i} className="flex justify-between items-center bg-gray-900 rounded px-3 py-2">
                    <span className="text-gray-300">{g.item}</span>
                    <span className="text-gray-500 text-sm">{g.person}</span>
                  </li>
                ))}
              </ul>
            ) : <div className="text-gray-500 italic text-center py-4">No items yet — people can add from their view</div>}
          </div>
        </section>
      </div>

      {/* Person Edit Modal */}
      {editingPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg my-8">
            <h3 className="text-lg font-bold text-white mb-4">{editingPerson === 'new' ? 'Add' : 'Edit'} Person</h3>
            <div className="space-y-4">
              <div><label className="block text-sm text-gray-400 mb-1">Name</label><input type="text" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value, slug: form.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')})} className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white" /></div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">URL Slug</label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">?p=</span>
                  <input type="text" value={form.slug || ''} onChange={e => setForm({...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')})} placeholder="kunal" className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white" />
                </div>
                <div className="text-xs text-gray-500 mt-1">Lowercase letters/numbers only. Used in their personal link.</div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm text-gray-400">Phone</label>
                  {form.contact?.phone && <button onClick={() => setForm({...form, contact: {}})} className="text-red-400 hover:text-red-300 text-xs">Clear</button>}
                </div>
                <PhoneInput value={form.contact?.phone} onChange={v => setForm({...form, contact: {...form.contact, phone: v}})} />
              </div>
              <div><label className="block text-sm text-gray-400 mb-1">Housing</label>
                <select value={form.housingId || ''} onChange={e => setForm({...form, housingId: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white">
                  <option value="">Select...</option>{HOUSING.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                </select>
              </div>
              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm text-gray-400">Inbound Flight</label>
                  {form.inbound?.airline && <button onClick={() => setForm({...form, inbound: {}})} className="text-red-400 hover:text-red-300 text-xs">Clear</button>}
                </div>
                <div className="space-y-2">
                  <AirlineSelect value={form.inbound?.airline} customValue={form.inbound?.customAirline} onChange={v => setForm({...form, inbound: {...form.inbound, airline: v}})} onCustomChange={v => setForm({...form, inbound: {...form.inbound, customAirline: v}})} />
                  <input type="text" value={form.inbound?.flightNumber || ''} onChange={e => setForm({...form, inbound: {...form.inbound, flightNumber: e.target.value}})} placeholder="Flight #" className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white" />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="date" value={form.inbound?.date || ''} onChange={e => setForm({...form, inbound: {...form.inbound, date: e.target.value}})} className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white" />
                    <select value={form.inbound?.time || ''} onChange={e => setForm({...form, inbound: {...form.inbound, time: e.target.value}})} className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white">
                      <option value="">Time...</option>{TIME_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.display}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm text-gray-400">Outbound Flight</label>
                  {form.outbound?.airline && <button onClick={() => setForm({...form, outbound: {}})} className="text-red-400 hover:text-red-300 text-xs">Clear</button>}
                </div>
                <div className="space-y-2">
                  <AirlineSelect value={form.outbound?.airline} customValue={form.outbound?.customAirline} onChange={v => setForm({...form, outbound: {...form.outbound, airline: v}})} onCustomChange={v => setForm({...form, outbound: {...form.outbound, customAirline: v}})} />
                  <input type="text" value={form.outbound?.flightNumber || ''} onChange={e => setForm({...form, outbound: {...form.outbound, flightNumber: e.target.value}})} placeholder="Flight #" className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white" />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="date" value={form.outbound?.date || ''} onChange={e => setForm({...form, outbound: {...form.outbound, date: e.target.value}})} className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white" />
                    <select value={form.outbound?.time || ''} onChange={e => setForm({...form, outbound: {...form.outbound, time: e.target.value}})} className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white">
                      <option value="">Time...</option>{TIME_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.display}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditingPerson(null)} className="flex-1 bg-gray-700 py-2 rounded text-white">Cancel</button>
              <button onClick={savePerson} className="flex-1 bg-purple-600 py-2 rounded text-white">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Housing Edit Modal */}
      {editingHousing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-4">{form.name}</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Access Code</label>
                <input type="text" value={form.code || ''} onChange={e => setForm({...form, code: e.target.value})} placeholder="Door code" className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-xl font-mono" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Parking Spot</label>
                <input type="text" value={form.parkingSpot || ''} onChange={e => setForm({...form, parkingSpot: e.target.value})} placeholder="e.g., Garage A-12" className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Property Website</label>
                <input type="text" value={form.websiteUrl || ''} onChange={e => setForm({...form, websiteUrl: e.target.value})} placeholder="https://..." className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Notes</label>
                <textarea value={form.notes || ''} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Wifi password, etc." rows={2} className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditingHousing(null)} className="flex-1 bg-gray-700 py-2 rounded text-white">Cancel</button>
              <button onClick={saveHousing} className="flex-1 bg-purple-600 py-2 rounded text-white">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Shared Info Modal */}
      {editingShared && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-4">Edit Meetup Spot</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Location Name</label>
                <input type="text" value={form.meetingSpot || ''} onChange={e => setForm({...form, meetingSpot: e.target.value})} placeholder="e.g., The Rose" className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Date</label>
                  <input type="date" value={form.meetingDate || ''} onChange={e => setForm({...form, meetingDate: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Time</label>
                  <input type="text" value={form.meetingTime || ''} onChange={e => setForm({...form, meetingTime: e.target.value})} placeholder="e.g., 6pm" className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Google Maps URL</label>
                <input type="text" value={form.mapsUrl || ''} onChange={e => setForm({...form, mapsUrl: e.target.value})} placeholder="https://maps.google.com/..." className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white" />
                <div className="text-xs text-gray-500 mt-1">Find location in Google Maps → Share → Copy link</div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Notes</label>
                <textarea value={form.notes || ''} onChange={e => setForm({...form, notes: e.target.value})} placeholder="e.g., Reservation under Kunal" rows={2} className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditingShared(false)} className="flex-1 bg-gray-700 py-2 rounded text-white">Cancel</button>
              <button onClick={saveShared} className="flex-1 bg-purple-600 py-2 rounded text-white">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Snow Links Modal */}
      {/* Mountain Info Modal */}
      {editingSnow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md my-8">
            <h3 className="text-lg font-bold text-white mb-4">Manage Mountains</h3>
            
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {(trip.weatherLocations || []).map(loc => (
                <div key={loc.id} className="flex justify-between items-center bg-gray-900 rounded p-3">
                  <div>
                    <div className="text-white font-medium">{loc.name}</div>
                    {loc.hours && <div className="text-xs text-gray-400">{loc.hours}</div>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => editMountain(loc)} className="text-blue-400 hover:text-blue-300 text-sm">Edit</button>
                    <button onClick={() => removeMountain(loc.id)} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                  </div>
                </div>
              ))}
              {(!trip.weatherLocations || trip.weatherLocations.length === 0) && (
                <div className="text-gray-500 italic text-center py-4">No mountains added</div>
              )}
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div className="text-sm text-gray-400 mb-2">Add New Mountain</div>
              <div className="space-y-2">
                <input type="text" value={newLoc.name} onChange={e => setNewLoc({...newLoc, name: e.target.value})} placeholder="Name (e.g., Jackson Hole)" className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white" />
                <input type="text" value={newLoc.hours} onChange={e => setNewLoc({...newLoc, hours: e.target.value})} placeholder="Hours (e.g., 9am - 4pm)" className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white" />
                <input type="text" value={newLoc.siteUrl} onChange={e => setNewLoc({...newLoc, siteUrl: e.target.value})} placeholder="Main Site URL (for tickets)" className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white" />
                <input type="text" value={newLoc.snowUrl} onChange={e => setNewLoc({...newLoc, snowUrl: e.target.value})} placeholder="Snow Report URL" className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white" />
                <input type="text" value={newLoc.trailMapUrl} onChange={e => setNewLoc({...newLoc, trailMapUrl: e.target.value})} placeholder="Trail Map URL" className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white" />
                <input type="text" value={newLoc.mapsUrl} onChange={e => setNewLoc({...newLoc, mapsUrl: e.target.value})} placeholder="Google Maps URL" className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white" />
                <button onClick={addMountain} className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded text-white">+ Add Mountain</button>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditingSnow(false)} className="flex-1 bg-purple-600 py-2 rounded text-white">Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Mountain Modal */}
      {editingMtn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-4">Edit {form.name}</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Name</label>
                <input type="text" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Hours</label>
                <input type="text" value={form.hours || ''} onChange={e => setForm({...form, hours: e.target.value})} placeholder="e.g., 9am - 4pm" className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Main Site URL (for tickets)</label>
                <input type="text" value={form.siteUrl || ''} onChange={e => setForm({...form, siteUrl: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Snow Report URL</label>
                <input type="text" value={form.snowUrl || ''} onChange={e => setForm({...form, snowUrl: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Trail Map URL</label>
                <input type="text" value={form.trailMapUrl || ''} onChange={e => setForm({...form, trailMapUrl: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Google Maps URL</label>
                <input type="text" value={form.mapsUrl || ''} onChange={e => setForm({...form, mapsUrl: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white" />
              </div>
              <div className="border-t border-gray-700 pt-3">
                <label className="block text-xs text-gray-400 mb-2">📹 Webcams</label>
                {(form.webcams || []).map((cam, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input type="text" value={cam.name} onChange={e => { const w = [...(form.webcams || [])]; w[i] = {...w[i], name: e.target.value}; setForm({...form, webcams: w}); }} placeholder="Name" className="flex-1 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-white text-sm" />
                    <input type="text" value={cam.url} onChange={e => { const w = [...(form.webcams || [])]; w[i] = {...w[i], url: e.target.value}; setForm({...form, webcams: w}); }} placeholder="YouTube URL" className="flex-1 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-white text-sm" />
                    <button onClick={() => setForm({...form, webcams: form.webcams.filter((_, idx) => idx !== i)})} className="text-red-400 hover:text-red-300 px-2">✕</button>
                  </div>
                ))}
                <button onClick={() => setForm({...form, webcams: [...(form.webcams || []), { name: '', url: '' }]})} className="text-blue-400 hover:text-blue-300 text-sm">+ Add Webcam</button>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditingMtn(null)} className="flex-1 bg-gray-700 py-2 rounded text-white">Cancel</button>
              <button onClick={saveMountain} className="flex-1 bg-blue-600 py-2 rounded text-white">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Vehicles Modal */}
      {editingVehicles && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-4">Manage Vehicles</h3>
            
            <div className="space-y-3 mb-4">
              {(trip.vehicles || []).map(v => {
                const house = trip.housing.find(h => h.id === v.housingId);
                return (
                  <div key={v.id} className="flex justify-between items-center bg-gray-900 rounded p-3">
                    <div>
                      <div className="text-white font-medium">{v.driver}'s {v.vehicle}</div>
                      <div className="text-xs text-gray-400">
                        {house && <span>{house.name}</span>}
                        {house && v.parkingSpot && <span> • </span>}
                        {v.parkingSpot && <span>🅿️ {v.parkingSpot}</span>}
                      </div>
                    </div>
                    <button onClick={() => removeVehicle(v.id)} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                  </div>
                );
              })}
              {(!trip.vehicles || trip.vehicles.length === 0) && (
                <div className="text-gray-500 italic text-center py-4">No vehicles added</div>
              )}
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div className="text-sm text-gray-400 mb-2">Add Vehicle</div>
              <div className="space-y-2">
                <input type="text" value={newVehicle.driver} onChange={e => setNewVehicle({...newVehicle, driver: e.target.value})} placeholder="Driver name (e.g., Kunal)" className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white" />
                <input type="text" value={newVehicle.vehicle} onChange={e => setNewVehicle({...newVehicle, vehicle: e.target.value})} placeholder="Vehicle (e.g., SUV Rental)" className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white" />
                <select value={newVehicle.housingId} onChange={e => setNewVehicle({...newVehicle, housingId: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white">
                  <option value="">Parked at... (optional)</option>
                  {HOUSING.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                </select>
                <input type="text" value={newVehicle.parkingSpot} onChange={e => setNewVehicle({...newVehicle, parkingSpot: e.target.value})} placeholder="Parking spot (e.g., Garage A-12)" className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white" />
                <button onClick={addVehicle} className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded text-white">+ Add Vehicle</button>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditingVehicles(false)} className="flex-1 bg-purple-600 py-2 rounded text-white">Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Local Spots & Events Modal */}
      {editingSpots && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md my-8">
            <h3 className="text-lg font-bold text-white mb-4">Manage Local Spots & Events</h3>
            
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {(trip.localSpots || []).map(s => (
                <div key={s.id} className="flex justify-between items-center bg-gray-900 rounded p-3">
                  <div>
                    <div className="text-white font-medium">{s.name}</div>
                    <div className="text-xs text-gray-400">{s.category}{s.why && ` — ${s.why}`}</div>
                  </div>
                  <button onClick={() => removeSpot(s.id)} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                </div>
              ))}
              {(!trip.localSpots || trip.localSpots.length === 0) && (
                <div className="text-gray-500 italic text-center py-4">No spots added</div>
              )}
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div className="text-sm text-gray-400 mb-2">Add Spot or Event</div>
              <div className="space-y-2">
                <input type="text" value={newSpot.name} onChange={e => setNewSpot({...newSpot, name: e.target.value})} placeholder="Name (e.g., Persephone Bakery)" className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white" />
                <select value={newSpot.category} onChange={e => setNewSpot({...newSpot, category: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white">
                  <option value="">Category...</option>
                  {SPOT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input type="text" value={newSpot.why} onChange={e => setNewSpot({...newSpot, why: e.target.value})} placeholder="Why? (e.g., Best coffee in town)" className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white" />
                <input type="text" value={newSpot.siteUrl} onChange={e => setNewSpot({...newSpot, siteUrl: e.target.value})} placeholder="Website URL (optional)" className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white" />
                <input type="text" value={newSpot.url} onChange={e => setNewSpot({...newSpot, url: e.target.value})} placeholder="Google Maps URL (optional)" className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white" />
                <button onClick={addSpot} className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded text-white">+ Add</button>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditingSpots(false)} className="flex-1 bg-purple-600 py-2 rounded text-white">Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('admin');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isAdmin = params.get('admin') === 'true';
    const personSlug = params.get('p');
    const personId = params.get('person');
    
    if (isAdmin) setView('admin');
    else if (personSlug) setView(`slug:${personSlug}`);
    else if (personId) setView(personId);
    else setView('admin'); // Default to admin if no params (for testing)
    
    loadData().then(data => {
      if (data) { 
        if (!data.housing?.length) data.housing = HOUSING; 
        if (!data.weatherLocations) data.weatherLocations = DEFAULT_LOCATIONS;
        // Always use latest name and dates from defaults
        data.name = defaultTrip.name;
        data.dates = defaultTrip.dates;
        setTrip(data); 
      }
      else setTrip(defaultTrip);
      setLoading(false);
    });
  }, []);

  const updateTrip = async (t) => { setTrip(t); await saveData(t); };
  const updatePerson = async (p) => { const t = {...trip, people: (trip.people || []).map(x => x.id === p.id ? p : x)}; await updateTrip(t); };

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white text-xl">Loading...</div></div>;

  if (view !== 'admin') {
    // Look up by slug or ID
    const person = view.startsWith('slug:') 
      ? (trip.people || []).find(p => p.slug === view.slice(5))
      : (trip.people || []).find(p => p.id === view);
    if (!person) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="text-6xl mb-4">🎿</div>
            <div className="text-white text-xl mb-2">Person not found</div>
            <div className="text-gray-400">Check the link or contact the trip organizer</div>
          </div>
        </div>
      );
    }
    return <PersonView person={person} trip={trip} onUpdate={updatePerson} />;
  }

  return <AdminView trip={trip} onUpdate={updateTrip} />;
}
