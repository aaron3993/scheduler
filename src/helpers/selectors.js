export function getAppointmentsForDay(state, day) {
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
console.log(getAppointmentsForDay(state, "Monday"))