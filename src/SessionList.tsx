import React, {useState} from 'react';
import { Container, Confirm } from "semantic-ui-react";
import { useEffect } from 'react';
import { RootState } from './redux';
import { loadSessions, getSessionLogs, getSession } from './redux/modules/sessionList';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faArrowRight, faCircleNotch } from '@fortawesome/free-solid-svg-icons'

import {changeAppMode, AppViewMode} from "./redux/modules/app"
import { changeBrewViewMode, BrewingViewMode } from './redux/modules/brewingview';
import { RecipeViewMode, changeMode } from './redux/modules/recipeview'
import { getRecipe } from './redux/modules/recipelist';
import {deleteSession, setSessions} from './redux/modules/sessionList';
import {refreshImportables} from './redux/modules/settingsview'
import {nSort} from './common'

const mapStateToProps = (state: RootState) => ({
  sessions: state.sessions.sessions,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(
    {
        loadSessions,
        changeAppMode,
        changeMode,
        changeBrewViewMode,
        getSessionLogs,
        getSession,
        getRecipe,
        deleteSession,
        refreshImportables,
        setSessions,
    },
    dispatch
  );
};

const sessionListTitles = ["Brew Date", "Token", "Recipe Name", "Style", "Details", "Trash"]

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const UnconnectedSessionList: React.FC<Props> = ({ setSessions, refreshImportables, deleteSession, getSession, getSessionLogs, changeBrewViewMode, getRecipe, changeMode, changeAppMode, loadSessions, sessions }) => {
  // Modal has a problem where it only picks up the last element in a map.
  // Local state to get around it.
  const[open, setOpen] = useState( false );
  const[name, setSessionDeleteName] = useState( "" );
  const[id, setSessionDeleteID] = useState( 0 );
  const[sortArray, setSortArray] = useState( [false, false, false, false, false, false, false, false] )

  useEffect(() => {
          if (sessions.length === 0) {
            loadSessions();
          }
        }, [loadSessions, sessions]);
    
        const sortAZ = (s: string, i: number) => (e: React.MouseEvent) => {
            e.preventDefault();
            console.log( "sortAZ: " + s );
            var copyArray = sortArray.slice()
            setSessions( nSort( copyArray[i], s, sessions ) )
            copyArray[i] = !copyArray[i] ;
            setSortArray ( copyArray );
          };      

        const viewRecipe = (id: Number) => (e: React.MouseEvent) => {
            e.preventDefault();
            console.log( "ID: " + id );
            changeAppMode( AppViewMode.Recipes ); 
            changeMode( RecipeViewMode.RecipeDetails );
            getRecipe( id );   
        };

        const viewSession = (id: Number) => (e: React.MouseEvent) => {
            e.preventDefault();
            console.log( "ID: " + id );
            getSession( id );
            getSessionLogs( id );   
            changeBrewViewMode( BrewingViewMode.SessionView );
        };

        const handleCancel = (id: Number) => (e: React.MouseEvent) => {
            e.preventDefault();
            console.log( "handleCancel: " + id )
            setOpen( false );
        };

        const handleConfirm = (id: Number) => (e: React.MouseEvent) => {
            e.preventDefault();
            deleteSession( id );
            refreshImportables();
            setOpen( false );
        };

        const popupModal = (id: number, name: string) => (e: React.MouseEvent) => {
            e.preventDefault();
            setSessionDeleteID( id );
            setSessionDeleteName( name )
            setOpen( true );
        }
    
    return (
        <Container className="list-container">
            <h2 className="heading"> Sessions </h2>
            <div className="pagemenu group">
            {sessionListTitles.map( (sessionTitle, i) => (
                <button className="btn sortbtn col6" onClick={sortAZ( sessionTitle.replace(/\s+/g, ''), i )}>{sessionTitle}</button>
            ))}
            </div>

        {sessions.map(session => (
        <Container>
            <div className="machine-container group">
                <div className="col6">
                    {session.brewdate}
                </div>
                <div className="col6">
                    {session.token}
                </div>
                <div className="col6">
                    <button className="btn sortbtn" onClick={viewRecipe( session.recipeid )}>{session.recipename}</button>
                </div>            
                <div className="col6">
                    {session.style}
                </div>
                <div className="col6">
                    {session.ABV}% / OG:{session.OG} / IBU:{session.IBU} / SRM:{session.SRM} 
                </div>
                <div className="col6">
                    <button className="savebtn btn" onClick={viewSession( session.ID )}>
                    <FontAwesomeIcon icon={faArrowRight}/>
                    </button>
                    <button className="trashbtn btn" onClick={popupModal( session.ID, session.recipename ) } >
                    <FontAwesomeIcon icon={faTrash}/>
                    </button>
                    <Confirm
                        content={"Delete Session: " + name +" ("+ id +") ?"}
                        open={open}
                        onCancel={handleCancel( id )}
                        onConfirm={handleConfirm( id )}
                    />                    
                </div>
            </div>
        </Container>            
        ))}
        </Container>            
    );
};

export const SessionList = connect(
  mapStateToProps,
  mapDispatchToProps
)(UnconnectedSessionList);
