import { typedAction } from '../common';

export enum RecipeViewMode {
    RecipeList = "RECIPELIST",
    RecipeDetails = "RECIPEDETAILS",
}

type RecipeViewState = {
    mode: RecipeViewMode;
};

const initialState: RecipeViewState = {
  mode: RecipeViewMode.RecipeList,
};

export const changeMode = (newMode: RecipeViewMode) => {
  console.log( "ChangeMode" + newMode )
  return typedAction('recipeView/CHANGE_MODE', newMode);
};

type RecipeViewModeAction = ReturnType<typeof changeMode>;

export function recipeViewReducer(
  state = initialState,
  action: RecipeViewModeAction
): RecipeViewState {
  switch (action.type) {
    case 'recipeView/CHANGE_MODE':
      return {
        ...state,
        mode: action.payload,
      };
    default:
      return state;
  }
}