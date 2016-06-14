Hydra is a browser-based tool for high-throughput screening still under development.
It is an open-source project which utilizes 3Dmol.js for molecular modeling and the
Webix JavaScript library for the general GUI.

If you wish to keep your data private, don't worry: your files are not uploaded
to any servers. "Uploading" files only places them in the browser's local instance.

-------------------------------------------------------------
== **Features** ==
- Display of up to 18 different compounds at once in an adjustable grid of 3Dmol
  instances
  - Grid may be resized in terms of number of viewers and in terms of raw pixels
  - Exact number of simultaneous instances may fluctuate.  It is usually ~16
- Structural representations
  - Cartoon, line (double/triple bonds supported), ball & stick, cross, sphere
- Surface representations
  - Van der Waals, molecular, solvent accessible, solvent excluded
- Fetching of compound information for compounds in the ZINC database
  - Uses "boutique shards" subset (subset #47)
  - Vendor list creation
  - Displayed properties:
      - "Compounds Overview": ZINC ID, IUPAC name, number of atoms, number of bonds
      - "Compound Details": LogP, molecular mass, nubmer of H-bond donors, number of
        H-bond acceptors, SMILES code, 2D bond-line representation, vendor list
- Processing of raw molecular docking simulation output
  - Filters uploaded files based upon a user-inputted filename template
  - Concatenates ligand and protein files then places them in the main workspace

- Please see 3Dmol.js's documentation for more extensive detail on the following:
  - Tranlations, rotation, and zoom with mouse and touchscreen
  - Non-exhaustive list of supported filetypes:
    - .mol2, .pdb, .cif, .sdf


== **How to** ==
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
- Using the file processor
  - The file processor GUI will open upon pressing the labeled button
  - All files outputted by a simulation may be uploaded via "Upload Raw Files"
  - Follow the in-program instructions for filtering relevant files
    - NOTE: if no filters are applied, nothing will happen
  - Confirm that all relevant files are present and that all other files have been 
    screened out then press "OK"
    - Return and modify the filters if not
  - The ligand files will have "ATOM" tags replaced with "HETATM" then be appended
    to the protein files
  - Pressing "OK" will clear the file processor tables, add them to the main Hydra
    interface, and close (technically, hide) the processor popup.  Filters will,
    however, not be cleared and will still be there if the processor is reopened.


== **System requirements** ==

Hydra has been developed primarily on Firefox and Chrome, but it should also work
in most other browsers as long as they support WebGL and Javascript.
It also works well on mobile devices and has been tested on Chrome for Android.

While it may still work, Internet Explorer is not supported at this time.


== **Troubleshooting** ==

Why won't my file load?
If you are running Hydra locally, please note that some browsers (eg Google Chrome)
have strict security settings which block uploading local files to a locally run 
instance as a Same-Origin-Policy violation (null source and null destination).
Please run this on a server or from a different browser (eg Firefox)
If you are running into a different problem, please verify that your filetype is 
supported by 3Dmol.js.