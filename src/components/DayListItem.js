import React from "react";
import classnames from "classnames";

import "components/DayListItem.scss"
import { stringLiteral } from "@babel/types";

export default function DayListItem(props) {
  const dayClass = classnames("day-list__item", {
    "day-list__item--selected" : props.selected,
    "day-list__item--full" : props.spots === 0
  })
  const formatSpots = function() {
    let string = "";
    if (props.spots === 0) {
      string = 'no spots remaining';
    } else if (props.spots === 1) {
      string = `${props.spots} spot remaining`;
    } else {
      string = `${props.spots} spots remaining`;
    }
    return string;
  }
  return (
    <li className={dayClass} onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2> 
      <h3 className="text--light">{formatSpots()}</h3>
    </li>
  );
}
