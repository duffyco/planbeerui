export const nSort = (ascending: boolean, s: string, values: Array<any> ) => {
    if ( values.length == 0 ) {
        return [];
    }
    
    s = s.toLowerCase();
    var compValue = values[0][s];
  
    if( typeof compValue === "string" ) {
      return nSortAZ( ascending, s, values );
    }
    else if( typeof compValue === "number" ) {
      console.log( "nSortInt" )
      return nSortInt( ascending, s, values );
    }
    else if( typeof compValue === "boolean") {
      console.log( "nSortBool" )    
      return nSortBool( ascending, s, values );
    }
    else {
      alert( "Can't sort on " + compValue )
      return []
    }
  }
  
export const nSortAZ = (ascending: boolean, s: string, values: Array<any> ) => {
      return values.sort( function( a: any, b: any ) {
        var textA = a[s].toUpperCase();
        var textB = b[s].toUpperCase();
        return ascending ?
          ( (textA < textB) ? -1 : (textA > textB) ? 1 : 0 ) : 
          ( (textA > textB) ? -1 : (textA < textB) ? 1 : 0 )
      })
  };
  
export const nSortInt = (ascending: boolean, s: string, values: Array<any> ) => {
    return values.sort( function( a: any, b: any ) {
      return ascending ?
        ( (a[s] < b[s]) ? -1 : (a[s] > b[s]) ? 1 : 0 ) :
        ( (a[s] > b[s]) ? -1 : (a[s] < b[s]) ? 1 : 0 ) 
    })
  };
  
export const nSortBool = (ascending: boolean, s: string, values: Array<string> ) => {
    return values.sort(function(a: any, b: any) {
      return ascending ?
          ( (a[s] === b[s])? 0 : a[s]? -1 : 1 ):
          ( (a[s] === b[s])? 0 : a[s]? 1 : -1 )
    })
  };
  