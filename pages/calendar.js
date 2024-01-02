import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useRouter } from 'next/router';

const Calendar = () => {

  const router = useRouter();

  const [interviews, setInterviews] = useState([]);

  const handleToggleWeeks = (eventInfo) => {

    const startDate = eventInfo.view.activeStart;
    const endtDate = eventInfo.view.activeEnd;

    fetchInterviews(startDate, endtDate);

  };

  const handleEventClick = (info) => {

    const interviewId = info.event.id;

    if (interviewId) {
      router.push(`/interviews/${interviewId}`);
    }

  };

  const fetchInterviews = async (startDate, endDate) => {

    try {

      const token = localStorage.getItem("token");

      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];

      const response = await fetch(
        `http://localhost:8080/api/v1/interviews/search/by-date?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {

        const data = await response.json();

        const mappedInterviews = data.map((interview) => ({
          id: interview.id,
          title: `${interview.candidate.firstName} ${interview.candidate.lastName} - ${interview.title.titleName}`,
          start: interview.dateTime,
          end: interview.endDateTime,
        }));

        setInterviews(mappedInterviews);

      } else {
        console.error('Failed to fetch interviews:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching interviews:', error);
    }

  };


  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="timeGridWeek"
        events={interviews}
        eventClick={handleEventClick}
        height="85vh"
        datesSet={handleToggleWeeks}
      />
    </div>
  );
};

export default Calendar;
