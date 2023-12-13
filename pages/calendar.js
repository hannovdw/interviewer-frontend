import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

const events = [
  {
    title: 'Phone Interview',
    start: '2023-12-13T10:00:00',
    end: '2023-12-13T12:00:00',
    candidate: 'John Doe',
  },
  {
    title: 'In-Person Interview',
    start: '2023-12-14T12:00:00',
    end: '2023-12-14T14:00:00',
    candidate: 'Jane Smith',
  },

];

const Calendar = () => {
  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="timeGridWeek"
        events={events}
        eventClick={(info) => {
          alert(
            `Interview Type: ${info.event.title}\nCandidate: ${info.event.extendedProps.candidate}\nStart: ${info.event.start.toLocaleString()}\nEnd: ${info.event.end.toLocaleString()}`
          );
        }}
        height="70vh"
      />
    </div>
  );
};

export default Calendar;
