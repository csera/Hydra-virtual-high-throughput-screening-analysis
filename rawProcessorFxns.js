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
   $$('procOutTable').clearAll();
   
   $$('uploader_1').files.clearAll();
}