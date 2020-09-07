import React, {useState} from "react";
import { RootState } from "./redux";
import { connect } from "react-redux";
import { Container } from "semantic-ui-react";
import './Recipes.css';
import glass from './glass.png'
import './RecipeHeader.css'

const mapStateToProps = (state: RootState) => ({
});

const mapDispatchToProps = {};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const UnconnectedRecipeHeader: React.FC<{recipeData: any}> = ( {recipeData } ) => {
    return (
    <Container>
        <div className="recipe-header group">
           <div className="col2 group first-item recipe-logo">
                <img src={glass} className="App-logo" alt="logo" /> 
           </div>
           <div className="col2 wide-item group">
                <div className="recipe-header-title">
                    {recipeData.Name}
                </div>
                <div className="recipe-header-desc">
                    {recipeData.TasteNotes}
                </div>
                <div className="recipe-header-beerdata">
                    Date Brewed: {recipeData.Date}
                </div>
                <div className="recipe-header-beerdata">
                    <div className="col2">
                        Category: {recipeData.Style.Name} ({recipeData.Style.CategoryNumber}-{recipeData.Style.StyleLetter})
                    </div>
                    <div className="col2">
                        Metric - L/grams
                    </div>
                </div>
                <div className="recipe-beerspecs group">
                    <div className="col5 group">
                        <div>
                            <b>OG</b>
                        </div>
                        <div>
                                {recipeData.OG}
                        </div>   
                    </div>
                    <div className="col5 group">
                        <div>
                            <b>FG</b>
                        </div>
                        <div>
                            {recipeData.FG}
                        </div>   
                    </div>
                    <div className="col5 group">
                        <div>
                            <b>IBU</b>
                        </div>
                        <div>
                            {recipeData.IBU}
                        </div>   
                    </div>
                    <div className="col5 group">
                        <div>
                            <b>SRM</b>   
                        </div>
                        <div>
                            {recipeData.Color}
                        </div>   
                    </div>
                    <div className="col5 group">
                        <div>
                            <b>ABV</b>
                        </div>
                        <div>
                            {recipeData.ABV}
                        </div>   
                    </div>                                                            
                </div>
           </div>
        </div>
    </Container>
  );
};


export const RecipeHeader = connect(
  mapStateToProps,
  mapDispatchToProps
  )(UnconnectedRecipeHeader);
