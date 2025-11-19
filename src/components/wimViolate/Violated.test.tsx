import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ViolatedTable, { timeAgo } from './Violated';
import api from "@/utils/axios";

jest.mock("@/utils/axios", () => ({
  get: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("../vehicleDetail/VehicleDetailModal", () => () => (
  <div data-testid="vehicle-modal" />
));

describe("timeAgo()", () => {
  beforeEach(() => {
    // Freeze system time so output is stable
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-01-01T12:00:00Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("returns seconds ago", () => {
    const input = "2025-01-01T11:59:45Z"; // 15s ago
    expect(timeAgo(input)).toBe("15s ago");
  });

  test("returns minutes ago", () => {
    const input = "2025-01-01T11:50:00Z"; // 10 min ago
    expect(timeAgo(input)).toBe("10 min ago");
  });

  test("returns hours ago", () => {
    const input = "2025-01-01T08:00:00Z"; // 4 hours ago
    expect(timeAgo(input)).toBe("4 hours ago");
  });

  test("returns days ago", () => {
    const input = "2024-12-30T12:00:00Z"; // 2 days ago
    expect(timeAgo(input)).toBe("2 days ago");
  });
});

describe("<ViolatedTable />", () => {
  const apiPayload = {
    data: {
      page: 1,
      perPage: 20,
      totalItems: 8,
      totalPages: 1,
      data: [
        {
          id: "a2f8507d-00da-42c6-9092-078c33223a11",
          plate_num_front: "H160SR",
          country_code_front: "NLD",
          speed: 108,
          length: 417,
          towt_kg: 1600,
          axles: 2,
          car_type: "CAR",
          date_veh: "2025-10-17T05:01:00.510Z",
        },
        {
          id: "ee9ca65d-83df-4a02-b485-09c2e9a2b9c3",
          plate_num_front: "ER867RM",
          country_code_front: "FRA",
          speed: 113,
          length: 516,
          towt_kg: 3500,
          axles: 2,
          car_type: "CAR",
          date_veh: "2025-10-17T04:13:34.260Z",
        },
      ],
    },
  };

  it("renders rows from API", async () => {
    (api.get as jest.Mock).mockResolvedValue(apiPayload);

    render(<ViolatedTable />);

    await waitFor(() => {
      expect(screen.getByText("H160SR")).toBeInTheDocument();
      expect(screen.getByText("ER867RM")).toBeInTheDocument();
    });

    expect(screen.getAllByText("CAR").length).toBeGreaterThanOrEqual(2);
    expect(api.get).toHaveBeenCalledTimes(1);
  });
});
