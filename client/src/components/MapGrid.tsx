import { CSSProperties } from "react";

import { getPathAppearance } from "../path-tile.js";
import { ResortMapResponse, ResortMapTile } from "../types.js";

interface MapGridProps {
  map: ResortMapResponse;
  selectedCabanaId: string | null;
  onSelectCabana: (cabanaId: string) => void;
}

function getTileClassName(tile: ResortMapTile, isSelected: boolean): string {
  const classes = ["tile", `tile--${tile.type}`];

  if (tile.type === "cabana") {
    classes.push(tile.isAvailable ? "is-available" : "is-booked");
  }

  if (isSelected) {
    classes.push("is-selected");
  }

  return classes.join(" ");
}

function getTileStyle(tile: ResortMapTile, tiles: ResortMapTile[][]): CSSProperties {
  if (tile.type === "path") {
    const appearance = getPathAppearance(tiles, tile.x, tile.y);

    return {
      backgroundImage: `url(${appearance.assetPath})`,
      transform: `rotate(${appearance.rotation}deg)`,
    };
  }

  if (tile.type === "pool") {
    return {
      backgroundImage: "url(/assets/pool.png)",
    };
  }

  if (tile.type === "chalet") {
    return {
      backgroundImage: "url(/assets/houseChimney.png)",
    };
  }

  if (tile.type === "cabana") {
    return {
      backgroundImage: "url(/assets/cabana.png)",
    };
  }

  return {};
}

function renderTile(
  tile: ResortMapTile,
  tiles: ResortMapTile[][],
  selectedCabanaId: string | null,
  onSelectCabana: (cabanaId: string) => void,
) {
  const isSelected = tile.cabanaId === selectedCabanaId;
  const tileClassName = getTileClassName(tile, isSelected);
  const iconStyle = getTileStyle(tile, tiles);
  const iconClassName = [
    "tile__icon",
    tile.type === "path" ? "tile__icon--path" : "",
  ].filter(Boolean).join(" ");

  if (tile.type === "cabana" && tile.cabanaId) {
    const availabilityLabel = tile.isAvailable ? "available" : "booked";

    return (
      <button
        key={`${tile.x}-${tile.y}`}
        type="button"
        className={tileClassName}
        onClick={() => onSelectCabana(tile.cabanaId!)}
        aria-label={`Cabana ${tile.cabanaId} ${availabilityLabel}`}
        title={`${tile.cabanaId} (${availabilityLabel})`}
      >
        <span className={iconClassName} style={iconStyle} aria-hidden="true" />
        <span className="tile__status-dot" aria-hidden="true" />
      </button>
    );
  }

  return (
    <div key={`${tile.x}-${tile.y}`} className={tileClassName} aria-hidden="true">
      {tile.type !== "empty" ? <span className={iconClassName} style={iconStyle} /> : null}
    </div>
  );
}

export function MapGrid({ map, selectedCabanaId, onSelectCabana }: MapGridProps) {
  return (
    <section className="map-board">
      <div className="map-board__header">
        <div>
          <p className="eyebrow">Interactive map</p>
          <h2>Poolside cabanas</h2>
        </div>
        <p className="map-board__hint">Choose any cabana tile to view status or book it.</p>
      </div>

      <div
        className="map-grid"
        style={{ "--map-cols": String(map.cols) } as CSSProperties}
      >
        {map.tiles.flatMap((row) =>
          row.map((tile) => renderTile(tile, map.tiles, selectedCabanaId, onSelectCabana)),
        )}
      </div>

      <div className="legend">
        <span><i className="legend-swatch legend-swatch--available" /> Available cabana</span>
        <span><i className="legend-swatch legend-swatch--booked" /> Booked cabana</span>
        <span><i className="legend-swatch legend-swatch--path" /> Path</span>
        <span><i className="legend-swatch legend-swatch--pool" /> Pool</span>
        <span><i className="legend-swatch legend-swatch--chalet" /> Chalet</span>
      </div>
    </section>
  );
}