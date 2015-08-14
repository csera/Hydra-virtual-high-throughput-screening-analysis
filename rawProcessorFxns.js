// calls filtereRaw and adds the results to the respective tables in the UI
//Lists are sorted at end
function addFilteredFiles(){
   //Make an array of relevant file objects using the filter function
   var filteredProts = filterRaw($$('protNom').getValue(), $$('procInTable'));
   
   //Loop through the array to add each file to the table
   for(var x=0; x<filteredProts.length; x++)
   {
      console.log('protOutTable adding: '+filteredProts[x].fileName);
      $$('protOutTable').add(
      {
         pot_ligID:filteredProts[x].ligID,
         protFileName:filteredProts[x].fileName,
         protData:filteredProts[x].fileData
      });
   }
   
   $$('protOutTable').sort('#pot_ligID#'); //sort files added by file names
   $$('protOutTable').markSorting('pot_ligID','asc'); //show button for flipping the sort
   
   var filteredLigs = filterRaw($$('ligNom').getValue(), $$('procInTable'));
   
   for(var x=0; x<filteredLigs.length; x++)
   {
      console.log('ligOutTable adding: '+filteredLigs[x].fileName);
      $$('ligOutTable').add(
      {
         lot_ligID:filteredLigs[x].ligID,
         ligFileName:filteredLigs[x].fileName,
         ligData:filteredLigs[x].fileData
      });
   }
   
   $$('ligOutTable').sort('#lot_ligID#');
   $$('ligOutTable').markSorting('lot_ligID','asc');
   
   var filteredZincs = filterRaw($$('zincNom').getValue(), $$('procInTable'));
   var matchLocation; //Index within the file-data string of the ZINC ID
   var zincId;
   
   for(var x=0; x<filteredZincs.length; x++)
   {
      zincId =''; //set to a blank string at start of each loop run
      
      //Case-insensitive search of the file for the ZINC ID
      matchLocation = filteredZincs[x].fileData.search(/zinc/i);
      
      if (matchLocation == -1) { //If no match to the regular expression found
         continue; //Stop processing this file if there's no ZINC ID
      }
      else {
         //ZINC ID's are 12 characters long
         zincId = filteredZincs[x].fileData.slice(matchLocation, matchLocation+12);
         
         //Go through each item in the ligOutTable until a match is found
         for(var ligIndex=0; ligIndex<$$('ligOutTable').count(); ligIndex++)
         {
            var tableId = $$('ligOutTable').getIdByIndex(ligIndex);
            var ligObj = $$('ligOutTable').getItem(tableId);
            
            if (filteredZincs[x].ligID == ligObj.lot_ligID) {
               ligObj.zincId = zincId; //Add ZINC ID to the table
            }
         }
      }
   }
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
   var ligID;
   
   for(var tableIndex=0; tableIndex<table.count(); tableIndex++)
   {
      fID = table.getIdByIndex(tableIndex);
      fName = table.getItem(fID).fileName;
      fNameArr = fName.split('.');
      ligID = ''; //clears the value from the previous loop run
      
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
               //Match must start at string start until the string end; must only be digits
               
               if(fNameArr[arrIndex].search(regex) == -1)
               {
                  console.log('File #'+tableIndex+' did not match');
                  break; //mismatch with filter: stop checking this file
               }
               else {
                  ligID = fNameArr[arrIndex];
                  continue;
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
                  var item = table.getItem(fID);
                     item.ligID = ligID;
                  
                  console.log('Match: file #'+tableIndex);
                  filteredFiles.push(item);
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
      //Dump the protein file data into protData
      protID = $$('protOutTable').getIdByIndex(i);
      protData = $$('protOutTable').getItem(protID).protData;
      protFileName = $$('protOutTable').getItem(protID).protFileName;
      
      ligID = $$('ligOutTable').getIdByIndex(i);
      ligData = $$('ligOutTable').getItem(ligID).ligData;
      
      //Replace "ATOM" tags with "HETATM"
      //Uses a regular expression (regex) with the g (global) setting
      ligData = ligData.replace(/ATOM  /g, 'HETATM');
      
      //Add ZINC ID to protData
      protData +=
         'REMARK   10                                                                     '+
         '\nREMARK   10 '+$$('ligOutTable').getItem(ligID).zincId;
      protData += '\n'+ligData; //Join files
      
      $$('uploadTable').add({col:0, oCol:0, row:0, oRow:0,
                            fileName:protFileName, fileData:protData});
      
      //Would prefer to do this via an event in the uploadTable, but not sure how to
      //grab the contents for what's being added
      //Parse for the ZINC ID and pull data using that
      parseForZinc(protData);
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