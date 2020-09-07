import React from "react";
import { RootState } from "./redux";
import { connect } from "react-redux";
import { Container } from "semantic-ui-react";
import './Recipes.css';
import './RecipeTable.css'


const mapStateToProps = (state: RootState) => ({
});

const mapDispatchToProps = {};



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


export function generateSingleRow( active: boolean, row: any[] ): SingleRow | undefined {
    console.log( "generateSingleRow" )
    console.dir( row );
    if( !active ) {
        return undefined;
    }
    
    return {
        title: row[0],
        label: row[1],
        value: row[2]
    };
}

export function generateTableRow( active: boolean, row: any[] ): TableRow | undefined {
    if( !active ) {
        return undefined;
    }
    
    return {
        title: row[0],
        labels: row[1],
        values: row[2]
    };
}


type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const UnconnectedRecipeTable: React.FC<{firstrow?:SingleRow, secondrow?:TableRow, thirdrow?:TableRow}> = ( { firstrow, secondrow, thirdrow } ) => {

  console.log( "UnconnectedRecipeTable" );
  console.dir( firstrow );
  console.dir( secondrow );
  console.dir( thirdrow );

  return (
    <Container>
    <div className="recipe-table">
        <div className="recipe-item col2 first-item firstrow">
            {firstrow !== undefined && <h2>{firstrow.title}</h2> }
        </div>
        <div className="recipe-item col2 firstrow">
            {firstrow !== undefined && <h2>{firstrow.label} {firstrow.value} </h2> }
        </div>
        <div className="content-table">
            <div className="table-flex-r secondrow">
                <div className="label">
                    {secondrow !== undefined && secondrow.title}
                </div>
            
                <div className="rowentry field-title fg1 secondrow">
                {secondrow !== undefined && secondrow.labels !== undefined && secondrow.labels.map(rowlabel => (
                    <div className="rowentry fg1">
                        <div className="recipe-item fg1">
                        {rowlabel}
                        </div>
                    </div>
                ))}          
                </div>

                { secondrow !== undefined && secondrow.values !== undefined && secondrow.values.map( row => (

                    <div className="rowentry fg1 secondrow">
                    {row !== undefined && row.map(val => (
                        <div className="rowentry fg1">
                            <div className="recipe-item fg1">
                            {val}
                            </div>
                        </div>
                    ))}
                    </div>
                ))}       
            </div>

            <div className="table-flex-r thirdrow">
            <div className="label">
                {thirdrow !== undefined && thirdrow.title}
            </div>

            <div className="rowentry fg1 field-title thirdrow">
            {thirdrow !== undefined && thirdrow.labels !== undefined && thirdrow.labels.map(rowlabel => (
                <div className="rowentry fg1">
                    <div className="recipe-item fg1">
                    {rowlabel}
                    </div>
                </div>
            ))}          
            </div>

            { thirdrow !== undefined && thirdrow.values !== undefined && thirdrow.values.map( row => (

                <div className="rowentry fg1 thirdrow">
                {row !== undefined && row.map(val => (
                    <div className="rowentry fg1">
                        <div className="recipe-item fg1">
                        {val}
                        </div>
                    </div>
                ))}
                </div>
            ))}       
            </div>
        </div>
    </div>
    </Container>
  );
};


export const RecipeTable = connect(
  mapStateToProps,
  mapDispatchToProps
  )(UnconnectedRecipeTable);
