import { typedAction } from '../common';

export enum AppViewMode {
    Recipes = "RECIPES",
    Brewing = "BREWING",
    Settings = "SETTINGS",
}

type AppViewState = {
    mode: AppViewMode;
};

const initialState: AppViewState = {
  mode: AppViewMode.Recipes,
};

export const changeAppMode = (newMode: AppViewMode) => {
  return typedAction('app/CHANGE_MODE', newMode);
};

type AppModeAction = ReturnType<typeof changeAppMode>;

export function appViewReducer(
  state = initialState,
  action: AppModeAction
): AppViewState {
  switch (action.type) {
    case 'app/CHANGE_MODE':
      return {
        ...state,
        mode: action.payload,
      };
    default:
      return state;
  }
}