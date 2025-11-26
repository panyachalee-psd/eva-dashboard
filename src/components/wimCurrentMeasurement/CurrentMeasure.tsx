"use client";
import React, { useState, useEffect, JSX, useCallback } from "react";
import {
  DataTable,
  DataTablePageEvent,
  DataTableSortEvent,
  DataTableFilterEvent,
  DataTableFilterMetaData,
  DataTableOperatorFilterMetaData,
} from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Card, CardContent } from "../ui/card";
import VehicleDetailModal from "../vehicleDetail/VehicleDetailModal";
import "./CurrentMeasure.css";
import { useTranslation } from "react-i18next";
import api from "@/utils/axios";
import { format } from "date-fns";
import { VehicleList, LazyState } from "../../models/vehicleModel";

type DataTableFilterMeta = {
  [key: string]: DataTableFilterMetaData | DataTableOperatorFilterMetaData;
};

async function fetchCurVehicleFromApi({
  page,
  rows,
  sortField,
  sortOrder,
  filters,
}: {
  page: number;
  rows: number;
  sortField?: string;
  sortOrder?: 1 | -1 | 0 | null;
  filters: LazyState["filters"];
}): Promise<{ data: VehicleList[]; total: number }> {
  try {
    const sortOrderValue =
      sortOrder === 1 ? "ASC" : sortOrder === -1 ? "DESC" : undefined;
    const searchText = filters.global?.value?.toString() ?? "";

    const res = await api.get(`/dashboard`, {
      params: {
        page: page,
        perPage: rows,
        sortBy: sortField,
        sortOrder: sortOrderValue,
        search: searchText,
      },
    });

    return {
      data: res.data.data,
      total: res.data.totalItems,
    };
  } catch (error) {
    return { data: [], total: 0 };
  }
}

function formatT(value: number) {
  if (value == null) return "-";
  return `${value / 1000} t`;
}

function formatM(value: number) {
  if (value == null) return "-";
  return `${value / 100} m`;
}

function formatKm(value: number) {
  if (value == null) return "-";
  return `${value} km/h`;
}

const TowtStatusTemplate = (value: string) => {
  const isNV = value === "NV";
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 10px",
        borderRadius: "12px",
        fontSize: "0.75rem",
        fontWeight: 600,
        color: "white",
        background: isNV ? "#dc2626" : "#048018", // red / green
        textTransform: "uppercase",
      }}
    >
      {isNV ? "NV" : value}
    </span>
  );
};

export const formatDate = (dateString: string | undefined | null) => {
  if (!dateString) return "-"; // fallback for empty/undefined/null

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date"; // fallback for invalid date

  return format(date, "yyyy/MM/dd HH:mm:ss");
};

const emptyTemplate = (value?: unknown): string => {
  return value === null || value === undefined || value === ""
    ? "-"
    : String(value);
};

export default function CurrentMeasureTable(): JSX.Element {
  const { t } = useTranslation();

  const [vehicles, setVehicle] = useState<VehicleList[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const [lazyState, setLazyState] = useState<LazyState>({
    first: 0,
    rows: 10,
    page: 0,
    sortField: undefined,
    sortOrder: undefined,
    filters: {
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    },
  });
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleList | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadViolateVehicle = useCallback(async () => {
    setLoading(true);
    const { data, total } = await fetchCurVehicleFromApi({
      page: lazyState.page + 1,
      rows: lazyState.rows,
      sortField: lazyState.sortField,
      sortOrder: lazyState.sortOrder,
      filters: lazyState.filters,
    });

    setVehicle(data);
    setTotalRecords(total);
    setLoading(false);
  }, [
    lazyState.page,
    lazyState.rows,
    lazyState.sortField,
    lazyState.sortOrder,
    lazyState.filters,
  ]);

  useEffect(() => {
    loadViolateVehicle();
  }, [loadViolateVehicle]);

  // ✅ DataTable event handlers
  // -----------------------------
  // Handlers
  // -----------------------------
  const onPage = (event: DataTablePageEvent) => {
    setLazyState((prev) => ({
      ...prev,
      first: event.first,
      rows: event.rows,
      page: event.page ?? 0,
    }));
  };

  const onSort = (event: DataTableSortEvent) => {
    setLazyState((prev) => ({
      ...prev,
      sortField: event.sortField ?? undefined,
      sortOrder: event.sortOrder ?? undefined,
    }));
  };

  const onFilter = (event: DataTableFilterEvent) => {
    const newFilters: LazyState["filters"] = {};

    Object.keys(event.filters).forEach((key) => {
      const f = event.filters[key];

      if (!f) return;

      // Single-value filter
      if ("value" in f && "matchMode" in f) {
        newFilters[key] = {
          value: f.value ?? null,
          matchMode:
            f.matchMode as (typeof FilterMatchMode)[keyof typeof FilterMatchMode],
        };
      }

      // Multi-operator filter (take first constraint)
      else if (
        "operator" in f &&
        Array.isArray(f.constraints) &&
        f.constraints.length > 0
      ) {
        const constraint = f.constraints[0];
        newFilters[key] = {
          value: constraint.value ?? null,
          matchMode:
            constraint.matchMode as (typeof FilterMatchMode)[keyof typeof FilterMatchMode],
        };
      }
    });

    setLazyState((prev) => ({
      ...prev,
      first: 0,
      filters: newFilters,
    }));
  };

  // -----------------------------
  // Map LazyState.filters to DataTableFilterMeta
  // -----------------------------
  const primeFilters: DataTableFilterMeta = Object.fromEntries(
    Object.entries(lazyState.filters)
      .filter(([_, f]) => f !== undefined)
      .map(([key, f]) => [key, { value: f!.value, matchMode: f!.matchMode }]),
  ) as DataTableFilterMeta;

  // ✅ Global search
  const renderHeader = () => (
    <div className="w-full">
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText
          variant="filled"
          className="w-full"
          placeholder={t("search_violations_by")}
          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setLazyState((prev) => ({
              ...prev,
              filters: {
                ...prev.filters,
                global: { value, matchMode: FilterMatchMode.CONTAINS },
              },
              first: 0,
              page: 0,
            }));
          }}
        />
      </IconField>
    </div>
  );

  return (
    <>
      <Card>
        <CardContent>
          <DataTable
            value={vehicles}
            paginator
            rows={lazyState.rows}
            totalRecords={totalRecords}
            first={lazyState.first}
            lazy
            loading={loading}
            onPage={onPage}
            onSort={onSort}
            onFilter={onFilter}
            sortField={lazyState.sortField}
            sortOrder={lazyState.sortOrder}
            filters={primeFilters}
            globalFilterFields={[
              "plate_num_front",
              "country_code_front",
              "car_type",
            ]}
            dataKey="id"
            header={renderHeader()}
            emptyMessage="No data found."
            onRowClick={(e) => {
              setSelectedVehicle(e.data as VehicleList);
              setIsModalOpen(true);
            }}
          >
            <Column
              field="date_veh"
              header={t("time")}
              sortable
              headerStyle={{ textAlign: "center" }}
              body={(rowData) => formatDate(rowData.date_veh)}
            />
            <Column
              field="plate_num_front"
              header={t("vehicle")}
              sortable
              headerStyle={{ textAlign: "center" }}
              body={(rowData) => emptyTemplate(rowData.plate_num_front)}
            />
            <Column
              field="country_code_front"
              header={t("province")}
              headerStyle={{ textAlign: "center" }}
              body={(rowData) => emptyTemplate(rowData.country_code_front)}
            />
            <Column
              field="car_type"
              header={t("type")}
              sortable
              headerStyle={{ textAlign: "center" }}
              body={(rowData) => emptyTemplate(rowData.car_type)}
            />
            <Column
              field="towt_kg"
              header={t("weight")}
              headerStyle={{ textAlign: "center" }}
              body={(rowData) => {
                const formatted = formatT(rowData.towt_kg);

                return (
                  <span
                    data-testid={`weight-${rowData.id}`}
                    style={{
                      color: rowData.isOverweight ? "rgb(255, 0, 0)" : "",
                    }}
                  >
                    {formatted}
                  </span>
                );
              }}
            />
            <Column
              field="axles"
              header={t("axle")}
              sortable
              headerStyle={{ textAlign: "center" }}
              body={(rowData) => emptyTemplate(rowData.axles)}
            />
            <Column
              field="length"
              header={t("length")}
              headerStyle={{ textAlign: "center" }}
              body={(rowData) => formatM(rowData.length)}
            />
            <Column
              field="speed"
              header={t("speed")}
              headerStyle={{ textAlign: "center" }}
              body={(rowData) => formatKm(rowData.speed)}
            />
            <Column
              field="towt_valid"
              header={t("status")}
              headerStyle={{ textAlign: "center" }}
              body={(rowData) => TowtStatusTemplate(rowData.towt_valid)}
            />
          </DataTable>
        </CardContent>
      </Card>

      <VehicleDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vehicle={selectedVehicle}
        width="max-w-md" // Tailwind width classes: max-w-sm, max-w-md, max-w-lg, max-w-xl
        height="auto"
        borderColor=""
      />
    </>
  );
}
