// frontend/src/components/ui/MonthYearPicker.jsx
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function MonthYearPicker({ date, onChange }) {
  return (
      <div className="max-w-xs">
        <DatePicker
            selected={date}
            onChange={onChange}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            inline
        />
      </div>
  );
}
