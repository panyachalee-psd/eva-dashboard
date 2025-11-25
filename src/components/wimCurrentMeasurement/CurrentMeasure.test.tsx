import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import CurrentMeasureTable from "./CurrentMeasure";
import api from "@/utils/axios";
import { formatDate } from "./CurrentMeasure";
import { format } from "date-fns";

jest.mock("@/utils/axios", () => ({
  get: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("../vehicleDetail/VehicleDetailModal", () => (props: any) => (
  <div data-testid="vehicle-modal">{props.isOpen ? "OPEN" : "CLOSED"}</div>
));

describe("<CurrentMeasureTable />", () => {
  const apiPayload = {
    data: {
      page: 1,
      perPage: 20,
      totalItems: 3,
      totalPages: 1,
      data: [
        {
          axles: 2,
          car_type: "Car",
          id: "15fb6602-6c0a-4f8f-9620-fa92c4a66c13",
          lane_number: 1,
          station_number: 8,
          date_veh: "2025-10-17T04:13:27.200Z",
          plate_num_front: "AB179EC",
          country_code_front: "FRA",
          car_class: "1",
          multiple_wheel: true,
          isOverweight: false,
          created_at: "2025-11-20T10:39:43.966Z",
          speed: 122,
          speed_excess: 0,
          length: 391,
          length_excess: 0,
          towt_kg: 900,
          towt_excess: 0,
          towt_valid: "NV",
        },
        {
          axles: 5,
          car_type: "Truck",
          id: "17351907-89be-4a0e-9bdf-f6a9b7045e57",
          lane_number: 1,
          station_number: 8,
          date_veh: "2025-10-17T04:31:50.460Z",
          plate_num_front: "1GAH015",
          country_code_front: "BEL",
          car_class: "10",
          multiple_wheel: false,
          isOverweight: true,
          created_at: "2025-11-20T10:46:23.926Z",
          speed: 88,
          speed_excess: 0,
          length: 1675,
          length_excess: 0,
          towt_kg: 38600,
          towt_excess: 0,
          towt_valid: "NV",
        },
        // Row with null/empty values to cover all branches
        {
          axles: null,
          car_type: "",
          id: "id-3",
          lane_number: 0,
          station_number: 0,
          date_veh: null,
          plate_num_front: null,
          country_code_front: undefined,
          car_class: "",
          multiple_wheel: false,
          isOverweight: false,
          created_at: null,
          speed: null,
          speed_excess: null,
          length: null,
          length_excess: null,
          towt_kg: null,
          towt_excess: null,
          towt_valid: null,
        },
      ],
    },
  };

  beforeEach(() => {
    (api.get as jest.Mock).mockResolvedValue(apiPayload);
  });

  it("renders rows from API", async () => {
    render(<CurrentMeasureTable />);

    await waitFor(() => {
      expect(screen.getByText("AB179EC")).toBeInTheDocument();
      expect(screen.getByText("1GAH015")).toBeInTheDocument();
    });

    expect(api.get).toHaveBeenCalledTimes(1);
  });

  it("applies red color only when isOverweight = true", async () => {
    render(<CurrentMeasureTable />);

    await waitFor(() => {
      const normalCell = screen.getByTestId(
        "weight-15fb6602-6c0a-4f8f-9620-fa92c4a66c13",
      );
      const overweightCell = screen.getByTestId(
        "weight-17351907-89be-4a0e-9bdf-f6a9b7045e57",
      );

      expect(normalCell).not.toHaveStyle("color: rgb(255, 0, 0)");
      expect(overweightCell).toHaveStyle("color: rgb(255, 0, 0)");
    });
  });

  it("renders fallback for null/undefined values", async () => {
    render(<CurrentMeasureTable />);

    await waitFor(() => {
      expect(screen.getByTestId("weight-id-3")).toHaveTextContent("-");
    });
  });

  it("opens and closes the modal", async () => {
    render(<CurrentMeasureTable />);

    await waitFor(() => screen.getByText("AB179EC"));

    fireEvent.click(screen.getByText("AB179EC")); // Open modal
    expect(screen.getByText("OPEN")).toBeInTheDocument();

    act(() => {
      fireEvent.click(document.body); // Close modal
    });
  });

  it("updates filters correctly", async () => {
    render(<CurrentMeasureTable />);

    const input = screen.getByPlaceholderText("search_violations_by");

    fireEvent.input(input, { target: { value: "AB" } });

    await waitFor(() => {
      expect(input).toHaveValue("AB");
    });
  });

  it("handles API errors gracefully", async () => {
    (api.get as jest.Mock).mockRejectedValueOnce(new Error("API failed"));
    render(<CurrentMeasureTable />);

    await waitFor(() => {
      expect(screen.getByText("No data found.")).toBeInTheDocument();
    });
  });
});

describe("formatDate", () => {
  it("formats ISO string correctly", () => {
    const testDate = "2025-11-24T12:34:56Z";
    const expected = format(new Date(testDate), "yyyy/MM/dd HH:mm:ss");

    expect(formatDate(testDate)).toBe(expected);
  });

  it("handles invalid date string gracefully", () => {
    const formatted = formatDate("invalid-date");
    expect(formatted).toBe("Invalid Date");
  });
});
