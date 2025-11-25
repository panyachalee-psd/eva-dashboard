import { render, screen, waitFor, act } from "@testing-library/react";
import { WIMStatOverall } from "./StatOverall";
import axios from "axios";
import React from "react";

interface WeightBin {
  weight_range: string;
  count: number;
}

interface CompressedBin {
  range: string;
  count: number;
}

interface TrafficPoint {
  time: string;
  vehicles: number;
  violations: number;
}

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Instead of any[][]
let barChartCalls: CompressedBin[][] = [];
let lineChartCalls: TrafficPoint[][] = [];

jest.mock("recharts", () => {
  const React = require("react");
  return {
    BarChart: (props: { data: CompressedBin[]; children: React.ReactNode }) => {
      barChartCalls.push(props.data);
      return <div data-testid="bar-chart">{props.children}</div>;
    },
    LineChart: (props: {
      data?: TrafficPoint[];
      children: React.ReactNode;
    }) => {
      if (props.data) lineChartCalls.push(props.data);
      return <div data-testid="line-chart">{props.children}</div>;
    },
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    CartesianGrid: () => <div />,
    XAxis: () => <div />,
    YAxis: () => <div />,
    Tooltip: () => <div />,
    Bar: () => <div />,
    Line: () => <div />,
  };
});

// Helper for creating weight bins
const makeBins = (count: number): WeightBin[] =>
  Array.from({ length: count }).map((_, i) => ({
    weight_range: `${i * 1000}-${i * 1000 + 999}`,
    count: i + 1,
  }));

beforeEach(() => {
  mockedAxios.get.mockReset();
  barChartCalls = [];
  lineChartCalls = [];
});

describe("WIMStatOverall — TypeScript tests with proper act", () => {
  it("shows loading initially", async () => {
    mockedAxios.get.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ data: { data: [] } }), 50),
        ),
    );

    await act(async () => {
      render(<WIMStatOverall />);
    });

    expect(screen.getByTestId("loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
    });
  });

  it("compresses bins and maps correctly", async () => {
    const bins = makeBins(12);

    mockedAxios.get
      .mockResolvedValueOnce({ data: { data: [] } }) // traffic
      .mockResolvedValueOnce({ data: { data: bins } }); // weight

    await act(async () => {
      render(<WIMStatOverall />);
    });

    await waitFor(() => {
      const weightChart = barChartCalls.find((data) =>
        data.some((item) => "range" in item),
      );
      expect(weightChart).toBeDefined();
      expect(weightChart!.length).toBe(10);

      for (let i = 0; i < 9; i++) {
        expect(weightChart![i].range).toBe(bins[i].weight_range);
        expect(weightChart![i].count).toBe(bins[i].count);
      }

      const start = bins[9].weight_range.split("-")[0];
      const expectedCount = bins.slice(9).reduce((sum, x) => sum + x.count, 0);

      expect(weightChart![9].range).toBe(`${start}+`);
      expect(weightChart![9].count).toBe(expectedCount);
    });
  });

  it("maps non-compressed weight bins", async () => {
    const bins = makeBins(5);

    mockedAxios.get
      .mockResolvedValueOnce({ data: { data: [] } })
      .mockResolvedValueOnce({ data: { data: bins } });

    await act(async () => {
      render(<WIMStatOverall />);
    });

    await waitFor(() => {
      const weightChart = barChartCalls.find((data) =>
        data.some((item) => "range" in item),
      );
      expect(weightChart!.length).toBe(5);
      bins.forEach((item, idx) => {
        expect(weightChart![idx].range).toBe(item.weight_range);
        expect(weightChart![idx].count).toBe(item.count);
      });
    });
  });

  it("uses fallback bins when API returns empty", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: { data: [] } })
      .mockResolvedValueOnce({ data: { data: [] } });

    await act(async () => {
      render(<WIMStatOverall />);
    });

    await waitFor(() => {
      const weightChart = barChartCalls.find((data) =>
        data.some((item) => "range" in item),
      );
      expect(weightChart!.map((x) => x.range)).toEqual([
        "0-1000",
        "1001-2000",
        "2001-3000",
        "3001-4000",
      ]);
    });
  });

  it("handles API error gracefully", async () => {
    mockedAxios.get.mockRejectedValue(new Error("Network Error"));

    await act(async () => {
      render(<WIMStatOverall />);
    });

    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );

    expect(screen.getByText(/weight_distribution/i)).toBeInTheDocument();
    expect(screen.getByText(/traffic_violations/i)).toBeInTheDocument();
  });

  it("formats traffic hourly time correctly", async () => {
    const trafficData = [
      {
        dateTime: "2025-01-01T08:00:00Z",
        vehicle_count: 10,
        violations_count: 2,
      },
      {
        dateTime: "2025-01-01T09:00:00Z",
        vehicle_count: 5,
        violations_count: 1,
      },
    ];

    const expectedTraffic: TrafficPoint[] = [
      { time: "15:00", vehicles: 10, violations: 2 },
      { time: "16:00", vehicles: 5, violations: 1 },
    ];

    mockedAxios.get
      .mockResolvedValueOnce({ data: { data: trafficData } }) // traffic
      .mockResolvedValueOnce({ data: { data: [] } }); // weight empty

    await act(async () => {
      render(<WIMStatOverall />);
    });

    await waitFor(() => {
      const trafficChart = lineChartCalls.find((data) =>
        data.some((item) => "time" in item),
      );
      expect(trafficChart).toBeDefined();
      expect(trafficChart).toEqual(expect.arrayContaining(expectedTraffic));
    });
  });
});
