import { typedAction, API_URL } from '../common';
import { Dispatch, AnyAction } from 'redux';
import  axios  from 'axios'
import * as rax from 'retry-axios';

const interceptorId = rax.attach();

export enum MachineStatus {
  Idle = 9999999,
  Active = 1
}

export type CurrentStatus = {
  LastSeen: string;
  Status: string;
  SessionID: number;
  SessionType: number;
  ErrorCode: number;
  PauseReason: number;
  TimeRemaining: number;
}

export type MachineListHeader = {
  ID: number;
  name: string;
  token: string;
  firmware: string;
  usessinceclean: number;
  CurrentStatus: CurrentStatus;
};

type MachineListState = {
    machines: MachineListHeader[];
    loading: boolean;
};

const initialState: MachineListState = {
  machines: [],
  loading: false,
};


const addMachines = (MachineHeaders: MachineListHeader[]) => {
  return typedAction('MachineList/ADD_MACHINE', MachineHeaders);
};

const removeMachines = (token: string) => {
  return typedAction('MachineList/REMOVE_MACHINES', token);
};

const setMachineTitles = (MachineHeaders: MachineListHeader[]) => {
  return typedAction('MachineList/SET_MACHINES', MachineHeaders);
};

export const setMachines = (machines: MachineListHeader[]) => {
  return (dispatch: Dispatch<AnyAction>) => {
        dispatch( setMachineTitles([]) )
        dispatch( setMachineTitles( machines ) )
  };
};

export const deleteMachine = (token: string) => {
  console.log( "DeleteMachine" );
  return (dispatch: Dispatch<AnyAction>) => {
    console.log( "DeleteMachineFire" );
    axios.get( API_URL + '/ui/DeleteMachine/' + token ) 
      .then( res => {
        dispatch( removeMachines( token ) )
      } );
    };
};

//dispatch( addMachines( res.data.Machines ) )
// Action creator returning a thunk!
export const loadMachines = () => {
    return (dispatch: Dispatch<AnyAction>) => {
      axios.get( API_URL + '/ui/ListMachines') 
        .then( res => {
          dispatch( addMachines( res.data.Machines ) )
        } );
    };
  };

/*
            ID: 2,
            name: "ZNext",
            token: "deadB33f",
            lastused: "1/1/2020",
            status: "????",            
            firmware: "0.0.116",
            SessionSinceClean: 2,
*/

type MachineListAction = ReturnType<typeof addMachines | typeof removeMachines | typeof setMachineTitles>;

//@TODO: Addmachines/setmachines are the same, but cause a loop in redux
// original AddMachine machines: [...state.machines, ...action.payload],
export function machineListReducer(
  state = initialState,
  action: MachineListAction
): MachineListState {
  switch (action.type) {
    case 'MachineList/ADD_MACHINE':
      if( action.payload === null) {
        return state;
      }
      else {
        return {
          ...state,
          machines: [...action.payload],
        };

      }
    case 'MachineList/REMOVE_MACHINES':
      return {
        ...state,
        machines: [],
    };      
    case 'MachineList/SET_MACHINES':
      if( action.payload === null) {
        return state;
      }
      else {
        return {
          ...state,
          machines: [...action.payload],
        };

      }      
    default:
      return state;
  }
}