//desired destination for file uploading
$file = $_FILES['uploader_1']; //getting a file object
 
$file['name']; //name of the uploaded file 
$file['tmp_name']; //name of the file in the temporary storage

$destination = realpath('uploads/'); //define folder
$filename = $destination."/".preg_replace("|[\\\/]|", "", $file["name"]); //set destination
move_uploaded_file($file["tmp_name"], $filename); //move files


// response to the server
$$("uploader_1").send(function(response){
    if(response)
        webix.message(response.status);
        webix.message(response.sname);
});


//parse file, write var to some js data table file
/ for our test purposes, we are feeding it a JSON to start and no actual converting is done; 
/ this is because I don't actually know what .mol2 files look like and what kind of data they feature
// ////


//write an updated uploaded.txt file in JSON format



//script response to server in form of JS string
if uploadsuccess == true:
	print '{ status: 'server'}',
else:
	print '{ status:'error' }',