import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import EventDetails from "../components/EventDetails"; // Adjust path based on your structure
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(() => Promise.resolve(JSON.stringify({ user: { _id: "user123" } }))),
}));

global.alert = jest.fn();
global.fetch = jest.fn((url, options) => {
  if (url.includes("/join_status")) {
    return Promise.resolve({
      json: () => Promise.resolve({ joined: false }), 
    });
  }
  if (url.includes("/join")) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ message: "Successfully joined" }),
    });
  }
  return Promise.reject("API URL not mocked");
});

describe("EventDetails - Join Button Functionality", () => {
    const eventMock = {
        _id: "event123",
        name: "Test Event",
        start_time: new Date().toISOString(),
        end_time: new Date().toISOString(),
        location: "Test Location",
        description: "This is a test event.",
        tags: "Technology",
      };      

  it("fetches join status on mount and updates state", async () => {
    render(<EventDetails event={eventMock} onClose={jest.fn()} />);

    await waitFor(() => expect(AsyncStorage.getItem).toHaveBeenCalledWith("user"));
    await waitFor(() => expect(fetch).toHaveBeenCalledWith(
      `http://localhost:5002/api/users/event123/join_status?userId=user123`
    ));
  });

  it("calls handleJoinEvent when the Join button is pressed", async () => {
    const { getByText } = render(<EventDetails event={eventMock} onClose={jest.fn()} />);

    const joinButton = await waitFor(() => getByText("Join"));
    fireEvent.press(joinButton);

    await waitFor(() => expect(fetch).toHaveBeenCalledWith(
      `http://localhost:5002/api/users/event123/join`,
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "user123" }),
      })
    ));
  });

  it("disables the Join button after joining", async () => {
    const { getByText, rerender } = render(<EventDetails event={eventMock} onClose={jest.fn()} />);

    const joinButton = await waitFor(() => getByText("Join"));
    await waitFor(() => fireEvent.press(joinButton));

    // Rerender with updated state
    rerender(<EventDetails event={eventMock} onClose={jest.fn()} />);
    await waitFor(() => expect(getByText("Joined")).toBeTruthy());
  });
});
