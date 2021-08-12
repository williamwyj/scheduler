export function getAppointmentsForDay(state, day) {
  const filteredAppointments = state.days.filter(item => item.name === day)
  let appointmentsId = [];
  filteredAppointments.map(item => item.appointments).forEach(element => appointmentsId=[...appointmentsId, ...element])
  return appointmentsId.map(item => state.appointments[item])
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }
  
  const id = interview.interviewer;
  const interviewer = {
    "id": id,
    "name": state.interviewers[id].name,
    "avatar": state.interviewers[id].avatar
  } 
  const outputObject = {
     "student": interview.student,
     "interviewer": interviewer
   };
  return outputObject;
}

export function getInterviewersForDay(state, day) {
  const filteredDay = state.days.filter(item => item.name === day)
  let interviewersId = [];
  filteredDay.map(item => item.interviewers).forEach(element => interviewersId=[...interviewersId, ...element])
  return interviewersId.map(item => state.interviewers[item])
}