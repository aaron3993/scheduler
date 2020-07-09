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

const state = {
  days: [
    {
      id: 1,
      name: "Monday",
      appointments: [1, 2, 3],
      interviewers: [1, 2]
    },
    {
      id: 2,
      name: "Tuesday",
      appointments: [4, 5],
      interviewers: [3, 4]
    }
  ],
  appointments: {
    "1": { id: 1, time: "12pm", interview: null },
    "2": { id: 2, time: "1pm", interview: null },
    "3": {
      id: 3,
      time: "2pm",
      interview: { student: "Archie Cohen", interviewer: 2 }
    },
    "4": { id: 4, time: "3pm", interview: null },
    "5": {
      id: 5,
      time: "4pm",
      interview: { student: "Chad Takahashi", interviewer: 2 }
    }
  },
  interviewers: {
    "1": {  
      id: 1,
      "name": "Sylvia Palmer",
      "avatar": "https://i.imgur.com/LpaY82x.png"
    },
    "2": {
      id: 2,
      name: "Tori Malcolm",
      avatar: "https://i.imgur.com/Nmx0Qxo.png"
    }
  }
};
// console.log(getAppointmentsForDay(state, "Tuesday"))
console.log(getInterviewersByDay(state, "Tuesday"))
// export { getAppointmentsForDay, getInterview }