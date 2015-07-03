/* Javascript for modifying the grid size.
 * Methods based on Yuan Zhao's original gridupdater.js for this project.
 * Updated to work with a Webix based central workspace table of viewers
 */

function updategridfxn() {
   //var addingView = {view:'iframe',src:'viewer.html',minWidth:250,minHeight:250};
   //addnumCols();
   //$$('workRows').addView(addingView);
   //deleteRows();deleteCols();
   //addnumRows();addnumCols();
   //console.log("original: "+$$('workRows').getChildViews().length);
   //$$('workLayout').addView({view:'iframe',src:'viewer.html',minWidth:250,minHeight:250});
   //$$('workCols0').addView({view:'iframe',src:'viewer.html',minWidth:250,minHeight:250});
   
   //console.log("new: "+$$('workRows').getChildViews().length);
   
   var newNumRows = $$('grid_dim').getValues().numRow,
      newNumCols = $$('grid_dim').getValues().numCol;
   var origNumRows = $$('workLayout').getChildViews().length,
      origNumCols = $$('workRow1').getChildViews().length;
   var resized = false;
   
   if(newNumRows < origNumRows)
      deleteRows(newNumRows, origNumRows);
   else if(newNumRows > origNumRows){
      appendRows(newNumRows, origNumRows, newNumCols, origNumCols);
      resized = true;
   }
      
   if(newNumCols < origNumCols)
      deleteCols(newNumCols, origNumCols);
   else if(newNumCols > origNumCols){
      calculateCols(newNumCols);
      resized = true;
   }
   
   /*else
      return;*/ //ie if the new dimensions are the same as the current grid size
   
}

function deleteRows(newNumRows, origNumRows){
   //Delete rows using a for loop index = row index
   for(var y=origNumRows; y>newNumRows; y--){
      console.log("deleting workRow"+y);
      $$('workLayout').removeView('workRow'+y);
   }
}

function deleteCols(newNumCols, origNumCols){
   var numRows = $$('workLayout').getChildViews().length;
   console.log("deleting cols");
   for(var y=numRows; y>0; y--){
      console.log("on row "+y);
      for(var x=origNumCols; x>newNumCols; x--){
         console.log("          deleting viewer"+x+','+y);
         $$('workRow'+y).removeView('viewer'+x+','+y);
      }
   }
}

function appendRows(newNumRows, origNumRows, newNumCols, origNumCols){
	var numRowstoAdd = newNumRows - origNumRows;
   
   for(var y=1; y<=numRowstoAdd; y++){
      $$('workLayout').addView({id:"workRow"+(origNumRows+y), cols:[
         {id:"viewer0,"+(origNumRows+y), view:'iframe', src:'viewer.html',
            minWidth:250, minHeight:250,
            on:{'onAfterLoad':setCoord_callback(1,y)}
         }
      ]});
      
      if($$('grid_dim').getValues().numCol > 1){
         appendCols((origNumRows+y),newNumCols,1)
      }
   }
}

function calculateCols(newNumCols){
   //using a unique, local var so that it only goes through what is actually there
   var numRows = $$('workLayout').getChildViews().length;
   var numCols;
	var numColstoAdd;
   
   //Go through each row and add columns to the end of each
   for(var y=1; y<=numRows; y++){
      //numColstoAdd = $$('grid_dim').getValues().numCol - $$('workRow'+y).getChildViews().length;
      numCols = $$('workRow'+y).getChildViews().length;
      //appendCols(y, numColstoAdd);
      appendCols(y,newNumCols,numCols);
   }
}

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