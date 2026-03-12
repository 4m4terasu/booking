export type TileType = "empty" | "path" | "pool" | "chalet" | "cabana";

export interface Tile {
  x: number;
  y: number;
  type: TileType;
  cabanaId?: string;
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

export interface Cabana {
  id: string;
  x: number;
  y: number;
  isAvailable: boolean;
}

export interface ResortMap {
  rows: number;
  cols: number;
  tiles: Tile[][];
  cabanas: Cabana[];
}