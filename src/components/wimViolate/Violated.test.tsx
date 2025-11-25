import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ViolatedTable, { timeAgo } from "./Violated";
import api from "@/utils/axios";
import "@testing-library/jest-dom";

// Mock axios
jest.mock("@/utils/axios", () => ({
  get: jest.fn(),
}));

// Mock translations
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock modal
jest.mock("../vehicleDetail/VehicleDetailModal", () => (props: any) => {
  return props.isOpen ? (
    <div data-testid="vehicle-modal-open">MODAL</div>
  ) : null;
});

const mockItems = Array.from({ length: 11 }, (_, i) => ({
  id: `id-${i}`,
  plate_num_front: `AAA${i}`,
  country_code_front: "USA",
  speed: 90 + i,
  length: 420,
  towt_kg: 3000,
  axles: 2,
  car_type: "CAR",
  date_veh: "2025-01-01T11:59:00Z",
}));

const mockResponse = {
  data: {
    data: mockItems.slice(0, 10), // first page
    totalItems: mockItems.length,
  },
};

const mockResponsePage2 = {
  data: {
    data: mockItems.slice(10, 11), // second page
    totalItems: mockItems.length,
  },
};

// timeAgo Tests
describe("timeAgo()", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-01-01T12:00:00Z"));
  });
  afterEach(() => jest.useRealTimers());

  test("returns seconds ago", () => {
    expect(timeAgo("2025-01-01T11:59:45Z")).toBe("15s ago");
  });

  test("returns minutes ago", () => {
    expect(timeAgo("2025-01-01T11:50:00Z")).toBe("10 min ago");
  });

  test("returns hours ago", () => {
    expect(timeAgo("2025-01-01T08:00:00Z")).toBe("4 hours ago");
  });

  test("returns days ago", () => {
    expect(timeAgo("2024-12-30T12:00:00Z")).toBe("2 days ago");
  });
});

// ViolatedTable Tests (Pagination / Sorting / Filtering)
describe("<ViolatedTable /> enhanced tests", () => {
  const mockItems = Array.from({ length: 11 }, (_, i) => ({
    id: `id-${i}`,
    plate_num_front: `AAA${i}`,
    country_code_front: "USA",
    speed: 90 + i,
    length: 420,
    towt_kg: 3000,
    axles: 2,
    car_type: "CAR",
    date_veh: "2025-01-01T11:59:00Z",
  }));

  const firstPage = {
    data: {
      data: mockItems.slice(0, 10),
      totalItems: mockItems.length,
    },
  };

  const secondPage = {
    data: {
      data: mockItems.slice(10, 11),
      totalItems: mockItems.length,
    },
  };

  beforeEach(() => {
    (api.get as jest.Mock).mockReset();
  });

  // Pagination Test
  test("pagination triggers API call", async () => {
    (api.get as jest.Mock)
      .mockReset()
      .mockResolvedValueOnce(mockResponse) // page 1
      .mockResolvedValueOnce(mockResponsePage2); // page 2

    render(<ViolatedTable />);

    // Wait for first page to load
    await screen.findByText("AAA0");

    // Click Next page button
    const nextButton = document.querySelector(
      ".p-paginator-next",
    ) as HTMLElement;
    fireEvent.click(nextButton);

    // Wait for second API call
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(2);
    });

    // Check that second page row is rendered
    const rows = await screen.findAllByRole("row");
    const found = rows.some(
      (row) =>
        Array.from(row.querySelectorAll("td"))
          .map((cell) => cell.textContent?.trim())
          .join(" ")
          .includes("AAA10"), // item on page 2
    );

    expect(found).toBe(true);
  });

  // Sorting Test
  test("sorting triggers API call", async () => {
    (api.get as jest.Mock)
      .mockReset()
      .mockResolvedValueOnce(mockResponse) // initial load
      .mockResolvedValueOnce(mockResponse); // sorted data

    render(<ViolatedTable />);

    // Wait for first page to load
    await screen.findByText("AAA0");

    // Click first sortable header to trigger sorting
    const sortableHeaders = screen.getAllByRole("columnheader");
    fireEvent.click(sortableHeaders[0]);

    // Wait for API call
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(2);
    });

    // Check that sorted row exists
    const rows = await screen.findAllByRole("row");
    const found = rows.some((row) =>
      Array.from(row.querySelectorAll("td"))
        .map((cell) => cell.textContent?.trim())
        .join(" ")
        .includes("AAA0"),
    );

    expect(found).toBe(true);
  });

  // Filtering Test
  test("filtering triggers API call", async () => {
    (api.get as jest.Mock)
      .mockReset()
      .mockResolvedValueOnce(mockResponse) // initial load
      .mockResolvedValueOnce(mockResponse); // filtered result

    render(<ViolatedTable />);

    // Wait for first page
    await screen.findByText("AAA0");

    // Enter filter text
    const input = screen.getByPlaceholderText("search_violations_by");
    fireEvent.input(input, { target: { value: "AAA" } });

    // Wait for API call
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(2);
    });

    // Check that filtered rows exist
    const rows = await screen.findAllByRole("row");
    const found = rows.some((row) =>
      Array.from(row.querySelectorAll("td"))
        .map((cell) => cell.textContent?.trim())
        .join(" ")
        .includes("AAA0"),
    );

    expect(found).toBe(true);
  });
});
