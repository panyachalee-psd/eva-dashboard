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


// ✅ Define your data type
// interface Customer {
//   id: number;
//   name: string;
//   country: string;
//   status: string;
// }
interface Axel {
  weight: number
  left_weight: number,
  right_weight: number
}

// interface VehcleViol {
//   id: number;
//   vehicle: string;
//   type: string;
//   actWeight: number;
//   limit: number;
//   excess: number;
//   station: string;
//   time: string;
//   severity: string;
// }
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
  sortOrder?: 1 | -1 | 0 | null | undefined; // <-- add null here
  filters: Record<string, any>;
}

// ✅ Mock API (replace this with your real backend)
// async function fetchCustomersFromApi({
//   page,
//   rows,
//   sortField,
//   sortOrder,
//   filters,
// }: {
//   page: number;
//   rows: number;
//   sortField?: string;
//   sortOrder?: 1 | -1 | 0 | null;
//   filters: Record<string, any>;
// }): Promise<{ data: Customer[]; total: number }> {
//   // Simulate API call delay
//   await new Promise((r) => setTimeout(r, 600));

//   // Example mock data
//   const data = Array.from({ length: rows }, (_, i) => ({
//     id: page * rows + i + 1,
//     name: `Customer ${page * rows + i + 1}`,
//     country: ["Japan", "Thailand", "Singapore", "USA"][i % 4],
//     status: i % 2 === 0 ? "Active" : "Inactive",
//   }));

//   return { data, total: 100 }; // total record count
// }

// async function fetchViolVehicleFromApi({
//   page,
//   rows,
//   sortField,
//   sortOrder,
//   filters,
// }: {
//   page: number;
//   rows: number;
//   sortField?: string;
//   sortOrder?: 1 | -1 | 0 | null;
//   filters: Record<string, any>;
// }): Promise<{ data: VehcleViol[]; total: number }> {
//   // Simulate API call delay
//   // await new Promise((r) => setTimeout(r, 600));

//   // const date = moment();
//   // const formattedDate = date.format("YYYY-MM-DD HH:MM");
//   // // Example mock data
//   // const data = Array.from({ length: rows }, (_, i) => ({
//   //   id: page * rows + i + 1,
//   //   vehicle: `Plate No. AB${page * rows + i + 1}`,
//   //   type: ["Heavy Truck", "Semi Trailer", "Truck"][i % 3],
//   //   actWeight: [300, 200, 100][i % 3],
//   //   limit: [300, 200, 100][i % 3],
//   //   excess: [10, 20, 30, 40, 50][i % 5],
//   //   station:  i % 2 === 0 ? "XY1" : "XY2",
//   //   time: formattedDate,
//   //   severity: ["L", "M", "H"][i % 3],
//   // }));
//    await axios
//       .get("https://93xp01kx-3000.asse.devtunnels.ms/wim")
//       .then((res) => {
//         console.log('res', res.data);
//         // total = res.totalItems
        
//       })
//       .catch(console.error);

//   return { data, 122 }; // total record count
// }


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
    // const res = await axios.get("http://85.204.247.82:3007/wim?page={page}&size=10&orderBy=name&orderSort");
    const sortOrderValue =
  sortOrder === 1 ? "asc" : sortOrder === -1 ? "desc" : undefined;
    
    const res = await axios.get('http://85.204.247.82:3007/wim', {
          params: {
            // dynamicValue will be sent as a query parameter (e.g., ?paramName=dynamicValue)
            page: page, 
            perPage: rows, // You can also include static parameters
            orderBy: sortField,
            orderSort: sortOrderValue
          }
        });

    // ✅ The real data is inside res.data
    const apiData = res.data;

    console.log('res', res);
    

    // Your API already returns an array under "data"
    let allData: VehcleViol[] = apiData.data;
    const total: number = apiData.totalItems; // ✅ Correctly reference here

    // Optional: Apply local pagination (if API doesn’t handle it)
    const start = (page - 1) * rows;
    const end = start + rows;
      console.log('allData', allData);

    // let paginatedData = [];
      // console.log('paginatedData', paginatedData);

    // Optional: Apply local sorting
    if (sortField && sortOrder) {
      allData = [...allData].sort((a, b) => {
        const valA = (a as any)[sortField];
        const valB = (b as any)[sortField];
        if (valA < valB) return sortOrder === 1 ? -1 : 1;
        if (valA > valB) return sortOrder === 1 ? 1 : -1;
        return 0;
      });
    }

    // Optional: Apply filtering
    const globalFilter = filters?.global?.value?.toLowerCase();
    const filteredData = globalFilter
      ? allData.filter((item) =>
          Object.values(item).some((val) =>
            String(val).toLowerCase().includes(globalFilter)
          )
        )
      : allData;

      console.log('filteredData', filteredData);
      

    return {
      data: filteredData,
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
    rows: 10,
    page: 0,
    sortField: undefined,
    sortOrder: undefined,
    filters: {
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      vehicle: { value: null, matchMode: FilterMatchMode.CONTAINS },
      type: { value: null, matchMode: FilterMatchMode.CONTAINS },
      station: { value: null, matchMode: FilterMatchMode.EQUALS },
    },
  });

  // ✅ Load customers from API
  // const loadCustomers = async () => {
  //   setLoading(true);
  //   const { data, total } = await fetchCustomersFromApi({
  //     page: lazyState.page,
  //     rows: lazyState.rows,
  //     sortField: lazyState.sortField,
  //     sortOrder: lazyState.sortOrder,
  //     filters: lazyState.filters,
  //   });
  //   setCustomers(data);
  //   setTotalRecords(total);
  //   setLoading(false);
  // };

    const loadViolateVehicle = async () => {
    setLoading(true);
    const { data, total } = await fetchViolVehicleFromApi({
      page: lazyState.page + 1,
      rows: lazyState.rows,
      sortField: lazyState.sortField,
      sortOrder: lazyState.sortOrder,
      filters: lazyState.filters,
    });
    console.log(data);

    setVehicle(data);
    setTotalRecords(total);
    setLoading(false);
  };

  useEffect(() => {
    // loadCustomers();
    loadViolateVehicle()    
  }, [lazyState]); // eslint-disable-line react-hooks/exhaustive-deps

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
          sortable
          style={{ width: "10%", textAlign: "center" }}
          alignHeader="center"
        />
        <Column
          field="plate"
          header="Vehicle"
          sortable
          filter
          filterPlaceholder="Search vehicle"
          headerStyle={{ textAlign: "center" }}
          body={(rowData) => emptyTemplate(rowData.plate)}
        />
        <Column
          field="vehicleType"
          header="Type"
          sortable
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
          sortable
          headerStyle={{ textAlign: "center" }}
          body={(rowData) => emptyTemplate(rowData.outcome)}
        />
         <Column
          field="speed"
          header="Speed"
          sortable
          filter
          filterPlaceholder="Search speed"
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
          sortable
          headerStyle={{ textAlign: "center" }}
          body={(rowData) => emptyTemplate(rowData.severity)}
        />
      </DataTable>
        </CardContent>
      </Card>
     
    // </div>
  );
}
