import { BookingError, BookingService } from "./bookings.js";
import { Cabana, CabanaLocation, MapTile, ResortMapLayout, ResortMapView, Tile } from "./types.js";

export class ResortMapService {
  private readonly cabanaLocationsById: Map<string, CabanaLocation>;

  constructor(
    private readonly resortMap: ResortMapLayout,
    private readonly bookingService: BookingService,
  ) {
    this.cabanaLocationsById = new Map(resortMap.cabanas.map((cabana) => [cabana.id, cabana]));
  }

  getMap(): ResortMapView {
    const cabanaViews = this.buildCabanaViews();
    const cabanaViewsById = new Map(cabanaViews.map((cabana) => [cabana.id, cabana]));

    return {
      rows: this.resortMap.rows,
      cols: this.resortMap.cols,
      tiles: this.projectTiles(cabanaViewsById),
      cabanas: cabanaViews,
    };
  }

  getCabana(cabanaId: string): Cabana {
    return this.toCabanaView(this.requireCabanaLocation(cabanaId));
  }

  bookCabana(cabanaId: string, room: string, guestName: string): Cabana {
    this.requireCabanaLocation(cabanaId);
    this.bookingService.bookCabana(cabanaId, room, guestName);
    return this.getCabana(cabanaId);
  }

  private buildCabanaViews(): Cabana[] {
    return this.resortMap.cabanas.map((cabana) => this.toCabanaView(cabana));
  }

  private projectTiles(cabanaViewsById: Map<string, Cabana>): MapTile[][] {
    return this.resortMap.tiles.map((row) =>
      row.map((tile) => this.projectTile(tile, cabanaViewsById)),
    );
  }

  private requireCabanaLocation(cabanaId: string): CabanaLocation {
    const cabana = this.cabanaLocationsById.get(cabanaId);

    if (!cabana) {
      throw new BookingError("cabana_not_found", "Cabana was not found.");
    }

    return cabana;
  }

  private toCabanaView(cabana: CabanaLocation): Cabana {
    return {
      ...cabana,
      isAvailable: this.bookingService.getCabanaAvailability(cabana.id),
    };
  }

  private projectTile(tile: Tile, cabanaViewsById: Map<string, Cabana>): MapTile {
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
