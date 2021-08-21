import React, { useState, useEffect, useReducer } from "react";
import axios from 'axios';

import reducer, {SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW, SET_SPOTS, SET_INTERVIEW_WS} from "reducers/application";

export default function useApplicationData() {

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewer: {},
  });

  const setDay = day => dispatch({type: SET_DAY, day});
  
  useEffect(() => {
    
    Promise.all([
      axios
        .get('/api/days'),
      axios
        .get('/api/appointments'),
      axios
        .get('/api/interviewers')
    ]).then((all) => {
      dispatch({type: SET_APPLICATION_DATA, days: all[0].data, appointments: all[1].data, interviewers: all[2].data})
    })
  }, [])

  useEffect(() => {
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL)
    webSocket.onopen = function (event) {
      webSocket.send("ping")
    }
    webSocket.onmessage = function(event) {
      const eventData = JSON.parse(event.data)
      if (eventData.type === 'SET_INTERVIEW' && eventData.interview) {
        const appointment = {
          id: [eventData.id],
          interview: {...eventData.interview}
        }
        dispatch({type: SET_INTERVIEW_WS, appointment})
      } else if (eventData.type === 'SET_INTERVIEW' && !eventData.interview) {
        const appointment = {
          id: [eventData.id],
          interview: null
        }
        dispatch({type: SET_INTERVIEW_WS, appointment})
      }
    }
  }, [])


  
  function bookInterview(id, interview) {
    return (
    axios
      .put(`/api/appointments/${id}`, {interview} )
      .then(()=> {
        const appointment = {
          ...state.appointments[id],
          interview: {...interview}
        }
        const appointments ={
          ...state.appointments,
          [id]:appointment
        }
        dispatch({type: SET_INTERVIEW, appointments})
      })
      .then(()=>{
        dispatch({type: SET_SPOTS})
      })
    )
  }

  function cancelInterview(id) {
    
    return(
    axios
      .delete(`/api/appointments/${id}`)
      .then(()=>{
        const appointment = {
          ...state.appointments[id],
          interview: null
        }
        const appointments = {
          ...state.appointments,
          [id]:appointment
        }
        dispatch({type: SET_INTERVIEW, appointments})
      })
      .then(()=>{
        dispatch({type: SET_SPOTS})
      })
    )
  }

  return { state, bookInterview, cancelInterview, setDay }
}