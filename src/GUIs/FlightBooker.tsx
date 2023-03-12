import { useState } from "react";

import Button from "../components/Button";

enum FlightType {
  OneWay = "One Way",
  Return = "Return",
}

export default function FlightBooker() {
  const today = new Date().toISOString().split("T")[0];

  const [flightType, setFlightType] = useState<FlightType>(FlightType.OneWay);
  const [departureDate, setDepartureDate] = useState<string>(today);
  const [returnDate, setReturnDate] = useState<string | null>(null);

  const isValid =
    departureDate >= today &&
    (flightType !== FlightType.Return ||
      (returnDate && returnDate >= departureDate));

  function handleFlightTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const flightType = event.target.value as FlightType;
    setFlightType(flightType);
    if (flightType === FlightType.OneWay) {
      setReturnDate(null);
    } else if (flightType === FlightType.Return) {
      setReturnDate(departureDate);
    }
  }

  return (
    <>
      <div>
        <label htmlFor="flightTypeSelect">Flight Type</label>
        <select
          id="flightTypeSelect"
          value={flightType}
          onChange={handleFlightTypeChange}
        >
          {Object.values(FlightType).map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="departureDate">Departure Date</label>
        <input
          className="invalid:border-4 invalid:border-red-600"
          id="departureDate"
          type="date"
          value={departureDate}
          min={today}
          onChange={(e) => setDepartureDate(e.target.value)}
        />
      </div>
      {flightType === FlightType.Return && (
        <div>
          <label htmlFor="returnDate">Return Date</label>
          <input
            className="invalid:border-4 invalid:border-red-600"
            id="returnDate"
            type="date"
            value={returnDate || ""}
            min={departureDate}
            onChange={(e) => setReturnDate(e.target.value)}
          />
        </div>
      )}
      <Button disabled={!isValid}>Book</Button>
    </>
  );
}
