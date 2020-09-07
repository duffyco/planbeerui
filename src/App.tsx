import React from 'react';
import { connect } from "react-redux";
import { RootState } from "./redux";
import { Container } from "semantic-ui-react";
import './App.css';
import './Recipes.css';
import { AppViewMode, changeAppMode } from './redux/modules/app';
import { RecipeView } from './RecipeView'
import { BrewingView } from './BrewingView'
import {SettingsView} from './SettingsView'
import { NavBar } from './NavBar'
import { Helmet } from 'react-helmet';

const mapStateToProps = (state: RootState) => ({
  mode: state.app.mode,
});

const mapDispatchToProps = {changeAppMode};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const UnconnectedAppView: React.FC<Props> = ( { mode, changeAppMode } ) => {

  return (
    <Container>
    <Helmet>
      <body className="app-container"/>
    </Helmet>
      <NavBar/>
      { mode === AppViewMode.Recipes && <RecipeView /> }
      { mode === AppViewMode.Brewing && <BrewingView /> }
      { mode === AppViewMode.Settings && <SettingsView /> }
    </Container>
  );
};

 export const App = connect(
  mapStateToProps,
  mapDispatchToProps
  )(UnconnectedAppView);