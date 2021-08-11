import React from "react";

import { render, cleanup, waitForElement, fireEvent, prettyDOM, waitForElementToBeRemoved, } from "@testing-library/react";
import { getAllByTestId, getByText, getByAltText, getByPlaceholderText, queryByText } from "@testing-library/react"

import Application from "components/Application";

afterEach(cleanup);


describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
    
    await waitForElement(() => getByText("Monday"))
    
    fireEvent.click(getByText("Tuesday"));
    
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
    
  });
  
  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async ()=> {
    const { container, debug } = render(<Application />);
    
    await waitForElement(()=> getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");

    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));
    
    const input = getByPlaceholderText(appointment,"Enter Student Name")

    fireEvent.change(input, {target: {value: "Lydia Miller-Jones"}})

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"))

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "SAVING")).toBeInTheDocument();

    await waitForElementToBeRemoved(()=>getByText(appointment, "SAVING"));

    const days = getAllByTestId(container, "day");

    const day = days.find(day => queryByText(day, "Monday"));

    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  
  });

})
