/* Gets ZINC IDs from file; adds to array zincIds
 * @author Shelby Matlock
 * @param {FileReader.result} Parsed file contents to scan
 */
function parseForZinc(readerResult){
   fileText = readerResult;
   var regex = /ZINC/gi, result, indices = [];
   var zincIds = [],
   bonds = [],
   numRes = [];
   while ( (result = regex.exec(fileText)) )
   {
       indices.push(result.index);
       // 12 is the length of ZINC id
       zincs = fileText.slice(result.index, result.index + 12);
       zincIds.push(zincs)
   }
   lines = fileText.split("\n");
   console.log("indices: "+indices);
   
   for(var x=0; x<indices.length;x++)
   {
      infoLine = lines.slice(indices[x] + 3, indices[x] + 4)
      console.log("infoLine: "+infoLine);
      stringLine = infoLine.toString();
      a1 = stringLine.search("\ ")+1;
      a2 = stringLine.slice(a1, stringLine.length).search("\ ")+1;
      atomInfo = stringLine.slice(a1, a2);
      bondString = stringLine.slice(a2+1, stringLine.length);
      b1 = bondString.search("\ ");
      bondInfo = bondString.slice(0,b1);
      bonds.push(bondInfo);
      numRes.push(atomInfo);
   }
   compound_fxn(zincIds, numRes, bonds);
   // compListDetails(zincIds, numRes, bonds);
   console.log(numRes, bonds);
}

//Loads parsed compounds into the set viewers
function load_fxn(){
   var fID, fData, fType, x, y, origX, origY;
   
   for(var index=0; index<$$('uploadTable').count(); index++){
      fID = $$('uploadTable').getIdByIndex(index);
      fData = $$('uploadTable').getItem(fID).fileData;
      x = $$('uploadTable').getItem(fID).col, y = $$('uploadTable').getItem(fID).row;
      origX=$$('uploadTable').getItem(fID).oCol, origY=$$('uploadTable').getItem(fID).oRow;
      
      //Only attempt load if the coordinates are valid AND the coordinates have been changed
      if (validCoordinates(x,y) && (x!=origX || y!=origY)){
         webix.message('New compound in viewer'+x+','+y);
         var viewer = $$('viewer'+x+','+y).getWindow();
         
         fType = getFileType(fID);
         console.log('Detected file type: '+fType);
         
         //Calls loading function for "viewer[x],[y]" defined in the iframe source html
         //REMOVE THE BELOW COMMAND IF YOU WANT TO DISPLAY MULTIPLE FILES AT ONCE
         viewer.glviewer.clear();
         viewer.toDefaultDisp(); //Resets the display tracking variables to the default
         setActiveViewer(x+','+y, viewer.getViewMode()); //Syncs controls w/ the new settings
         viewer.fileToViewer(fData,fType); //Sends file data for display
         
         //Clear old cell if the structure was loaded
         if (origX!=0 && origY!=0) {
            var oldViewer = $$('viewer'+origX+','+origY).getWindow();
            oldViewer.glviewer.clear();
            //set default display values in the old viewer
            oldViewer.toDefaultDisp();
         }
         
         $$('uploadTable').getItem(fID).oCol = x;
         $$('uploadTable').getItem(fID).oRow = y;
         
         console.log('Sent to '+$$('uploadTable').getItem(fID).oCol+
                     ','+$$('uploadTable').getItem(fID).oRow);
      }
      else if (x==origX || y==origY) {
         webix.message("Coordinates have not been changed for "+
                       $$('uploadTable').getItem(fID).fileName);
      }
      else{
         webix.message('NOT loading '+$$('uploadTable').getItem(fID).fileName+' to '+x+','+y);
      }
   }
}

function getFileType(fID) {
   var fName = $$('uploadTable').getItem(fID).fileName;
   var fType;
   
   //Split fName into an array with elements demarcated by a '.'
   var splitName = fName.split('.');
   
   //User may have included '.' in the name so only grab the last one
   fType = splitName[splitName.length-1];
   
   return fType;
}

//Removes selected compounds from the list and clears them from the relevant viewers
function clear_fxn(){
   //$$(...).getSelectedId returns an array of selected items (with param (true))
   var IDs = $$('uploadTable').getSelectedId(true);
   var x, y;
   
   //Go through each selected item and remove from viewer if it is loaded
   for(var a=0; a<IDs.length; a++){
      x = $$('uploadTable').getItem(IDs[a]).col;
      y = $$('uploadTable').getItem(IDs[a]).row;
      
      var fType = getFileType(IDs[a]);
      
      if (validCoordinates(x,y)){
         var viewer = $$('viewer'+x+','+y).getWindow();
         viewer.glviewer.clear();
         viewer.toDefaultDisp();
      }
   }
   
   $$('uploadTable').remove($$('uploadTable').getSelectedId(true));
}

/* Checks if the passed coordinates are defined.
 * @param {int} x The x (column) coordinate
 * @param {int} y The y (row) coordinate
 * @returns {boolean} True if the coordinates are valid.  False otherwise.
 */
function validCoordinates(x, y) {
   var numCols = $$('grid_dim').getValues().numCol,
      numRows = $$('grid_dim').getValues().numRow;
      
   if ((0<x && x<= numCols) && (0<y && y<=numRows)) {
      console.log('Valid Coordinates');
      return true;
   }
   else{
      console.warn('Invalid coordinates');
      return false;
   }
}


//Function for interpretting raw output of docking programs
//NOT CURRENTLY UNIVERSALLY COMPATIBLE
function processRaw(){
   
}


//Closes processorWin and clears/resets all components
function closeProcessor(){
   $$('processorWin').hide();
   
   $$('procInTable').clearAll();
   $$('procOutTable').clearAll();
   
   $$('uploader_1').files.clearAll();
}