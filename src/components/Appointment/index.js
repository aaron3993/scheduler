import React from 'react';

import Header from "./Header"
import Show from "./Show"
import Empty from "./Empty"
import Form from "./Form"
import useVisualMode from "../../hooks/useVisualMode"
import classnames from "classnames"
import "components/Appointment/styles.scss"

export default function Appointment (props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const appointmentClass = classnames("appointment", {
    "appointment:last-of-type": props.id === "last"
  });

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    console.log(interview, "save function")
    props.bookInterview(props.id, interview).then(() => {
      transition(SHOW)
    })
  }

  return (
    <article className={appointmentClass}>
      <Header time={props.time}/>
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onEdit={props.onEdit}
          onDelete={props.onDelete}
        />
      )}
      {mode === CREATE && (
      <Form
        interviewers={props.interviewers}
        onSave={save}
        onCancel={back}/>
      )}
      
    </article>
  )
}