#!/usr/bin/python

## Program takes in a .mol2 file and parses out the link to the 
## zinc image, compound name, a list of vendors, and links to each vendor's website

import sys, re, requests

with open(sys.argv[1], 'r') as filename:
	read_file = filename.read()
lines = read_file.splitlines()

i = 0
zincs = []
while i < len(lines):
	if lines[i].startswith("ZINC"):
		zinc_id = lines[i]
		atom_info = lines[i+1].lstrip()
		sep = atom_info.find(" ")
		print(zinc_id, "\n", "number of atoms:\t", atom_info[0:sep], "\n")
		zincs += [zinc_id]
		i += 1
	i += 1

## http request for the zinc database website
## note: the website's url is: http://zinc.docking.org/
## which is followed by the zinc ID, which can be determined from the .mol2 file.

## parse html

zinc_file = [r.text for r in [requests.get(str("http://zinc.docking.org/substance/")+str(item)) for item in zincs]]

## get zinc image from html
## image_url can be used in <img src="..."> in HYDRA later

image_url = str("http://zinc.docking.org/img/sub/") + str(zinc_id[4::]) + str(".gif")

## get vendor information from html
## Vendor information is located at: http://zinc.docking.org/catalogs/company_name

purchasable = [m.start() for m in re.finditer("Purchase", str(zinc_file))]

## Slice div with Vendor information

vendor_start = str(zinc_file).find("purchasable catalogs report-title")
company_urls = []
try:
	company_urls = ([str("http:") + x for x in [str(zinc_file)[str(zinc_file).find("purchasable catalogs report-title"):purchasable[-1]][site:str(zinc_file)[str(zinc_file).find("purchasable catalogs report-title"):purchasable[-1]].find("\"", site)] for site in [n.start() for n in re.finditer("//zinc.docking.org/catalogs/", str(zinc_file)[str(zinc_file).find("purchasable catalogs report-title"):purchasable[-1]])]]])
	company_names = str([x for x in [str(zinc_file)[str(zinc_file).find("purchasable catalogs report-title"):purchasable[-1]][site+len("More about "):str(zinc_file)[str(zinc_file).find("purchasable catalogs report-title"):purchasable[-1]].find("\"", site)] for site in [n.start() for n in re.finditer("More about ", str(zinc_file)[str(zinc_file).find("purchasable catalogs report-title"):purchasable[-1]])]]])

	company_list = [str(zinc_file)[str(zinc_file).find("purchasable catalogs report-title"):purchasable[-1]][site+len("More about "):str(zinc_file)[str(zinc_file).find("purchasable catalogs report-title"):purchasable[-1]].find("\"", site)] for site in [n.start() for n in re.finditer("More about ", str(zinc_file)[str(zinc_file).find("purchasable catalogs report-title"):purchasable[-1]])]]

except:
	IndexError
	print("Sorry: no record of a vendor.")

## URLs for company websites

comps = ', '.join(map(str, company_list))

## Out will later be changed so that the output is displayed in the Vendor List / Compound Details in Hydra

out = sys.argv[2]
output = open(out, 'w')
output.write("[\n\t{ id:1, compname:\"" + str(zinc_id) + "\", res:" + str(atom_info[0:sep]) + ", vendor:\"" + str(comps) + "\",},\n];")

