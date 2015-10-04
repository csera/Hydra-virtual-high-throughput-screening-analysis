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
    return txt;
}

/* Gets information from VENDOR database regarding input Zinc IDs
 * @author smatlock & csera
 * @param {String[]} zincArr Array of strings for the ZINC IDs
 * @param {String} searchableData Compound data-containing String
 * @returns {Object[]} vendorCollect Array of objects containing vendor info
 */
function searchData(zincArr, searchableData){
   vendorCollect = new Array();
   all = searchableData.split("\n")
   
   for (var line=0; line<all.length; line++){
      toFind = all[line].indexOf(zincArr);
      if (toFind != -1){
         allSplit = all[line].split("\t");
         json_var = {compound: allSplit[0], 
            comp_img: "http://zinc.docking.org/img/sub/"+allSplit[0]+".gif",
            vendor: allSplit[1], website: allSplit[3],
            email: allSplit[4], phone: allSplit[5], 
            fax:allSplit[6], orderurl:allSplit[7]}
         vendorCollect.push(json_var);
      }
      if (line==all.length-1 && vendorCollect.length==0) {
         vendorCollect = ' ';
      }
   }
   
   return vendorCollect;
}

/* Searches database for a compound and adds relevant data to the
 * main object as properties.
 * @author csera
 * @param {String} db String from parsing the relevant database
 * @param {String[]} propNames Names of the properties adding to the object
 * @param {Int[]} propIndices Positions of properties' columns
 * @param {Object} obj The object to add the properties to
 */
function addPropFromDB(db, propNames, propIndices, obj){
   var zId = obj.zincId;
   
   console.log('searching');
   db = db.split('\n'); //split db into array elements at new lines
   
   for(var line=0; line<db.length; line++){
      //db potentially huge. need a better way than for loops
      if (db[line].indexOf(zId) != -1) {
         console.log('found!');
         
         var lineData = db[line].split('\t');
         
         //Loop through all props to add and add sequentially
         for(var x=0; x<propNames.length; x++){
            obj[propNames[x]] = lineData[propIndices[x]];
            //Square bracket notation allows a var for the prop name
         }
      }
      if (line==db.length-1 && !obj[propNames[0]]) {
         obj[propNames[0]] = ' ';
      }
   }
   console.log(obj);
}