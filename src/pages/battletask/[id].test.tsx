import { render, screen, fireEvent } from "@testing-library/react";
import { BattleTask } from "./[id]";
import { describe } from "node:test";

const subtasks = [
  {
    id: 1,
    title: "Subtask 1",
    estimatedMinutes: 10,
    isCompleted: false,
  },
  {
    id: 2,
    title: "Subtask 2",
    estimatedMinutes: 20,
    isCompleted: false,
  },
];

describe("BattleTask", () => {
  it("renders the subtasks", () => {
    render(<BattleTask subtasks={subtasks} imageurl={undefined} />);
    const subtask1 = screen.getByText("Subtask 1");
    const subtask2 = screen.getByText("Subtask 2");
    expect(subtask1).toBeInTheDocument();
    expect(subtask2).toBeInTheDocument();
  });

  it("updates the progress bar when a subtask is completed", () => {
    render(<BattleTask subtasks={subtasks} imageurl={undefined} />);
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute("aria-valuenow", "100");
    fireEvent.click(screen.getByText("Subtask 1"));
    expect(progressBar).toHaveAttribute("aria-valuenow", "83");
  });
});