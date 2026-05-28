'use client';

import { colors } from '../colors';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSessions, getCoachClubs, createSession } from './actions';

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

interface Club {
  id: string;
  name: string;
}

export default function Booking() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [coachClubs, setCoachClubs] = useState<Club[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getSessions().then((sessions) => {
      setEvents(sessions.map((s) => ({ id: s.id, title: `${s.name} (${s.clubName})`, start: new Date(s.startTime), end: new Date(s.endTime) })));
    });
    getCoachClubs().then(setCoachClubs);
  }, []);

  const getWeekDays = (date: Date) => {
    const week = [];
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDays = getWeekDays(currentDate);
  const hours = Array.from({ length: 14 }, (_, i) => i + 7);

  const goToPreviousWeek = () => { const d = new Date(currentDate); d.setDate(d.getDate() - 7); setCurrentDate(d); };
  const goToNextWeek = () => { const d = new Date(currentDate); d.setDate(d.getDate() + 7); setCurrentDate(d); };
  const goToToday = () => setCurrentDate(new Date());

  const getEventsForDayAndHour = (day: Date, hour: number) =>
    events.filter((e) => e.start.toDateString() === day.toDateString() && e.start.getHours() === hour);

  const calculateEventHeight = (event: Event) => ((event.end.getTime() - event.start.getTime()) / 3600000) * 80;
  const calculateEventTop = (event: Event) => (event.start.getMinutes() / 60) * 80;

  const formatMonthYear = () => {
    const start = weekDays[0];
    const end = weekDays[6];
    if (start.getMonth() === end.getMonth()) return start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    return `${start.toLocaleDateString('en-US', { month: 'short' })} - ${end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
  };

  async function handleCreateSession(formData: FormData) {
    await createSession(formData);
    setShowForm(false);
    const sessions = await getSessions();
    setEvents(sessions.map((s) => ({ id: s.id, title: `${s.name} (${s.clubName})`, start: new Date(s.startTime), end: new Date(s.endTime) })));
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <main className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 style={{ color: colors.text }} className="text-3xl font-bold">Calendar</h1>
            <button onClick={goToToday} style={{ backgroundColor: colors.button, color: 'white' }} className="px-4 py-2 rounded text-sm">Today</button>
            {coachClubs.length > 0 && (
              <button onClick={() => setShowForm(!showForm)} style={{ backgroundColor: colors.text, color: 'white' }} className="px-4 py-2 rounded text-sm">
                {showForm ? 'Cancel' : 'Create Session'}
              </button>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span style={{ color: colors.text }} className="font-semibold">{formatMonthYear()}</span>
            <div className="flex gap-2">
              <button onClick={goToPreviousWeek} style={{ backgroundColor: colors.button, color: 'white' }} className="px-3 py-1 rounded">←</button>
              <button onClick={goToNextWeek} style={{ backgroundColor: colors.button, color: 'white' }} className="px-3 py-1 rounded">→</button>
            </div>
          </div>
        </div>

        {showForm && (
          <form action={handleCreateSession} className="bg-white p-6 rounded shadow mb-6 grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Club</label>
              <select name="clubId" required className="w-full border p-2 rounded">
                {coachClubs.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Session Name</label>
              <input name="name" required className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input name="location" required className="w-full border p-2 rounded" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea name="description" required className="w-full border p-2 rounded" rows={2} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Agenda (optional)</label>
              <textarea name="agenda" className="w-full border p-2 rounded" rows={2} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Skill Level</label>
              <select name="skillLevel" className="w-full border p-2 rounded">
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Capacity</label>
              <input name="capacity" type="number" min="1" required className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price (pence)</label>
              <input name="price" type="number" min="0" required className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Time</label>
              <input name="startTime" type="datetime-local" required className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Time</label>
              <input name="endTime" type="datetime-local" required className="w-full border p-2 rounded" />
            </div>
            <div className="col-span-2">
              <button type="submit" className="w-full py-2 rounded text-white" style={{ backgroundColor: colors.button }}>Create Session</button>
            </div>
          </form>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-8 border-b" style={{ borderColor: '#e0e0e0' }}>
            <div className="p-2 text-center font-semibold" style={{ color: colors.text }}></div>
            {weekDays.map((day, i) => (
              <div key={i} className="p-2 text-center border-l" style={{ borderColor: '#e0e0e0' }}>
                <div className="text-xs" style={{ color: colors.text }}>{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div
                  className={`text-lg font-semibold ${day.toDateString() === new Date().toDateString() ? 'rounded-full w-8 h-8 mx-auto flex items-center justify-center' : ''}`}
                  style={{ backgroundColor: day.toDateString() === new Date().toDateString() ? colors.button : 'transparent', color: day.toDateString() === new Date().toDateString() ? 'white' : colors.text }}
                >
                  {day.getDate()}
                </div>
              </div>
            ))}
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
            {hours.map(hour => (
              <div key={hour} className="grid grid-cols-8 border-b" style={{ borderColor: '#e0e0e0', height: '80px' }}>
                <div className="p-2 text-right text-sm" style={{ color: colors.text }}>{hour}:00</div>
                {weekDays.map((day, i) => {
                  const hourEvents = getEventsForDayAndHour(day, hour);
                  return (
                    <div key={i} className="border-l relative" style={{ borderColor: '#e0e0e0' }}>
                      {hourEvents.map(event => (
                        <div
                          key={event.id}
                          onClick={() => coachClubs.length > 0 && router.push(`/booking/session/${event.id}`)}
                          className="absolute rounded p-2 text-xs cursor-pointer hover:opacity-80"
                          style={{
                            backgroundColor: colors.button,
                            color: 'white',
                            top: `${calculateEventTop(event)}px`,
                            height: `${calculateEventHeight(event)}px`,
                            left: '4px',
                            right: '4px',
                            zIndex: 10
                          }}
                        >
                          <div className="font-semibold">{event.title}</div>
                          <div className="text-xs">
                            {event.start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} -
                            {event.end.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
