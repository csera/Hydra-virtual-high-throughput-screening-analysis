// calls filtereRaw and adds the results to the respective tables in the UI
//Lists are sorted at end
function addFilteredFiles(){
   var filteredProts = filterRaw($$('protNom').getValue(), $$('procInTable'));
   
   for(var x=0; x<filteredProts.length; x++)
   {
      console.log('protOutTable adding: '+filteredProts[x].fileName);
      $$('protOutTable').add(
      {
         protFileName:filteredProts[x].fileName,
         protData:filteredProts[x].fileData
      });
   }
   
   $$('protOutTable').sort('#protFileName#'); //sort files added by file names
   $$('protOutTable').markSorting('protFileName','asc'); //show button for flipping the sort
   
   var filteredLigs = filterRaw($$('ligNom').getValue(), $$('procInTable'));
   
   for(var x=0; x<filteredLigs.length; x++)
   {
      console.log('ligOutTable adding: '+filteredLigs[x].fileName);
      $$('ligOutTable').add(
      {
         ligFileName:filteredLigs[x].fileName,
         ligData:filteredLigs[x].fileData
      });
   }
   
   $$('ligOutTable').sort('#ligFileName#');
   $$('ligOutTable').markSorting('ligFileName','asc');
}

/* Compares all files in the specified table to a filter string and returns
 * an array of files that pass the filter
 * @param {string} filter The filter to be applied
 * @param {object} table The Webix table object ('view') to obtain the items from
 * @returns {Array} An array of file objects that passed the filter checks
 */
function filterRaw(filter, table){
   var filteredFiles = [];
   var filterArr = filter.split('.');
   
   for(var tableIndex=0; tableIndex<table.count(); tableIndex++)
   {
      fID = table.getIdByIndex(tableIndex);
      fName = table.getItem(fID).fileName;
      fNameArr = fName.split('.');
      
      //Initial filter compares the number of '.' delimited elements
      if (fNameArr.length == filterArr.length) {
         //Compare each element of each array to each other
         for(var arrIndex=0; arrIndex<filterArr.length; arrIndex++)
         {
            if (filterArr[arrIndex] == "[*]") {
               if (arrIndex+1 != filterArr.length)
                  continue; //move onto next iteration
               else{
                  filteredFiles.push(table.getItem(fID));
                  continue;
               }
            }
            else if (filterArr[arrIndex] == "[ligID]") {
               //if (fNameArr[arrIndex] != 'number')
               //CAUSING ERROR: anything spliced from a string is a string by default
               var regex = /^\d{1,}$/;
               //Match must start at string start, be at least one digit, and terminate
               
               if(fNameArr[arrIndex].search(regex) == -1)
               {
                  console.log('File #'+tableIndex+' did not match');
                  break; //mismatch with filter: stop checking this file
               }
            }
            else if (filterArr[arrIndex] != fNameArr[arrIndex]) {
               console.log('File #'+tableIndex+' did not match');
               break; //mismatch: stop checking this file
            }
            else if (filterArr[arrIndex] == fNameArr[arrIndex]) {
               if(arrIndex+1 != filterArr.length)
                  continue;
               else {
                  filteredFiles.push(table.getItem(fID));
                  continue;
               }
            }
            
            //Will only reach here if the name passes all filters
            //filteredFiles.push(table.getItem(fID));
         }
      }
      
      fData = table.getItem(fID).fileData;
   }
   
   return filteredFiles;
}

function combineFiles () {
   var protID, protData, ligID, ligData;
   
   //Loop through all items
   for (var i=0; i<$$('protOutTable').count(); i++) {
      console.log(i);
      //Dump the protein file data into protData and append with TER on a new line
      protID = $$('protOutTable').getIdByIndex(i);
      protData = $$('protOutTable').getItem(protID).protData;
      protFileName = $$('protOutTable').getItem(protID).protFileName;
      //$$('protOutTable').remove(protID); //remove from table after getting data
      
      //protData += '\nTER';
      
      ligID = $$('ligOutTable').getIdByIndex(i);
      ligData = $$('ligOutTable').getItem(ligID).ligData;
      //$$('ligOutTable').remove(ligID);
      
      ligData = ligData.replace(/ATOM  /g, 'HETATM');
      //No replaceAll() in JS
      //Need to use a regular expression (regex) with the g (global)
      
      protData += ligData;
      //for now, ignore zinc
      //later, pull ZINC ID from the set file and add 'REMARK 10   [ZINC ID]'
      
      $$('uploadTable').add({col:0, oCol:0, row:0, oRow:0,
                            fileName:protFileName, fileData:protData});
      
      //temp implementation: still need to implement zinc id
      //also need to store ZINC ID's in case that the file names alone don't work
   }
}

//Removes selected compounds from the list and clears them from the relevant viewers
function clear_fxn(){
   //$$(...).getSelectedId returns an array of selected items (with param (true))
   var IDs = $$('procInTable').getSelectedId(true);
   
   $$('procInTable').remove($$('procInTable').getSelectedId(true));
}

//Closes processorWin and clears/resets all components
function closeProcessor(){
   $$('processorWin').hide();
   
   $$('procInTable').clearAll();
   $$('protOutTable').clearAll();
   $$('ligOutTable').clearAll();
   
   $$('procUploader').files.clearAll();
}