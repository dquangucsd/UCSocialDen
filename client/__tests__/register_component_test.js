import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import RegisterScreen from "../app/register";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';

jest.mock("@react-native-async-storage/async-storage", () => ({
    getItem: jest.fn(),
}));

jest.mock('expo-image-picker', () => ({
    launchImageLibraryAsync: jest.fn(),
}));

global.fetch = jest.fn();
global.alert = jest.fn();


describe("RegisterScreen Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });


    test("loads user data from token", async () => {
        const fakeToken = "fake-jwt-token";
        const fakePayload = {
            email: "test@example.com",
            name: { givenName: "John", familyName: "Doe" },
        };

        AsyncStorage.getItem.mockResolvedValue(fakeToken);
        jest.spyOn(require("jwt-decode"), "jwtDecode").mockReturnValue(fakePayload);

        const { getByPlaceholderText } = render(<RegisterScreen />);
        
        await waitFor(() => {
            expect(getByPlaceholderText("Major")).toBeTruthy();
        });
    });

    test("updates state when form fields change", () => {
        const { getByPlaceholderText } = render(<RegisterScreen />);

        const majorInput = getByPlaceholderText("Major");
        fireEvent.changeText(majorInput, "Computer Science");

        expect(majorInput.props.value).toBe("Computer Science");
    });

    test("handles image upload", async () => {
        const mockImageUri = "file://mock-image.jpg";

        ImagePicker.launchImageLibraryAsync.mockResolvedValueOnce({
            canceled: false,
            assets: [{ uri: mockImageUri }],
        });

        const { getByText, queryByText } = render(<RegisterScreen />);

        fireEvent.press(getByText("Upload Profile Photo"));

        await waitFor(() => {
            expect(queryByText("Photo selected")).toBeTruthy();
        });
    });

    test("shows error on registration failure", async () => {
        AsyncStorage.getItem.mockResolvedValue("fake-jwt-token");

        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: "Registration failed" }),
        });

        const { getByText, getByPlaceholderText, queryByText } = render(<RegisterScreen />);

        fireEvent.changeText(getByPlaceholderText("Major"), "Computer Science");
        fireEvent.press(getByText("Register"));

        await waitFor(() => {
          expect(global.alert).toHaveBeenCalledWith("All required fields must be filled out.");
        });
    });
});
