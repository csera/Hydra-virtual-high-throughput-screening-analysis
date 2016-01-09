//Slightly buggy: Requires initial click and release before it will activate
/* Transfers/passes mouse events done on one viewer to all other viewers.
 * Adapted from code by Kohei Ichikawa
 * @param {String} coord "Coordinates" in [x],[y] format for the view to manipulate
 * @param {Event} e The mouse event to transfer
 */
function transferMouseEvent(coords, e) {
   var loopCoords;
   
   //Loop through all viewers
   for(x=1; x<=$$('grid_dim').getValues().numCol; x++) {
      for(y=1; y<=$$('grid_dim').getValues().numRow; y++){
         loopCoords = x+','+y;
         
         //If coords are not the viewer being manipulated, transfer the event
         if(loopCoords != coords)
         {
            var evt = $$('viewer'+x+','+y).getWindow().document.createEvent("MouseEvents");
            
            evt.initMouseEvent(e.type, true, true, window, e.detail, e.screenX, e.screenY,
                               e.clientX, e.clientY, e.ctrlKey, e.altKey, e.shiftKey,
                               e.metaKey, e.button, null);
            
            $$('viewer'+x+','+y).getWindow().$("#gldiv>canvas")[0].dispatchEvent(evt);
         }
      }
   }
}

/* Called by iframe if it is clicked or a file is sent to the viewer.
 * Updates the "active viewer" being referenced, changes Hydra's model display
 * settings to the current viewer's settings, and changes the viewer's frame
 * style to "activeViewer"
 * @param {String} activeCoord
 * @param {String[]} viewSettings Array containing the viewer's display settings.
 *                               [0] is structure type
 *                               [1] is surface type
 *                               [2] is surface opacity
 */
function setActiveViewer(activeCoord, viewSettings) {
   //because JS is stupid and can't work with multidimensional arrays
   //The data contained in these arrays is the actual value of the selected item's id
   var structType = viewSettings[0];
   var surfType = viewSettings[1];
   var surfOpacity = viewSettings[2];
   
   //Removes colored border from previously active viewer (if any and if it is different)
   var prevActive = $$('activeCoord').getValue();
   if (prevActive && prevActive!=activeCoord) {
      webix.html.removeCss($$('viewer'+prevActive).$view, "activeViewer");
      webix.html.addCss($$('viewer'+prevActive).$view, 'inactiveViewer');
   }
   //Adds colored border to currently active viewer
   webix.html.addCss($$('viewer'+activeCoord).$view, "activeViewer");
   
   $$('activeCoord').setValue(activeCoord);
   
   $$('mStructType').setValue('struct'+structType[0]);
   $$('mSurfOpacity').setValue(surfOpacity[0]);
   $$('mSurfType').setValue(surfType[0]);
      //Because this references the value of surfOpacity when changed, it must be set
      //only AFTER surfOpacity is set. Otherwise the default view:'slider' val
      //pollutes the whole process
   
   $$('lStructType').setValue('struct'+structType[1]);
   $$('lSurfOpacity').setValue(surfOpacity[1]);
   $$('lSurfType').setValue(surfType[1]);
}

/* Sets the properties for the molecular surface to display
 * @param {String} coord "Coordinates" in [x],[y] format for the view to manipulate
 * @param {Object} listObj Webix drop-down menu object for structure type selection
 * @param {int} surfIndex Index of the relevant surface in the viewer's array of
 *                         molecular surfaces.
 *                         0 -> target protein.
 *                         1 -> ligand denoted by HetAtm tag in the .pdb
 */
function setStruct(coord, listObj, structIndex){
   var glviewer = $$('viewer'+coord).getWindow().glviewer;
   var itemID = listObj.getValue();
   var itemVal = listObj.getPopup().getList().getItem(itemID).value;
   var setHetAtms;
   
   if (structIndex == 0)
      setHetAtms = false;
   else
      setHetAtms = true;
   
   //Ugly method. Try getting the variable method to work later...
   if (itemVal == 'Cartoon') //set hetflag to false to disable hiding hetatms
      glviewer.setStyle({hetflag:setHetAtms},{cartoon:{color: 'spectrum'}});
   else if (itemVal == 'Sphere')
      glviewer.setStyle({hetflag:setHetAtms},{sphere:{}});
   else if (itemVal == 'Stick')
      glviewer.setStyle({hetflag:setHetAtms},{stick:{}});
   else if (itemVal == 'Line')
      glviewer.setStyle({hetflag:setHetAtms},{line:{}});
   else if (itemVal == 'Cross')
      glviewer.setStyle({hetflag:setHetAtms},{cross:{linewidth:5}});
   
   glviewer.render();
   
   //Store new setting in iframe
   $$('viewer'+coord).getWindow().structType[structIndex] = itemVal;
}

/* Sets the properties for the molecular surface to display
 * @param {String} coord "Coordinates" in [x],[y] format for the view to manipulate
 * @param {String} surfID The type of surface to show. Options:
 *                         surfVDW, surfMS, surfSAS, surfSES
 *                         See 3Dmol.js documentation for details
 * @param {int} surfIndex Index of the relevant surface in the viewer's array of
 *                         molecular surfaces.
 *                         0 -> target protein.
 *                         1 -> ligand denoted by HetAtm tag in the .pdb
 * @param {int} opacSet A number from 0-100 denoting the surface's % opacity
 */
function setSurface(coord, surfID, surfIndex, opacSet){
   var iViewer = $$('viewer'+coord).getWindow();
   var glviewer = iViewer.glviewer;
   var setHetAtms;
   
   if (surfIndex == 0)
      setHetAtms = false;
   else
      setHetAtms = true;
   
   if (iViewer.surfaceObjs[surfIndex] != null) {
      console.log('Removing surface for '+coord);
      glviewer.removeSurface(iViewer.surfaceObjs[surfIndex]),
         iViewer.lastsurfstyle = 1;
      delete iViewer.surfaceObjs[surfIndex];
   }
   
   //Note: This can be set to work with specific chains (as in the 3Dmol example.html),
   //but this has not been implemented since this is a nonstandard way of including
   //ligands in files that would be complicated to work with.
   if (surfID == 'surfVDW') {
      console.log('Adding VdW surface for '+coord);
      iViewer.surfaceObjs[surfIndex] =
         glviewer.addSurface(iViewer.$3Dmol.SurfaceType.VDW, {opacity:opacSet},
         {hetflag:setHetAtms},{hetflag:setHetAtms});
   }
   else if (surfID == 'surfMS') {
      console.log('Adding molecular surface for '+coord);
      iViewer.surfaceObjs[surfIndex] =
         glviewer.addSurface(iViewer.$3Dmol.SurfaceType.MS, {opacity:opacSet},
         {hetflag:setHetAtms},{hetflag:setHetAtms});
   }
   else if (surfID == 'surfSAS') {
      console.log('Adding SA surface for '+coord);
      iViewer.surfaceObjs[surfIndex] =
         glviewer.addSurface(iViewer.$3Dmol.SurfaceType.SAS, {opacity:opacSet},
         {hetflag:setHetAtms},{hetflag:setHetAtms});
   }
   else if (surfID == 'surfSES') {
      console.log('Adding SE surface for '+coord);
      iViewer.surfaceObjs[surfIndex] =
         glviewer.addSurface(iViewer.$3Dmol.SurfaceType.SES, {opacity:opacSet},
         {hetflag:setHetAtms},{hetflag:setHetAtms});
   }
   
   iViewer.surfType[surfIndex] = surfID; //surfType stores ID of applied surf type
   iViewer.surfOpacity[surfIndex] = opacSet*100;
      //surfOpacity stores values of the slider
}