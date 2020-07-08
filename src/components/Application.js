import React, { useState, useEffect } from "react";
import axios from 'axios'
import DayList from './DayList'
import Appointment from './Appointment/index'

import "components/Application.scss";

const appointments = [
  {
    id: 1,
    time: "12pm",
  },
  {
    id: 2,
    time: "1pm",
    interview: {
      student: "Lydia Miller-Jones",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },
  {
    id: 3,
    time: "2pm",
  },
  {
    id: 4,
    time: "1pm",
    interview: {
      student: "Aaron Sham",
      interviewer: {
        id: 6,
        name: "Francis",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },
  {
    id: 5,
    time: "1pm",
  },
];

const appointmentList = appointments.map(appointment => {
  return <Appointment key={appointment.id} {...appointment} />
})

export default function Application(props) {
  const [day, setDay] = useState("Monday")
  const [days, setDays] = useState([])

  useEffect(() => {
    axios
    .get("/api/days")
    .then(response => setDays(response.data))
  }, [])

  return (
    <main className="layout">
      <section className="sidebar">
      <img
        className="sidebar--centered"
        src="images/logo.png"
        alt="Interview Scheduler"
      />
      <hr className="sidebar__separator sidebar--centered" />
      <nav className="sidebar__menu">
        <DayList
          days={days}
          day={day}
          setDay={setDay}
        />
      </nav>
      <img
        className="sidebar__lhl sidebar--centered"
        src="images/lhl.png"
        alt="Lighthouse Labs"
      />
      </section>
      <section className="schedule">
        {appointmentList}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
