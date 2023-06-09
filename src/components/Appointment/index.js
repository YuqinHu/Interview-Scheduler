import React from 'react';
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Status from 'components/Appointment/Status';
import useVisualMode from "hooks/useVisualMode";
import Form from 'components/Appointment/Form';
import Confirm from 'components/Appointment/Confirm';
import Error from 'components/Appointment/Error';

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

// This component displays an appointment in different modes
// based on the value of the `mode` state variable returned by the `useVisualMode` custom hook
export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props
      .bookInterview(props.id, interview)
      .then(() => {transition(SHOW)})
      .catch(error => {transition(ERROR_SAVE, true)});
  }

  function remove() {
    if (mode === CONFIRM) {
      transition(DELETING, true)
      props.cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(() => transition(ERROR_DELETE, true))
    } else {
      transition(CONFIRM);      
    }
  }

  function edit() {
    transition(EDIT);
  }

  
  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
         <Show
         student={props.interview.student}
         interviewer={props.interview.interviewer}
         onDelete={remove}
         onEdit={edit}
       />
     )}
     {mode === CREATE &&
       <Form
         interviewers={props.interviewers}
         onSave={save}
         onCancel={back}
       />}
     {mode === SAVING && <Status message="Saving" />}
     {mode === DELETING && <Status message="Deleting" />}
      {mode === CONFIRM && 
        <Confirm 
          onCancel={back}
          onConfirm={remove}
          message="Are you sure you would like to delete?" 
        />}
      {mode === EDIT &&
        <Form 
          student={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
        />
      }
      {mode === ERROR_SAVE && 
        <Error 
          message="Could not create appointment"
          onClose={back}
        />
      }
      {mode === ERROR_DELETE && 
        <Error 
          message="Could not cancel appointment"
          onClose={back}
        />
      }

   </article>

 )
}