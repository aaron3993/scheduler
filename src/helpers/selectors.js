export default function getAppointmentsForDay(state, day) {
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

getInterview(state, interview)
// {  
//   "student": "Lydia Miller-Jones",
//   "interviewer": {  
//     "id": 1,
//     "name": "Sylvia Palmer",
//     "avatar": "https://i.imgur.com/LpaY82x.png"
//   }
// }