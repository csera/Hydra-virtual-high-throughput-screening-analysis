var vendKeyMap = makeKeyMap(readTextFile("codebase/47_purch.xls"),'vend');

var propKeyMap = makeKeyMap(readTextFile("codebase/47_prop.xls"),'prop');

//Function makes a pseudo-key map:
//Reads each line into a file into an object as a new element
//The elements are sorted by the value of the first section of the line
function makeKeyMap(parsedText, dbType){
   var myKeyMap = {};
   
   var elem;
   var elemIndices; //0 indexed col num of desired props in db spreadsheet
   
   parsedText = parsedText.split('\n');
   
   for(line in parsedText){
      var lineData = parsedText[line].split('\t');
      
      if (!myKeyMap[lineData[0]]) {
         myKeyMap[lineData[0]] = [parsedText[line]];
      }
      else{
         myKeyMap[lineData[0]].push(parsedText[line]);
      }
   }
   console.log('Key map for '+dbType+': '+myKeyMap);
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

function addVendFromDb(vendInfo, vendIndices, obj){
   var zId = obj.zincId;
   
   if (vendKeyMap[zId]) {
      var matchedData = vendKeyMap[zId];
      var processedData = [];
      
      //make text line with vendor info into an object with \t delimited props
      for(elem in matchedData){
         //matchedData[elem] = matchedData[elem].split('\t');
         var vendor = matchedData[elem].split('\t');
         var dataElem = [];
         
         for(var x=0; x<vendInfo.length; x++){
            dataElem[vendInfo[x]] = vendor[vendIndices[x]];
         }
         processedData.push(dataElem);
      }
      
      obj.vendors = processedData;
   }
   else { //if not in processed database
      obj.vendors = '';
   }
}

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