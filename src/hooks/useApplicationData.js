import { useEffect, useReducer } from "react";
import { setSpots } from "../helpers/selectors"
import axios from 'axios'

export default function useApplicationData() {
const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return {...state, day: action.day}
        case SET_APPLICATION_DATA:
          return {...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers}
        case SET_INTERVIEW: {
          console.log(action)
        const appointment = {
      ...state.appointments[action.id],
      interview: action.interview
      };
      const appointments = {
        ...state.appointments,
        [action.id]: appointment
      };
      const days = setSpots(state, appointments)
      return {...state, appointments, days}
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
      );
    }
  }

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  })
    
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
      dispatch({
        type: SET_APPLICATION_DATA,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      })
    })
  }, [])

  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    return axios.put(`/api/appointments/${id}`, appointment)
    .then(() => {
      dispatch({ type: SET_INTERVIEW, id, interview });
    })
  }

  const cancelInterview = (id) => {
    const appointment = {
      ...state.appointments[id],
      interview: null
    }
    return axios.delete(`/api/appointments/${id}`, appointment)
    .then(() => {
      dispatch({ type: SET_INTERVIEW, id, interview: null });
    })
  }
  
  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}