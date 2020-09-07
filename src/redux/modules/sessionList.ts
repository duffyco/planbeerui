import { typedAction, API_URL } from '../common';
import { Dispatch, AnyAction } from 'redux';
import  axios  from 'axios'

export type SessionList = {
  ID: number;
  machinename: string;
  recipename: string;
  recipeid: number;
  token: string;
  style: string;
  brewdate: string;
  ABV: number;
  IBU: number;
  SRM: number;
  OG: number;
};

type SessionListState = {
    sessions: SessionList[];
    loading: boolean;
    currentSession: any | undefined;
    currentSessionLogs: any | undefined;
};

const initialState: SessionListState = {
  sessions: [],
  loading: false,
  currentSession: undefined,
  currentSessionLogs: undefined
};

const addSessions = (sessionList: SessionList[]) => {
  return typedAction('sessionList/ADD_SESSION', sessionList);
};

const removeSessions = (sessionid: Number) => {
  return typedAction('sessionList/REMOVE_SESSIONS', sessionid);
};

const setSessionsList = (sessionList: SessionList[]) => {
  return typedAction('sessionList/SET_SESSIONS', sessionList);
};

export const setSessions = (sessions: SessionList[]) => {
  return (dispatch: Dispatch<AnyAction>) => {
        dispatch( setSessionsList([]) )
        dispatch( setSessionsList( sessions ) )
  };
};


export const viewSessionLogs = (sessionLogs: any) => {
  console.log( "viewSessionLogs" );
  return typedAction('sessionList/VIEW_SESSION_LOGS', sessionLogs);
};

export const viewSession = (session: any) => {
  console.log( "viewSession" );
  return typedAction('sessionList/VIEW_SESSION', session);
};

// Action creator returning a thunk!
export const loadSessions = () => {
    return (dispatch: Dispatch<AnyAction>) => {
      axios.get( API_URL + '/ui/ListSessions') 
        .then( res => {
          if( res.data.Sessions !== null ) {
            console.dir( res.data.Sessions )
            dispatch( addSessions( res.data.Sessions ) )
          }
        } );
    };
  };

  export const deleteSession = (id: Number) => {
    return (dispatch: Dispatch<AnyAction>) => {
      axios.get( API_URL + '/ui/DeleteSession/' + id ) 
        .then( res => {
          dispatch( removeSessions( id ) )
        } );
      };
  };


  export const getSession = (id: Number) => {
    return (dispatch: Dispatch<AnyAction>) => {
      axios.get( API_URL + '/ui/GetSession/' + id ) 
        .then( res => {
          console.log( "LogData: " )
          console.dir( res.data )
          dispatch( viewSession( res.data ) )
        } );
      };
  };

export const getSessionLogs = (id: Number) => {
  return (dispatch: Dispatch<AnyAction>) => {
    axios.get( API_URL + '/ui/GetLogs/' + id ) 
      .then( res => {
        console.log( "LogData: " )
        console.dir( res.data.LogData )
        dispatch( viewSessionLogs( res.data.LogData ) )
      } );
    };
};

type SessionListAction = ReturnType<typeof addSessions | typeof viewSession | typeof viewSessionLogs | typeof removeSessions | typeof setSessionsList>;

export function sessionListReducer(
  state = initialState,
  action: SessionListAction
): SessionListState {
  switch (action.type) {
    case 'sessionList/ADD_SESSION':
      if( action.payload == null ) {
        return {
          ...state,
          sessions: [...state.sessions]
        }
      }
      else 
      {
        return {
          ...state,
          sessions: [...state.sessions, ...action.payload],
        };
      };
      case 'sessionList/REMOVE_SESSIONS':
        return {
          ...state,
          sessions: [],
        };      
      case 'sessionList/SET_SESSIONS':
        return {
          ...state,
          sessions: [...action.payload],
        };      
      case 'sessionList/VIEW_SESSION':
      return {
        ...state,
        currentSession: action.payload,
      };      
    case 'sessionList/VIEW_SESSION_LOGS':
      return {
        ...state,
        currentSessionLogs: action.payload,
      };      
    default:
      return state;
  }
}