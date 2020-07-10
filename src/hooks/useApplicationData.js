import { useState, useEffect } from "react";
import axios from 'axios'

export default function useApplicationData() {
const [state, setState] = useState({
  day: "Monday",
  days: [],
  appointments: {},
  interviewers: {}
});

  const setDay = day => setState({ ...state, day });

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

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.put(`/api/appointments/${id}`, appointment)
    .then(response => {
      setState({
        ...state,
        appointments
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
    return axios.delete(`/api/appointments/${id}`, appointment)
    .then(response => {
      setState({
        ...state,
        appointments
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