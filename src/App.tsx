import { useState } from 'react';
import './App.css';

function App() {
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
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </section>

      <section className="selected-date">
        <h2>
          {selectedDate.toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </h2>
        <p>No events planned. Enjoy the free time!</p>
      </section>
    </main>
  );
}

export default App;