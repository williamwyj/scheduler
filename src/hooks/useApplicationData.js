import React, { useState, useEffect, useReducer } from "react";
import axios from 'axios';

import reducer, {SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW, SET_SPOTS} from "reducers/application";

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

  // const [state, setState] = useState({
  //   day: "Monday",
  //   days: [],
  //   appointments: {},
  //   interviewer: {},
  // });

  // const setDay = day => setState({...state, day});

  // useEffect(() => {
  //   Promise.all([
  //     axios
  //       .get('/api/days'),
  //     axios
  //       .get('/api/appointments'),
  //     axios
  //       .get('/api/interviewers')
  //   ]).then((all) => {
  //     setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}))
  //   })
  // }, [])
  
  // function bookInterview(id, interview) {
  //   return (
  //   axios
  //     .put(`/api/appointments/${id}`, {interview} )
  //     .then(()=> {
  //       const appointment = {
  //         ...state.appointments[id],
  //         interview: {...interview}
  //       }
  //       const appointments ={
  //         ...state.appointments,
  //         [id]:appointment
  //       }
  //       setState({
  //         ...state,
  //         appointments
  //       })
  //     })
  //     .then(()=>{
  //       setState(prev => {
  //         const day = prev.days.filter(element => element.name === prev.day)
  //         let spot = day[0].appointments.length;
  //         const interviews = day[0].appointments.map(id => prev.appointments[id])
  //         for (const interview of interviews) {
  //           if (interview.interview) {
  //             spot--;
  //           }
  //         }
  //         const days = prev.days.map(day => {
  //           return {...day}
  //         })
  //         for (const day of days) {
  //           if (day.name === state.day) {
  //             day.spots = spot
  //           }
  //         } 
  //         return {...prev, days}
  //       })
  //     })
  //   )
  // }
// function cancelInterview(id) {
    
  //   return(
  //   axios
  //     .delete(`/api/appointments/${id}`)
  //     .then(()=>{
  //       const appointment = {
  //         ...state.appointments[id],
  //         interview: null
  //       }
  //       const appointments = {
  //         ...state.appointments,
  //         [id]:appointment
  //       }
  //       setState({
  //         ...state,
  //         appointments
  //       });
  //     })
  //     .then(()=>{
  //       setState(prev => {
  //         const day = prev.days.filter(element => element.name === prev.day)
  //         let spot = day[0].appointments.length;
  //         const interviews = day[0].appointments.map(id => prev.appointments[id])
  //         for (const interview of interviews) {
  //           if (interview.interview) {
  //             spot--;
  //           }
  //         }
  //         const days = prev.days.map(day => {
  //           return {...day}
  //         })
        
  //         for (const day of days) {
  //           if (day.name === state.day) {
  //             day.spots = spot
  //           }
  //         } 
  //         return {...prev, days}
  //       })
  //     })
  //   )
  // }
  // return { state, bookInterview, cancelInterview, setDay }
}