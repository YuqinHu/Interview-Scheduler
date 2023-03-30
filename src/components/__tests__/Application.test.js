import React from "react";
import { render, cleanup } from "@testing-library/react";
import { fireEvent, waitForElement, getByText, prettyDOM, getAllByTestId, getByPlaceholderText, getByAltText, act } from "@testing-library/react";
import Application from "components/Application";

afterEach(cleanup);

it("renders without crashing", () => {
  render(<Application />);
});

it("defaults to Monday and changes the schedule when a new day is selected", () => {
  const { getByText } = render(<Application />);

  return waitForElement(() => getByText("Monday")).then(() => {

    act(() => {
    fireEvent.click(getByText("Tuesday"));
    })
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });
});

it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
  const { container } = render(<Application />);

  await waitForElement(() => getByText(container, "Archie Cohen"));

  const appointments = getAllByTestId(container, "appointment");
  const appointment = appointments[0];

  fireEvent.click(getByAltText(appointment, "Add"));

  fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
    target: { value: "Lydia Miller-Jones" }
  });
  fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

  fireEvent.click(getByText(appointment, "Save"));

  console.log(prettyDOM(appointment));
});