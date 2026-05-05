import { create } from "zustand";
import locations from "../data/locations.json";

const MAX_SELECTION = 4;

export const useStore = create((set, get) => ({
  locations,
  selectedNodes: [],
  activeNodeId: null,
  viewMode: "single",
  timeOffsetMs: 0,
  setTimeOffset: (ms) => set({ timeOffsetMs: ms }),
  toggleLens: (nodeId) => {
    const { selectedNodes } = get();
    const isSelected = selectedNodes.includes(nodeId);

    let nextSelection;
    if (isSelected) {
      nextSelection = selectedNodes.filter((id) => id !== nodeId);
    } else {
      nextSelection = [...selectedNodes, nodeId].slice(0, MAX_SELECTION);
    }

    set({
      selectedNodes: nextSelection,
      activeNodeId: nextSelection.at(-1) ?? null,
      viewMode: nextSelection.length > 1 ? "compare" : "single",
    });
  },
  clearSelection: () =>
    set({
      selectedNodes: [],
      activeNodeId: null,
      viewMode: "single",
    }),
}));
