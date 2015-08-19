webix.ready(function(){

popupProcessor = webix.ui({
   id:'processorWin', view:'window', position:'center', move:true,
   modal:true, //Freezes main interface until this window is dismissed
   width:800, height:600,
   head:{
      view:'toolbar', cols:[
         {view:'label', label:'Process files for upload'},
         {},
         {view:'button', label:'Cancel', align:'right', click:closeProcessor}
      ]
   },
   body:{
      cells:[
         {id:'processIn', rows:[
            {cols:[
               {rows:[ //Table showing uploaded files
                  { //Uploader element
                     id:"procUploader", view:"uploader",
                     value:"Upload Data Files",
                     multiple:true, autosend:false,
                  },
                  {
                     id:"procInTable", view:"datatable",
                     drag:true,
                     select:true, multiselect:true, //ctrl+click & shift+click work
                     columns:[
                        {id:"fileName", header:"File Name", fillspace:1},
                        {id:"fileData", header:"Data", hidden:true},
                     ],
                  }
               ]},
               {rows:[
                  {view:'template', //optional, included for clarity
                     scroll:'y', src:'text/procInputInfo.html'},
                  {id:'protNom', view:'text', label:'Protein File Nomenclature',
                     labelPosition:'top'},
                  {id:'ligNom', view:'text', label:'Ligand File Nomenclature',
                     labelPosition:'top'},
                  /*{id:'ZINCloc', view:'richselect', label:'Ligand ZINC ID location',
                  labelPosition:'top', options:[
                     {id:'zInFinalPdb', value:'In final conformation .pdb'},
                     {id:'zInInitPdb', value:'In initial .pdb'},
                     {id:'zInMol2', value:'In initial .mol2'},
                     {id:'zNon', value:'No ZINC ID prsent'}
                  ]},*/
                  {id:'zincNom', view:'text',
                     label:'ZINC ID file Nomenclature (may resuse an above filter)',
                     labelPosition:'top'}
               ]}
            ]},
            {cols:[
               {
                  id:'procRmv', view:'button', value:"Remove", type:"danger",
                  click:function(){
                     $$('procInTable').remove($$('procInTable').getSelectedId(true));
                  },
               },
               //IMPLEMENT AN OverlayBox AS A LOADING MESSAGE
               {
                  id:"toPO", view:"button", type:"next", label:'Next',
                  click:function(){
                     //webix.extend($$('processIn'), webix.OverlayBox);
                     //$$('processIn').showOverlay("HIYA, this is an OverlayBox");
                     addFilteredFiles();
                     
                     $$('processOut').show();
                  }
               }
            ]}
         ]},
         {id:'processOut', rows:[
            {cols:[
               {rows:[
                  {
                     id:"protOutTable", view:"datatable",
                     columns:[
                        {id:'pot_ligID', header:'#', width:40},
                        {id:"protFileName", header:"Protein File Name", fillspace:1},
                        {id:"protFileData", header:"Data", hidden:true},
                     ],
                  },
                  {
                     id:"ligOutTable", view:"datatable",
                     columns:[
                        {id:'lot_ligID', header:'#', width:40},
                        {id:"ligFileName", header:"Ligand File Name", fillspace:3},
                        {id:'zincId', header:'ZINC', fillspace:2},
                        {id:"ligFileData", header:"Data", hidden:true},
                     ],
                  }
               ]},
               {view:'template', //optional, included for clarity
                  scroll:'y', src:'text/procOutputInfo.html'},
            ]},
            {cols:[
               {
                  id:"toPI",  view:"button", type:"prev", label:'Back',
                  click:function(){
                     $$('processIn').show();
                     $$('protOutTable').clearAll();
                     $$('ligOutTable').clearAll();
                     //Clear these tables since the user did not like the output
                  }
               },
               {
                  id:'procOK', view:'button', type:'form', label:'OK',
                  click:function(){
                     $$('procInTable').clearAll();
                     combineFiles();
                     
                     $$('protOutTable').clearAll();
                     $$('ligOutTable').clearAll();
                     //Clear tables after concatenation, but leave the filter fields
                     
                     //Hide processor first so the user doesn't see it going back
                     popupProcessor.hide();
                     $$('processIn').show();
                  }
               }
            ]}
         ]}
      ]
   }
});

$$("procUploader").attachEvent("onAfterFileAdd",function(){
   
   var reader = new FileReader();
   
   var fID, fName, fData;
   
   fID = $$('procUploader').files.getFirstId();
   
   fName = $$("procUploader").files.getItem(fID).name;
   fData = $$("procUploader").files.getItem(fID).file;
   
   reader.onload = function(e) {
      //CHANGE THIS SO THAT THE FILES GET ADDED TO THE PROCESSOR WINDOW IF PROCESS == 1
      $$('procInTable').add({fileName:fName, fileData:reader.result});
      //Add the parsed file data to 'uploadTable" w/ default coordinates 0,0
      //Added as an object with string props rather than an actual file object
      
      $$('procInTable').sort('#fileName#'); //sort by file name after adding
      $$('procInTable').markSorting('fileName','asc'); //show button for flipping the sort
   };
   reader.onerror = function(e) {
      console.error("File could not be read. Code: "+e.target.error.code);
      webix.error("Error uploading a file.");
   };
   
   reader.readAsText(fData);
   
   $$('procUploader').files.remove(fID);
});

});