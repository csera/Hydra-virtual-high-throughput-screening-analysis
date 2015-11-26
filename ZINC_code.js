var vendKeyMap = makeKeyMap(readTextFile("codebase/47_purch.xls"),'vend');

var propKeyMap = makeKeyMap(readTextFile("codebase/47_prop.xls"),'prop');


/* Returns a pseudo-key map of a passed .xls file
 * Reads each line into an object as a new element, and the first column
 * is used as the key to link to the rest of the data/line text.
 * All entries are created as elements in a child array of the key. Thus,
 * all entries with an identical key are grouped in the same array.
 * @author csera
 * @param {String} parsedText Parsed, text database file to be used
 * @returns {Object} myKeyMap Generated key map of parsedText
 */

function makeKeyMap(parsedText){
   var myKeyMap = {};
   
   parsedText = parsedText.split('\n');
   
   for(line in parsedText){
      var lineData = parsedText[line].split('\t');
      
      //Create new child node if this value has not been added yet
      //(ie if the current ZINC ID has not yet been used)
      if (!myKeyMap[lineData[0]]) {
         myKeyMap[lineData[0]] = [parsedText[line]];
      }
      //If such a node already exists, instead push the data to a new,
      //terminal element of the child (of the ZINC ID key) array
      else{
         myKeyMap[lineData[0]].push(parsedText[line]);
      }
   }
   console.log('Key map: '+myKeyMap);
   return myKeyMap;
}

/* Allows access to database file
 * @author smatlock & csera
 * @param {file} rawFile (database) to be parsed
 * @returns {String} Plaintext of a rawFile
 */
function readTextFile(file){
   txt = "";
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                txt += rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
   /*var txt;
   
   var reader = new FileReader();
   
   reader.onload = function(e){
      txt = reader.result;
   };
   reader.onerror = function(e){
      console.error("Failed to read db file: "+e.target.error.code);
   };
   
   reader.readAsText(file);*/
   
    return txt;
}

/* Searches for relevant vendor information and adds it to the selected
 * object in the main Hydra interface.
 * @param {String[]} vendInfo String array defining the property names to add data as defined by vendIndices
 * @param {int[]} vendIndices Integer array defining the relevant columns. Matched to vendInfo
 * @param {Object} obj The object to modify. Intended object: comp selected in lists
 */
function addVendFromDb(vendInfo, vendIndices, obj){
   var zId = obj.zincId;
   
   if (vendKeyMap[zId]) {
      var matchedData = vendKeyMap[zId]; //Raw input from database
      var processedData = []; //Must declare as an array
      
      //Make text line with vendor info into an array as delimited by \t
      //Dump relevant data into a new array (dataElem)
      for(elem in matchedData){
         var vendor = matchedData[elem].split('\t');
         var dataElem = [];  //Must declare as an array
         
         //Add all info queried in vendInfo using vendIndices to find the data
         for(var x=0; x<vendInfo.length; x++){
            //Add each info bit as a key-object pair
            dataElem[vendInfo[x]] = vendor[vendIndices[x]];
         }
         processedData.push(dataElem);
      }
      
      obj.vendors = processedData; //Export processed data to main Hydra obj
   }
   else { //if not in processed database -> blank prop
      obj.vendors = '';
   }
}

/* Searches for relevant chemical properties and adds it to the selected
 * object in the main Hydra interface.
 * @param {String[]} props String array defining the property names to add data as defined by propIndices
 * @param {int[]} propIndices Integer array defining the relevant columns. Matched to props
 * @param {Object} obj The object to modify. Intended object: comp selected in lists
 */
function addPropFromDb(props, propIndices, obj){
   var zId = obj.zincId;
   
   if (propKeyMap[zId]) {
      var match = propKeyMap[zId];
      var lineData = match[0].split('\t');
      
      //Loop through all props to add and add sequentially
      for(var x=0; x<props.length; x++){
         obj[props[x]] = lineData[propIndices[x]];
         //Square bracket notation allows a var for the prop name
         //This is because JS overloads the notation with key and index values
         //This is basically the same thing as obj.propNames[x]
      }
   }
   else{
      obj[props[0]] = ' ';
   }
   
   console.log(obj);
}