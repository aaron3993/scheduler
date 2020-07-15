import { useEffect, useReducer } from "react";
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducers/application";
import axios from 'axios'

export default function useApplicationData() {

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
    // const getDaysPromise = axios.get(new WebSocket("ws://localhost:8001/api/days"))
    // const getAppointmentsPromise = axios.get(new WebSocket("ws://localhost:8001/api/appointments"))
    // const getInterviewersPromise = axios.get(new WebSocket("ws://localhost:8001/api/interviewers"))
    // getAppointmentsWS = new WebSocket("wss://localhost:8001/api/appointments")
    // const getAppointmentsPromise = axios.get(getAppointmentsWS)
    // getInterviewersWS = new WebSocket("wss://localhost:8001/api/interviewers")
    // const getInterviewersPromise = axios.get(getInterviewersWS)
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