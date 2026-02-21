import { useCallback, useReducer } from "react";
import type { PageComponent, PageData } from "@project-promotion/components";

interface EditorState {
  pageData: PageData;
  selectedComponentId: string | null;
  undoStack: PageData[];
  redoStack: PageData[];
  isDirty: boolean;
}

type EditorAction =
  | { type: "ADD_COMPONENT"; component: PageComponent; index?: number }
  | { type: "REMOVE_COMPONENT"; componentId: string }
  | { type: "MOVE_COMPONENT"; fromIndex: number; toIndex: number }
  | { type: "UPDATE_PROPS"; componentId: string; props: Record<string, unknown> }
  | { type: "SELECT_COMPONENT"; componentId: string | null }
  | { type: "SET_PAGE_DATA"; pageData: PageData }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "MARK_SAVED" };

function pushUndo(state: EditorState): EditorState {
  return {
    ...state,
    undoStack: [...state.undoStack.slice(-49), state.pageData],
    redoStack: [],
    isDirty: true,
  };
}

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "ADD_COMPONENT": {
      const withUndo = pushUndo(state);
      const components = [...withUndo.pageData.components];
      const index = action.index ?? components.length;
      components.splice(index, 0, action.component);
      return {
        ...withUndo,
        pageData: { ...withUndo.pageData, components },
        selectedComponentId: action.component.id,
      };
    }

    case "REMOVE_COMPONENT": {
      const withUndo = pushUndo(state);
      return {
        ...withUndo,
        pageData: {
          ...withUndo.pageData,
          components: withUndo.pageData.components.filter(
            (c) => c.id !== action.componentId
          ),
        },
        selectedComponentId:
          state.selectedComponentId === action.componentId
            ? null
            : state.selectedComponentId,
      };
    }

    case "MOVE_COMPONENT": {
      const withUndo = pushUndo(state);
      const components = [...withUndo.pageData.components];
      const [moved] = components.splice(action.fromIndex, 1);
      components.splice(action.toIndex, 0, moved);
      return {
        ...withUndo,
        pageData: { ...withUndo.pageData, components },
      };
    }

    case "UPDATE_PROPS": {
      const withUndo = pushUndo(state);
      return {
        ...withUndo,
        pageData: {
          ...withUndo.pageData,
          components: withUndo.pageData.components.map((c) =>
            c.id === action.componentId
              ? { ...c, props: { ...c.props, ...action.props } }
              : c
          ),
        },
      };
    }

    case "SELECT_COMPONENT":
      return { ...state, selectedComponentId: action.componentId };

    case "SET_PAGE_DATA":
      return {
        ...state,
        pageData: action.pageData,
        selectedComponentId: null,
        undoStack: [],
        redoStack: [],
        isDirty: false,
      };

    case "UNDO": {
      if (state.undoStack.length === 0) return state;
      const previous = state.undoStack[state.undoStack.length - 1];
      return {
        ...state,
        pageData: previous,
        undoStack: state.undoStack.slice(0, -1),
        redoStack: [...state.redoStack, state.pageData],
        isDirty: true,
      };
    }

    case "REDO": {
      if (state.redoStack.length === 0) return state;
      const next = state.redoStack[state.redoStack.length - 1];
      return {
        ...state,
        pageData: next,
        undoStack: [...state.undoStack, state.pageData],
        redoStack: state.redoStack.slice(0, -1),
        isDirty: true,
      };
    }

    case "MARK_SAVED":
      return { ...state, isDirty: false };

    default:
      return state;
  }
}

export function useEditorStore(initialPageData: PageData) {
  const [state, dispatch] = useReducer(editorReducer, {
    pageData: initialPageData,
    selectedComponentId: null,
    undoStack: [],
    redoStack: [],
    isDirty: false,
  });

  const addComponent = useCallback(
    (component: PageComponent, index?: number) =>
      dispatch({ type: "ADD_COMPONENT", component, index }),
    []
  );

  const removeComponent = useCallback(
    (componentId: string) =>
      dispatch({ type: "REMOVE_COMPONENT", componentId }),
    []
  );

  const moveComponent = useCallback(
    (fromIndex: number, toIndex: number) =>
      dispatch({ type: "MOVE_COMPONENT", fromIndex, toIndex }),
    []
  );

  const updateProps = useCallback(
    (componentId: string, props: Record<string, unknown>) =>
      dispatch({ type: "UPDATE_PROPS", componentId, props }),
    []
  );

  const selectComponent = useCallback(
    (componentId: string | null) =>
      dispatch({ type: "SELECT_COMPONENT", componentId }),
    []
  );

  const undo = useCallback(() => dispatch({ type: "UNDO" }), []);
  const redo = useCallback(() => dispatch({ type: "REDO" }), []);
  const markSaved = useCallback(() => dispatch({ type: "MARK_SAVED" }), []);

  const selectedComponent = state.selectedComponentId
    ? state.pageData.components.find(
        (c) => c.id === state.selectedComponentId
      ) ?? null
    : null;

  return {
    state,
    selectedComponent,
    addComponent,
    removeComponent,
    moveComponent,
    updateProps,
    selectComponent,
    undo,
    redo,
    markSaved,
  };
}
