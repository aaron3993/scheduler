import { useState, useEffect, useReducer } from "react";
import { getAppointmentsForDay } from '../helpers/selectors'
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

  const setSpots = appointments => {
    let count = 0
    const tempState = {...state, appointments}
    const appointmentsToday = getAppointmentsForDay(tempState, state.day)
    appointmentsToday.forEach(appointment => {
      if (!appointment.interview) {
        count++
      }
    })
    const days = [...state.days]
    console.log(state.days)
    const currentDay = days.map(day => day.name).indexOf(state.day)
    days[currentDay].spots = count
    console.log(appointments)
      return days
    }

  function bookInterview(appointmentId, interview) {
    const appointment = {
      ...state.appointments[appointmentId],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [appointmentId]: appointment
    };

    const days = setSpots(appointments)
    console.log(days)
    return axios.put(`/api/appointments/${appointmentId}`, appointment)
    .then(response => {
      setState({
        ...state,
        appointments,
        days
      });
    })
  }

  function cancelInterview(appointmentId) {
    const appointment = {
      ...state.appointments[appointmentId],
      interview: null
    }
    const appointments = {
      ...state.appointments,
      [appointmentId]: appointment
    }
    const days = setSpots(appointments)
    // const spotsRemaining = () => setSpots(appointmentId)
    return axios.delete(`/api/appointments/${appointmentId}`, appointment)
    .then(response => {
      setState({
        ...state,
        appointments,
        days
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