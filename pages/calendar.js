// src/Calendar.js
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'; // Import timeGridPlugin

const events = [
  {
    title: 'Phone Interview',
    start: '2023-09-25T10:00:00',
    end: '2023-09-25T11:00:00',
    candidate: 'John Doe',
  },
  {
    title: 'In-Person Interview',
    start: '2023-09-27T14:00:00',
    end: '2023-09-27T15:00:00',
    candidate: 'Jane Smith',
  },
  // Add more events here
];

const Calendar = () => {
  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]} // Include timeGridPlugin
        initialView="timeGridWeek" // Change the initial view to timeGridWeek
        events={events}
        eventClick={(info) => {
          alert(
            `Interview Type: ${info.event.title}\nCandidate: ${info.event.extendedProps.candidate}\nStart: ${info.event.start.toLocaleString()}\nEnd: ${info.event.end.toLocaleString()}`
          );
        }}
        height="50vh" // Set the calendar height to 50% of the viewport height
      />
    </div>
  );
};

export default Calendar;
