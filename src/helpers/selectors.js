const getAppointmentsForDay = (state, day) => {
  const output = []
  for (const eachDay of state.days) {
    if (eachDay.name === day) {
      for (const appointment of eachDay.appointments) {
        if (appointment === state.appointments[appointment].id) {
          output.push(state.appointments[appointment])
        }
      }
    }
  }
  return output
}

const getInterview = (state, interview) => {
  const output = {}
  if (!interview) {
    return null
  }
  for (const interviewer in state.interviewers) {
    if (state.interviewers[interviewer].id === interview.interviewer) {
      output.student = interview.student
      output.interviewer = {...state.interviewers[interviewer]}
      }
    }
  return output
}

export { getAppointmentsForDay, getInterview }