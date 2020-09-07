import { typedAction } from '../common';

export enum BrewingViewMode {
    SessionList = "SESSIONLIST",
    SessionView = "SESSIONVIEW"
}

type BrewingViewState = {
    mode: BrewingViewMode;
};

const initialState: BrewingViewState = {
  mode: BrewingViewMode.SessionList,
};

export const changeBrewViewMode = (newMode: BrewingViewMode) => {
  return typedAction('brewingview/CHANGE_MODE', newMode);
};

type BrewingViewModeAction = ReturnType<typeof changeBrewViewMode>;

export function brewingViewReducer(
  state = initialState,
  action: BrewingViewModeAction
): BrewingViewState {
  switch (action.type) {
    case 'brewingview/CHANGE_MODE':
      return {
        ...state,
        mode: action.payload,
      };
    default:
      return state;
  }
}