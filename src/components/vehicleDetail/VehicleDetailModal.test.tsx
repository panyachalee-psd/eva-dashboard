// VehicleDetailModal.test.tsx
import { render, screen, waitFor, within } from "@testing-library/react";
import VehicleDetailModal from "../vehicleDetail/VehicleDetailModal";
import axios from "axios";
import { VehcleViolDetail } from "../../models/vehicleModel";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "en", changeLanguage: jest.fn() },
  }),
}));

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock Vehicle Data
const mockVehicle = {
  id: "605b8c7c-a8c2-478b-ab3a-04bd91e4d600",
  lane_number: "1",
  station_number: "8",
  date_veh: "2025-10-17T04:40:28.070Z",
  bool_ceanpr: false,
  plate_num_front: "2DHK895",
  country_code_front: "BEL",
  date_plate_front: "2025-10-17T04:40:28.070Z",
  car_class: "1",
  car_type: "Truck",
  axles: 2,
  multiple_wheel: true,
  date_sh_first_axle: "2025-10-17T04:40:28.070Z",
  plate_num_rear: "2DHK896",
  country_code_rear: "BEL",
  date_plate_rear: "2025-10-17T04:40:28.070Z",
  bool_tmd_anpr: false,
  created_at: "2025-11-20T04:10:50.090Z",
  speed: 129,
  speed_excess: 0,
  length: 462,
  length_excess: 0,
  towt_kg: 2100,
  towt_excess: 0,
  towt_valid: "NV",
};

// Mock Vehicle Detail API Response
const mockVehicleDetail: VehcleViolDetail = {
  vehicle: {
    id: mockVehicle.id,
    lane_number: "1",
    station_number: "8",
    date_veh: mockVehicle.date_veh,
    plate_num_front: mockVehicle.plate_num_front,
    country_code_front: mockVehicle.country_code_front,
    car_class: "1",
    car_type: "Truck",
    multiple_wheel: true,
    photo_front_plate: "BASE64_FRONT",
    photo_overview: "BASE64_OVERVIEW",
    isOverweight: false,
    created_at: mockVehicle.created_at,
  },
  vehicle_measures: [
    {
      speed: 129,
      speed_excess: 0,
      length: 462,
      length_excess: 0,
      towt_kg: 2100,
      towr_kg: 1050,
      towl_kg: 1050,
      towt_excess: 0,
      towt_valid: "NV",
    },
  ],
  axles: [
    {
      axle_no: 1,
      weight_excess: 0,
      weight: 1200,
      weight_left: 600,
      weight_right: 600,
    },
    {
      axle_no: 2,
      weight_excess: 0,
      weight: 900,
      weight_left: 450,
      weight_right: 450,
    },
  ],
  maximum: {
    max_length: 0,
    max_speed: 0,
    max_weight: 0,
  },
};

describe("VehicleDetailModal", () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: mockVehicleDetail });
  });

  it("renders modal title with vehicle plate number", async () => {
    render(
      <VehicleDetailModal
        isOpen={true}
        onClose={() => {}}
        vehicle={mockVehicle}
      />,
    );
    await waitFor(() =>
      expect(
        screen.getByText(/vehicle_weight_information - 2DHK895/i),
      ).toBeInTheDocument(),
    );
  });

  it("renders basic information cards", async () => {
    render(
      <VehicleDetailModal
        isOpen={true}
        onClose={() => {}}
        vehicle={mockVehicle}
      />,
    );
    await waitFor(() => {
      expect(screen.getByText(/BEL/i)).toBeInTheDocument();
      expect(screen.getByText(/Truck/i)).toBeInTheDocument();
    });
  });

  it("renders measurements cards", async () => {
    render(
      <VehicleDetailModal
        isOpen={true}
        onClose={() => {}}
        vehicle={mockVehicle}
      />,
    );
    await waitFor(() => {
      expect(screen.getByText(/129 km\/h/i)).toBeInTheDocument();
      expect(screen.getByText(/4.62 m/)).toBeInTheDocument();
      expect(screen.getByText(/2.1 t/)).toBeInTheDocument();
      expect(screen.getByText(/Not Valid/i)).toBeInTheDocument();
    });
  });

  it("renders axles weight left and right", async () => {
    render(
      <VehicleDetailModal
        isOpen={true}
        onClose={() => {}}
        vehicle={mockVehicle}
      />,
    );

    await waitFor(() => {
      // Left side
      const leftCard = screen
        .getByText(/left_side/i)
        .closest(".border-green-800");
      expect(leftCard).toHaveTextContent(/axle 1/i);
      expect(leftCard).toHaveTextContent("0.6 t");
      expect(leftCard).toHaveTextContent(/axle 2/i);
      expect(leftCard).toHaveTextContent("0.45 t");

      // Right side
      const rightCard = screen
        .getByText(/right_side/i)
        .closest(".border-green-800");
      expect(rightCard).toHaveTextContent(/axle 1/i);
      expect(rightCard).toHaveTextContent("0.6 t");
      expect(rightCard).toHaveTextContent(/axle 2/i);
      expect(rightCard).toHaveTextContent("0.45 t");
    });
  });

  it("renders legal limits cards", async () => {
    render(
      <VehicleDetailModal
        isOpen={true}
        onClose={() => {}}
        vehicle={mockVehicle}
      />,
    );

    await waitFor(() => {
      // Get all cards
      const legalLimitCards = screen.getAllByTestId("legal-limits-card");

      // Find the one that contains "Max Weight"
      const maxWeightCard = legalLimitCards.find((card) =>
        card.textContent?.includes("max_weight"),
      );

      if (!maxWeightCard) {
        throw new Error("Max Weight legal limits card not found");
      }

      const withinCard = within(maxWeightCard);

      // Check actual weight
      expect(
        withinCard.getByText((content) => content.includes("2.1")),
      ).toBeInTheDocument();

      // Check maximum allowed weight
      expect(
        withinCard.getByText((content) => content.includes("0")),
      ).toBeInTheDocument();
    });
  });

  it("renders vehicle images if provided", async () => {
    const vehicleWithPhotos = {
      ...mockVehicle,
      photo_overview: "mockOverviewBase64",
      photo_front_plate: "mockFrontBase64",
    };
    const mockDetailWithPhotos = {
      ...mockVehicleDetail,
      vehicle: vehicleWithPhotos,
    };
    mockedAxios.get.mockResolvedValueOnce({ data: mockDetailWithPhotos });

    render(
      <VehicleDetailModal
        isOpen={true}
        onClose={() => {}}
        vehicle={vehicleWithPhotos}
      />,
    );
    await waitFor(() => {
      expect(screen.getAllByRole("img")).toHaveLength(2);
    });
  });

  it("shows loading message while fetching data", async () => {
    mockedAxios.get.mockImplementationOnce(() => new Promise(() => {})); // never resolves
    render(
      <VehicleDetailModal
        isOpen={true}
        onClose={() => {}}
        vehicle={mockVehicle}
      />,
    );
    expect(screen.getByText(/loading_vehicle_data/i)).toBeInTheDocument();
  });

  it("shows error message on fetch failure", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("API Error"));
    render(
      <VehicleDetailModal
        isOpen={true}
        onClose={() => {}}
        vehicle={mockVehicle}
      />,
    );
    await waitFor(() =>
      expect(
        screen.getByText(/Failed to load vehicle data/i),
      ).toBeInTheDocument(),
    );
  });
});
