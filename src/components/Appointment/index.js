import React from 'react';

import Header from "./Header"
import Show from "./Show"
import Empty from "./Empty"
import Form from "./Form"
import Status from "./Status"
import Confirm from "./Confirm"
import useVisualMode from "../../hooks/useVisualMode"
import classnames from "classnames"
import "components/Appointment/styles.scss"

export default function Appointment (props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";

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
    transition(SAVING)
    props.bookInterview(props.id, interview).then(() => {
      transition(SHOW)
    })
  }

  function deleteInterview () {
    transition(DELETING)
    props.cancelInterview(props.id).then(() => {
      transition(EMPTY)
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
          onDelete={() => transition(CONFIRM)}
        />
      )}
      {mode === CREATE && (
      <Form
        interviewers={props.interviewers}
        onSave={save}
        onCancel={back}/>
      )}
      {mode === SAVING && <Status message="Saving"/>}
      {mode === DELETING && <Status message="Deleting"/>}
      {mode === CONFIRM && (
        <Confirm
          message="Are you sure you would like to delete?"
          onConfirm={deleteInterview}
          onCancel={back}
        />
      )}
    </article>
  )
}