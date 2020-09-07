import React, {useState} from "react";
import { RootState } from "./redux";
import { connect } from "react-redux";
import { Container } from "semantic-ui-react";
import {RecipeHeader} from "./RecipeHeader"
import {RecipeTable} from "./RecipeTable"
import {viewRecipe} from "./redux/modules/recipelist"
import {SingleRow, TableRow, generateSingleRow, generateTableRow } from "./RecipeTable"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import './Recipes.css';

const mapStateToProps = (state: RootState) => ({
    recipe: state.recipeList.currentRecipe
});

const waterHeader = ["Ingredient", "Amount"]


const mashStepsHeader = ["Step", "Temp", "Time"]
const fermentablesHeader = ["Ingredient", "Amount", "Gravity", "Color"]

const boilStepsHeader = ["Step", "Temp", "Time"]
const hopsHeader = ["Ingredient", "Amount", "AA", "Time"]

const yeastHeader = ["Name", "Temp", "AA"]

type BoilWPFermStruct = {
    mash: Array<Array<string>>;
    boil: Array<Array<string>>;
    whirlpool: Array<Array<string>>;
    fermentation: Array<Array<string>>;
};


function unwindSteps(steps: Array<any>, recipe: any ): BoilWPFermStruct {
    let retStruct: BoilWPFermStruct = {
        mash: [[]],
        boil: [[]],
        whirlpool: [[]],
        fermentation: [[]]
    };

    let nextBoilAdjunctTime: number = recipe.BoilTime;

    steps.forEach( function( step: any ) {

        if( step.Location.startsWith( "Mash" ) )
        {
            retStruct.mash.push( [
                step.Name,
                step.Temp,
                step.Time
            ] )
        }
        else if( step.Name.startsWith( "Boil Adjunct" ) )
        {
            retStruct.boil.push( [
                step.Location,
                step.Temp,
                nextBoilAdjunctTime
            ] )

            nextBoilAdjunctTime -= step.Time;
        }
        else if( step.Name.startsWith( "Whirlpool Step" ) )
        {
            retStruct.whirlpool.push( [
                step.Location,
                step.Temp,
                step.Time
            ] )
        }
    })

    console.log( "unwindMashSteps")
    console.dir( retStruct );

    return retStruct;
}

function unwindMashFermentable(fermentables: Array<any> ): Array<Array<string>> {
    let retArray: Array<Array<string>>;
    retArray=[[]];

    fermentables.forEach( function( fermentable: any ) {
        console.dir( fermentable )
        retArray.push( [
            fermentable.Name,
            fermentable.Amount,
            fermentable.Yield,
            fermentable.Color
        ] )
    })

    console.log( "unwindMashFermentable")
    console.dir( retArray );

    return retArray;
}

function unwindYeast(yeasts: Array<any> ): Array<Array<string>> {
    let retArray: Array<Array<string>>;
    retArray=[[]];

    console.log( "unwindYeast" );
    console.dir( yeasts );

    yeasts.forEach( function( yeast: any ) {
        console.dir( yeast )
        retArray.push( [
            yeast.Lab + " " + yeast.Name + " " + yeast.ProductID,
            yeast.MinTemp + " - " + yeast.MaxTemp,
            yeast.Attenuation + "%"
        ] )
    })

    console.log( "unwindYeast")
    console.dir( retArray );

    return retArray;
}


function unwindHops(hops: Array<any> ): BoilWPFermStruct {
    let retStruct: BoilWPFermStruct = {
        mash: [[]],
        boil: [[]],
        whirlpool: [[]],
        fermentation: [[]]
    };

    hops.forEach( function( hop: any ) {
        console.dir( hop )
        if( hop.Use.startsWith( "Boil" ) )
        {
            retStruct.boil.push( [
                hop.Name,
                (hop.Amount -0 ) * 1000,
                hop.Alpha,
                hop.Time
            ] )
        }
        else if( hop.Use.startsWith( "Aroma" ) ) {
            retStruct.whirlpool.push( [
                hop.Name,
                (hop.Amount -0 ) * 1000,
                hop.Alpha,
                hop.Time
            ] )
        }
        else if( hop.Use.startsWith( "Dry Hop" ) ) {
            retStruct.fermentation.push( [
                hop.Name,
                (hop.Amount -0 ) * 1000,
                hop.Alpha,
                (hop.Time / 24 /60) 
            ] )
        }
    })

    console.log( "unwindHops")
    console.dir( retStruct );

    return retStruct;
}


const mapDispatchToProps = {viewRecipe};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const UnconnectedRecipeDetails: React.FC<Props> = ( {recipe, viewRecipe} ) => {
  console.log("UnconnectedRecipeDetails" )
  const [firstRow, setFirstRow] = useState( true );
  const [secondRow, setSecondRow] = useState( true );
  const [thirdRow, setThirdRow] = useState( true );



  if( recipe === undefined )
  {
      return (
        <Container>
             <h2 className="loading-title"> Loading Recipe.... </h2> <FontAwesomeIcon className="fa-spinner fa-spin" icon={faCircleNotch} size='2x'/>
        </Container>
      );
  }
  else 
  {
        let recipeSteps: BoilWPFermStruct;
        recipeSteps = unwindSteps( recipe.Zymatic.Steps, recipe );

        let recipeHops: BoilWPFermStruct;
        recipeHops = unwindHops( recipe.Hops.Hop );

        return (
        <Container>
            <RecipeHeader recipeData={recipe}/>
                <div className="headernav center group">
                    <div className="col3 pad-btn">
                        <button className="recipebtn headerbtn btn" onClick={() => setFirstRow( !firstRow )}> Process </button>
                    </div>
                    <div className="col3 pad-btn">
                        <button className="recipebtn headerbtn btn" onClick={() => setSecondRow( !secondRow )}> Steps </button>
                    </div>
                    <div className="col3 pad-btn">
                        <button className="recipebtn headerbtn btn" onClick={() => setThirdRow( !thirdRow )}> Ingredients </button>
                    </div>
                </div>
            <RecipeTable firstrow={generateSingleRow(firstRow, ["Water", "Starting Water", recipe.Waters.Water[0].Amount] ) }
                         thirdrow={generateTableRow( thirdRow, ["", waterHeader, [["Starting Water", recipe.Waters.Water[0].Amount],["Batch Size", recipe.BatchSize]]])}/>

            <RecipeTable firstrow={generateSingleRow(firstRow, ["Mash", "", recipe.Mash.Name] ) }
                         secondrow={generateTableRow(secondRow, ["Mash Steps", mashStepsHeader, recipeSteps.mash ]) }
                         thirdrow={generateTableRow(thirdRow, ["Fermentables", fermentablesHeader, unwindMashFermentable(recipe.Fermentables.Fermentable)] ) }/> 

            <RecipeTable firstrow={generateSingleRow(firstRow, ["Boil", "", recipe.BoilTime + " min"] ) }
                         secondrow={generateTableRow(secondRow, ["Boil Steps", boilStepsHeader, recipeSteps.boil ]) }
                         thirdrow={generateTableRow(thirdRow, ["Hops", hopsHeader, recipeHops.boil] ) }/> 

            <RecipeTable firstrow={generateSingleRow(firstRow, ["Whirlpool", "", recipe.BoilTime + " min"] ) }
                         secondrow={generateTableRow(secondRow, ["Boil Steps", mashStepsHeader, recipeSteps.whirlpool ]) }
                         thirdrow={generateTableRow(thirdRow, ["Hops", hopsHeader, recipeHops.whirlpool] ) }/> 

            <RecipeTable firstrow={generateSingleRow(firstRow, ["Fermentation", "", (( recipe.PrimaryAge + recipe.SecondaryAge ) / 24 / 60) + " days" ] ) }
                         secondrow={generateTableRow(secondRow, ["Yeasts", yeastHeader, unwindYeast( recipe.Yeasts.Yeast ) ]) }
                         thirdrow={generateTableRow(thirdRow, ["Hops", hopsHeader, recipeHops.fermentation] ) }/> 

        </Container>
    );
  }
};


export const RecipeDetails = connect(
  mapStateToProps,
  mapDispatchToProps
  )(UnconnectedRecipeDetails);
