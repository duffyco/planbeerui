import React, {useState} from 'react';
import { Container, Confirm } from "semantic-ui-react";
import { useEffect } from 'react';
import { RootState } from './redux';
import { loadRecipeHeaders, setRecipes, getRecipe, deleteRecipe, updateRecipeFromHeader } from './redux/modules/recipelist';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark, faTrash, faArrowRight, faReply } from '@fortawesome/free-solid-svg-icons'
import { changeMode } from './redux/modules/recipeview'
import {refreshImportables} from './redux/modules/settingsview'
import {nSort} from './common'


import './RecipeList.css';
import { RecipeViewMode } from './redux/modules/recipeview';

const mapStateToProps = (state: RootState) => ({
  recipeHeaders: state.recipeList.recipes,
  sortOrderAZ: state.recipeList.sortOrderAZ,
  currentRecipe: state.recipeList.currentRecipe
});

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(
    {
        loadRecipeHeaders,
        setRecipes,
        getRecipe,
        changeMode,
        deleteRecipe,
        refreshImportables,
        updateRecipeFromHeader,
    },
    dispatch
  );
};


const recipeListTitles = ["Synced", "Name", "Style", "ABV", "IBU", "OG", "SRM", ""]

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const UnconnectedRecipes: React.FC<Props> = ({ updateRecipeFromHeader, refreshImportables, deleteRecipe, changeMode, getRecipe, setRecipes, loadRecipeHeaders, recipeHeaders }) => {
  const[open, setOpen] = useState( false )
  const[sortArray, setSortArray] = useState( [false, false, false, false, false, false, false, false] )
  
  console.log( "UnconnectedRecipes" )
  useEffect(() => {
          if (recipeHeaders.length === 0) {
            loadRecipeHeaders();
          }
        }, [loadRecipeHeaders, recipeHeaders]);
     
    const sortAZ = (s: string, i: number) => (e: React.MouseEvent) => {
      e.preventDefault();
      console.log( "SortAZ: " + s + " - " + i );
      var copyArray = sortArray.slice()
      setRecipes( nSort( copyArray[i], s, recipeHeaders ) );
      copyArray[i] = !copyArray[i] ;
      setSortArray ( copyArray );
    };

    const viewRecipe = (id: Number) => (e: React.MouseEvent) => {
        e.preventDefault();
        console.log( "ID: " + id );
        getRecipe( id );   
        changeMode( RecipeViewMode.RecipeDetails );
    };

    const updateSync = (id: number) => (e: React.MouseEvent) => {
      e.preventDefault();
      recipeHeaders[id].synced = !recipeHeaders[id].synced
      updateRecipeFromHeader( id, recipeHeaders );   
    };

    const handleCancel = () => (e: React.MouseEvent) => {
      e.preventDefault();
      setOpen( false );
    };

    const handleConfirm = (id: Number) => (e: React.MouseEvent) => {
        e.preventDefault();
        deleteRecipe( id );
        refreshImportables();
        setOpen( false );
    };

    const popupModal = (id: Number) => (e: React.MouseEvent) => {
        e.preventDefault();
        setOpen( true );
    }

    return (
        <Container className="list-container">
        <h2 className="heading"> Recipes </h2>
        <div className="pagemenu group">
        {recipeListTitles.map( (recipeTitle, i ) => (
          <button className="btn sortbtn col8" onClick={sortAZ( recipeTitle, i )}>{recipeTitle}</button>
        ))}
        </div>

        {recipeHeaders.map(recipeHeader => (
        <div className="RecipeIcon group center">
            <button className="btn col8" onClick={updateSync( recipeHeader.ID )}>
              {recipeHeader.synced && <FontAwesomeIcon icon={faBookmark}/>}
              {!recipeHeader.synced && <FontAwesomeIcon icon={faReply}/>}
            </button>
          <div className="recipe-title col8">
            {recipeHeader.name}
          </div>
          <div className="recipe-style col8">
           {recipeHeader.style}
          </div>
          <div className="recipe-detail col8">
            {recipeHeader.abv}%
          </div>
          <div className="recipe-detail col8">
            {recipeHeader.ibu}
          </div>
          <div className="recipe-detail col8">
            {recipeHeader.og}
          </div>
          <div className="recipe-detail col8">
            {recipeHeader.srm}
          </div>
          <div className="col8">
                    <button className="savebtn btn" onClick={viewRecipe( recipeHeader.ID )}>
                    <FontAwesomeIcon icon={faArrowRight}/>
                    </button>
                    <button className="trashbtn btn" onClick={popupModal( recipeHeader.ID ) } >
                    <FontAwesomeIcon icon={faTrash}/>
                    </button>
                </div>
                <Confirm
                  content={"Delete Recipe: " + recipeHeader.name +" ("+ recipeHeader.ID +") ?"}
                  open={open}
                  onCancel={handleCancel()}
                  onConfirm={handleConfirm( recipeHeader.ID )}
                />
        </div>
        ))}      
    </Container>
    );
};

export const RecipeList = connect(
  mapStateToProps,
  mapDispatchToProps
)(UnconnectedRecipes);
