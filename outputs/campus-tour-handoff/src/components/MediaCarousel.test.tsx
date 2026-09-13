import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { LocationMedia } from "../types/tour";
import { MediaCarousel } from "./MediaCarousel";

const media: readonly LocationMedia[] = [
  {
    type: "image",
    src: "/campus.jpg",
    alt: "A tree-lined campus path",
  },
  {
    type: "video",
    src: "/campus.mp4",
    label: "A video tour of the quad",
    poster: "/poster.jpg",
  },
];

describe("MediaCarousel", () => {
  it("renders accessible mixed media without autoplaying video", () => {
    render(<MediaCarousel media={media} title="Campus highlights" />);

    expect(screen.getByRole("img", { name: "A tree-lined campus path" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Next media" }));
    const video = screen.getByLabelText("A video tour of the quad");
    expect(video).toHaveAttribute("controls");
    expect(video).not.toHaveAttribute("autoplay");
    expect(screen.getByRole("button", { name: "Previous media" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Next media" })).toBeEnabled();
    expect(screen.getByText("2 of 2")).toHaveAttribute("aria-live", "polite");
  });

  it("wraps backward from the first slide to the last slide", () => {
    render(<MediaCarousel media={media} title="Campus highlights" />);

    fireEvent.click(screen.getByRole("button", { name: "Previous media" }));

    expect(screen.getByText("2 of 2")).toBeInTheDocument();
  });

  it("wraps forward from the last slide to the first slide", () => {
    render(<MediaCarousel media={media} title="Campus highlights" />);

    const nextButton = screen.getByRole("button", { name: "Next media" });
    fireEvent.click(nextButton);
    expect(screen.getByText("2 of 2")).toBeInTheDocument();

    fireEvent.click(nextButton);
    expect(screen.getByText("1 of 2")).toBeInTheDocument();
  });
});
