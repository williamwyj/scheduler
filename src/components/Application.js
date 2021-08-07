import React, { useState, useEffect } from "react";
import axios from 'axios';

import "components/Application.scss";

import DayList from "components/DayList"
import Header from "components/Appointment/Header"
import Show from "components/Appointment/Show"
import Empty from "components/Appointment/Empty"
import Appointment from "components/Appointment/index";
import { getAppointmentsForDay, getInterviewersForDay } from "helpers/selectors";

export default function Application() {

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: {...interview}
    }
    const appointments ={
      ...state.appointments,
      [id]:appointment
    }
    setState({
      ...state,
      appointments
    });

    return (
    axios
      .put(`http://localhost:8001/api/appointments/${id}`, {interview} )
    )
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    }
    const appointments = {
      ...state.appointments,
      [id]:appointment
    }
    setState({
      ...state,
      appointments
    });
    return(
    axios
      .delete(`http://localhost:8001/api/appointments/${id}`)
    )
  }

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewer: {},
  });


  const setDay = day => setState({...state, day});
  // const setDays = days => setState(prev => ({ ...prev, days }));

  useEffect(() => {
    Promise.all([
      axios
        .get('http://localhost:8001/api/days'),
      axios
        .get('http://localhost:8001/api/appointments'),
      axios
        .get('http://localhost:8001/api/interviewers')
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}))
    })
  }, [])

  const appointments = getAppointmentsForDay(state, state.day)
  const interviewers = getInterviewersForDay(state, state.day)

  


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
            days={state.days}
            day={state.day}
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
        {appointments.map(appointment => {
          return <Appointment key={appointment.id} {...appointment} interviewers={interviewers} bookInterview={bookInterview} cancelInterview={cancelInterview} />
        })}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
    
  );
}
