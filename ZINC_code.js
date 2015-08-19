/* Allows access to database file
 * @author smatlock
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

/* Gets information from database regarding input Zinc IDs
 * @author smatlock
 */
function searchData(zincArr, searchableData){
   // validation = searchableData.indexOf("ZINC");
   vendorCollect = new Array();
   all = searchableData.split("\n")
   for (var i=0;i<zincArr.length;i++){
      for (var line in all){
         toFind = all[line].indexOf(zincArr[i]);
         if (toFind != -1){
            allSplit = all[line].split("\t");
            json_var = {idNum: i, compound: allSplit[0], 
               comp_img: "http://zinc.docking.org/img/sub/"+allSplit[0]+".gif",
               vendor: allSplit[1], website: allSplit[3],  email: allSplit[4], phone: allSplit[5], 
               fax:allSplit[6], orderurl:allSplit[7]}
               vendorCollect.push(json_var)
         }
      }
   }
   return vendorCollect;
}

/* Gets information for compound list and details
 * @author smatlock
 */
function zincRequests(arr1, arr2, arr3){
   basicInfo = new Array();
   for(var i=0;i<arr1.length;i++){
      json_head = {compound: arr1[i], category: "ZN ligand", res: arr2[i], bond: arr3[i]};
      basicInfo.push(json_head);
      console.log(json_head);
   }
   return basicInfo
};

/* Change this fxn to update what's displayed in the viewers and compound list coordinates
 * @author smatlock
 */
function compound_fxn(arr1, arr2, arr3){
   var smallDatabase = readTextFile("codebase/3_purch.xls"),
   compInfo = zincRequests(arr1, arr2, arr3),
   dummy_comp = searchData(arr1, smallDatabase);

   // loads uploaded.js to overwrite compound_data var with uploaded data
   //delete compound_data;
   // refreshes the compounds list id comp_table via .refresh()
   $$("comp_table").define("data",compInfo);
   $$("comp_table").refresh();
   $$("comp_det").define("data",compInfo);
   $$("comp_det").refresh();
   $$("vendors").define("data",dummy_comp);
   $$("vendors").refresh();
}