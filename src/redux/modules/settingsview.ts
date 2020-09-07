import { typedAction, API_URL } from '../common';
import { Dispatch, AnyAction } from 'redux';
import  axios  from 'axios'

type ImportableSession = {
    ID: number,
    recipename: string
}

type SettingsListState = {
    importableSessions: ImportableSession[];
    importableChecked: boolean;
    importableRecipes: ImportableSession[];
    savingSession: boolean;
    savingRecipe: boolean;
    uploading: boolean;
};

const initialState: SettingsListState = {
    importableSessions: [],
    importableRecipes: [],
    importableChecked: false,
    savingSession: false,
    savingRecipe: false,
    uploading: false
};

const addImportableSessions = (sessions: any[]) => {
  return typedAction('settings/ADD_IMPORTABLE_SESSIONS', sessions);
};

const addImportableRecipes = (recipes: any[]) => {
  return typedAction('settings/ADD_IMPORTABLES_RECIPES', recipes);
};

export const updateSaveRecipe = (loading: boolean) => {
  return typedAction('settings/UPDATE_SAVE_RECIPE', loading);
};

export const updateSaveSession = (loading: boolean) => {
  return typedAction('settings/UPDATE_SAVE_SESSION', loading);
};

export const deleteImportables = () => {
  return typedAction('settings/DELETE_IMPORTABLES', null);
};

export const refreshImportables = () => {
  return typedAction('settings/REFRESH', null);
};

  export const getImportableItems = () => {
    return (dispatch: Dispatch<AnyAction>) => {
      axios.get( API_URL + '/ui/GetImportableItems/' ) 
        .then( res => {
          console.log( "getImportableItems")
          console.dir( res.data )
          dispatch( addImportableSessions( res.data.ImportableSessions ) )
          dispatch( addImportableRecipes( res.data.ImportableRecipes ) )
        } );
      };
  };

  export const deleteImportableSession = (id: number) => {
    console.log( "deleteImportableSession" );
    return (dispatch: Dispatch<AnyAction>) => {
      console.log( "deleteImportableSessionFire" );
      axios.get( API_URL + '/ui/DeleteImportableSession/' + id ) 
        .then( res => {
          dispatch( deleteImportables() )
        } );
      };
  };
  
  export const deleteImportableRecipe = (id: number) => {
    console.log( "deleteImportableRecipe" );
    return (dispatch: Dispatch<AnyAction>) => {
      console.log( "deleteImportableRecipeFire" );
      axios.get( API_URL + '/ui/DeleteImportableRecipe/' + id ) 
        .then( res => {
          dispatch( deleteImportables() )
        } );
      };
  };

  export const saveRecipe = (name: string ) => {
      return (dispatch: Dispatch<AnyAction>) => {      
      dispatch( updateSaveRecipe(true) )
      axios.post( API_URL + '/ui/ImportRecipe/' + name ) 
        .then( res => {
          console.log( "saveRecipe")
          dispatch( updateSaveRecipe(false) )
      },res => {
        alert( "Unable to import recipe: " + name + ". (Retry)" )
        dispatch( updateSaveRecipe(false) )
    });
    };
  };

  export const uploadFiles = (fileType: string, inFiles: string[], fileNames: string[]) => {
    console.log( "uploadFiles" )
    return (dispatch: Dispatch<AnyAction>) => {      
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    axios.post( API_URL + '/ui/UploadFiles/', {
      Type: fileType,
      Files: inFiles,
      FileNames: fileNames
    } , {headers: headers} )
      .then( res => {
        console.log( "uploadSessionFiles")
        dispatch( refreshImportables() )
    },res => {
      alert( "Unable to save upload session file: " + fileNames + ". (Retry)")
      dispatch( refreshImportables() )
  });
  };
};


  export const saveSession = (id: number, machine: string, recipeid: number ) => {
    return (dispatch: Dispatch<AnyAction>) => {      
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      dispatch( updateSaveSession(true) )
    axios.post( API_URL + '/ui/ImportSession/', {
      SessionID: id,
      Machine: machine,
      RecipeID: recipeid
    } , {headers: headers} )
      .then( res => {
        console.log( "saveSession")
        alert( "done save" );
        dispatch( updateSaveSession(false) )
    },res => {
      alert( "Unable to save session: " + id + ". (Retry)")
      dispatch( updateSaveSession(false) )
  }).catch(
    function (error) {
      alert( "Cannot connect to " + API_URL)
  });
  };
};


type SettingsListAction = ReturnType<typeof deleteImportables | typeof refreshImportables | typeof addImportableRecipes | typeof addImportableSessions | typeof updateSaveRecipe | typeof updateSaveSession>;

export function settingsListReducer(
  state = initialState,
  action: SettingsListAction
): SettingsListState {
  switch (action.type) {
    case 'settings/REFRESH' : 
    return {
      ...state,
      importableChecked: false
    };
    case 'settings/DELETE_IMPORTABLES':
      return {
        ...state,
        importableSessions: [],
        importableRecipes: [],
        importableChecked: false
      };
    case 'settings/ADD_IMPORTABLE_SESSIONS':
      if( action.payload == null ) {
        return {
          ...state,
          importableSessions: [...state.importableSessions],
        }
      }
      else 
      {
        return {
          ...state,
          importableSessions: [...action.payload],
          importableChecked: true
        };
      };
      case 'settings/ADD_IMPORTABLES_RECIPES':
      if( action.payload == null ) {
        return {
          ...state,
          importableRecipes: [...state.importableRecipes],
          importableChecked: true
        }
      }
      else 
      {
        return {
          ...state,
          importableRecipes: [...action.payload],
          importableChecked: true
        };
      };
      case 'settings/UPDATE_SAVE_RECIPE': {
        return {
          ...state,
          savingRecipe: action.payload,
        }
      };
      case 'settings/UPDATE_SAVE_SESSION': {
        return {
          ...state,
          savingSession: action.payload,
        }  
      };
    default:
      return state;
  }
}