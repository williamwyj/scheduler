import React from "react";

import axios from "axios";

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
  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    // 3. Click the delete button on the Archie Cohen appointment
    const appointments = getAllByTestId(container, "appointment");

    const appointment = appointments.find(appointment => queryByText(appointment, 'Archie Cohen'));

    fireEvent.click(getByAltText(appointment, 'Delete'));

    // 4. Check that the element with the text "Are you sure you would like to delete?" is displayed
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    // 5. Click the confirm button in the confirmation element
    fireEvent.click(getByText(appointment, 'Confirm'))

    // 6. Check that the element with the text "DELETING" is displayed.
    expect(getByText(appointment, "DELETING")).toBeInTheDocument();
    // 7. Wait until the element with the text "DELETING" is gone
    await waitForElementToBeRemoved(()=>getByText(appointment, "DELETING"));
    // 8. Check the EMPTY element with  the add button is displayed
    expect(getByAltText(appointment, "Add")).toBeInTheDocument();

    // 9. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const days = getAllByTestId(container, "day");

    const day = days.find(day => queryByText(day, "Monday"));

    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();

  });
  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    //1. Render the application
    const { container } = render(<Application />);
    //2. Wait until the text "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));
    //3. Click on the edit button
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments.find(appointment => queryByText(appointment, 'Archie Cohen'));
    fireEvent.click(getByAltText(appointment, 'Edit'))
    //4. Wait and Check the text "Save" is displayed in the edit element
    await waitForElement(() => getByText(appointment, "Save"));
    expect(getByText(appointment, "Save")).toBeInTheDocument();
    //5. Change the name to "Chad Takahashi"
    const input = getByPlaceholderText(appointment,"Enter Student Name")
    fireEvent.change(input, {target: {value: "Chad Takahashi"}})
    //6. Click the 1st mentor button to select the mentor
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"))
    //7. Click the save button
    fireEvent.click(getByText(appointment, "Save"));
    //8. Check the "SAVING" text is being displayed
    expect(getByText(appointment, "SAVING")).toBeInTheDocument();
    //10. Wait until the element with the text "SAVING" is gone
    await waitForElementToBeRemoved(()=>getByText(appointment, "SAVING"));
    //11. Check the "Chad Takahashi" text is displayed
    expect(getByText(appointment, "Chad Takahashi")).toBeInTheDocument();
    //12. Check that the DayListItem with the text "Monday" still has the text "1 spots remaining".
    const days = getAllByTestId(container, "day");
    const day = days.find(day => queryByText(day, "Monday"));
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });
  it("shows the save error when failing to save an appointment", async ()=>{
    //Reject put request once
    axios.put.mockRejectedValueOnce();

    //1 Render the application
    const { container, debug } = render(<Application />);
    //2 Wait until the text "Archie Cohen" is displayed
    await waitForElement(()=> getByText(container, "Archie Cohen"));
    //3 Click on the add button
    const appointments = getAllByTestId(container, "appointment");

    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));
    //4 Input the student name "Lydia Miller-Jones" and select the mentor "Sylvia Palmer"
    const input = getByPlaceholderText(appointment,"Enter Student Name")

    fireEvent.change(input, {target: {value: "Lydia Miller-Jones"}})

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"))
    
    //5 Click on the save button
    fireEvent.click(getByText(appointment, "Save"));
    //6 Check if the message "SAVING" is displayed and wait for it to pass
    expect(getByText(appointment, "SAVING")).toBeInTheDocument();

    await waitForElementToBeRemoved(()=>getByText(appointment, "SAVING"));

    //7 Check if the error message is displayed "Could not save appointment."
    expect(getByText(appointment, "Could not save appointment.")).toBeInTheDocument();
    //8 Click the close button
    fireEvent.click(getByAltText(appointment, "Close"));
    //9 Check if back to the form element with Save text for button
    expect(getByText(appointment, "Save")).toBeInTheDocument();
    //10 Check that the DayListItem with the text "Monday" still has the text "1 spots remaining".
    const days = getAllByTestId(container, "day");
    const day = days.find(day => queryByText(day, "Monday"));
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  })
  it("shows the save error when failing to save an appointment", async ()=>{
    //Reject put request once
    axios.delete.mockRejectedValueOnce();
    
    // 1. Render the Application.
    const { container } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    // 3. Click the delete button on the Archie Cohen appointment
    const appointments = getAllByTestId(container, "appointment");

    const appointment = appointments.find(appointment => queryByText(appointment, 'Archie Cohen'));

    fireEvent.click(getByAltText(appointment, 'Delete'));

    // 4. Check that the element with the text "Are you sure you would like to delete?" is displayed
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    // 5. Click the confirm button in the confirmation element
    fireEvent.click(getByText(appointment, 'Confirm'))

    // 6. Check that the element with the text "DELETING" is displayed.
    expect(getByText(appointment, "DELETING")).toBeInTheDocument();
    // 7. Wait until the element with the text "DELETING" is gone
    await waitForElementToBeRemoved(()=>getByText(appointment, "DELETING"));

    // 7. Check if the error message is displayed "Could not delete appointment."
    expect(getByText(appointment, "Could not delete appointment.")).toBeInTheDocument();
    // 8. Click the close button
    fireEvent.click(getByAltText(appointment, "Close"));
    // 9. Check if back to the show element with Archie Cohen text for button
    expect(getByText(appointment, "Archie Cohen")).toBeInTheDocument();
    //10 Check that the DayListItem with the text "Monday" still has the text "1 spots remaining".
    const days = getAllByTestId(container, "day");
    const day = days.find(day => queryByText(day, "Monday"));
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  })
})
