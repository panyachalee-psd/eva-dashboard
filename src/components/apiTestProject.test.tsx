import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import axios from "axios";
import type { AxiosStatic } from "axios";
import  CustomerTable from "../components/ApiTestProject"// adjust import path

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<AxiosStatic>;

describe("CustomerTable interactions", () => {
  const mockResponse = {
    data: {
      data: [
        {
          id: "abc123",
          plate: "AB-123",
          vehicleType: "Truck",
          totalWeight: 25000,
          weightLimit: 20000,
          outcome: "Overweight",
          speed: 65,
          datetime: "2025-10-23 10:30",
          severity: "High",
        },
        {
          id: "abc124",
          plate: "CD-456",
          vehicleType: "Car",
          totalWeight: 1500,
          weightLimit: 2000,
          outcome: "OK",
          speed: 90,
          datetime: "2025-10-23 12:30",
          severity: "Low",
        },
      ],
      totalItems: 20,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls API again when sorting by a column", async () => {
    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    render(<CustomerTable />);

    // Wait for initial data
    await waitFor(() => screen.getByText("AB-123"));
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);

    // Mock a new API call for the sort event
    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    // Click on a sortable column header (e.g., 'Vehicle')
    const vehicleHeader = screen.getByText("Vehicle");
    await userEvent.click(vehicleHeader);

    // Wait for re-fetch after sorting
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
      expect(mockedAxios.get).toHaveBeenLastCalledWith(
        expect.stringContaining("http://85.204.247.82:3007/wim"),
        expect.objectContaining({
          params: expect.objectContaining({
            orderBy: "plate",
            orderSort: "asc", // 👈 should map from sortOrder === 1
          }),
        })
      );
    });
  });

  it("calls API again when changing pagination page", async () => {
    mockedAxios.get.mockResolvedValueOnce(mockResponse);
    render(<CustomerTable />);

    // Wait for data to appear
    await waitFor(() => screen.getByText("AB-123"));

    // Mock the next page API call
    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    // Find the paginator next button — PrimeReact uses aria-labels
    const nextButton = screen.getByLabelText("Next Page");

    // Click to go to next page
    await userEvent.click(nextButton);

    // Wait for API to be called again with updated page param
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
      expect(mockedAxios.get).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({
            page: 2, // 👈 next page should be 2 (since first page = 1)
          }),
        })
      );
    });
  });

  it("filters when typing in the search box", async () => {
    mockedAxios.get.mockResolvedValue(mockResponse);
    render(<CustomerTable />);

    await waitFor(() => screen.getByText("AB-123"));

    // Type into global search box
    const searchInput = screen.getByPlaceholderText("Global Search");
    await userEvent.type(searchInput, "Truck");

    // The filter should update immediately (client-side filtering)
    await waitFor(() => {
      expect(screen.getByText("Truck")).toBeInTheDocument();
    });
  });
});
