import Swal, { SweetAlertOptions } from "sweetalert2";

export function showErrorPopup(message: string) {
  const options: SweetAlertOptions = {
    icon: "error",
    title: "Error",
    text: message,
    confirmButtonColor: "#d33",
  };

  Swal.fire(options);
}
