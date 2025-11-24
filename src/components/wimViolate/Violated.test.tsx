import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ViolatedTable, { timeAgo } from "./Violated";
import api from "@/utils/axios";
import "@testing-library/jest-dom";

// -------------------
// Mock axios
// -------------------
jest.mock("@/utils/axios", () => ({
  get: jest.fn(),
}));

// -------------------
// Mock translations
// -------------------
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// -------------------
// Mock modal
// -------------------
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

const mockFilteredResponse = {
  data: {
    data: mockItems.filter(item => item.plate_num_front.includes("AAA1")), // e.g., filter by "AAA1"
    totalItems: mockItems.filter(item => item.plate_num_front.includes("AAA1")).length,
  },
};

const mockResponsePage2 = {
  data: {
    data: mockItems.slice(10, 11), // second page
    totalItems: mockItems.length,
  },
};

// --------------------------
// timeAgo Tests
// --------------------------
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

// --------------------------
// ViolatedTable Tests
// --------------------------
// --------------------------
// ViolatedTable Tests (Pagination / Sorting / Filtering)
// --------------------------
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

  // --------------------------
  // ---------------------------
// Pagination Test
// ---------------------------
test("pagination triggers API call", async () => {
  (api.get as jest.Mock)
    .mockReset()
    .mockResolvedValueOnce(mockResponse)       // page 1
    .mockResolvedValueOnce(mockResponsePage2); // page 2

  render(<ViolatedTable />);

  // Wait for first page to load
  await screen.findByText("AAA0");

  // Click Next page button
  const nextButton = document.querySelector(".p-paginator-next") as HTMLElement;
  fireEvent.click(nextButton);

  // Wait for second API call
  await waitFor(() => {
    expect(api.get).toHaveBeenCalledTimes(2);
  });

  // Check that second page row is rendered
  const rows = await screen.findAllByRole("row");
  const found = rows.some((row) =>
    Array.from(row.querySelectorAll("td"))
      .map((cell) => cell.textContent?.trim())
      .join(" ")
      .includes("AAA10") // item on page 2
  );

  expect(found).toBe(true);
});

// ---------------------------
// Sorting Test
// ---------------------------
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
      .includes("AAA0")
  );

  expect(found).toBe(true);
});

// ---------------------------
// Filtering Test
// ---------------------------
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
      .includes("AAA0")
  );

  expect(found).toBe(true);
});

});

// describe("<ViolatedTable />", () => {
//   const mockResponse = {
//     data: {
//       data: [
//         {
//           id: "111111111",
//           plate_num_front: "AAA111",
//           country_code_front: "USA",
//           speed: 90,
//           length: 420,
//           towt_kg: 3000,
//           axles: 2,
//           car_type: "CAR",
//           date_veh: "2025-01-01T11:59:00Z",
//         },
//         {
//           id: "222222222",
//           plate_num_front: "BBB222",
//           country_code_front: "FRA",
//           speed: 77,
//           length: 350,
//           towt_kg: 1500,
//           axles: 2,
//           car_type: "CAR",
//           date_veh: "2025-01-01T11:00:00Z",
//         },
//       ],
//       totalItems: 2,
//     },
//   };

//   beforeEach(() => {
//     (api.get as jest.Mock).mockReset();
//     (api.get as jest.Mock).mockResolvedValue(mockResponse);
//   });

//   // --------------------------------------------------------------------
//   test("loads and displays API data", async () => {
//     render(<ViolatedTable />);

//     expect(api.get).toHaveBeenCalledTimes(1);

//     await screen.findByText("AAA111");
//     await screen.findByText("BBB222");
//     // expect(screen.getByText("CAR")).toBeInTheDocument();
//     const carCells = screen.getAllByText("CAR");
// expect(carCells.length).toBeGreaterThan(0);
//   });

//   // --------------------------------------------------------------------
//   test("handles API failure safely", async () => {
//     (api.get as jest.Mock).mockRejectedValueOnce(new Error("API error"));

//     render(<ViolatedTable />);

//     await waitFor(() =>
//       expect(screen.queryByText("AAA111")).not.toBeInTheDocument()
//     );
//   });

//   // --------------------------------------------------------------------
//   // test("pagination triggers API call", async () => {
//   //   render(<ViolatedTable />);

//   //   await screen.findByText("AAA111");

//   //   const nextButton = document.querySelector(
//   //     ".p-paginator-next"
//   //   ) as HTMLElement;

//   //   if (nextButton) fireEvent.click(nextButton);

//   //   await waitFor(() => {
//   //     expect(api.get).toHaveBeenCalledTimes(2);
//   //   });
//   // });
//  // --------------------
// // Pagination test
// // --------------------
// // test("pagination triggers API call", async () => {
// //   (api.get as jest.Mock).mockReset();
// //   (api.get as jest.Mock)
// //     .mockResolvedValueOnce(mockResponse)      // first page
// //     .mockResolvedValueOnce(mockResponsePage2); // second page

// //   render(<ViolatedTable />);

// //   // Wait for first page to render
// //   const firstRow = await screen.findAllByRole("row");
// //   expect(firstRow.some(r => r.textContent?.includes("AAA0"))).toBe(true);

// //   // Click Next page
// //   const nextButton = document.querySelector(".p-paginator-next") as HTMLElement;
// //   fireEvent.click(nextButton);

// //   // Wait for second page rows
// //   await waitFor(async () => {
// //     const secondPageRows = await screen.findAllByRole("row");
// //     expect(secondPageRows.some(r => r.textContent?.includes("AAA10"))).toBe(true);
// //     expect(api.get).toHaveBeenCalledTimes(2);
// //   });
// // });
// test("pagination triggers API call", async () => {
//   (api.get as jest.Mock).mockReset();
//   (api.get as jest.Mock)
//     .mockResolvedValueOnce(mockResponse)      // page 1
//     .mockResolvedValueOnce(mockResponsePage2); // page 2

//   render(<ViolatedTable />);

//   // Wait for page 1 rows
//   await waitFor(async () => {
//     const firstRows = await screen.findAllByRole("row");
//     // Check for any row containing "AAA0" to "AAA9"
//     const hasPage1Row = firstRows.some(r =>
//       r.textContent?.match(/AAA[0-9]/)
//     );
//     expect(hasPage1Row).toBe(true);
//   });

//   // Click Next page
//   const nextButton = document.querySelector(".p-paginator-next") as HTMLElement;
//   fireEvent.click(nextButton);

//   // Wait for page 2 row
//   await waitFor(async () => {
//     const secondRows = await screen.findAllByRole("row");
//     const hasPage2Row = secondRows.some(r =>
//       r.textContent?.includes("AAA10")
//     );
//     expect(hasPage2Row).toBe(true);
//     expect(api.get).toHaveBeenCalledTimes(2);
//   });
// });

// // --------------------
// // Sorting test
// // --------------------
// // test("sorting triggers API call", async () => {
// //   (api.get as jest.Mock).mockReset();
// //   (api.get as jest.Mock)
// //     .mockResolvedValueOnce(mockResponse)   // initial load
// //     .mockResolvedValueOnce(mockResponse);  // sorted results

// //   render(<ViolatedTable />);

// //   // Wait for initial rows
// //   const initialRows = await screen.findAllByRole("row");
// //   expect(initialRows.some(r => r.textContent?.includes("AAA0"))).toBe(true);

// //   // Click first sortable column header
// //   const sortableHeaders = screen.getAllByRole("columnheader");
// //   fireEvent.click(sortableHeaders[0]);

// //   // Wait for sorted rows
// //   await waitFor(async () => {
// //     const sortedRows = await screen.findAllByRole("row");
// //     expect(sortedRows.some(r => r.textContent?.includes("AAA0"))).toBe(true);
// //     expect(api.get).toHaveBeenCalledTimes(2);
// //   });
// // });
// test("sorting triggers API call", async () => {
//   // Reset mocks
//   (api.get as jest.Mock).mockReset();

//   // First call: initial unsorted data
//   // Second call: simulate sorted data
//   const sortedResponse = {
//     data: {
//       data: [...mockItems].sort((a, b) => a.plate_num_front.localeCompare(b.plate_num_front)),
//       totalItems: mockItems.length,
//     },
//   };

//   (api.get as jest.Mock)
//     .mockResolvedValueOnce(mockResponse) // initial load
//     .mockResolvedValueOnce(sortedResponse); // sorted result

//   render(<ViolatedTable />);

//   // Wait for initial page to load
//   await waitFor(async () => {
//     const rows = await screen.findAllByRole("row");
//     const hasRow = rows.some(r => r.textContent?.match(/AAA[0-9]/));
//     expect(hasRow).toBe(true);
//   });

//   // Click the first sortable column header to trigger sorting
//   const sortableHeaders = screen.getAllByRole("columnheader");
//   fireEvent.click(sortableHeaders[0]);

//   // Wait for sorted results
//   await waitFor(async () => {
//     const sortedRows = await screen.findAllByRole("row");
//     // Check that at least one of the rows contains "AAA0"
//     const hasSortedRow = sortedRows.some(r =>
//       r.textContent?.includes("AAA0")
//     );
//     expect(hasSortedRow).toBe(true);

//     // Ensure API was called twice (initial + sort)
//     expect(api.get).toHaveBeenCalledTimes(2);
//   });
// });

// // --------------------
// // Filtering test
// // --------------------
// // test("filtering triggers API call", async () => {
// //   (api.get as jest.Mock).mockReset();
// //   (api.get as jest.Mock)
// //     .mockResolvedValueOnce(mockResponse)   // initial load
// //     .mockResolvedValueOnce(mockResponse);  // filtered results

// //   render(<ViolatedTable />);

// //   // Wait for initial rows
// //   const initialRows = await screen.findAllByRole("row");
// //   expect(initialRows.some(r => r.textContent?.includes("AAA0"))).toBe(true);

// //   // Enter filter value
// //   const input = screen.getByPlaceholderText("search_violations_by");
// //   fireEvent.input(input, { target: { value: "AAA" } });

// //   // Wait for filtered rows
// //   await waitFor(async () => {
// //     const filteredRows = await screen.findAllByRole("row");
// //     expect(filteredRows.some(r => r.textContent?.includes("AAA0"))).toBe(true);
// //     expect(api.get).toHaveBeenCalledTimes(2);
// //   });
// // });
// test("filtering triggers API call", async () => {
//   (api.get as jest.Mock).mockReset();
//   (api.get as jest.Mock)
//     .mockResolvedValueOnce(mockResponse)       // initial load
//     .mockResolvedValueOnce(mockFilteredResponse); // filtered result

//   render(<ViolatedTable />);

//   // Wait for initial page
//   await waitFor(async () => {
//     const firstRows = await screen.findAllByRole("row");
//     const hasRow = firstRows.some(r => r.textContent?.match(/AAA[0-9]/));
//     expect(hasRow).toBe(true);
//   });

//   // Apply filter
//   const input = screen.getByPlaceholderText("search_violations_by");
//   fireEvent.input(input, { target: { value: "AAA1" } });

//   // Wait for filtered results
//   await waitFor(async () => {
//     const filteredRows = await screen.findAllByRole("row");
//     const hasFilteredRow = filteredRows.some(r =>
//       r.textContent?.includes("AAA1")
//     );
//     expect(hasFilteredRow).toBe(true);
//     expect(api.get).toHaveBeenCalledTimes(2);
//   });
// });


//   // --------------------------------------------------------------------
//   test("row click opens modal", async () => {
//     render(<ViolatedTable />);

//     const rowText = await screen.findByText("AAA111");
//     fireEvent.click(rowText);

//     expect(screen.getByTestId("vehicle-modal-open")).toBeInTheDocument();
//   });
// });
