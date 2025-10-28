"use client";
import React, { useState, useEffect, JSX } from "react";
import { DataTable, DataTablePageEvent, DataTableSortEvent, DataTableFilterEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import { Icon } from "../components/ui/icon"
import moment from "moment";
import axios from "axios";

interface Axel {
  weight: number
  left_weight: number,
  right_weight: number
}

interface VehcleViol extends Axel {
  id: string;
  crossingIndexCode: string;
  datetime: string;
  plate: string;
  plateProvince: string;
  totalAxles: number;
  totalLength: number;
  totalWidth: number;
  outcome: string;
  totalWeight: number;
  weightLimit: number;
  speed: number;
  vehicleClass: string;
  vehicleType: string;
  lane: string;
  overviewImage: string;
  plateImage: string;
  axlesJson: Array<Axel>;
  createdAt: string;
}

// ✅ Define lazy state type
interface LazyState {
  first: number;
  rows: number;
  page: number;
  sortField?: string;
  sortOrder?: 1 | -1 | 0 | null | undefined;
  filters: Record<string, any>;
}

async function fetchViolVehicleFromApi({
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
  filters: Record<string, any>;
}): Promise<{ data: VehcleViol[]; total: number }> {
  try {
    console.log('hi fetch', page);
    console.log('hi fetch', rows);
    console.log('hi fetch', sortField);

    const sortOrderValue = sortOrder === 1 ? "ASC" : sortOrder === -1 ? "DESC" : undefined;
    console.log('hi fetch', sortOrderValue);
  
    const res = await axios.get('http://85.204.247.82:3007/wim', {
          params: {
            page: page,
            perPage: rows,
            sortBy: sortField,
            sortOrder: sortOrderValue
          }
        });

    const apiData = res.data;

    console.log('res.data', res.data);
    

    let allData: VehcleViol[] = apiData.data;
    const total: number = apiData.totalItems;

    // Optional: Apply local pagination (if API doesn’t handle it)
    // const start = (page - 1) * rows;
    // const end = start + rows;
      console.log('allData', allData);

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
  } catch (error) {
    console.error("API fetch error:", error);
    return { data: [], total: 0 };
  }
}

const emptyTemplate = (value?: any): string => {
  return value === null || value === undefined || value === "" ? "-" : String(value);
};

export default function CustomerTable(): JSX.Element {
  // const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicle] = useState<VehcleViol[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const [lazyState, setLazyState] = useState<LazyState>({
    first: 0,
    rows: 5,
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

    const loadViolateVehicle = async () => {
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
  };

 useEffect(() => {
  loadViolateVehicle();
}, [lazyState.page, lazyState.rows, lazyState.sortField, lazyState.sortOrder, lazyState.filters.global?.value]);

  // ✅ DataTable event handlers
  const onPage = (event: DataTablePageEvent) => setLazyState((prev) => ({ ...prev, ...event }));
  const onSort = (event: DataTableSortEvent) => setLazyState((prev) => ({ ...prev, ...event }));
  const onFilter = (event: DataTableFilterEvent) => setLazyState((prev) => ({ ...prev, ...event, first: 0 }));

  // ✅ Global search
  const renderHeader = () => (
    <div className="flex justify-end">
      <IconField  iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText 
          variant="filled"
          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
            setLazyState((prev) => ({
              ...prev,
              filters: {
                ...prev.filters,
                global: { value: e.target.value, matchMode: FilterMatchMode.CONTAINS },
              },
              first: 0,
              page: 0
            }));
          }}
          placeholder="Global Search"
        />
      </IconField>
    </div>
  );

  return (
    // <div className="card">
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
        filters={lazyState.filters}
        header={renderHeader()}
        dataKey="id"
        globalFilterFields={["Vehicle", "Station", "Type"]}
        emptyMessage="No vehicles found."
      >
        <Column
          // field="id"
          body={(_, options) =>
    vehicles.length > 0 ? lazyState.first + options.rowIndex + 1 : "-"}
          header="ID"
          style={{ width: "10%", textAlign: "center" }}
          alignHeader="center"
        />
        <Column
          field="plate"
          header="Vehicle"
          filter
          filterPlaceholder="Search vehicle"
          headerStyle={{ textAlign: "center" }}
          body={(rowData) => emptyTemplate(rowData.plate)}
        />
        <Column
          field="vehicleType"
          header="Type"
          filter
          filterPlaceholder="Search country"
          headerStyle={{ textAlign: "center" }}
          body={(rowData) => emptyTemplate(rowData.vehicleType)}
        />
        <Column
          field="totalWeight"
          header="ActWeight"
          sortable
          headerStyle={{ textAlign: "center" }}
          body={(rowData) => emptyTemplate(rowData.totalWeight)}
        />
         <Column
          field="weightLimit"
          header="Limit"
          sortable
          headerStyle={{ textAlign: "center" }}
          body={(rowData) => emptyTemplate(rowData.weightLimit)}
        />
         <Column
          field="outcome"
          header="Excess"
          headerStyle={{ textAlign: "center" }}
          body={(rowData) => emptyTemplate(rowData.outcome)}
        />
         <Column
          field="lane"
          header="Station"
          filter
          filterPlaceholder="Search Station"
          headerStyle={{ textAlign: "center" }}
        />
         <Column
          field="datetime"
          header="Time"
          sortable
          headerStyle={{ textAlign: "center" }}
          body={(rowData) => emptyTemplate(rowData.datetime)}
        />
         <Column
          field="severity"
          header="Severity"
          headerStyle={{ textAlign: "center" }}
          body={(rowData) => emptyTemplate(rowData.severity)}
        />
      </DataTable>
        </CardContent>
      </Card>
     
    // </div>
  );
}
