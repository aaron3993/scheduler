const getAppointmentsForDay = (state, day) => {
  const output = []
  for (const eachDay of state.days) {
    if (eachDay.name === day) {
      for (const appointment of eachDay.appointments) {
        if (state.appointments[appointment]) {
          if (appointment === state.appointments[appointment].id) {
            output.push(state.appointments[appointment])
          }
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

const getInterviewersByDay = (state, day) => {
  const output = []
  for (const eachDay of state.days) {
    if (eachDay.name === day) {
      for (const interviewer of eachDay.interviewers) {
        if (state.interviewers[interviewer]) {
          if (interviewer === state.interviewers[interviewer].id) {
            output.push(state.interviewers[interviewer])
          }
        }
      }
    }
  }
  return output
}

const setSpots = (state, appointments) => {
  let count = 0
  const tempState = {...state, appointments}
  const appointmentsToday = getAppointmentsForDay(tempState, state.day)
  appointmentsToday.forEach(appointment => {
    console.log(appointment.interview)
    if (!appointment.interview) {
      count++
    }
  })
  const days = [...state.days]
  const currentDay = days.map(day => day.name).indexOf(state.day)
  days[currentDay].spots = count
  return days
}

export { getAppointmentsForDay, getInterview, getInterviewersByDay, setSpots }