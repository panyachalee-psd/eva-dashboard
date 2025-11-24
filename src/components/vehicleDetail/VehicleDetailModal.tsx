import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../ui/modal";
import { VehcleViolDetail, VehicleList } from "../../models/vehicleModel"; // adjust this path to your model file
import { Scale, AlertTriangle, Truck, Camera, Gauge } from "lucide-react";
// import { StatCard } from "../StatCard";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// import { color } from "framer-motion";
import "./vehicleDetailModal.css";
import { Divider } from "primereact/divider";

interface VehicleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: VehicleList | null;
  width?: string;
  height?: string;
  borderColor?: string;
}

const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  width = "w-full max-h-[80vw]",
  height = "max-h-[80vh]",
  borderColor = "border-blue-500",
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [vehicleDetail, setVehicleDetail] = useState<VehcleViolDetail | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  // Fetch data when modal opens
  useEffect(() => {
    const fetchVehicleDetail = async () => {
      if (!vehicle?.id || !isOpen) return;
      setLoading(true);
      setVehicleDetail(null);
      setError(null);

      try {
        const res = await axios.get(
          `http://85.204.247.82:3007/dashboard/detail/${vehicle.id}`,
        );
        setVehicleDetail(res.data);
        // console.log('res.data', res.data.vehicle.photo_front_plate);
      } catch {
        // console.error("Error fetching vehicle detail:", err);
        setError("Failed to load vehicle data.");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetail();
  }, [vehicle?.id, isOpen]);

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const parts = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).formatToParts(date);

    const lookup = Object.fromEntries(parts.map((p) => [p.type, p.value]));

    return `${lookup.weekday} ${lookup.day}/${lookup.month}/${lookup.year} ${lookup.hour}:${lookup.minute} ${lookup.dayPeriod}`;
  }

  function formatT(value: number) {
    if (value == null) return "N/A";
    return `${value / 1000} t`;
  }

  function formatTNounit(value: number) {
    if (value == null) return "N/A";
    return `${value / 1000}`;
  }

  function formatM(value: number) {
    if (value == null) return "N/A";
    return `${value / 100} m`;
  }

   function formatMNounit(value: number) {
    if (value == null) return "N/A";
    return `${value / 100}`;
  }

  function formatKm(value: number) {
    if (value == null) return "N/A";
    return `${value} km/h`;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Vehicle Weight Information - ${vehicleDetail?.vehicle.plate_num_front ?? vehicle?.plate_num_front ?? ""}`}
      width={width}
      height={height}
      borderColor={borderColor}
    >
      <div
        //         // make the inner content scrollable while header (in Modal) stays visible
        className="overflow-y-auto"
        style={{ maxHeight: "calc(80vh - 72px)", paddingRight: 8 }}
      >
        {loading ? (
          <div className="text-center p-4">Loading vehicle data...</div>
        ) : error ? (
          <div className="text-red-600 text-center p-4">{error}</div>
        ) : vehicleDetail ? (
          <div className="space-y-4">
            <section>
              <strong className="flex gap-2 text-green">
                <Truck /> Basic Information
              </strong>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-4">
                {[
                  {
                    label: t("vehicle_id"),
                    value: vehicleDetail?.vehicle?.plate_num_front,
                  },
                  {
                    label: t("province"),
                    value: vehicleDetail?.vehicle?.country_code_front,
                  },
                  {
                    label: t("vehicle_type"),
                    value: vehicleDetail?.vehicle?.car_type,
                  },
                  {
                    label: t("time"),
                    value: formatDate(vehicleDetail?.vehicle?.date_veh),
                  },
                ].map((item, i) => (
                  <Card
                    key={i}
                    className="bg-orange-50 border-0 w-auto inline-block"
                  >
                    <CardHeader>
                      <CardTitle className="text-gray text-xs whitespace-nowrap">
                        {item.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-nowrap">
                        {item.value ? item.value : ""}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <Divider className="my-divider" />

            <div>
              <section>
                <strong className="flex gap-2 text-green">
                  <Scale /> Measurements
                </strong>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-4">
                  {[
                    {
                      label: t("total_weight"),
                      value: formatT(
                        vehicleDetail?.vehicle_measures[0]?.towt_kg,
                      ),
                    },
                    // {
                    //   label: t("width"),
                    //   value: vehicleDetail.vehicle_measures[0].width,
                    // },
                    {
                      label: t("length"),
                      value: formatM(
                        vehicleDetail?.vehicle_measures[0]?.length,
                      ),
                    },
                    // {
                    //   label: t("height"),
                    //   value: vehicleDetail.vehicle_measures[0].length,
                    // },
                    {
                      label: t("speed"),
                      value: formatKm(
                        vehicleDetail?.vehicle_measures[0]?.speed,
                      ),
                    },
                    {
                      label: t("number_of_axles"),
                      value: vehicleDetail?.axles?.length,
                    },
                    // {
                    //   label: t("status"),
                    //   value: vehicleDetail?.vehicle_measures[0]?.towt_valid,
                    //   isStatus: true, // 👈 mark this card as status
                    // },
                  ].map((item, i) => {
                    // const status = vehicleDetail.vehicle_measures[0].towt_valid;
                    return (
                      <Card
                        key={i}
                        className="bg-orange-50 border-0 w-auto inline-block"
                      >
                        <CardHeader>
                          <CardTitle className="text-gray text-xs whitespace-nowrap">
                            {item.label}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center gap-2">
                          <p className="whitespace-nowrap">
                            {item.value ? item.value : "N/A"}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-2 mt-4">
                  {[
                    // {
                    //   label: t("total_weight"),
                    //   value: formatT(vehicleDetail?.vehicle_measures[0]?.towt_kg),
                    // },
                    // {
                    //   label: t("width"),
                    //   value: vehicleDetail.vehicle_measures[0].width,
                    // },
                    // {
                    //   label: t("length"),
                    //   value: formatM(vehicleDetail?.vehicle_measures[0]?.length),
                    // },
                    // {
                    //   label: t("height"),
                    //   value: vehicleDetail.vehicle_measures[0].length,
                    // },
                    // {
                    //   label: t("speed"),
                    //   value: formatKm(vehicleDetail?.vehicle_measures[0]?.speed),
                    // },
                    // {
                    //   label: t("number_of_axles"),
                    //   value: vehicleDetail?.axles?.length,
                    // },
                    {
                      label: t("status"),
                      value: vehicleDetail?.vehicle_measures[0]?.towt_valid,
                      // isStatus: true, // 👈 mark this card as status
                    },
                  ].map((item, i) => {
                    // const status = vehicleDetail.vehicle_measures[0].towt_valid;
                    return (
                      <Card
                        key={i}
                        className="bg-orange-50 border-0 w-auto inline-block"
                      >
                        <CardHeader>
                          <CardTitle className="text-gray text-xs whitespace-nowrap">
                            {item.label}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center gap-2">
                          {vehicleDetail?.vehicle_measures[0]?.towt_valid ===
                          "NV" ? (
                            <span className="px-2 py-0.5 text-[10px] rounded-full font-semibold bg-red-500 text-white">
                              Not Valid
                            </span>
                          ) : vehicleDetail?.vehicle_measures[0]?.towt_valid ===
                            "OK" ? (
                            <span className="px-2 py-0.5 text-[10px] rounded-full font-semibold bg-green-600 text-white">
                              Valid
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-[10px] rounded-full font-semibold bg-gray-400 text-white">
                              {vehicleDetail?.vehicle_measures[0]?.towt_valid}
                            </span>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>
            </div>

            <Divider color="inherit" />

            <div>
              <strong className="flex gap-2 text-green">
                {" "}
                <Gauge className="" /> Weight per Axel
              </strong>
              {/* ==== AXLE LEFT/RIGHT UI ===== */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* LEFT SIDE */}
                <Card className="border border-green-800 p-4">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">
                      Left Side
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {vehicleDetail?.axles.map((axle, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center bg-orange-50 px-3 py-2 rounded-md"
                      >
                        <span className="text-gray">Axle {axle.axle_no}</span>
                        <span className="font-semibold">
                          {formatT(axle.weight_left)}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* RIGHT SIDE */}
                <Card className="border border-green-800 p-4">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">
                      Right Side
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {vehicleDetail?.axles.map((axle, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center bg-orange-50 px-3 py-2 rounded-md"
                      >
                        <span className="text-gray">Axle {axle.axle_no}</span>
                        <span className="font-semibold">
                          {formatT(axle.weight_right)}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>

            <Divider color="inherit" />

            <div>
              <strong className="flex gap-2 text-green">
                {" "}
                <AlertTriangle className="" /> Legal Limits for Truck
              </strong>
              <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                {[
                  {
                    label: "Max Weight",
                    limit: formatTNounit(vehicleDetail?.maximum?.max_weight),
                    actual: formatTNounit(vehicleDetail?.vehicle_measures[0]?.towt_kg),
                    unit: "t",
                  },
                  // {
                  //   label: "Max Width",
                  //   limit: vehicleDetail.vehicle_measures[0]?.width_excess,
                  //   actual: vehicleDetail.vehicle_measures[0].width,
                  //   unit: "m",
                  // },
                  {
                    label: "Max Length",
                    limit: formatMNounit(vehicleDetail?.maximum?.max_length),
                    actual: formatMNounit(vehicleDetail?.vehicle_measures[0]?.length),
                    unit: "m",
                  },
                  // {
                  //   label: "Max Height",
                  //   limit: vehicleDetail.vehicle_measures[0]?.vytm,
                  //   actual: vehicleDetail.vehicle_measures[0].vvdf,
                  //   unit: "m",
                  // },
                ].map((item, i) => {
                  const isOver = Number(item.actual) > Number(item.limit);

                  return (
                    <Card
                      key={i}
                      className="bg-orange-50 border border-orange-200 rounded-xl gap-2"
                      data-testid="legal-limits-card"
                    >
                      <CardHeader>
                        <CardTitle className="text-xs text-gray">
                          {item.label}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="space-y-1">
                        {/* LIMIT VALUE (big number) */}
                        <p className="text-lg">
                          {item.limit}
                          {item.unit}
                        </p>

                        {/* ACTUAL VALUE label */}
                        <p className="text-xs text-gray">Actual</p>

                        {/* ACTUAL VALUE */}
                        <p
                          className={`text-sm ${isOver ? "text-red-600" : "text-green-600"}`}
                        >
                          {item.actual}
                          {isOver}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <Divider color="inherit" />
            <strong className="flex gap-2 text-green">
              {" "}
              <Camera className="" /> Vehicle Capture
            </strong>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
              {vehicleDetail.vehicle.photo_overview && (
                <img
                  style={{
                    width: "400px",
                    height: "280px",
                    objectFit: "cover",
                  }}
                  src={`data:image/jpeg;base64,${vehicleDetail?.vehicle?.photo_overview}`}
                  alt="Overview"
                  className="w-md-full h-auto rounded-lg border mx-auto object-cover"
                />
              )}
              {vehicleDetail.vehicle.photo_front_plate && (
                <img
                  style={{
                    width: "400px",
                    height: "280px",
                    objectFit: "cover",
                  }}
                  src={`data:image/jpeg;base64,${vehicleDetail?.vehicle?.photo_front_plate}`}
                  alt="Plate"
                  className="w-md-full h-auto rounded-lg border mx-auto"
                />
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No vehicle data available.
          </p>
        )}
      </div>
    </Modal>
  );
};

export default VehicleDetailModal;
