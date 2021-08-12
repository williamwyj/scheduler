const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";
const SET_SPOTS = "SET_SPOTS"

export default function reducer(state, action) {
    
  switch (action.type) {
    case SET_DAY:
      const day = action.day
      return {...state, day}
    case SET_APPLICATION_DATA: {
      const days = action.days;
      const appointments = action.appointments;
      const interviewers = action.interviewers;
      return {...state, days, appointments, interviewers}
    }
    case SET_INTERVIEW: {
      const appointments = action.appointments
      return {...state, appointments}
    }
    case SET_SPOTS: {
      const day = state.days.filter(element => element.name === state.day)
        let spot = day[0].appointments.length;
        const interviews = day[0].appointments.map(id => state.appointments[id])
        for (const interview of interviews) {
          if (interview.interview) {
            spot--;
          }
        }
        const days = state.days.map(day => {
          return {...day}
        })
        for (const day of days) {
          if (day.name === state.day) {
            day.spots = spot
          }
        }
      return {...state, days}
    }
  default:
    throw new Error(
      `Tried to reduce with unsupported action type : ${action.type}`
    );
  }
}

export {SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW, SET_SPOTS}