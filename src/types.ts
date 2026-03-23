export type TileType = "empty" | "path" | "pool" | "chalet" | "cabana";

export interface Tile {
  x: number;
  y: number;
  type: TileType;
  cabanaId?: string;
}

export interface MapTile extends Tile {
  isAvailable?: boolean;
}

export interface GuestBooking {
  room: string;
  guestName: string;
}

export interface BookCabanaRequest {
  room: string;
  guestName: string;
}

export interface CabanaLocation {
  id: string;
  x: number;
  y: number;
}

export interface Cabana extends CabanaLocation {
  isAvailable: boolean;
}

export interface ResortMapLayout {
  rows: number;
  cols: number;
  tiles: Tile[][];
  cabanas: CabanaLocation[];
}

export interface ResortMapView {
  rows: number;
  cols: number;
  tiles: MapTile[][];
  cabanas: Cabana[];
}
