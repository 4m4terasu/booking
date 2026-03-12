import { BookCabanaInput, BookingResponse, ResortMapResponse } from "./types.js";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  return JSON.parse(text) as unknown;
}

async function requestJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  const payload = await parseJson(response);

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "message" in payload
        ? String(payload.message)
        : "Request failed.";

    throw new ApiError(response.status, message);
  }

  return payload as T;
}

export function fetchResortMap(): Promise<ResortMapResponse> {
  return requestJson<ResortMapResponse>("/api/map");
}

export function bookCabana(
  cabanaId: string,
  payload: BookCabanaInput,
): Promise<BookingResponse> {
  return requestJson<BookingResponse>(`/api/cabanas/${cabanaId}/book`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}