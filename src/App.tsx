import { useState } from 'react';
import './App.css';

type CalendarEvent = {
  id: number;
  title: string;
  date: string;
  time: string;
};

function App() {

    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [eventTitle, setEventTitle] = useState('');
    const [eventTime, setEventTime] = useState('09:00');
    const [showEventForm, setShowEventForm] = useState(false);
    const [editingEventId, setEditingEventId] = useState<number | null>(null);

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const mondayOffset = (firstDay.getDay() + 6) % 7;

    const calendarStart = new Date(year, month, 1 - mondayOffset);

    const days = Array.from({ length: 42 }, (_, index) => {
        return new Date(
        calendarStart.getFullYear(),
        calendarStart.getMonth(),
        calendarStart.getDate() + index
        );
    });

    const today = new Date();

    function changeMonth(amount: number) {
        setCurrentMonth(new Date(year, month + amount, 1));
    }

    function addEvent() {
        if (!eventTitle.trim()) return;

        const date = [
            selectedDate.getFullYear(),
            String(selectedDate.getMonth() + 1).padStart(2, '0'),
            String(selectedDate.getDate()).padStart(2, '0'),
        ].join('-');

        if (editingEventId !== null) {
            // Update the existing event
            setEvents((previousEvents) =>
            previousEvents.map((event) =>
                event.id === editingEventId
                ? {
                    ...event,
                    title: eventTitle.trim(),
                    time: eventTime,
                    date,
                    }
                : event
            )
            );
        } else {
            // Create a new event
            const newEvent: CalendarEvent = {
            id: Date.now(),
            title: eventTitle.trim(),
            date,
            time: eventTime,
            };

            setEvents((previousEvents) => [...previousEvents, newEvent]);
        }

        setEventTitle('');
        setEventTime('09:00');
        setEditingEventId(null);
        setShowEventForm(false);
        }

    function editEvent(event: CalendarEvent) {
        setSelectedDate(new Date(`${event.date}T12:00:00`));
        setEventTitle(event.title);
        setEventTime(event.time);
        setEditingEventId(event.id);
        setShowEventForm(true);
        }

        function deleteEvent() {
        if (editingEventId === null) return;

        const confirmed = window.confirm(
            'Are you sure you want to delete this event?'
        );

        if (!confirmed) return;

        setEvents((previousEvents) =>
            previousEvents.filter(
            (event) => event.id !== editingEventId
            )
        );

        setEventTitle('');
        setEventTime('09:00');
        setEditingEventId(null);
        setShowEventForm(false);
        }
    function isSameDay(a: Date, b: Date) {
        return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
        );
    }

    return (
    <main className="app">
      <header className="calendar-header">
        <div>
          <h1>My Calendar</h1>
          <p>Calendar</p>
        </div>

        <button
          className="today-button"
          onClick={() => {
            const now = new Date();
            setCurrentMonth(now);
            setSelectedDate(now);
          }}
        >
          Today
        </button>
      </header>

      <section className="calendar">
        <div className="month-header">
          <h2>
            {currentMonth.toLocaleDateString('en-GB', {
              month: 'long',
              year: 'numeric',
            })}
          </h2>

          <div className="month-buttons">
            <button onClick={() => changeMonth(-1)}>
              &larr;
            </button>
            <button onClick={() => changeMonth(1)}>
              &rarr;
            </button>
          </div>
        </div>

        <div className="calendar-grid">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
            (day) => (
              <div className="weekday" key={day}>
                {day}
              </div>
            )
          )}

          {days.map((day) => {
            const isCurrentMonth = day.getMonth() === month;
            const isToday = isSameDay(day, today);
            const isSelected = isSameDay(day, selectedDate);

            return (
              <button
                key={day.toISOString()}
                className={[
                  'calendar-day',
                  !isCurrentMonth && 'other-month',
                  isToday && 'today',
                  isSelected && 'selected',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => setSelectedDate(day)}
              >
                <span>{day.getDate()}</span>
                {events
                    .filter((event) => {
                        const eventDate = new Date(`${event.date}T12:00:00`);
                        return isSameDay(eventDate, day);
                    })
                    .map((event) => (
                        <div
                            className="event-chip"
                            key={event.id}
                            role="button"
                            tabIndex={0}
                            title="Click to edit event"
                            onClick={(e) => {
                                e.stopPropagation();
                                editEvent(event);
                            }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                editEvent(event);
                            }
                        }}
                    >
                        {event.time} {event.title}
                    </div>
                ))}
              </button>
            );
          })}
        </div>
      </section>
        <section className="event-section">
        <button
            type="button"
            onClick={() => {
            setEventTitle('');
            setEventTime('09:00');
            setEditingEventId(null);
            setShowEventForm(!showEventForm);
            }}
        >
            + Add event
        </button>

        {showEventForm && (
            <form
            className="event-form"
            onSubmit={(e) => {
                e.preventDefault();
                addEvent();
            }}
            >
            <h3>
                {editingEventId !== null ? 'Edit event' : 'New event'}
            </h3>

            <input
                type="text"
                placeholder="What is the event?"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                required
            />

            <input
                type="date"
                value={[
                selectedDate.getFullYear(),
                String(selectedDate.getMonth() + 1).padStart(2, '0'),
                String(selectedDate.getDate()).padStart(2, '0'),
                ].join('-')}
                onChange={(e) => {
                if (e.target.value) {
                    setSelectedDate(new Date(`${e.target.value}T12:00:00`));
                }
                }}
                required
            />

            <input
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                required
            />

            <div className="event-form-actions">
                <button type="submit">
                {editingEventId !== null ? 'Save changes' : 'Create event'}
                </button>

                {editingEventId !== null && (
                <button type="button" className="delete-button" onClick={deleteEvent}>
                    Delete event
                </button>
                )}

                <button
                type="button"
                className="cancel-button"
                onClick={() => {
                    setShowEventForm(false);
                    setEditingEventId(null);
                    setEventTitle('');
                    setEventTime('09:00');
                }}
                >
                Cancel
                </button>
            </div>
            </form>
        )}
        </section>
      <section className="selected-date">
        <div className="selected-date-header">
            <div>
            <h2>
                {selectedDate.toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                })}
            </h2>
            <p>
                {events.filter((event) =>
                isSameDay(
                    new Date(`${event.date}T12:00:00`),
                    selectedDate
                )
                ).length === 0
                ? 'Nothing planned for this day.'
                : `${
                    events.filter((event) =>
                        isSameDay(
                        new Date(`${event.date}T12:00:00`),
                        selectedDate
                        )
                    ).length
                    } event(s) planned`}
            </p>
            </div>

            <button
            type="button"
            className="today-button"
            onClick={() => {
                setEventTitle('');
                setEventTime('09:00');
                setEditingEventId(null);
                setShowEventForm(true);
            }}
            >
            + Add event
            </button>
        </div>

        <div className="planned-events">
            {events
            .filter((event) =>
                isSameDay(
                new Date(`${event.date}T12:00:00`),
                selectedDate
                )
            )
            .sort((a, b) => a.time.localeCompare(b.time))
            .map((event) => (
                <button
                type="button"
                className="planned-event"
                key={event.id}
                onClick={() => editEvent(event)}
                >
                <span className="event-time">{event.time}</span>
                <span className="event-title">{event.title}</span>
                <span className="edit-label">Edit →</span>
                </button>
            ))}
        </div>
        </section>
    </main>
  );
}

export default App;