import React, { useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Chips } from "primereact/chips";
// import axios from "axios";
import type { ChipsChangeEvent } from "primereact/chips";
import { useTranslation } from "react-i18next";
import api from "@/utils/axios";
import { showSuccessPopup, showWarningPopup } from "@/utils/alertPopup";
import { format } from "date-fns";

interface Props {
  visible: boolean;
  onHide: () => void;
}
// interface ChipsPrivate {
//   inputEl?: HTMLInputElement;
// }

export default function DownloadReportModal({ visible, onHide }: Props) {
  const [emails, setEmails] = useState<string[]>([]);
  const [date, setDate] = useState<Date | null>(new Date());
  const [loading, setLoading] = useState(false);
  const [invalidEmails, setInvalidEmails] = useState<string[]>([]);
  const [formError, setFormError] = useState<string>("");
  // const chipsRef = useRef<Chips>(null);
  const chipsWrapperRef = useRef<HTMLDivElement | null>(null);

  const { t } = useTranslation();
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateEmails = (list: string[]) => {
    const invalid = list.filter((email) => !isValidEmail(email));
    setInvalidEmails(invalid);
  };

  const handleEmailChange = (e: ChipsChangeEvent) => {
    const value = e.value as string[];
    setEmails(value);
    validateEmails(value);
    setFormError("");
  };

  const handleSend = async () => {
    // const { t } = useTranslation();
    setFormError("");

    // ---- LOCAL VALIDATION ----
    if (emails.length === 0) {
      setFormError(t("error_no_email"));
      return;
    }

    if (invalidEmails.length > 0) {
      setFormError(t("error_invalid_email"));
      return;
    }

    if (!date) {
      setFormError(t("error_no_date"));
      return;
    }

    const formatted = format(date, "yyyy-MM-dd");

    setLoading(true);

    try {
      const res = await api.post(`/report/email`, {
        email: emails.toString(),
        date: formatted,
      });

      // ---- STATUS CHECKING ----
      if (res.data?.message === "Success") {
        setEmails([]);
        setDate(new Date())
        showSuccessPopup(t("email_report_sent"));
      } else {
        showWarningPopup(t("unexpected_status").replace("{{status}}", res.status.toString()));
      }

      onHide(); // close modal
    } catch (error) {
      // Error popup already shown by interceptor
      setFormError(t("error_send_report"));
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlurCommitEmail = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();

    if (!value) {
      clearInput();
      return;
    }

    // split if user pasted multiple emails
    const newEmails = value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

    let validToAdd: string[] = [];
    let invalid: string[] = [];

    newEmails.forEach((em) => {
      if (!isValidEmail(em)) invalid.push(em);
      else if (!emails.includes(em)) validToAdd.push(em);
    });

    if (validToAdd.length > 0) {
      setEmails((prev) => [...prev, ...validToAdd]);
    }

    setInvalidEmails(invalid);
    clearInput();
  };

  const clearInput = () => {
    const wrapper = chipsWrapperRef.current;
    if (!wrapper) return;

    const input = wrapper.querySelector("input") as HTMLInputElement | null;
    if (input) {
      input.value = "";
    }
  };

  return (
    <Dialog
      header={t("download_wim")}
      visible={visible}
      onHide={onHide}
      style={{ width: "30rem" }}
      modal
      draggable={false}
      closeOnEscape
    >
      <div className="flex flex-col space-y-5 gap-6">
        {/* EMAIL (CHIPS) */}
        <div className="flex flex-col gap-2 bg-red-50 p-3 rounded-xl">
          <label className="text-gray-500 text-sm">{t("email")}</label>

          {/* <Chips
            value={emails}
            onChange={handleEmailChange}
            separator=","
            placeholder={t("enter_emails")}
            className={`w-full bg-transparent border-0 shadow-none ${
              invalidEmails.length > 0 ? "p-invalid" : ""
            }`}
            pt={{
              root: { className: "w-full" }, // container
              container: { className: "w-full" }, // inner wrapper
              input: { className: "w-full" }, // actual input
            }}
            onBlur={handleBlurCommitEmail}
          /> */}
          <Chips
            // ref={chipsRef}
            value={emails}
            onChange={handleEmailChange}
            placeholder={t("enter_emails")}
            separator=","
            className={`w-full bg-transparent border-0 shadow-none ${
              invalidEmails.length > 0 ? "p-invalid" : ""
            }`}
            pt={{
              root: {
                ref: chipsWrapperRef, // <-- The correct DOM ref
                className: "w-full",
              },
              container: { className: "w-full" },
              input: { className: "w-full" },
            }}
            // pt={{
            //   root: { className: "w-full" },
            //   container: { className: "w-full" },
            //   input: { className: "w-full" },
            //   ref: chipsWrapperRef,
            // }}
            onBlur={handleBlurCommitEmail}
          />

          {/* Email-level validation */}
          {invalidEmails.length > 0 && (
            <p className="text-red-500 text-xs">
              {t("invalid_email")}: {invalidEmails.join(", ")}
            </p>
          )}
        </div>

        {/* DATE PICKER */}
        <div className="flex flex-col gap-2 bg-red-50 p-3 rounded-xl">
          <label className="text-gray-500 text-sm">{t("date")}</label>

          <Calendar
            value={date}
            onChange={(e) => {
              setDate(e.value as Date);
              setFormError("");
            }}
            dateFormat="dd/mm/yy"
            className="w-full border-0 bg-transparent"
            inputClassName="w-full bg-transparent border-0 shadow-none"
          />
        </div>

        {/* GLOBAL ERROR MESSAGE */}
        {formError && <p className="text-red-600 text-sm text-right">{formError}</p>}

        {/* SEND BUTTON */}
        <div className="flex justify-end my-2">
          <Button
            label={t("send_report")}
            severity="success"
            className="w-fit ml-auto px-5 py-2 mt-4 p-button-sm"
            onClick={handleSend}
            loading={loading}
          />
        </div>
      </div>
    </Dialog>
  );
}
