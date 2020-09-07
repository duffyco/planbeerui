import React, {useState, SyntheticEvent} from "react";
import { RootState } from "./redux";
import { connect } from "react-redux";
import { Dropdown, Confirm, Container, Select, DropdownItemProps, DropdownProps } from "semantic-ui-react";
import './Recipes.css';
import './RecipeTable.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrash, faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import {MachineListHeader} from './redux/modules/machinelist'
import {RecipeListHeader} from './redux/modules/recipelist'
import {AppViewMode, changeAppMode} from './redux/modules/app'
import {saveRecipe, saveSession, uploadFiles, updateSaveRecipe, updateSaveSession, refreshImportables, deleteImportableRecipe, deleteImportableSession} from './redux/modules/settingsview'
import { bindActionCreators, Dispatch } from 'redux';
import {FileUploadView} from './FileUploader'
import './Settings.css'

import 'semantic-ui-css/semantic.min.css' 
//import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
  
type SettingsTableProps = {
    title: string,
    type: string,
    machines:MachineListHeader[], 
    recipeList: RecipeListHeader[], 
    sessions?: TableRow, 
    recipes?: TableRow,
};

const mapStateToProps = (state: RootState, ownProps: SettingsTableProps ) => ({
    title: ownProps.title,
    type: ownProps.type,
    machines: ownProps.machines,
    recipeList: ownProps.recipeList,
    sessions: ownProps.sessions,
    recipes: ownProps.recipes,
    savingRecipe: state.settings.savingRecipe,
    savingSession: state.settings.savingSession,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators(
      {
          saveRecipe,
          saveSession,
          changeAppMode,
          uploadFiles, 
          updateSaveSession,
          updateSaveRecipe,
          refreshImportables,
          deleteImportableRecipe,
          deleteImportableSession
      },
      dispatch
    );
  };

type ImportProps = {
    importMachine: string,
    importRecipeName: string
}

export type SingleRow = {
    title: string | undefined;
    label: string | undefined;
    value: string | undefined;
};

export type TableRow = {
    title: string | undefined;
    labels: string[] | undefined;
    values: string[][] | undefined;
};


export function generateTableRow( row: any[] ): TableRow {
    return {
        title: row[0],
        labels: row[1],
        values: row[2]
    };
}

function unwindMachines(machines: MachineListHeader[] ): DropdownItemProps[] {
    let retArray: DropdownItemProps[];
    retArray=[];

    machines.forEach( function( machine: MachineListHeader ) {
        retArray.push( {
          key: machine.token, 
          text: machine.name + " (" + machine.token + ")", 
          value: machine.token
        })
    })

    return retArray;
  }

  function unwindRecipes(recipeList: RecipeListHeader[] ): DropdownItemProps[] {
    let retArray: DropdownItemProps[];
    retArray=[];

    recipeList.forEach( function( recipe: RecipeListHeader ) {
        retArray.push( {
          key: recipe.ID, 
          text: recipe.name + " (" + recipe.style + ")", 
          value: recipe.ID
        })
    })

    return retArray;
  }

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const UnconnectedSettingsTable: React.FC<Props> = ( { deleteImportableRecipe, deleteImportableSession, refreshImportables, updateSaveSession, updateSaveRecipe, savingSession, savingRecipe, uploadFiles, saveSession, saveRecipe, changeAppMode, title, type, sessions, recipes, machines, recipeList} ) => {
    const [machineOption, setMachineOption] = useState( "" );
    const [recipeOption, setRecipeOption] = useState( "" );
    const[deleteType, setDeleteType] = useState( "" );    
    const[deleteId, setDeleteID] = useState( -1 );    
    const[open, setOpen] = useState( false );

    console.log( "UnconnectedSettingsTable"  );

    const handleCancel = (id: number ) => (e: React.MouseEvent) => {
        e.preventDefault();
        console.log( "handleCancel: " + id )
        setDeleteID( -1 );
        setDeleteType( "" );
        setOpen( false );
    };

    const handleConfirm = (type: string, id: number) => (e: React.MouseEvent) => {
        e.preventDefault();
        if( type == "Recipe" ) {
            deleteImportableRecipe( id )
        } else if ( type == "Session" ) {
            deleteImportableSession( id )
        }

        setDeleteID( -1 );
        setDeleteType( "" );
        setOpen( false );
    };

    const popupModal = (type: string, id: number) => (e: React.MouseEvent) => {
        e.preventDefault();
        setDeleteType( type );
        setDeleteID( id );
        setOpen( true );
    }

    const saveRec = (name: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        saveRecipe( name ); 
        refreshImportables();  
        changeAppMode( AppViewMode.Settings );
    };

    const selectChangeMachine = (event: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        setMachineOption( data.value as string ) ;
    };

    const selectChangeRecipes = (event: SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        setRecipeOption( data.value as string  );
    };

    const saveSes = (id: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        console.log( "ID: " + id );
        if( machineOption !== undefined && recipeOption !== undefined )
        {
            saveSession( +id, machineOption, +recipeOption );
            changeAppMode( AppViewMode.Settings );
            refreshImportables();
        }
        else {
            alert( "Please Select Machine and Recipe before saving Session")
        }
        alert( "This may take a while.  We'll let you know when it's done. ")
    };

  return (
    <Container>
    <div className="recipe-table">
        <div className="recipe-table-header col2 group">
            <h1>{title}</h1>
        </div>
        <div className="recipe-table-header col2 group right">
            <FileUploadView type={type}/>            
        </div>

        <div className="content-table">
        {sessions !== undefined && 
            <div className="table-flex-r">
                <div className="label">
                    {sessions.title}
                </div>
            
                <div className="pb-flex-r fg1">
                {sessions.labels !== undefined && sessions.labels.map(rowlabel => (
                    <div className="pb-flex-r fg1 col5">
                        <div className="recipe-item fg1">
                        {rowlabel}
                        </div>
                    </div>
                ))}          
                </div>

                { sessions.values !== undefined && sessions.values.map( (row, index) => (
                    <div className="pb-flex-r fg1">
                    {row !== undefined && row.map(val => (
                        <div className="pb-flex-r fg1 col5">
                            <div className="recipe-item fg1">
                            {val}
                            </div>
                        </div>
                    ))}
                        <div className="pb-flex-r fg1 col5">
                            <div className="recipe-item fg1">
                            <Dropdown
                                className="settings-dropdown"
                                placeholder='Select Machine'
                                fluid
                                selection                                                            
                                options={unwindMachines( machines )}
                                onChange={selectChangeMachine}
                            />
                            </div>
                        </div>
                        <div className="pb-flex-r fg1 col5">
                            <div className="recipe-item fg1">
                            <Select
                                className="settings-dropdown"
                                placeholder='Select Recipe'
                                fluid
                                selection                                                            
                                options={unwindRecipes( recipeList )}
                                onChange={selectChangeRecipes}                                
                            />
                            </div>
                        </div>
                        <div className="pb-flex-r fg1 col5">
                            <div className="recipe-item fg1 rightalign">
                                {savingSession && <FontAwesomeIcon className="btn col2 savebtn fa-spinner fa-spin" icon={faCircleNotch}/> }        
                                {!savingSession && <button className="btn col2 savebtn" onClick={saveSes(row[0])}><FontAwesomeIcon icon={faSave} size='1x'/></button>}
                                <button className="btn col2 trashbtn btn" onClick={popupModal( "Session", index  ) } >
                                    <FontAwesomeIcon icon={faTrash}/>
                                </button>
                                <Confirm
                                    content={"Delete " + deleteType +" ? (This will delete the imported file)"}
                                    open={open}
                                    onCancel={handleCancel( deleteId )}
                                    onConfirm={handleConfirm( deleteType, deleteId )}
                                />                                   
                            </div>
                        </div>

                    </div>
                ))}       
            </div>
            }
            <div className="table-flex-r">
            <div className="label">
                {recipes !== undefined && recipes.title}
            </div>

            <div className="pb-flex-r fg1">
            {recipes !== undefined && recipes.labels !== undefined && recipes.labels.map(rowlabel => (
                <div className="pb-flex-r fg1 col6">
                    <div className="recipe-item fg1">
                    {rowlabel}
                    </div>
                </div>
            ))}    
            </div>

            { recipes !== undefined && recipes.values !== undefined &&  recipes.values.map( (rowValue, index) => (
                <div className="pb-flex-r fg1">
                {rowValue !== undefined && rowValue.map(val => (
                    <div className="pb-flex-r fg1 col6">
                        <div className="recipe-item fg1">
                        {val}
                        </div>
                    </div>
                ))}   
                 <div className="pb-flex-r fg1">
                        <div className="recipe-item fg1 col6">
                        {savingRecipe && <FontAwesomeIcon className="btn col2 uploadbtn savebtn fa-spinner fa-spin" icon={faCircleNotch}/> }
                        {!savingRecipe && <button className="btn col2 uploadbtn savebtn" onClick={saveRec( rowValue[1] )}><FontAwesomeIcon icon={faSave} size='1x'/></button> }
                        <button className="btn col2 trashbtn btn uploadbtn" onClick={popupModal( "Recipe", index  ) } >
                                    <FontAwesomeIcon icon={faTrash}/>
                                </button>
                                <Confirm
                                    content={"Delete " + deleteType +" ? (This will delete the imported file)"}
                                    open={open}
                                    onCancel={handleCancel( deleteId )}
                                    onConfirm={handleConfirm( deleteType, deleteId )}
                                />      
                        </div>
                    </div>
                </div>  
            ))}       
            </div>
        </div>
    </div>    
    </Container>
  );
};


export const SettingsTable = connect(
  mapStateToProps,
  mapDispatchToProps
  )(UnconnectedSettingsTable);
