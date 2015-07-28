Hydra is a browser-based tool for high-throughput screening still under development.
It is an open-source project which makes use of 3Dmol.js for displaying molecules
and the Webix code library for general GUI generation and functionality.

This README will be updated as development proceeds.

-------------------------------------------------------------
== Completed Features ==
- Display of up to 18 different compounds at once in an adjustable grid of 3Dmol
  instances
  - Grid may be resized in terms of number of viewers and in terms of raw pixels
  - Exact number of simultaneous instances may fluctuate.  It is usually ~16
- Structural representations
  - Cartoon, line (double/triple bonds supported), ball & stick, cross, sphere
- Surface representations
  - Van der Waals, molecular, solvent accessible, solvent excluded
- Fetching of compound information for compounds in the ZINC database

- Please see 3Dmol.js's documentation for more extensive detail on the following:
- Tranlations, rotation, and zoom with mouse and touchscreen
- Non-exhaustive list of supported filetypes:
  - .mol2, .pdb, .cif, .sdf


== Basic Usage ==
- Upload files into Hydra via the "Upload Files" button
  - Multiple files may be uploaded at once via shift+click and ctrl+click
  - Uploaded files will appear in the file list
- Items in the file list may be reorded via drag and drop
  - Multiple items can be selected at once and removed via "Delete Data"
- Uploaded files may be sent to a viewer by entering the corresponding viewer's
  coordinates in the "Col" and "Row" fields via double-click
  - The viewer coordinates are displayed in Col,Row format in the bottom left of
    each 3Dmol instance
  - Once all desired coordinates have been set, press the "Upload Data" button
  - Please note that changing the coordinates of an already loaded molecule will 
    clear it from its original viewer and reload it with the default display 
    settings in the new viewer
- The number of viewers in the grid may be resized via the "Grid Controls" pane
- To change the display settings of a given compound, navigate to the "Viewer Controls"
  panel which can be accessed via the multiview tab-bar on the bottom left
  - Select a viewer to make "active" by simply clicking on it. It will be highlighted
    whilst "active"
  - Display mode may only be altered for the ACTIVE VIEWER
  - New display modes will be applied soon as a change in the settings is detected


== System requirements ==

Hydra has been developed largely on Firefox and Chrome, but it should also work
in most other browsers as long as they support WebGL and Javascript.
It also works well on mobile devices and has been tested on Chrome for Android.

While it may still work, Internet Explorer is unfortunately not supported at this time.


== Troubleshooting ==

Why won't my file load?
If you are running Hydra locally, please note that some browsers (eg Google Chrome)
have strict security settings which block uploading local files to a locally run 
instance as a Same-Origin-Policy violation (null source and null destination).
Please run this on a server or from a different browser (eg Firefox)
If you are running into a different problem, please verify that your filetype is 
supported by 3Dmol.js.