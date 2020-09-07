
import React from "react";
import { RootState } from "./redux";
import { connect } from "react-redux";
import { Container } from "semantic-ui-react";
import './Recipes.css';
import { RecipeViewMode } from './redux/modules/recipeview';
import { RecipeList } from './RecipeList' 
import { RecipeDetails } from './RecipeDetails'

import { changeMode } from './redux/modules/recipeview'



const mapStateToProps = (state: RootState) => ({
  mode: state.recipeView.mode,
});

const mapDispatchToProps = {changeMode};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const UnconnectedRecipeView: React.FC<Props> = ( { changeMode, mode } ) => {

  console.log( " UnconnectedRecipeView: " + mode )

  return (
    <Container>
      { mode === RecipeViewMode.RecipeList && <RecipeList /> }
      { mode === RecipeViewMode.RecipeDetails && <RecipeDetails/> }
    </Container>
  );
};


export const RecipeView = connect(
  mapStateToProps,
  mapDispatchToProps
  )(UnconnectedRecipeView);
