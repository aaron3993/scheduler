import { useState, useEffect, useReducer } from "react";
import axios from 'axios'

export default function useApplicationData() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = day => setState({...state, day });

  useEffect(() => {
    const getDaysPromise = axios.get("/api/days")
    const getAppointmentsPromise = axios.get("/api/appointments")
    const getInterviewersPromise = axios.get("/api/interviewers")
    Promise.all([
      getDaysPromise,
      getAppointmentsPromise,
      getInterviewersPromise
    ])
    .then(all => {
      setState(prev => ({
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      }))
    })
  }, [])

  const setSpots = (id, interview) => {
    let spotsRemaining = {}
      for (const day of state.days) {
        if (day.appointments.includes(id)) {
          spotsRemaining = {
            ...day,
            // Check to see if we are adding an interview, if so, then check if an interview already exists, if it does, we are editing it and will not change the spots
            // remaining, if it doesn't a lready exist, it will subtract from spots remaing, and if we are not adding an interview, we are deleting and will add to spots remaining
            spots: interview ? state.appointments[id].interview ? day.spots : day.spots-- : day.spots++
          }
        }
      }
    return spotsRemaining
  }

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    const spotsRemaining = setSpots(id, interview)
    return axios.put(`/api/appointments/${id}`, appointment)
    .then(response => {
      setState({
        ...state,
        appointments,
        spotsRemaining
      });
    })
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    }
    const appointments = {
      ...state.appointments,
      [id]: appointment
    }
    const spotsRemaining = setSpots(id)
    return axios.delete(`/api/appointments/${id}`, appointment)
    .then(response => {
      setState({
        ...state,
        appointments,
        spotsRemaining
      });
    })
  }
  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}