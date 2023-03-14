import { useState } from "react";

import Button from "../components/button";

enum FlightType {
  OneWay = "One Way",
  RoundTrip = "Round Trip",
}

interface OneWayFlight {
  type: FlightType.OneWay;
  departureDate: string;
}

interface RoundTripFlight {
  type: FlightType.RoundTrip;
  departureDate: string;
  returnDate: string;
}

type Flight = OneWayFlight | RoundTripFlight;

export default function FlightBooker() {
  const today = new Date().toISOString().split("T")[0];
  const maxDate = "2029-12-31";

  const [flight, setFlight] = useState<Flight>({
    type: FlightType.OneWay,
    departureDate: today,
  });

  const isValid =
    flight.departureDate >= today &&
    (flight.type !== FlightType.RoundTrip ||
      flight.returnDate >= flight.departureDate);
  const minReturnDate =
    today < flight.departureDate ? flight.departureDate : today;

  function handleFlightTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedFlightType = event.target.value as FlightType;
    if (selectedFlightType === FlightType.RoundTrip) {
      setFlight((f) => ({
        ...f,
        type: selectedFlightType,
        returnDate: minReturnDate,
      }));
    } else {
      setFlight((f) => ({ ...f, type: selectedFlightType }));
    }
  }

  function handleButtonClick() {
    alert(
      `You booked a ${flight.type.toLowerCase()} flight departing on ${
        flight.departureDate
      }${
        flight.type === FlightType.RoundTrip
          ? ` and returning on ${flight.returnDate}`
          : ""
      }`
    );
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
          className="w-full rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
          value={flight.type}
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
          className="w-full rounded border py-2 px-3 leading-tight text-gray-700 shadow invalid:border-red-600 invalid:bg-red-100 focus:outline-none"
          id="departureDate"
          type="date"
          value={flight.departureDate}
          min={today}
          max={maxDate}
          onChange={(event) =>
            setFlight((f) => ({ ...f, departureDate: event.target.value }))
          }
        />
      </div>
      {flight.type === FlightType.RoundTrip && (
        <div className="mb-4">
          <label
            htmlFor="returnDate"
            className="mb-2 block font-bold text-gray-700"
          >
            Select Return Date:
          </label>
          <input
            className="w-full rounded border py-2 px-3 leading-tight text-gray-700 shadow invalid:border-red-600 invalid:bg-red-100 focus:outline-none"
            id="returnDate"
            type="date"
            value={flight.returnDate}
            min={minReturnDate}
            max={maxDate}
            onChange={(event) =>
              setFlight((f) => ({ ...f, returnDate: event.target.value }))
            }
          />
        </div>
      )}
      <Button
        className="w-full"
        disabled={!isValid}
        onClick={handleButtonClick}
      >
        Book {flight.type} Flight
      </Button>
    </div>
  );
}
