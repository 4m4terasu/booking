export type TileType = "empty" | "path" | "pool" | "chalet" | "cabana";

export interface ResortMapTile {
  x: number;
  y: number;
  type: TileType;
  cabanaId?: string;
  isAvailable?: boolean;
}

export interface ResortCabana {
  id: string;
  x: number;
  y: number;
  isAvailable: boolean;
}

export interface ResortMapResponse {
  rows: number;
  cols: number;
  tiles: ResortMapTile[][];
  cabanas: ResortCabana[];
}

export interface BookCabanaInput {
  room: string;
  guestName: string;
}

export interface BookingResponse {
  message: string;
  cabana: ResortCabana;
}

export interface Notice {
  tone: "success" | "error";
  message: string;
}