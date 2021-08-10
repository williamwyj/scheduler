import React, { useState, useEffect } from "react";
import axios from 'axios';

import "components/Application.scss";

import DayList from "components/DayList"
import Appointment from "components/Appointment/index";
import useApplicationData from "hooks/useApplicationData";
import { getAppointmentsForDay, getInterviewersForDay } from "helpers/selectors";

export default function Application() {
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();
  
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
