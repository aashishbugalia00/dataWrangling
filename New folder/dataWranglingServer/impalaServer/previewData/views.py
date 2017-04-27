from django.http import JsonResponse
from impala.dbapi import connect
from django.views.decorators.csrf import csrf_exempt
import yaml
from django.utils.datastructures import MultiValueDictKeyError

@csrf_exempt
def previewData(request):
	try:
		outputRes=""
		finalQuery=""
		selectedData=[]
		data = request.GET['data']
		if data !='':
			ignoredAscii= data.encode('ascii', 'ignore')
			dataDict = yaml.load(ignoredAscii)
			finalQuery=createQuery(dataDict)
			curr=getCursor()
			selectedData=curr.execute(finalQuery)
			outputRes=selectedData
		else:
			outputRes = 'Fail, No Task Details Received'
		return JsonResponse({'responseData':outputRes})
	except (MultiValueDictKeyError,Exception) as ex:
		print ex
		outputRes = 'Exception Occured at DB End'
		return JsonResponse({'responseData':outputRes})

def getCursor():
    conn = connect(host='10.20.0.196', port=21050)
    cur = conn.cursor()
    return cur

def createQuery(taskDict):
	selectSQL="SELECT a.*"
	frmSQL=" FROM '" + taskDict['childTable'] + "' a "
	whereSQL=""
	##### lookup table join formation
	print 'Lkp tables:'
	lkpIdx=0;
	for lkp in taskDict['lookupList']:
		print lkp['parentTable']
    	frmSQL += " JOIN " + lkp['parentTable'] + " lkp" + str(lkpIdx) + " ON a." + lkp['childColumn'] + lkp['selectedCondition']['value'] + "lkp"+str(lkpIdx)+"." + lkp['parentColumn'] 
    	lkpIdx+=1

	print frmSQL

	##### transformed column formation
	txIdx=0;
	for tx in taskDict['transformationList']:
		print tx['targetColumn']
		selectSQL += ", " + tx['transformationFunction'] + " as " + tx['targetColumn']
		#selectSQL += ", " + tx['transformationFunction'] + "("+ tx['srcColumn'] + ") as " + tx['targetColumn']
		txIdx+=1

	print selectSQL

	##### filter clause
	filterIdx=0;
	for fil in taskDict['filterList']:
		print fil['column']
		if filterIdx == 0 : 
			whereSQL = " WHERE " +  fil['column'] + fil['condition']['value'] + fil['filterValue']
		else: 
			whereSQL +=      " AND " + fil['column'] + fil['condition']['value'] + fil['filterValue']
	filterIdx+=1

	print whereSQL
	return selectSQL + frmSQL + whereSQL






