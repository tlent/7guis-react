import { useState } from "react";

import Button from "../components/Button";

enum FlightType {
  OneWay = "One Way",
  RoundTrip = "Round Trip",
}

export default function FlightBooker() {
  const today = new Date().toISOString().split("T")[0];

  const [flightType, setFlightType] = useState<FlightType>(FlightType.OneWay);
  const [departureDate, setDepartureDate] = useState<string>(today);
  const [returnDate, setReturnDate] = useState<string | null>(null);

  const isValid =
    departureDate >= today &&
    (flightType !== FlightType.RoundTrip ||
      (returnDate && returnDate >= departureDate));

  function handleFlightTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedFlightType = event.target.value as FlightType;
    setFlightType(selectedFlightType);
    if (selectedFlightType === FlightType.OneWay) {
      setReturnDate(null);
    } else if (selectedFlightType === FlightType.RoundTrip) {
      setReturnDate(departureDate);
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-4">
        <label
          htmlFor="flightTypeSelect"
          className="mb-2 block font-bold text-gray-700"
        >
          Select Flight Type:
        </label>
        <select
          id="flightTypeSelect"
          className="focus:shadow-outline w-full rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
          value={flightType}
          onChange={handleFlightTypeChange}
        >
          {Object.values(FlightType).map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label
          htmlFor="departureDate"
          className="mb-2 block font-bold text-gray-700"
        >
          Select Departure Date:
        </label>
        <input
          className="focus:shadow-outline w-full rounded border py-2 px-3 leading-tight text-gray-700 shadow invalid:border-red-600 invalid:bg-red-100 focus:outline-none"
          id="departureDate"
          type="date"
          value={departureDate}
          min={today}
          onChange={(e) => setDepartureDate(e.target.value)}
        />
      </div>
      {flightType === FlightType.RoundTrip && (
        <div className="mb-4">
          <label
            htmlFor="returnDate"
            className="mb-2 block font-bold text-gray-700"
          >
            Select Return Date:
          </label>
          <input
            className="focus:shadow-outline w-full rounded border py-2 px-3 leading-tight text-gray-700 shadow invalid:border-red-600 invalid:bg-red-100 focus:outline-none"
            id="returnDate"
            type="date"
            value={returnDate || ""}
            min={today < departureDate ? departureDate : today}
            onChange={(e) => setReturnDate(e.target.value)}
          />
        </div>
      )}
      <Button
        className="w-full"
        disabled={!isValid}
        onClick={() =>
          alert(
            `You booked a ${flightType.toLowerCase()} flight departing on ${departureDate}${
              flightType === FlightType.RoundTrip
                ? ` and returning on ${returnDate}`
                : ""
            }`
          )
        }
      >
        Book {flightType} Flight
      </Button>
    </div>
  );
}
