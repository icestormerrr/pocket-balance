import {nanoid} from "nanoid";
import {create} from "zustand";
import {devtools, persist} from "zustand/middleware";
import type {Operation} from "./types";

type OperationStore = {
  operations: Operation[];
  addOperation: (operation: Omit<Operation, "id">) => void;
  deleteOperation: (id: string) => void;
  updateOperation: (operation: Operation) => void;
};

export const useOperationStore = create<OperationStore>()(
  devtools(
    persist(
      set => ({
        operations: [],

        addOperation: (operation: Omit<Operation, "id">) =>
          set(state => ({
            operations: [...state.operations, {...operation, id: nanoid()}],
          })),

        updateOperation: (operation: Operation) =>
          set(state => ({
            operations: state.operations.map(op => (op.id === operation.id ? operation : op)),
          })),

        deleteOperation: (id: string) =>
          set(state => ({
            operations: state.operations.filter(op => op.id !== id),
          })),
      }),
      {
        name: "operation-storage",
      }
    )
  )
);
