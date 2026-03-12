import { useEffect, useState } from "react";

import { ApiError, bookCabana, fetchResortMap } from "./api.js";
import { BookingPanel } from "./components/BookingPanel.js";
import { MapGrid } from "./components/MapGrid.js";
import { Notice, ResortMapResponse } from "./types.js";

function updateBookedCabana(map: ResortMapResponse, cabanaId: string): ResortMapResponse {
  return {
    ...map,
    cabanas: map.cabanas.map((cabana) =>
      cabana.id === cabanaId ? { ...cabana, isAvailable: false } : cabana,
    ),
    tiles: map.tiles.map((row) =>
      row.map((tile) =>
        tile.cabanaId === cabanaId ? { ...tile, isAvailable: false } : tile,
      ),
    ),
  };
}

export default function App() {
  const [map, setMap] = useState<ResortMapResponse | null>(null);
  const [selectedCabanaId, setSelectedCabanaId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    void loadMap();
  }, []);

  async function loadMap() {
    setIsLoading(true);
    setPageError(null);

    try {
      const nextMap = await fetchResortMap();
      setMap(nextMap);
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Could not load the resort map.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleBook(payload: { room: string; guestName: string }) {
    if (!selectedCabanaId || !map) {
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    setNotice(null);

    try {
      const response = await bookCabana(selectedCabanaId, payload);
      setMap((currentMap) =>
        currentMap ? updateBookedCabana(currentMap, response.cabana.id) : currentMap,
      );
      setSelectedCabanaId(null);
      setNotice({ tone: "success", message: response.message });
    } catch (error) {
      if (error instanceof ApiError) {
        setFormError(error.message);
        return;
      }

      setFormError(error instanceof Error ? error.message : "Something went wrong while booking the cabana.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const selectedCabana =
    map?.cabanas.find((cabana) => cabana.id === selectedCabanaId) ?? null;
  const availableCount = map?.cabanas.filter((cabana) => cabana.isAvailable).length ?? 0;

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Luxury resort booking</p>
          <h1>Choose your poolside cabana in a couple of clicks.</h1>
          <p className="hero-copy">
            Browse the live resort map, check cabana availability, and confirm a booking
            for a current guest without leaving the page.
          </p>
        </div>

        <div className="stat-row">
          <article>
            <strong>{map?.cabanas.length ?? "--"}</strong>
            <span>Total cabanas</span>
          </article>
          <article>
            <strong>{availableCount}</strong>
            <span>Available now</span>
          </article>
          <article>
            <strong>{map?.rows ?? "--"} x {map?.cols ?? "--"}</strong>
            <span>Map size</span>
          </article>
        </div>
      </section>

      {notice ? <p className={`notice notice--${notice.tone}`}>{notice.message}</p> : null}

      {pageError ? (
        <section className="panel-card panel-card--error">
          <h2>Unable to load the map</h2>
          <p>{pageError}</p>
          <button type="button" className="primary-button" onClick={() => void loadMap()}>
            Try again
          </button>
        </section>
      ) : null}

      {!pageError ? (
        <section className="workspace">
          {isLoading || !map ? (
            <section className="map-board map-board--loading">
              <p>Loading resort map...</p>
            </section>
          ) : (
            <MapGrid
              map={map}
              selectedCabanaId={selectedCabanaId}
              onSelectCabana={(cabanaId: string) => {
                setNotice(null);
                setFormError(null);
                setSelectedCabanaId(cabanaId);
              }}
            />
          )}

          <BookingPanel
            cabana={selectedCabana}
            isSubmitting={isSubmitting}
            errorMessage={formError}
            onClose={() => {
              setFormError(null);
              setSelectedCabanaId(null);
            }}
            onBook={handleBook}
          />
        </section>
      ) : null}
    </main>
  );
}