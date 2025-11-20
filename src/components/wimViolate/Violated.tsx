"use client";
import React, { useState, useEffect, JSX, useCallback  } from "react";
import {
  DataTable,
  DataTablePageEvent,
  DataTableSortEvent,
  DataTableFilterEvent,
} from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Card, CardContent } from "../ui/card";
// , CardHeader, CardTitle
// import { Icon } from "../components/ui/icon"
// import moment from "moment";
// import axios from "axios"; // adjust path if needed
import VehicleDetailModal from "../vehicleDetail/VehicleDetailModal";
import "./Violated.css";
import { useTranslation } from "react-i18next";
import api from "@/utils/axios";
import Swal from "sweetalert2";
import { VehicleList, LazyState } from "../../models/vehicleModel";
// VehicleDetailModalProps,

async function fetchViolVehicleFromApi({
  page,
  rows,
  sortField,
  sortOrder,
  // filters,
}: {
  page: number;
  rows: number;
  sortField?: string;
  sortOrder?: 1 | -1 | 0 | null;
  filters: Record<string, unknown>;
}): Promise<{ data: VehicleList[]; total: number }> {
  try {
    // console.log('hi fetch', page);
    // console.log('hi fetch', rows);
    // console.log('hi fetch', sortField);
    // const baseUrl = import.meta.env.VITE_API_URL;

    const sortOrderValue = sortOrder === 1 ? "ASC" : sortOrder === -1 ? "DESC" : undefined;
    // console.log('hi fetch', sortOrderValue);

    const res = await api.get(`/dashboard`, {
      params: {
        page: page,
        perPage: rows,
        sortBy: sortField,
        sortOrder: sortOrderValue,
      },
    });

    const apiData = res.data;

    // console.log("res.data", res.data);

    const allData: VehicleList[] = apiData.data;
    const total: number = apiData.totalItems;

    // Optional: Apply local pagination (if API doesn’t handle it)
    // const start = (page - 1) * rows;
    // const end = start + rows;
    // console.log("allData", allData);

    // Optional: Apply local sorting
    // if (sortField && sortOrder) {
    //   allData = [...allData].sort((a, b) => {
    //     const valA = (a as any)[sortField];
    //     const valB = (b as any)[sortField];
    //     if (valA < valB) return sortOrder === 1 ? -1 : 1;
    //     if (valA > valB) return sortOrder === 1 ? 1 : -1;
    //     return 0;
    //   });
    // }

    // Optional: Apply filtering
    // const globalFilter = filters?.global?.value?.toLowerCase();
    // const filteredData = globalFilter
    //   ? allData.filter((item) =>
    //       Object.values(item).some((val) =>
    //         String(val).toLowerCase().includes(globalFilter)
    //       )
    //     )
    //   : allData;
    //   console.log('filteredData', filteredData);

    return {
      data: allData,
      total, // ✅ total from API, not local length
    };
  } catch {
  // console.error("API fetch error:", error);
    return { data: [], total: 0 };
  }
}

const emptyTemplate = (value?: unknown): string => {
  return value === null || value === undefined || value === "" ? "-" : String(value);
};

export function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHr < 24) return `${diffHr} hours ago`;

  return `${diffDay} days ago`;
}

function shortId(id: string) {
  if (!id) return "";
  return id.substring(0, 5) + "...";
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

export default function ViolatedTable(): JSX.Element {
  // const [customers, setCustomers] = useState<Customer[]>([]);
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
      plate: { value: null, matchMode: FilterMatchMode.CONTAINS },
      vehicleType: { value: null, matchMode: FilterMatchMode.EQUALS },
      speed: { value: null, matchMode: FilterMatchMode.EQUALS },
    },
  });
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleList | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

const loadViolateVehicle = useCallback(async () => {
  setLoading(true);

  const { data, total } = await fetchViolVehicleFromApi({
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
  lazyState.filters
]);

useEffect(() => {
  loadViolateVehicle();
}, [loadViolateVehicle]);
  // lazyState.filters.global?.value

  // ✅ DataTable event handlers
  const onPage = (event: DataTablePageEvent) => setLazyState((prev) => ({ ...prev, ...event }));
  const onSort = (event: DataTableSortEvent) => setLazyState((prev) => ({ ...prev, ...event }));
  const onFilter = (event: DataTableFilterEvent) =>
    setLazyState((prev) => ({ ...prev, ...event, first: 0 }));

  const { t } = useTranslation();

  // ✅ Global search
  const renderHeader = () => (
    <div className="w-full">
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText
          variant="filled"
          className="w-full"
          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
            setLazyState((prev) => ({
              ...prev,
              filters: {
                ...prev.filters,
                global: { value: e.target.value, matchMode: FilterMatchMode.CONTAINS },
              },
              first: 0,
              page: 0,
            }));
          }}
          placeholder={t("search_violations_by")}
        />
      </IconField>
    </div>
  );

  return (
    // <div className="card">
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
            // filters={lazyState.filters}
            header={renderHeader()}
            dataKey="id"
            globalFilterFields={["Vehicle", "Station", "Type"]}
            emptyMessage="No data found."
            onRowClick={(e) => {
              setSelectedVehicle(e.data as VehicleList);
              setIsModalOpen(true);
            }}
          >
            {/* <Column
          // field="id"
          body={(_, options) =>
    vehicles.length > 0 ? lazyState.first + options.rowIndex + 1 : "-"}
          header="ID"
          style={{ width: "10%", textAlign: "center" }}
          alignHeader="center"
        /> */}
            <Column
              field="id"
              header={t("violation_id")}
              // filter
              sortable
              // filterPlaceholder="Search vehicle"
              headerStyle={{ textAlign: "center" }}
              body={(rowData) => shortId(rowData.id)}
            />
            <Column
              field="plate_num_front"
              header={t("vehicle")}
              sortable
              // filter
              // filterPlaceholder="Search country"
              headerStyle={{ textAlign: "center" }}
              body={(rowData) => emptyTemplate(rowData.plate_num_front)}
            />
            <Column
              field="country_code_front"
              header={t("province")}
              // sortable
              headerStyle={{ textAlign: "center" }}
              body={(rowData) => emptyTemplate(rowData.country_code_front)}
            />
            <Column
              field="car_type"
              header={t("type")}
              // sortable
              headerStyle={{ textAlign: "center" }}
              body={(rowData) => emptyTemplate(rowData.car_type)}
            />
            <Column
              field="towt_kg"
              header={t("actual_weight")}
              sortable
              headerStyle={{ textAlign: "center" }}
              body={(rowData) => formatT(rowData.towt_kg)}
            />
            <Column
              field="axles"
              header={t("axle")}
              sortable
              // filter
              // filterPlaceholder="Search Station"
              headerStyle={{ textAlign: "center" }}
               body={(rowData) => emptyTemplate(rowData.axles)}
            />
            <Column
              field="length"
              header={t("length")}
              sortable
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
              field="date_veh"
              header={t("time")}
              headerStyle={{ textAlign: "center" }}
              body={(rowData) => timeAgo(rowData.date_veh)}
            />
            {/* <Column
              field="severity"
              header={t("severity")}
              headerStyle={{ textAlign: "center" }}
              body={(rowData) => emptyTemplate(rowData.severity)}
            /> */}
          </DataTable>
        </CardContent>
      </Card>

      <VehicleDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vehicle={selectedVehicle}
        width="w-full max-w-[1700px]"
        height="max-h-[80vh]"
        borderColor=""
      />

      
    </>
  );
}
