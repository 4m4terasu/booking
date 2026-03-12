import { ChangeEvent, FormEvent, useEffect, useState } from "react";

import { ResortCabana } from "../types.js";

interface BookingPanelProps {
  cabana: ResortCabana | null;
  isSubmitting: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onBook: (payload: { room: string; guestName: string }) => Promise<void>;
}

export function BookingPanel({
  cabana,
  isSubmitting,
  errorMessage,
  onClose,
  onBook,
}: BookingPanelProps) {
  const [room, setRoom] = useState("");
  const [guestName, setGuestName] = useState("");

  useEffect(() => {
    setRoom("");
    setGuestName("");
  }, [cabana?.id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onBook({ room, guestName });
  }

  if (!cabana) {
    return (
      <aside className="panel-card panel-card--empty">
        <p className="eyebrow">Booking panel</p>
        <h2>Select a cabana</h2>
        <p>
          Click an available cabana on the map to confirm availability and submit a
          guest booking.
        </p>
      </aside>
    );
  }

  if (!cabana.isAvailable) {
    return (
      <aside className="panel-card">
        <div className="panel-card__topline">
          <p className="eyebrow">Cabana details</p>
          <button type="button" className="ghost-button" onClick={onClose}>
            Close
          </button>
        </div>
        <h2>{cabana.id}</h2>
        <p className="availability availability--booked">Already booked</p>
        <p>This cabana is currently unavailable. Please pick another spot on the map.</p>
      </aside>
    );
  }

  return (
    <aside className="panel-card">
      <div className="panel-card__topline">
        <p className="eyebrow">Cabana booking</p>
        <button type="button" className="ghost-button" onClick={onClose}>
          Close
        </button>
      </div>
      <h2>{cabana.id}</h2>
      <p className="availability availability--available">Available now</p>
      <p>Enter the room number and guest name for the current resort guest.</p>

      <form className="booking-form" onSubmit={handleSubmit}>
        <label>
          Room number
          <input
            value={room}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setRoom(event.target.value)}
            placeholder="101"
            autoComplete="off"
          />
        </label>

        <label>
          Guest name
          <input
            value={guestName}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setGuestName(event.target.value)}
            placeholder="Alice Smith"
            autoComplete="name"
          />
        </label>

        {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? "Booking..." : "Confirm booking"}
        </button>
      </form>
    </aside>
  );
}