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
      origNumCols = $$('workRow0').getChildViews().length;
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
   
   /*if (resized)
      labelViews(newNumRows,newNumCols);*/
   
   /*else
      return;*/ //ie if the new dimensions are the same as the current grid size
   
}

function deleteRows(newNumRows, origNumRows){
   //Delete rows using a for loop index = row index
   for(var y=origNumRows-1; y>=newNumRows; y--){
      console.log("deleting workRow"+y);
      $$('workLayout').removeView('workRow'+y);
   }
}

function deleteCols(newNumCols, origNumCols){
   var numRows = $$('workLayout').getChildViews().length;
   console.log("deleting cols");
   for(var y=numRows-1; y>=0; y--){
      console.log("on row "+y);
      for(var x=origNumCols-1; x>=newNumCols; x--){
         console.log("          deleting viewer"+x+','+y);
         $$('workRow'+y).removeView('viewer'+x+','+y);
      }
   }
}

function appendRows(newNumRows, origNumRows, newNumCols, origNumCols){
	var numRowstoAdd = newNumRows - origNumRows;
   
   for(var y=0; y<numRowstoAdd; y++){
      $$('workLayout').addView({id:"workRow"+(origNumRows+y), cols:[
         {id:"viewer0,"+(origNumRows+y), view:'iframe', src:'viewer.html',
            minWidth:250, minHeight:250,
            on:{'onAfterLoad':function(){
               console.log("         after y="+y);
               console.log("         loaded id="+this.id);
					this.getWindow().setGridCoordinates('0,'+(origNumRows+y));
               //this.getWindow().setGridCoordinates(this.id);
				}}
         }
      ]});
      //No need for +1 to id # because element length starts at 1
      
      //gives $$(...) is undefined
      /*$$('viewer0,'+(origNumRows+y)).attachEvent("onAfterLoad",function(){
         console.log("     rows id");
         $$('viewer0,'+(origNumRows+y)).getWindow().setGridCoordinates('0,'+(origNumRows+y));
      });*/
      
      //gives $$(...).getWindow(...).setGridCoordinates is not a function
      //$$('viewer0,'+(origNumRows+y)).getWindow().loadFile('hi');
      
      console.log('     MAKING (0,'+(origNumRows+y)+')');
      
      if($$('grid_dim').getValues().numCol > 1){
         /*var numColstoAdd = $$('grid_dim').getValues().numCol -
            $$('workRow'+(origNumRows+y)).getChildViews().length;*/
         
         //appendCols((origNumRows+y), numColstoAdd);
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
   for(var y=0; y<numRows; y++){
      //numColstoAdd = $$('grid_dim').getValues().numCol - $$('workRow'+y).getChildViews().length;
      numCols = $$('workRow'+y).getChildViews().length;
      //appendCols(y, numColstoAdd);
      appendCols(y,newNumCols,numCols);
   }
}

//function appendCols(y, numColstoAdd) {
function appendCols(y, newNumCols, currentNumCols) {
   //The y var that gets passed in is already adjusted so no adjustments are necessary here
   //Goes through a single row and adds viewers as new columns
   //for (var x=0; x<numColstoAdd; x++){
   for(var x=currentNumCols; x<newNumCols; x++){
      console.log('     MAKING ('+x+','+y+')');
         $$('workRow'+y).addView({id:"viewer"+x+","+(y), view:'iframe', src:'viewer.html',
                                  minWidth:250, minHeight:250});
         
         /*$$('viewer'+(x+1)+','+(y)).attachEvent("onAfterLoad",function(){
            console.log("     cols id");
            $$('viewer'+(x+1)+','+(y)).getWindow().setGridCoordinates((x+1)+','+(y));
         });*/
         //$$("viewer"+(x+1)+","+(y)).getWindow().setGridCoordinates((x+1)+','+(y));
   }
}

//Clunky workaround for not being able to do this as each iframe is added. Hopefully temporary
function labelViews(numRows, numCols) {
   for(y=0; y<numRows; y++){
      for(x=0; x<numCols; x++){
         console.log('('+x+','+y+')');
         $$('viewer'+x+','+y).getWindow().setGridCoordinates(x+','+y);
      }
   }
}