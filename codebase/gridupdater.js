/* Javascript for modifying the grid size.
 * Methods based on Yuan Zhao's original gridupdater.js for this project.
 * Updated to work with a Webix based central workspace table of viewers
 */

/**
 * @description Main function: checks for changes to row and col number and
 * adds or deletes the appropriate accordingly.
 *
 * @function updategridfxn
 */
function updategridfxn() {
   var newNumRows = $$('grid_dim').getValues().numRow,
      newNumCols = $$('grid_dim').getValues().numCol;
   var origNumRows = $$('workLayout').getChildViews().length,
      origNumCols = $$('workRow1').getChildViews().length;
   var resized = false;
   
   if(newNumRows < origNumRows)
      deleteRows(newNumRows, origNumRows);
   else if(newNumRows > origNumRows){
      appendRows(newNumRows, origNumRows, newNumCols);
      resized = true;
   }
      
   if(newNumCols < origNumCols)
      deleteCols(newNumCols, origNumCols);
   else if(newNumCols > origNumCols){
      calculateCols(newNumCols);
      resized = true;
   }
   
   else //If nothing actually changed, exit the function
      return;
   
}

/**
 * @function deleteRows
 * @param {int} newNumRows New number of rows set
 * @param {int} origNumRows Number of rows before resize
 */
function deleteRows(newNumRows, origNumRows){
   
   for(var y=origNumRows; y>newNumRows; y--){
      $$('workLayout').removeView('workRow'+y);
   }
}

/**
 * @function deleteCols
 * @param {int} newNumCols New number of cols set
 * @param {int} origNumCols Number of cols before resize
 */
function deleteCols(newNumCols, origNumCols){
   var numRows = $$('workLayout').getChildViews().length;
   
   //Delete in EVERY row
   for(var y=numRows; y>0; y--){
      for(var x=origNumCols; x>newNumCols; x--){ //Delete at ends on the right
         $$('workRow'+y).removeView('viewer'+x+','+y);
      }
   }
}

/**
 * This requires newNumCols in order to size the new row appropriatesly
 * 
 * @function appendRows
 * @param {int} newNumRows New number of rows set
 * @param {int} origNumRows Number of rows before resize
 * @param {int} newNumCols New number of cols set
 */
function appendRows(newNumRows, origNumRows, newNumCols){
	var numRowstoAdd = newNumRows - origNumRows;
   
   for(var y=1; y<=numRowstoAdd; y++){
      $$('workLayout').addView({id:"workRow"+(origNumRows+y), type:'head', borderless:true, cols:[
         {id:"viewer1,"+(origNumRows+y), view:'iframe', src:'viewer.html',
            minWidth:250, minHeight:250,
            on:{'onAfterLoad':setCoord_callback(1,(origNumRows+y))}
         }
      ]});
      
      if(newNumCols > 1){
         appendCols((origNumRows+y),newNumCols,1)
      }
   }
}

/**
 * @description Called by updategridfxn(). Goes through each row and calls
 * appendCols(...) as needed.
 * 
 * @function calculateCols
 * @param {int} newNumCols New number of rows set
 */
function calculateCols(newNumCols){
   //Using a unique, local var so that it only goes through what is actually there
   //(number of rows may have changed since initial check)
   var numRows = $$('workLayout').getChildViews().length;
   var numCols;
	var numColstoAdd;
   
   //Go through EVERY row and add columns to the end of each
   for(var y=1; y<=numRows; y++){
      numCols = $$('workRow'+y).getChildViews().length;
      appendCols(y,newNumCols,numCols);
   }
}

/**
 * @function appendRows
 * @param {int} y Index of row being modified
 * @param {int} newNumCols New number of cols set
 * @param {int} currentNumCols Current number of cols (may have changed since script initiated)
 */
function appendCols(y, newNumCols, currentNumCols) {
   //Goes through a single row and adds viewers as new columns
   //Start at +1 since you add on starting at the end of the row
   for(var x=currentNumCols+1; x<=newNumCols; x++){
         $$('workRow'+y).addView({id:"viewer"+x+","+(y), view:'iframe', src:'viewer.html',
                                    minWidth:250, minHeight:250,
                                    on:{'onAfterLoad': setCoord_callback(x,y)}
         });
   }
}

function setCoord_callback(x,y){
   return function(){
      this.getWindow().setGridCoordinates(x+','+y);
   }
}