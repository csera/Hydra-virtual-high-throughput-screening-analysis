/* Javascript for modifying the grid size.
 * Methods based on Yuan Zhao's original gridupdater.js for this project.
 * Updated to work with a Webix based central workspace table of viewers
 */

function updategridfxn() {
   //deleteRows();deleteColumns();
   //addnumRows();addnumCols();
   $$('workRows').addView({view:'iframe',src:'viewer.html',minWidth:250,minHeight:250});
   $$('workCols0').addView({view:'iframe',src:'viewer.html',minWidth:250,minHeight:250});
   
   console.log($$('workRows'
                  ).rows().length);
}

function deleteRows(){
   
}

function deleteColumns(){
   
}

function addnumRows(){
	var numRowstoAdd = $$('grid_dim').getValues().numRow-1;
   //This method overrides everything after the first instance.
   //TODO: store original size of grid in an array ->
      //subtract that off instead of 1 -> add only this number to the end of table
   
   for(var x=0; x<numRowstoAdd; x++){
      appendRow();
   }
}

function addnumCols(){
	var numColstoAdd = $$('grid_dim').getValues().numCol-1;
   //See comments for addnumRows
   
	for (var x=0; x<numColstoAdd; x++){
		appendColumn()
	}
}

function appendRow(){
   //for(var i=0; i<)
}

function appendColumn(){
   for(var x=0; x< $$('workRows').rows.length; x++){}
}