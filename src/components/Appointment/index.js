import React, {useState} from "react"
import "components/Appointment/styles.scss"

import Header from "components/Appointment/Header"
import Show from "components/Appointment/Show"
import Empty from "components/Appointment/Empty"
import Form from "components/Appointment/Form"
import Status from "components/Appointment/Status"
import Confirm from "components/Appointment/Confirm"

import useVisualMode from "../../hooks/useVisualMode"

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";

  const {mode , transition, back} = useVisualMode(props.interview ? SHOW : EMPTY);

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview)
      .then(()=>transition(SHOW))
    
  }

  function deleteInterview(id) {
    transition(DELETING);
    props.cancelInterview(id)
      .then(()=>transition(EMPTY))
  }
  const [cb, setCb] = useState({});

  function transitionConfirm(callback, parameter) {
    transition(CONFIRM);
    setCb({
      callback,
      parameter
    })
  }

  function editInterview() {
    transition(EDIT);
  }

  function confirmAction() {
    cb.callback(cb.parameter);
  }

  function findInterviewer(interviewerId) {
    return props.interviewers.find(interviewer => interviewer.id === interviewerId)
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={findInterviewer(props.interview.interviewer)}
          id={props.id}
          onDelete={deleteInterview}
          onConfirm={transitionConfirm}
          onEdit={editInterview}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={()=>back()}
          onSave={save}
        />
      )}
      {mode === SAVING && (
        <Status message={SAVING}/>
      )}
      {mode === DELETING && (
        <Status message={DELETING}/>
      )}
      {mode === CONFIRM && (
        <Confirm
          message={"Are you sure you would like to delete?"}
          onCancel={()=>back()}
          onConfirm={confirmAction}
        />
      )}
      {mode === EDIT && (
        <Form
        name={props.interview.student}
        interviewer={props.interview.interviewer}
        interviewers={props.interviewers}
        onCancel={()=>back()}
        onSave={save}
        />
      )}
    </article>
  );
}