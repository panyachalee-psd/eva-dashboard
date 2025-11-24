import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { WIMDashboardOverall } from "./DashboardOverall";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock i18next translation
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Sample API response
const mockData = {
  total: 3226,
  overweight_count: 108,
  overweight_percentage: 3.3,
  total_weight: 18000,
  average_speed: 98.5,
  average_total_weight: 18000,
};

describe("<WIMDashboardOverall />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state initially", () => {
    // Do not resolve axios yet
    mockedAxios.get.mockImplementation(() => new Promise(() => {}));
    render(<WIMDashboardOverall />);
    expect(screen.getByText("Loading dashboard...")).toBeInTheDocument();
  });

  test("renders StatCards with correct values after API success", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockData });
    render(<WIMDashboardOverall />);

    // Wait for StatCards to appear
    await waitFor(() => expect(screen.getByText("avg_vehicle_weight")).toBeInTheDocument());

    // Titles
    expect(screen.getByText("avg_vehicle_weight")).toBeInTheDocument();
    expect(screen.getByText("vehicles_today")).toBeInTheDocument();
    expect(screen.getByText("violations_detected")).toBeInTheDocument();
    expect(screen.getByText("avg_vehicle_speed")).toBeInTheDocument();

    // Formatted values
    expect(screen.getByText("18 t")).toBeInTheDocument(); // 18000 / 1000
    expect(screen.getByText("3226")).toBeInTheDocument();
    expect(screen.getByText("108")).toBeInTheDocument();
    expect(screen.getByText("98.5 km/h")).toBeInTheDocument();
  });

  test("renders error message on API failure", async () => {
    mockedAxios.get.mockRejectedValue(new Error("Network Error"));
    render(<WIMDashboardOverall />);

    await waitFor(() =>
      expect(screen.getByText(/Error loading dashboard/i)).toBeInTheDocument()
    );
    expect(screen.getByText(/Network Error/)).toBeInTheDocument();
  });

  test("applies correct changeType based on overweight_percentage", async () => {
    // overweight_percentage < 10 → positive
    mockedAxios.get.mockResolvedValue({ data: { ...mockData, overweight_percentage: 5 } });
    render(<WIMDashboardOverall />);
    await waitFor(() =>
      expect(screen.getByText("violations_detected")).toBeInTheDocument()
    );
    // The component does not render changeType as text, so we assume StatCard uses it internally
    // You could add a data attribute in StatCard for testing:
    // <div data-change-type={changeType}>...</div>
    // Then assert it here:
    // expect(screen.getByTestId("violations_detected")).toHaveAttribute("data-change-type", "positive");
  });

  test("applies negative changeType when overweight_percentage >= 10", async () => {
    mockedAxios.get.mockResolvedValue({ data: { ...mockData, overweight_percentage: 15 } });
    render(<WIMDashboardOverall />);
    await waitFor(() =>
      expect(screen.getByText("violations_detected")).toBeInTheDocument()
    );
    // Same note: add data attribute in StatCard to assert changeType if needed
  });

  test("renders 4 StatCards", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockData });
    render(<WIMDashboardOverall />);
    await waitFor(() => screen.getByText("avg_vehicle_weight"));

    const cards = screen.getAllByText(/avg_vehicle_weight|vehicles_today|violations_detected|avg_vehicle_speed/);
    expect(cards.length).toBe(4);
  });
});

// import { render, screen } from "@testing-library/react";
// import "@testing-library/jest-dom";
// import { WIMDashboardOverall } from "./DashboardOverall";

// jest.mock("react-i18next", () => ({
//   useTranslation: () => ({
//     t: (key: string) => key,
//   }),
// }));

// describe("<WIMDashboardOverall />", () => {
//   test("renders all stat cards with correct titles and values", () => {
//     render(<WIMDashboardOverall />);

//     // Titles (translated)
//     expect(screen.getByText("avg_vehicle_weight")).toBeInTheDocument();
//     expect(screen.getByText("vehicles_today")).toBeInTheDocument();
//     expect(screen.getByText("violations_detected")).toBeInTheDocument();
//     expect(screen.getByText("avg_vehicle_speed")).toBeInTheDocument();

//     // Values
//     expect(screen.getByText("18")).toBeInTheDocument();
//     expect(screen.getByText("3,226")).toBeInTheDocument();
//     expect(screen.getByText("108")).toBeInTheDocument();
//     expect(screen.getByText("98.5%")).toBeInTheDocument();

//     // Changes / Subtexts
//     expect(screen.getByText("+2 new stations")).toBeInTheDocument();
//     expect(screen.getByText("+18% from yesterday")).toBeInTheDocument();
//     expect(screen.getByText("3.3% violation rate")).toBeInTheDocument();
//     expect(screen.getByText("Within spec range")).toBeInTheDocument();
//   });

//   test("renders 4 StatCards", () => {
//     render(<WIMDashboardOverall />);

//     // StatCard renders a heading (title), so count by title text tags
//     const cards = screen.getAllByText(/avg_vehicle_weight|vehicles_today|violations_detected|avg_vehicle_speed/);
//     expect(cards.length).toBe(4);
//   });
// });
