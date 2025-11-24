import { FilterMatchMode } from "primereact/api";
interface Axel {
  axle_no: number;
  weight: number;
  weight_excess: number;
  weight_left: number;
  weight_right: number;
}

interface Vehicle {
  id: string;
  lane_number: string;
  station_number: string;
  date_veh: string;
  plate_num_front: string;
  country_code_front: string;
  car_class: string;
  car_type: string;
  multiple_wheel: boolean;
  created_at: string;
  photo_front_plate: string;
  photo_overview: string;
  isOverweight: boolean,
}


interface VehMeasuer {
  speed: number,
  speed_excess: number,
  length: number,
  length_excess: number,
  towt_kg: number,
  towr_kg: number,
  towl_kg: number,
  towt_excess: number,
  towt_valid: string,
}

interface VehicleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: VehcleViolDetail | null; // ✅ allow null
}

// interface VehcleViolDetail extends Axel, VehMeasuer, Vehicle {
//   vehicle_measures: Array<VehMeasuer>;
//   axles: Array<Axel>;
//   maximum: {
//     max_length: number,
//     max_speed: number
//     max_weight: number
//   }
//   vehicle: Vehicle
// }
interface VehcleViolDetail {
  vehicle: Vehicle;
  vehicle_measures: VehMeasuer[];
  axles: Axel[];
  maximum: {
    max_length: number;
    max_speed: number;
    max_weight: number;
  };
}

interface VehicleList {
  id: string;
  lane_number: string;
  station_number: string;
  date_veh: string;
  bool_ceanpr: boolean;
  plate_num_front: string;
  country_code_front: string;
  date_plate_front: string;
  car_class: string;
  car_type: string;
  axles: number;
  multiple_wheel: boolean;
  date_sh_first_axle: string;
  plate_num_rear: string;
  country_code_rear: string;
  date_plate_rear: string;
  bool_tmd_anpr: boolean;
  created_at: string;
  speed: number,
  speed_excess: number,
  length: number,
  length_excess: number,
  towt_kg: number,
  towt_excess: number,
  towt_valid: string
}

// ✅ Define lazy state type
// interface LazyState {
//   first: number;
//   rows: number;
//   page: number;
//   sortField?: string;
//   sortOrder?: 1 | -1 | 0 | null | undefined;
//   filters: Record<string, unknown>;
// }

interface FilterMeta {
  value: string | number | null;
  matchMode: typeof FilterMatchMode[keyof typeof FilterMatchMode];
}

interface LazyState {
  first: number;
  rows: number;
  page: number;
  sortField?: string;
  sortOrder?: 1 | -1 | 0 | null;
  filters: {
    global?: FilterMeta;
    plate?: FilterMeta;
    vehicleType?: FilterMeta;
    speed?: FilterMeta;
    [key: string]: FilterMeta | undefined; // allow dynamic keys
  };
}
 
interface TraffViolation {
  dateTime: string,
  vehicle_count: number,
  violations_count: number
}

interface WeightDistri {
  weight_range: string,
  count: number
}

interface WimSummary {
  total: number,
  overweight_count: number,
  overweight_percentage: number,
  total_weight: number,
  average_speed: number,
  average_total_weight: number
}
export { VehicleDetailModalProps, VehcleViolDetail, LazyState, VehicleList, FilterMeta, TraffViolation, WeightDistri, WimSummary };
