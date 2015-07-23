webix.ready(function(){
   //webix.ui.fullScreen(); //for fullscreen on mobile devices
   
hydraUI = webix.ui({
   container:"masterarea",
   type:"line",
   responsive:"true",
   
    rows:[
      // first row is a title header for app, maybe put more stuff here later?
      {template:"html->titlebar", height:1 },
      
      // second row, main content of app goes here
      {cols:[{
         // left column has control panel, upload manager as accordioned components
         view:"scrollview",
         scroll:"y",
         type:"line",
         body:
         {multi:true, view:"accordion", type:"line", 
            rows:[
            
            // Upload compound list / DOCK data
            {header:"Import Compounds", maxWidth:250, autoheight:true, collapsed:false, body:
               {rows:[ //removed view:'form' to make this take up the whole width
                  { //Uploader element
                     id:"uploader_1", view:"uploader",
                     value:"Upload Files",
                     multiple:true, autosend:false,
                     //upload:"parser.php"
                  },
                  { //Table showing uploaded files
                     id:"uploadTable", view:"datatable",
                     select:true, multiselect:true, //ctrl+click & shift+click work
                     drag:true, //NEED TO MAKE THIS SYNC WITH COMPOUND LIST
                     editable:true, editaction:"dblclick",
                     maxHeight:400, minHeight:160,
                     leftSplit:2, //left 2 col's won't scroll horizontally
                     columns:[
                        {id:"col", header:"Col", width:40, editor:"text"},
                        {id:"oCol", header:"origCol", hidden:true},
                        {id:"row", header:"Row", width:45, editor:"text"},
                        {id:"oRow", header:"origRow", hidden:true},
                        {id:"fileName", header:"File Name", width:200},
                        {id:"fileData", header:"Data", hidden:true},
                     ],
                  },
                  {
                     cols:[
                        {
                           view:"button",id:"load_click",value:"Update Data",type:"form",
                           click:"load_fxn"
                        },
                        {
                           view:"button",id:"clear_click",value:"Delete Data",type:"danger",
                           click:"clear_fxn"
                        }
                     ]
                  }
               ]}
            },
            {view:'resizer'},
            
            //Webix bug: section below resizer expands when resizer moved up
            //TEMP FIX: Need to nest the below sections in one row
            
            {rows:[
            // "Grid Controls" - controls for resizing the grid
            {header:"Grid Controls", maxWidth:250, collapsed:false, body:
               {view:"form", id:"grid_dim", elements:[
                  //{view:"text",value:"blarg",label:"test",name:"mg"},
                  {
                     view:"text",value:"1",label:"Columns:",name:"numCol",//specifies cols count
                  },
                  {
                     view:"text",value:"1",label:"Rows:",name:"numRow",//specifies rows count
                  },
                  /*{/* NOTE: feature not yet implemented --> dropdown menu to select
                   *the ID for each of the viewers in the central grid, as defined in the
                   *grid_dim form above; via this drop down menu, we can set and specify
                   *the docking file and legand to be shown in each viewer
                     view:"form", type:"space", rows:[
                        {
                           view:"text",label:"Dock File:", id:"dock11var",
                        },
                        {
                           view:"text",label:"Ligand File", id:"lig11var", 
                        },
                  ]},*/
                  {
                     view:"button",id:"update_grid",value:"Update Grid",inputWidth:"150",align:"center",
                     on:{
                        'onItemClick': updategridfxn
                        //function(){alert( $$('grid_dim').getValues().numRow )} //debug
                     }
                  },
               ]},
            },
            
            
            {header:"Viewer Controls", maxWidth:250, collapsed:false, body:
               {rows:[ //Making this a form would give a cleaner look but would take up more space...
                  //Hidden element which keeps track of the active viewer. Avoids making global var
                  {id:'activeCoord', view:'text', hidden:true},
                  {id:'structType', view:'richselect', label:'Display as', options:[
                     {id:'structCartoon', value:'Cartoon'},
                     {id:'structSphere', value:'Sphere'},
                     {id:'structStick', value:'Stick'},
                     {id:'structLine', value:'Line'},
                     {id:'structCross', value:'Cross'},
                     ],
                     on:{
                        'onChange': function(){
                           var coord = $$('activeCoord').getValue();
                           
                           if (coord) {
                              setStruct(coord,this,0);
                           }
                        }
                     }
                  
                  },
                  {id:'surfType', view:'richselect', label:'Surface', options:[
                     {id:'surfNone', value:'None'},
                     {id:'surfVDW', value:'Van der Waals'},
                     {id:'surfMS', value:'Molecular'},
                     {id:'surfSAS', value:'Solvent Accessible'},
                     {id:'surfSES', value:'Solvent Excluded'},
                     ],
                     on:{
                        onChange: function(){
                           var coord = $$('activeCoord').getValue();
                           
                           if (coord){
                              var opacSet = $$('surfOpacity').getValue()/100;
                              
                              setSurface(coord,this,0,opacSet);
                           }
                        }
                     }
                  },
                  {id:'surfOpacity', view:'slider', level:'Opacity', label:'Opacity',
                     value:'50', min:0, max:100,
                     //Gives opacity in percentage
                     //3Dmol requires decimal -> use this.getValue()/100
                     on:{
                        onChange: function(){
                           var coord = $$('activeCoord').getValue();
                           
                           if (coord) {
                              var opacSet = itemVal/100;
                              
                              setSurface(coord,$$('surfType'),0,opacSet);
                           }
                        }
                     }
                  },
                  {cols:[
                     {id:'alphaCs', view:'checkbox', label:"Show α C's",
                        on:{
                           onChange: function(){
                              var coord = $$('activeCoord').getValue();
                              
                              if (coord) {
                                 var itemVal = this.getValue(); //0 = not checked; 1 = checked
                                 
                                 setAlphaCs(coord, itemVal, 0);
                              }
                           }
                        }
                     },
                     {id:'ligand', view:'checkbox', label:'Set Ligand'}
                  ]},
                  //recenter control here? place this in the viewer?
                  
                  {} //Blank view needed to fix a related resizing issue
                  //Webix thread: http://forum.webix.com/discussion/comment/4771
               ]}
            },
            ]}
         ]},
      },
      
      // middle column contains central workspace with all of the visualization object
      {id:"workspace", view:"scrollview", container:"central_workspace",type:"clean",
      scroll:"xy", //Enables horizontal (x) and vertical (y) scrolling
      
      //Framework for a resizable grid of GLmol instances
      //Viewers start at index of 1 with coordinates (x,y)
      //Eg "viewer2,1" is in the first row, second column from the left
      body:{id:"workLayout", type:'head', borderless:true, rows:[{
         id:"workRow"+"1", type:'head', borderless:true, cols:[{
            view:"iframe",
            id:"viewer"+"1"+","+"1",
            src:"3Dmol frame.html",
            minWidth:250,minHeight:250,
            on:{
               'onAfterLoad':function(){
                  this.getWindow().setGridCoordinates('1,1');
               }
            }
         }]
      }]}
      },
      
      // right column has compounds list, details are accordioned components
      {view:"scrollview",scroll:"y",body:
      {
         multi:true, view:"accordion", type:"line", 
         rows:[
         
         // Compound list showing cat,name from uploaded file
         {header:"Compound List", height:300, collapsed:false, body:
            {
               id:"comp_table",
               view:"datatable",
               select:true, 
               columns:[
                  { id:"id", header:"ID", width:50}, 
                  { id:"category", header:"Category", width:85}, 
                  { id:"compname", header:"Compound Name", fillspace:1 },
               ], 
               data:'',
               minWidth:250,
               
            on:{
               onBeforeLoad:function(){
                  this.showOverlay("Loading...");
               },
               onAfterLoad:function(){
                  this.hideOverlay();
               }
            },
               //datatype:"json",
               //url:'compounds.json'
            }
         },
         {view:"resizer"},
         // Details of selected compound not shown in list, such as scores
         {header:"Compound Details", collapsed:false, body:
            {view:"form", id:"comp_det", maxWidth:250, rows:[
               { view:"text",name:"category",label:"Category" },
               { view:"text",name:"compname",label:"Name" },
               { view:"text",name:"pdb",label:"PDB #" },
               { view:"text",name:"res",label:"Residues" },
            ]}
         },
         
         //For debugging: Textarea to display contents of files
         /*{header:"File Value", collapsed:false, body:
            {view:"textarea", id:"file_dump", maxWidth:300}
         },*/
         
      ]},	
      },
      ]}
   ]
});

/* Called after a file is added to the view:uploader. Called successively for each file
 * if multiple files are sent at once.
 * Takes data from the first file in "uploader_1" and puts it in the "uploadTable"
 * view:datatable.  Object is then removed so more items may be read successfully.
 */
$$("uploader_1").attachEvent("onAfterFileAdd",function(){
   var reader = new FileReader();
   
   var numFiles = 1+$$('uploader_1').files.getIndexById($$('uploader_1').files.getLastId());
   var fID, fName, fData;
   
   console.log('Number of files found = '+numFiles);
   
   fID = $$('uploader_1').files.getFirstId();
   
   fName = $$("uploader_1").files.getItem(fID).name;
   fData = $$("uploader_1").files.getItem(fID).file;
   
   reader.onload = function(e) {
      $$('uploadTable').add({col:0, oCol:0, row:0, oRow:0,
                            fileName:fName, fileData:reader.result});
      //Add the parsed file data to 'uploadTable" w/ default coordinates 0,0
      //Added as a string rather than an actual file object
      
   };
   reader.onerror = function(e) {
      console.error("File could not be read. Code: "+e.target.error.code);
      alert("error");
   };
   
   reader.readAsText(fData);
   
   $$('uploader_1').files.remove(fID);
});

// binds selected compound detail panel with selection in compounds list, default selection is first
$$('comp_det').bind($$('comp_table'));
$$("comp_table").select(1);

// syncs the compound list table displayed with the uploaded data DataCollection
//$$('comp_table').data.sync($$('data_col'));

//logic.init(); //reference to logic section
});

//Resizes GUI dynamically with the window size
webix.event(window,"resize", function(){hydraUI.adjust();});
/*webix.attachEvent('onFocusChange',function(current_view, prev_view){
   console.log('focused: '+(!view?'null' : view.config.id));
});*/