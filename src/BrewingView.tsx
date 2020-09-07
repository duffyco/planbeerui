
import React from "react";
import { RootState } from "./redux";
import { connect } from "react-redux";
import { Container } from "semantic-ui-react";
import './Recipes.css';
import { changeBrewViewMode, BrewingViewMode } from './redux/modules/brewingview';
import {MachineList} from './MachineList'
import {SessionList} from './SessionList'
import {SessionDetails} from './SessionDetails'

const mapStateToProps = (state: RootState) => ({
  mode: state.brewingView.mode,
});

const mapDispatchToProps = {changeBrewViewMode};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const UnconnectedBrewingView: React.FC<Props> = ( { mode, changeBrewViewMode } ) => {

  console.log( "UnconnectedBrewingView")

  return (
    <Container>
      { mode === BrewingViewMode.SessionList && 
          <Container>
            <MachineList/>  
            <SessionList/>
          </Container>
      }
      {
        mode === BrewingViewMode.SessionView &&
          <Container>
            <SessionDetails/>
          </Container>
      }
    </Container>
  );
};


export const BrewingView = connect(
  mapStateToProps,
  mapDispatchToProps
  )(UnconnectedBrewingView);
