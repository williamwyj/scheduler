import React from 'react';
import { stringLiteral } from "@babel/types";

import "components/InterviewerList.scss"
import InterviewerListItem from './InterviewerListItem';

export default function InterviewerList(props) {
  return (
    
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {props.interviewers.map(interviewer => {
          
          return <InterviewerListItem
                key={interviewer.id}
                avatar={interviewer.avatar}
                name={interviewer.name}
                setInterviewer={event=> props.onChange(interviewer.id)}
                selected={props.value === interviewer.id}
              />

        })}
      </ul>
    </section>
  );
}