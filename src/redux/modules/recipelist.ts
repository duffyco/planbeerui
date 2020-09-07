import { typedAction, API_URL } from '../common';
import { Dispatch, AnyAction } from 'redux';
import  axios  from 'axios'

export type RecipeListHeader = {
  ID: number;
  name: string;
  style: string;
  og: number;
  fg: number;
  ibu: number;
  srm: number;
  abv: string;
  synced: boolean;
};

type RecipeListState = {
    recipes: RecipeListHeader[];
    sortOrderAZ: boolean;
    loading: boolean;
    currentRecipe: any | undefined;
};

const initialState: RecipeListState = {
  recipes: [],
  sortOrderAZ: true,
  loading: false,
  currentRecipe: undefined,
};

const addRecipes = (recipeHeaders: RecipeListHeader[]) => {
  return typedAction('recipeList/ADD_RECIPES', recipeHeaders);
};

export const setRecipes = (recipeState: RecipeListHeader[]) => {
  console.log( "SetRecipes" )
  console.dir( recipeState )
  return typedAction('recipeList/SET_RECIPES', recipeState);
};

const removeRecipe = (recipeid: Number) => {
  return typedAction('recipeList/REMOVE_RECIPES', recipeid);
};

export const viewRecipe = (recipe: any) => {
  console.log( "ViewRecipe" );
  return typedAction('recipeList/VIEW_RECIPE', recipe);
};

export const updateRecipeFromHeader = (i: number, recHeaders: RecipeListHeader[]) => {
  return (dispatch: Dispatch<AnyAction>) => {      
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      var recHeader = recHeaders[i];
      axios.post( API_URL + '/ui/UpdateRecipe/' + recHeader.ID, {
          Synced: recHeader.synced
    } , {headers: headers} )
      .then( res => {
        console.log( "UpdateRecipeFromHeader")
        dispatch( setRecipes(recHeaders) )
    },res => {
      alert( "Unable to save update recipe: " + recHeader.name + ".  (Retry)")
  });
  };
};

export const getRecipe = (id: Number) => {
  return (dispatch: Dispatch<AnyAction>) => {
    axios.get( API_URL + '/ui/GetRecipe/' + id ) 
      .then( res => {
        console.dir( res.data.Recipe )
        dispatch( viewRecipe( res.data.Recipe ) )
      }).catch(
        function (error) {
          alert( "Unable to connect to " + API_URL)
      });
    };
};

export const deleteRecipe = (id: Number) => {
  return (dispatch: Dispatch<AnyAction>) => {
    axios.get( API_URL + '/ui/DeleteRecipe/' + id ) 
      .then( res => {
        dispatch( removeRecipe( id ) )
      } );
    };
};

export const loadRecipeHeaders = () => {
  console.log( "LOADRECIPEHEADERS" );
  return (dispatch: Dispatch<AnyAction>) => {
    axios.get( API_URL + '/ui/ListRecipes') 
      .then( res => {
        console.dir( res.data.Recipes )
        dispatch( addRecipes( res.data.Recipes ) )
      }).catch(
        function (error) {
          alert( "Unable to connect to " + API_URL)
      });
  };
};

type RecipeListAction = ReturnType<typeof addRecipes | typeof viewRecipe | typeof setRecipes | typeof removeRecipe>;

export function recipeListReducer(
  state = initialState,
  action: RecipeListAction
): RecipeListState {
  console.log( "recipeListReducer" + action );
  console.dir( action )
  switch (action.type) {
    case 'recipeList/ADD_RECIPES':
      if ( action.payload === null ) {
        console.log( "state.recipes.length == 0 ")
        return {
        ...state,
        recipes: state.recipes
      }
     } else {
      return {
        ...state,
        recipes: action.payload,
      }
    };
    case 'recipeList/REMOVE_RECIPES':
      return {
        ...state,
        recipes: [],
        currentRecipe: undefined,
      };      
    case 'recipeList/VIEW_RECIPE':
      return {
        ...state,
        currentRecipe: action.payload,
      };      
    case 'recipeList/SET_RECIPES':
      return {
        ...state,
        recipes: [...action.payload],
    };
    default:
      return state;
  }
}