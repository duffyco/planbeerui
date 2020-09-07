
import React from "react";
import { RootState } from "./redux";
import { connect } from "react-redux";
import { Container } from "semantic-ui-react";
import { bindActionCreators, Dispatch } from 'redux';
import {getImportableItems, updateSaveRecipe, updateSaveSession, refreshImportables} from './redux/modules/settingsview'
import {loadMachines, MachineListHeader} from './redux/modules/machinelist'
import {loadRecipeHeaders} from './redux/modules/recipelist'
import {generateSingleRow, generateTableRow, RecipeTable } from './RecipeTable'
import {SettingsTable} from './SettingsTable'
import './Recipes.css';



const mapStateToProps = (state: RootState) => ({
  importableSessions: state.settings.importableSessions,
  importableRecipes: state.settings.importableRecipes,
  machines: state.machines.machines,
  recipeList: state.recipeList.recipes,
  importableChecked: state.settings.importableChecked
  });
  
  const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
      {
        getImportableItems,
        loadMachines,
        loadRecipeHeaders,
        updateSaveRecipe,
        updateSaveSession,
        refreshImportables
      },
      dispatch
    );
  };
  
     function unwindRecipes(recipesIn: Array<any> ): Array<Array<string>> {
      let retArrayRec: Array<Array<string>>;
      retArrayRec=[];

      recipesIn.forEach( function( recipeIn: any ) {
        retArrayRec.push( [
          recipeIn.Date,
          recipeIn.Name,
          recipeIn.Style,
          recipeIn.ABV + " / " + recipeIn.IBU + " / " + recipeIn.SRM,
          recipeIn.BoilSize,
          ] )
      })
  
    return retArrayRec;
  }

  function unwindSessions(sessions: Array<any> ): Array<Array<string>> {
    let retArray: Array<Array<string>>;
    retArray=[];

    sessions.forEach( function( session: any ) {
        retArray.push( [
          session.SessionID,
          session.LogDate
        ] )
    })

    return retArray;
  }

const importSessionHeader = ["SessionID", "LogDate", "Machine", "Recipes", "Save Session"]
const importRecipeHeader = ["Date", "Name", "Style", "ABV / IBU / SRM", "Boilsize", "Save Recipe"]

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const UnconnectedSettingsView: React.FC<Props> = ( { refreshImportables, importableChecked, updateSaveRecipe, updateSaveSession, loadRecipeHeaders, recipeList, loadMachines, machines, importableSessions, importableRecipes, getImportableItems } ) => {
  
  console.log( "UnconnectedSettingsView")

  if( !importableChecked  )
  {
    if( machines.length == 0) {
      loadMachines();
    }

    getImportableItems();
    loadRecipeHeaders();
  }

  return (
    <Container>
          <SettingsTable title={"Import Recipes"} type={"Recipe"} machines={machines} recipeList={recipeList}
                    recipes={generateTableRow( true, ["Recipe", importRecipeHeader, unwindRecipes( importableRecipes ) ]) } />

          <SettingsTable title={"Import Sessions"} type={"Session"} machines={machines} recipeList={recipeList}
                        sessions={generateTableRow( true, ["Session", importSessionHeader, unwindSessions( importableSessions ) ]) }/>

    </Container>
  );
};


export const SettingsView = connect(
  mapStateToProps,
  mapDispatchToProps
  )(UnconnectedSettingsView);
