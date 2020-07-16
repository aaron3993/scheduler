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
    const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL)
    socket.onopen = function (event) {
      socket.send("ping");
    }
    socket.onmessage = event => {
      console.log("Message received: ", event.data);
      const data = JSON.parse(event.data);
      console.log(data)
      if (typeof data === "object" && data.type === "SET_INTERVIEW") {
        dispatch({ type: SET_INTERVIEW, id: data.id, interview: data.interview })
      }
    }
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
      
    ])
    .then(([days, appointments, interviewers]) => {
      
      dispatch({
        type: SET_APPLICATION_DATA,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data
      })
    })
  }, [])

  function bookInterview (id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    return axios.put(`/api/appointments/${id}`, appointment)
    .then(() => {
      dispatch({ type: SET_INTERVIEW, id, interview });
    })
  }

  function cancelInterview (id) {
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