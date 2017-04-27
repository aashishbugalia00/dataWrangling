from django.http import HttpResponse
from pymongo import MongoClient
import json
from django.http import JsonResponse
from bson import ObjectId

def getFilterList(request):
	client = MongoClient("mongodb://localhost:27017")
	db = client.demo
	#collectionList=db.collection_names()
	collectionName=db.get_collection("ConditionsList")
	filterConditions=[]

	a=db.filterConditionsList.find()
	for i in a:
		obj={}
		for k,v in i.items():			
			k=k.encode("utf8")
			obj[k]=str(v)
		filterConditions.append(obj)

		
	return JsonResponse({'data':filterConditions})



