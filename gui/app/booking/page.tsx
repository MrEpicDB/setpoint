'use client';

import Link from 'next/link';
import { colors } from '../colors';
import { useState, useEffect } from 'react';
import { getSessions } from './actions';

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'session' | 'event';
}

export default function Booking() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    getSessions().then((sessions) => {
      setEvents(
        sessions.map((s) => ({
          id: s.id,
          title: s.name,
          start: new Date(s.startTime),
          end: new Date(s.endTime),
          type: 'session' as const,
        }))
      );
    });
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
  const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM to 8 PM

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getEventsForDayAndHour = (day: Date, hour: number) => {
    return events.filter(event => {
      if (event.start.toDateString() !== day.toDateString()) return false;
      return event.start.getHours() === hour;
    });
  };

  const calculateEventHeight = (event: Event) => {
    const durationMs = event.end.getTime() - event.start.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);
    return durationHours * 80;
  };

  const calculateEventTop = (event: Event) => {
    const minutes = event.start.getMinutes();
    return (minutes / 60) * 80;
  };

  const formatMonthYear = () => {
    const start = weekDays[0];
    const end = weekDays[6];
    if (start.getMonth() === end.getMonth()) {
      return start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    return `${start.toLocaleDateString('en-US', { month: 'short' })} - ${end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <main className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 style={{ color: colors.text }} className="text-3xl font-bold">Calendar</h1>
            <button
              onClick={goToToday}
              style={{ backgroundColor: colors.button, color: 'white' }}
              className="px-4 py-2 rounded text-sm"
            >
              Today
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span style={{ color: colors.text }} className="font-semibold">{formatMonthYear()}</span>
            <div className="flex gap-2">
              <button
                onClick={goToPreviousWeek}
                style={{ backgroundColor: colors.button, color: 'white' }}
                className="px-3 py-1 rounded"
              >
                ←
              </button>
              <button
                onClick={goToNextWeek}
                style={{ backgroundColor: colors.button, color: 'white' }}
                className="px-3 py-1 rounded"
              >
                →
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-8 border-b" style={{ borderColor: '#e0e0e0' }}>
            <div className="p-2 text-center font-semibold" style={{ color: colors.text }}></div>
            {weekDays.map((day, i) => (
              <div key={i} className="p-2 text-center border-l" style={{ borderColor: '#e0e0e0' }}>
                <div className="text-xs" style={{ color: colors.text }}>
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div
                  className={`text-lg font-semibold ${day.toDateString() === new Date().toDateString() ? 'rounded-full w-8 h-8 mx-auto flex items-center justify-center' : ''}`}
                  style={{
                    backgroundColor: day.toDateString() === new Date().toDateString() ? colors.button : 'transparent',
                    color: day.toDateString() === new Date().toDateString() ? 'white' : colors.text
                  }}
                >
                  {day.getDate()}
                </div>
              </div>
            ))}
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
            {hours.map(hour => (
              <div key={hour} className="grid grid-cols-8 border-b" style={{ borderColor: '#e0e0e0', height: '80px' }}>
                <div className="p-2 text-right text-sm" style={{ color: colors.text }}>
                  {hour}:00
                </div>
                {weekDays.map((day, i) => {
                  const hourEvents = getEventsForDayAndHour(day, hour);
                  return (
                    <div key={i} className="border-l relative" style={{ borderColor: '#e0e0e0' }}>
                      {hourEvents.map(event => (
                        <div
                          key={event.id}
                          className="absolute rounded p-2 text-xs cursor-pointer hover:opacity-80"
                          style={{
                            backgroundColor: event.type === 'session' ? colors.button : colors.text,
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
