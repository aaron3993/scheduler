import React from 'react';

import Header from "./Header"
import Show from "./Show"
import Empty from "./Empty"
import useVisualMode from "../../hooks/useVisualMode"
import classnames from "classnames"
import "components/Appointment/styles.scss"

export default function Appointment (props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const appointmentClass = classnames("appointment", {
    "appointment:last-of-type": props.id === "last"
  });
  return (
    <article className={appointmentClass}>
      <Header time={props.time}/>
      {
        props.interview ?
        <Show student={props.interview.student} interviewer={props.interview.interviewer}/> :
        <Empty />
      }
    </article>
  )
}