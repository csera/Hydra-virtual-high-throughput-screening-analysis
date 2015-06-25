/// Central Grid/Table Update Scripts
// The general procedure for updating the central grid is as follows:
// 1. Delete existing columns and rows w/ deleteRows and deleteColumns
// 2. Loop of appendRows fxn for the # entered in the rows field
// 2. Loop of appendColumn fxn for the # entered in the rows field

// Alternatiave implementation: Modify deleteRows/Columns so that the # of cells removed is the dimension len/index minus # entered in respective field and only remove cells if necessary; then, add the # of cells required to reach the # specified in the form fields. This approach would preserve any existing cells in the table grid and also any present visualizations of proteins.
// FEATURE STILL NEED TO IMPLEMENT: In the cell creation step, sequentially give new cells IDs automatically so that these may be used to map cells to proteins; can use index for simplicity

// adapted from http://www.redips.net/javascript/adding-table-rows-and-columns/

//<iframe src="viewer.html" width="100%" height="100%" frameBorder="0" scrolling="no" style="padding:0px;overflow: hidden;overflow-x: hidden;overflow-y: hidden;"></iframe>

// delete table rows with index greater then 0
function deleteRows() {
    var tbl = document.getElementById('view_table'), // table reference
        lastRow = tbl.rows.length - 1,             // set the last row index
        i;
    // delete rows with index greater then 0
    for (i = lastRow; i > 0; i--) {
        tbl.deleteRow(i);
    }
}
 
// delete table columns with index greater then 0
function deleteColumns() {
    var tbl = document.getElementById('view_table'), // table reference
        lastCol = tbl.rows[0].cells.length - 1,    // set the last column index
        i, j;
    // delete cells with index greater then 0 (for each row)
    for (i = 0; i < tbl.rows.length; i++) {
        for (j = lastCol; j > 0; j--) {
            tbl.rows[i].deleteCell(j);
        }
    }
}

// append row to the HTML table
function appendRow() {
    var tbl = document.getElementById('view_table'), // table reference
        row = tbl.insertRow(tbl.rows.length),      // append table row
        i;
    var j = [
'<iframe src="viewer.html" width="100%" height="100%" frameBorder="0" scrolling="no" style="padding:0px;overflow: hidden;overflow-x: hidden;overflow-y: hidden;"></iframe>'
].join(''); // NOTE TEMPORARY: this is the content that will be loaded into each new cell in each new row in the table; as in the main page, this is temporarily holding an iframe linking to the viewer software
    // insert table cells to the new row
    for (i = 0; i < tbl.rows[0].cells.length; i++) {
        createCell(row.insertCell(i), j, 'row');
    }
}
 
// create DIV element and append to the table cell
function createCell(cell, text, style) {
    var div = document.createElement('div'), // create DIV element
        txt = document.createTextNode(""); // node to store j (here, var text); or default initial viewer loading for new cells... achieved via innerHTML to pass html thru a js var below
    div.appendChild(txt);                    // append text node to the DIV
    div.setAttribute('class', style);        // set DIV class attribute
    //div.setAttribute('className', style);    // set DIV class attribute for IE (?!)
    cell.appendChild(div);                   // append DIV to the table cell
    cell.innerHTML = text
    //cell.setAttribute('id', 'var'); // <--- re: sequential ID feature to be implemented; change 'var' here to an actual variable, add a loop or something to define the variable
}

// append column to the HTML table
function appendColumn() {
    var tbl = document.getElementById('view_table'), // table reference
        i;
    var j = [
'<iframe src="viewer.html" width="100%" height="100%" frameBorder="0" scrolling="no" style="padding:0px;overflow: hidden;overflow-x: hidden;overflow-y: hidden;"></iframe>'
].join(''); // NOTE TEMPORARY: this is the content that will be loaded into each new cell in each new row in the table; as in the main page, this is temporarily holding an iframe linking to the viewer software    // open loop for each row and append cell
    for (i = 0; i < tbl.rows.length; i++) {
        createCell(tbl.rows[i].insertCell(tbl.rows[i].cells.length), j, 'col');
    }
}

/// NOTE: These following functions can be consolidated into the above ones as single function if preferred; currently left independent for easier debugging
// appendRows loop function
function addnumRows() {
	var numRowstoAdd = $$('grid_dim').getValues().numRow-1;
	for (i = 0; i < numRowstoAdd; i++){
		appendRow()
	}
	
}

// appendCols loop function
function addnumCols() {
	var numColstoAdd = $$('grid_dim').getValues().numCol-1;
	for (i = 0; i < numColstoAdd; i++){
		appendColumn()
	}
	
}

/// OVERALL FUNCTION IN ORDER
function updategridfxn() {
	deleteColumns();deleteRows();addnumCols();addnumRows();
}