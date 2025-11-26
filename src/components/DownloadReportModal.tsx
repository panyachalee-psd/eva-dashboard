import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Chips } from "primereact/chips";
import axios from "axios";
import type { ChipsChangeEvent } from "primereact/chips";

interface Props {
  visible: boolean;
  onHide: () => void;
}

export default function DownloadReportModal({ visible, onHide }: Props) {
  const [emails, setEmails] = useState<string[]>([]);
  const [date, setDate] = useState<Date | null>(new Date());
  const [loading, setLoading] = useState(false);
  const [invalidEmails, setInvalidEmails] = useState<string[]>([]);
  const [formError, setFormError] = useState<string>("");

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
    setFormError(""); // reset errors

    // Required validation
    if (emails.length === 0) {
      setFormError("Please enter at least one e-mail.");
      return;
    }

    if (invalidEmails.length > 0) {
      setFormError("Some e-mails are invalid. Please fix them.");
      return;
    }

    if (!date) {
      setFormError("Please select a date.");
      return;
    }

    setLoading(true);

    try {
      await axios.post("/api/send-wim-report", {
        emails,
        date: date.toISOString().split("T")[0],
      });

      onHide(); // close modal
    } catch (error) {
      console.error(error);
      setFormError("Failed to send report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      header="Download WIM Daily Report"
      visible={visible}
      onHide={onHide}
      style={{ width: "40rem" }}
      modal
      draggable={false}
      closeOnEscape
    >
      <div className="flex flex-col space-y-5 gap-6 my-2">
        {/* EMAIL (CHIPS) */}
        <div className="flex flex-col gap-2 bg-red-50 p-3 rounded-xl">
          <label className="text-gray-500 text-sm">E-mail</label>

          <Chips
            value={emails}
            onChange={handleEmailChange}
            separator=","
            placeholder="Enter emails and press Enter"
            className={`w-full bg-transparent border-0 shadow-none ${
              invalidEmails.length > 0 ? "p-invalid" : ""
            }`}
            pt={{
              root: { className: "w-full" }, // container
              container: { className: "w-full" }, // inner wrapper
              input: { className: "w-full" }, // actual input
            }}
          />

          {/* Email-level validation */}
          {invalidEmails.length > 0 && (
            <p className="text-red-500 text-xs">Invalid e-mail(s): {invalidEmails.join(", ")}</p>
          )}
        </div>

        {/* DATE PICKER */}
        <div className="flex flex-col gap-2 bg-red-50 p-3 rounded-xl">
          <label className="text-gray-500 text-sm">Date</label>

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
            label="Send Report to E-mail"
            severity="success"
            className="w-fit ml-auto px-5 py-2 mt-4"
            onClick={handleSend}
            loading={loading}
          />
        </div>
      </div>
    </Dialog>
  );
}
