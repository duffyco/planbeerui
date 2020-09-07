import React, {useEffect} from 'react';
import { connect } from "react-redux";
import { RootState } from "./redux";
import { Container } from "semantic-ui-react";
import './NavBar.css';
import logo from './logo.png'
import {changeAppMode, AppViewMode} from "./redux/modules/app"
import {changeMode, RecipeViewMode } from "./redux/modules/recipeview"
import {changeBrewViewMode, BrewingViewMode} from "./redux/modules/brewingview"
import {loadMachines, MachineListHeader} from "./redux/modules/machinelist"
import {loadSessions, SessionList} from "./redux/modules/sessionList"
import { bindActionCreators, Dispatch } from 'redux';
import {nSort} from './common'

  const mapStateToProps = (state: RootState) => ({
    machines: state.machines.machines,
    sessions: state.sessions.sessions
  });
  
  const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
      {
         loadMachines,
          loadSessions,
          changeBrewViewMode,
          changeMode, 
          changeAppMode,
      },
      dispatch
    );
  };

  type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

  const UnconnectedNavBarView: React.FC<Props> = ( {sessions, loadSessions, machines, loadMachines, changeBrewViewMode, changeMode, changeAppMode }) => {

    useEffect(() => {
      if (sessions.length === 0) {
        loadSessions();
      }
    }, [loadSessions, sessions]);

    useEffect(() => {
      if (machines.length === 0) {
        loadMachines();
      }
    }, [loadMachines, machines]);

    // @TODO: Hack to sort sessions
    const orderedSessionsDate = nSort( false, "brewdate", sessions );

    const getSession = ( id: number ) => {
      for( let sess of sessions ) {
        if( sess.ID === id ) {
          return sess;
        }
      }

      return null;
    }

    const convertMsToTime = (duration: number) => {
      let seconds = Math.floor(duration % 60),
        minutes = Math.floor((duration / 60) % 60),
        hours = Math.floor((duration / (60 * 60)) % 24);
    
      console.log( hours + "," + minutes + "," + seconds)

      let shours = (hours < 10) ? "0" + hours : "" + hours;
      let sminutes = (minutes < 10) ? "0" + minutes : "" + minutes;
      let sseconds = (seconds < 10) ? "0" + seconds : "" + seconds;
    
      return shours + ":" + sminutes + ":" + sseconds;
    }; 

    const formatHighlightedSession = () => {
      console.log( "formatHighlightedSession")
      console.dir( machines );
      for( const mach of machines ) {
        if( mach.CurrentStatus.Status !== "Idle" ) {
          let sess: SessionList | null = getSession( mach.CurrentStatus.SessionID );
    
          if( sess !== null ) {
            return (
              <Container>
                <div className="machine-detail-primary">
                      Active Session (Time Remaining: { convertMsToTime( mach.CurrentStatus.TimeRemaining) } )
                </div>    
                <div className="machine-detail-primary">
                   <b>{sess.recipename} - {sess.style}</b>
                </div>   
              </Container> 
            );
          }
        }
      }

      console.log( "returning null")
      return (
        <Container>
        <div className="machine-detail-primary">
              Last Session: {sessions[0].brewdate}
        </div>    
        <div className="machine-detail-primary">
          <b>{sessions[0].recipename}</b> - {sessions[0].style}
        </div>   
      </Container> 
      );
    }

    const navigate = (newMode: AppViewMode) => (e: React.MouseEvent) => {
        changeAppMode( newMode ); 
        changeMode( RecipeViewMode.RecipeList );
        changeBrewViewMode( BrewingViewMode.SessionList );
      };

    return (
      
      <Container>
        <div className ="container group">
        <div className="navbar">
            <div className="group group-top">
              <div className="col2 first-item logo-navbar">
                  <img src={logo} className="App-logo" alt="logo" /> 
              </div>
              <div className="col2 wide-item">
              <div className="group">
              <div className ="machine-detail-primary">
                  <ul className="nav">
                  <li className="item col3">
                      <button className="btn navbtn" onClick={navigate(AppViewMode.Brewing)}> Brewing </button>
                  </li>
                  <li className="item col3">
                  <button className="btn navbtn" onClick={navigate(AppViewMode.Recipes)}> Recipes </button>
                  </li>
                  <li className="item col3">
                  <button className="btn navbtn" onClick={navigate(AppViewMode.Settings)}> Settings </button>
                  </li>
                  </ul>
              </div>
            </div>  
            <div className="group navbar-machine-status">                          
              {sessions.length == 0 &&  <div className="machine-detail-primary">
                                         Welcome! Start Brewing or Import Sessions </div> }
              {sessions.length > 0 && formatHighlightedSession() }
                    <div className="machine-detail-primary">
                    {machines.map(machine => (
                      <Container>
                      {machine.token !== "" && 
                      <div className="machine-dashboard-title">
                      
                        <div className="machine-dashboard-name">
                          {machine.name} ({machine.token})
                        </div>
                        <div className="machine-dashboard-status">
                          <b>{machine.CurrentStatus.Status}</b>
                        </div>
                      </div>
                    }
                    </Container>
                    ))}
                    </div>
                </div>
              </div>
            </div>
          </div>  
        </div>
      </Container>
    );
  };
  
export const NavBar = connect(
mapStateToProps,
mapDispatchToProps
)(UnconnectedNavBarView);