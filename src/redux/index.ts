import { combineReducers } from 'redux';
import { recipeViewReducer } from './modules/recipeview';
import { recipeListReducer } from './modules/recipelist';
import { brewingViewReducer } from './modules/brewingview';
import {machineListReducer} from './modules/machinelist'
import { appViewReducer } from './modules/app';
import { sessionListReducer } from './modules/sessionList'
import {settingsListReducer} from './modules/settingsview'

export const rootReducer = combineReducers({
    app: appViewReducer,
    recipeView: recipeViewReducer,
    recipeList: recipeListReducer,
    brewingView: brewingViewReducer,
    machines: machineListReducer,
    sessions: sessionListReducer,
    settings: settingsListReducer
});

export type RootState = ReturnType<typeof rootReducer>;