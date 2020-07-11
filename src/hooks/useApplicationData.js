import { useState, useEffect, useReducer } from "react";
import axios from 'axios'

export default function useApplicationData() {
const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

// const [state, setState] = useState({
//   day: "Monday",
//   days: [],
//   appointments: {},
//   interviewers: {},
// });

function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return { /* insert logic */ }
    case SET_APPLICATION_DATA:
      return { /* insert logic */ }
    case SET_INTERVIEW: {
      return /* insert logic */
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
    }
  }

  // function scheuler() {
    const [state, dispatch] = useReducer(reducer)
  
    const setDay = day => dispatch({ type: SET_DAY, day });

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
        dispatch(prev => ({
          type: SET_APPLICATION_DATA,
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
      let spotsRemaining = {}
      // If an appointment already exists, that means we are editing it and will not decrease the spots remaining
      if (!state.appointments[id].interview) {
        for (const day of state.days) {
          if (day.appointments.includes(id)) {
            spotsRemaining = {
              ...day,
              spots: day.spots--
            }
          }
        }
      }
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
      let spotsRemaining = {}
      for (const day of state.days) {
        if (day.appointments.includes(id)) {
          spotsRemaining = {
            ...day,
            spots: day.spots++
          }
        }
      }
      return axios.delete(`/api/appointments/${id}`, appointment)
      .then(response => {
        setState({
          ...state,
          appointments,
          spotsRemaining
        });
      })
    }
  }
  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
// }