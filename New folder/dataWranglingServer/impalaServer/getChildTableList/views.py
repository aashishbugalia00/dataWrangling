from django.http import JsonResponse
from impala.dbapi import connect
from django.views.decorators.csrf import csrf_exempt
from django.utils.datastructures import MultiValueDictKeyError

def getCursor():
    conn = connect(host='10.20.0.196', port=21050)
    cur = conn.cursor()
    return cur


@csrf_exempt
def getChildTableList(request):
	outputRes=''
	try:
		tablesData=[]
		curr = getCursor()
		curr.execute('use selfdi ;')
		curr.execute('Show Tables;')
		tableList=curr.fetchall()
		for tableName in tableList:
			tableObj={}
			tableObj['name']=tableName[0]
			query='describe '+tableName[0]+' ;'
			curr.execute(query)
			columnsTuple=curr.fetchall()
			columns=[]
			for column in columnsTuple:
				columns.append(column[0])
			tableObj['columns'] = columns
			tablesData.append(tableObj)
		return JsonResponse({'responseData':tablesData})
	except (MultiValueDictKeyError,Exception) as ex:
		print ex
		outputRes = 'Exception Occured at DB End'
		return JsonResponse({'responseData':outputRes})







