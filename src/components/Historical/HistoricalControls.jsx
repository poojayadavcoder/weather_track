import React, { memo, useMemo } from "react";
import DatePicker from "react-datepicker";
import { Calendar, Loader2 } from "lucide-react";

const DateField = ({ label, selected, onChange, maxDate }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-blue-600 uppercase ml-1">
        {label}
      </label>

      <div className="relative">
        <DatePicker
          selected={selected}
          onChange={onChange}
          maxDate={maxDate}
          className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />

        <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
      </div>
    </div>
  );
};

const HistoricalControls = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  handleFetch,
  loading,
}) => {

  const maxDate = useMemo(() => new Date(), []);

  return (
    <div className="bg-white rounded-[20px] px-6 py-2 shadow-sm border border-gray-100 flex flex-wrap items-center gap-6 mb-10">

      <DateField
        label="Start Date"
        selected={startDate}
        onChange={setStartDate}
        maxDate={maxDate}
      />

      <DateField
        label="End Date"
        selected={endDate}
        onChange={setEndDate}
        maxDate={maxDate}
      />

      <button
        onClick={handleFetch}
        disabled={loading}
        className="mt-6 px-8 py-2.5 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 bg-blue-600 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          "Analyze Trends"
        )}
      </button>

    </div>
  );
};

export default memo(HistoricalControls);