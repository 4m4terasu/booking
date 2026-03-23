import { BookingError, BookingService } from "./bookings.js";
import { Cabana, CabanaLocation, MapTile, ResortMapLayout, ResortMapView, Tile } from "./types.js";

export class ResortMapService {
  private readonly cabanasById: Map<string, CabanaLocation>;

  constructor(
    private readonly resortMap: ResortMapLayout,
    private readonly bookingService: BookingService,
  ) {
    this.cabanasById = new Map(resortMap.cabanas.map((cabana) => [cabana.id, cabana]));
  }

  getMap(): ResortMapView {
    const cabanas = this.resortMap.cabanas.map((cabana) => this.toCabanaView(cabana));
    const cabanaViewsById = new Map(cabanas.map((cabana) => [cabana.id, cabana]));

    const tiles = this.resortMap.tiles.map((row) =>
      row.map((tile) => this.toTileView(tile, cabanaViewsById)),
    );

    return {
      rows: this.resortMap.rows,
      cols: this.resortMap.cols,
      tiles,
      cabanas,
    };
  }

  getCabana(cabanaId: string): Cabana {
    const cabana = this.findCabana(cabanaId);

    if (!cabana) {
      throw new BookingError("cabana_not_found", "Cabana was not found.");
    }

    return this.toCabanaView(cabana);
  }

  bookCabana(cabanaId: string, room: string, guestName: string): Cabana {
    this.getCabana(cabanaId);
    this.bookingService.bookCabana(cabanaId, room, guestName);
    return this.getCabana(cabanaId);
  }

  private findCabana(cabanaId: string): CabanaLocation | undefined {
    return this.cabanasById.get(cabanaId);
  }

  private toCabanaView(cabana: CabanaLocation): Cabana {
    return {
      ...cabana,
      isAvailable: this.bookingService.getCabanaAvailability(cabana.id),
    };
  }

  private toTileView(tile: Tile, cabanaViewsById: Map<string, Cabana>): MapTile {
    if (tile.type !== "cabana" || !tile.cabanaId) {
      return tile;
    }

    const cabana = cabanaViewsById.get(tile.cabanaId);

    if (!cabana) {
      throw new Error(`Cabana tile ${tile.cabanaId} is missing from the map layout.`);
    }

    return {
      ...tile,
      isAvailable: cabana.isAvailable,
    };
  }
}
