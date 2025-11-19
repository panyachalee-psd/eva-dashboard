interface Axel {
  id: string;
  vehicle_id: string;
  axle_no: number;
  weight: number;
  weight_excess: number;
  weight_quality: number;
  weight_left: number;
  weight_right: number;
}

interface AxelGroup {
  id: string,
  vehicle_id: string,
  group_no: number,
  group_type: number,
  group_towt: number,
  group_towt_excess: number
}


interface VehMeasuer {
  id: string,
  vehicle_id: string,
  speed: number,
  speed_excess: number,
  length: number,
  length_excess: number,
  width: number,
  width_excess: number,
  vytm: number,
  vvdf: number,
  dtb1: number,
  dtlb: number,
  towt_kg: number,
  towr_kg: number,
  towt_excess: number,
  towt_valid: string,
  towr_valid: string,
  towr_kg_2: number,
  infraction_1: boolean,
  infraction_2: boolean,
  infraction_3: boolean,
  overlap: boolean,
  avoidance: boolean,
  uncentered: boolean
}

interface VehicleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: VehcleViolDetail | null; // ✅ allow null
}

interface VehcleViolDetail extends Axel, VehMeasuer, AxelGroup {
  id: string;
  lane_number: string;
  station_number: string;
  date_veh: string;
  date_veh_end: string;
  date_veh_ind: string;
  bool_ceanpr: boolean;
  plate_num_front: string;
  country_code_front: string;
  date_plate_front: string;
  car_class: string;
  car_type: string;
  multiple_wheel: boolean;
  date_sh_first_axle: string;
  plate_num_rear: string;
  country_code_rear: string;
  date_plate_rear: string;
  bool_tmd_anpr: boolean;
  date_remote_1: string;
  date_remote_2: string;
  created_at: string;
  request_id: string;
  photo_front_plate: string;
  photo_overview: string;
  vehicle_measures: Array<VehMeasuer>;
  axles: Array<Axel>;
  axle_groups: Array<AxelGroup>;
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
interface LazyState {
  first: number;
  rows: number;
  page: number;
  sortField?: string;
  sortOrder?: 1 | -1 | 0 | null | undefined;
  filters: Record<string, unknown>;
}

export { VehicleDetailModalProps, VehcleViolDetail, LazyState, VehicleList };
