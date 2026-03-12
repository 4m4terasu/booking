import { BookingError, BookingService } from "./bookings.js";
import { Cabana, ResortMap } from "./types.js";

export class ResortMapService {
  constructor(
    private readonly resortMap: ResortMap,
    private readonly bookingService: BookingService,
  ) {}

  getMap(): ResortMap {
    const cabanas = this.resortMap.cabanas.map((cabana) => this.toCabanaView(cabana));

    const tiles = this.resortMap.tiles.map((row) =>
      row.map((tile) => {
        if (tile.type !== "cabana" || !tile.cabanaId) {
          return tile;
        }

        return {
          ...tile,
          isAvailable: this.bookingService.getCabanaAvailability(tile.cabanaId),
        };
      }),
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

  private findCabana(cabanaId: string): Cabana | undefined {
    return this.resortMap.cabanas.find((cabana) => cabana.id === cabanaId);
  }

  private toCabanaView(cabana: Cabana): Cabana {
    return {
      ...cabana,
      isAvailable: this.bookingService.getCabanaAvailability(cabana.id),
    };
  }
}