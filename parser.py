#desired destination for file uploading
##

#parse file, write var to some js data table file
# for our test purposes, we are feeding it a JSON to start and no actual converting is done; 
# this is because I don't actually know what .mol2 files look like and what kind of data they feature
##

#write an updated uploaded.txt file in JSON format
##

#script response to server in form of JS string
if uploadsuccess == true:
	print '{ status: 'server'}',
else:
	print '{ status:'error' }',