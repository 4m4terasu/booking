// @vitest-environment jsdom

import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import App from "./App.js";
import { ResortMapResponse } from "./types.js";

function createMapFixture(isAvailable = true): ResortMapResponse {
  return {
    rows: 2,
    cols: 2,
    tiles: [
      [
        { x: 0, y: 0, type: "cabana", cabanaId: "cabana-0-0", isAvailable },
        { x: 1, y: 0, type: "pool" },
      ],
      [
        { x: 0, y: 1, type: "path" },
        { x: 1, y: 1, type: "empty" },
      ],
    ],
    cabanas: [
      { id: "cabana-0-0", x: 0, y: 0, isAvailable },
    ],
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("App", () => {
  it("loads the map and books an available cabana", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify(createMapFixture(true)), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            message: "Cabana booked successfully.",
            cabana: { id: "cabana-0-0", x: 0, y: 0, isAvailable: false },
          }),
          {
            status: 201,
            headers: { "Content-Type": "application/json" },
          },
        ),
      );

    vi.stubGlobal("fetch", fetchMock);

    render(<App />);

    const user = userEvent.setup();
    const cabanaButton = await screen.findByRole("button", {
      name: /Cabana cabana-0-0 available/i,
    });

    await user.click(cabanaButton);
    await user.type(screen.getByLabelText(/Room number/i), "101");
    await user.type(screen.getByLabelText(/Guest name/i), "Alice Smith");
    await user.click(screen.getByRole("button", { name: /Confirm booking/i }));

    expect(await screen.findByText("Cabana booked successfully.")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Cabana cabana-0-0 booked/i }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
  });

  it("shows an unavailable message for a booked cabana", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(createMapFixture(false)), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    render(<App />);

    const user = userEvent.setup();
    const cabanaButton = await screen.findByRole("button", {
      name: /Cabana cabana-0-0 booked/i,
    });

    await user.click(cabanaButton);

    expect(await screen.findByText("Already booked")).toBeInTheDocument();
    expect(
      screen.getByText(/This cabana is currently unavailable/i),
    ).toBeInTheDocument();
  });
});