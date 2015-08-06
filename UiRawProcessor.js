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
               { //Table showing uploaded files
                  id:"procInTable", view:"datatable",
                  select:true, multiselect:true, //ctrl+click & shift+click work
                  columns:[
                     {id:"fileName", header:"File Name", width:300},
                     {id:"fileData", header:"Data", hidden:true},
                  ],
               },
               {rows:[
                  {view:'template', //optional, included for clarity
                     scroll:'y', src:'text/procInputInfo.html'},
                  {id:'protNom', view:'text', label:'Protein File Nomenclature',
                     labelPosition:'top'},
                  {id:'ligNom', view:'text', label:'Ligand File Nomenclature',
                     labelPosition:'top'},
                  {id:'ZINCloc', view:'richselect', label:'Ligand ZINC ID location',
                  labelPosition:'top', options:[
                     {id:'zInFinalPdb', value:'In final conformation .pdb'},
                     {id:'zInInitPdb', value:'In initial .pdb'},
                     {id:'zInMol2', value:'In initial .mol2'},
                     {id:'zNon', value:'No ZINC ID prsent'}
                  ]},
               ]}
            ]},
            {cols:[
               {
                  id:'procRmv', view:'button', value:"Remove", type:"danger",
                  click:'',
               },
               {
                  id:"toPO", view:"button", type:"next", label:'Next',
                  click:function(){$$('processOut').show();}
               }
            ]}
         ]},
         {id:'processOut', rows:[
            {cols:[
               { //Table showing uploaded files
                  id:"procOutTable", view:"datatable",
                  columns:[
                     {id:"fileName", header:"File Name", width:300},
                     {id:"fileData", header:"Data", hidden:true},
                  ],
               },
               {view:'template', //optional, included for clarity
                  scroll:'y', src:'text/procOutputInfo.html'},
            ]},
            {cols:[
               {
                  id:"toPI",  view:"button", type:"prev", label:'Back',
                  click:function(){$$('processIn').show();}
               },
               {
                  id:'procOK', view:'button', type:'form', label:'OK',
                  click:''
               }
            ]}
         ]}
      ]
   }
});

});