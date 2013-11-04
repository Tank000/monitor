#!/usr/bin/python
# -*- coding:utf-8 -*-

import time
from config import METRICS, STEP, db


#计算物理机的CPU各项使用率
def cpu_util(data, document):
	cpu_metrics = ['cpu_user', 'cpu_nice', 'cpu_system', 'cpu_idle', 
				   'cpu_wio', 'cpuintr', 'cpu_sintr']
	cpu_total = 0
	for metric in cpu_metrics:
		cpu_total += data[metric] - document[metric]
	if cpu_total:
		for metric in cpu_metrics:
			data[metric] = round((data[metric] - document[metric])/cpu_total*100, 2)
			if data[metric] <0:
				data[metric] == 0.00
			elif data[metric] > 100:
				data[metric] = 100.00
	else:
		for metric in cpu_metrics:
			data[metric] = 0.00
	return data

#将原始数据处理处理成基本数据，包括COUNTER类型数据和CPU数据处理
def process():
	db_origin = db['origin']
	key = {'UUID':1}
	now = int(time.time())
	condition = {'unixSecondsUTC': {"$gte": now-10, "$lt": now}}
	initial = {'unixSecondsUTC': 0}
	reduce = 'function (doc, prev) {'
	reduce += 'if (doc.unixSecondsUTC > prev.unixSecondsUTC) {'
	reduce += 'for (var key in doc) {'
	reduce += 'prev[key] = doc[key]; }}}'
	documents_1 = db_origin.group(key, condition, initial, reduce)
	initial = {'unixSecondsUTC': float('inf')}
	reduce = reduce.replace('>', '<')
	documents_2 = db_origin.group(key, condition, initial, reduce)
	for i in range(len(documents_1)):
		if documents_1[i]['unixSecondsUTC'] == documents_2[i]['unixSecondsUTC']:
			continue 
		documents_1[i] = cpu_util(documents_1[i], documents_2[i])
		del documents_1[i]['status']
		interval = documents_1[i]['unixSecondsUTC'] - documents_2[i]['unixSecondsUTC']
		for key in documents_1[i].keys():
			if METRICS.has_key(key): 
				if METRICS[key]['dst'] == 'COUNTER':
					documents_1[i][key] = round((documents_1[i][key] - documents_2[i][key])/interval, 2)
				if documents_1[i][key] < 0:
					documents_1[i][key] = 0
			 	if METRICS[key]['group'] != 'common':
			 		if not documents_1[i].has_key(METRICS[key]['group']):
			 			documents_1[i][METRICS[key]['group']] = {}
			 		documents_1[i][METRICS[key]['group']][key] = documents_1[i][key]
			 		del documents_1[i][key]
		db_origin.update({'_id':documents_1[i]['_id']},{'$set':{'status':1}})
	if len(documents_1)>0:
		db['day_5s'].insert(documents_1)
		print documents_1[0]['_id']
	# db_origin.remove({'unixSecondsUTC': {"$lt": now-3*24*60*60}})
	# db['day_5s'].remove({'unixSecondsUTC': {"$lt": now-30*24*60*60}})


#将基本数据聚合为更大时间间隔，更长的时间段的数据
def aggregateForDay():
	collection_1 = db['day_5s']
	collection_n = db['month_300s']
	key = {'UUID':1}
	now = int(time.time())
	condition = {'unixSecondsUTC': {"$gte": now-300, "$lt": now}}
	initial = {'unixSecondsUTC': 0, 'count': 0}
	reduce = 'function (doc, prev) { prev.count++;'
	reduce += 'if (doc.unixSecondsUTC > prev.unixSecondsUTC)'
	reduce += '{prev.unixSecondsUTC = doc.unixSecondsUTC;}'
	reduce += 'for (var key in doc)'
	reduce += '{if (key != "unixSecondsUTC" && key != "_id") '
	reduce += '{if (prev.count == 1) {prev[key] = doc[key];}'
	reduce += 'else {if (typeof(doc[key]) != "string")'
	reduce += '{prev[key] += doc[key];}}}}}'
	finalize = 'function (prev) {for (var key in prev) {'
	finalize += 'if (key != "unixSecondsUTC" && key != "count" && typeof(prev[key]) != "string") {'
	finalize += 'prev[key] /= prev.count;}}delete prev.count;}'
	documents = collection_1.group(key, condition, initial, reduce, finalize)
	if documents:
		collection_n.insert(documents)



def aggregateForMonth():
	collection_1 = db['month_300s']
	collection_n = db['year_3600s']
	key = {'UUID':1}
	now = int(time.time())
	condition = {'unixSecondsUTC': {"$gte": now-3600, "$lt": now}}
	initial = {'unixSecondsUTC': 0, 'count': 0}
	reduce = 'function (doc, prev) { prev.count++;'
	reduce += 'if (doc.unixSecondsUTC > prev.unixSecondsUTC)'
	reduce += '{prev.unixSecondsUTC = doc.unixSecondsUTC;}'
	reduce += 'for (var key in doc)'
	reduce += '{if (key != "unixSecondsUTC" && key != "_id") '
	reduce += '{if (prev.count == 1) {prev[key] = doc[key];}'
	reduce += 'else {if (typeof(doc[key]) != "string")'
	reduce += '{prev[key] += doc[key];}}}}}'
	finalize = 'function (prev) {for (var key in prev) {'
	finalize += 'if (key != "unixSecondsUTC" && key != "count" && typeof(prev[key]) != "string") {'
	finalize += 'prev[key] /= prev.count;}}delete prev.count;}'
	documents = collection_1.group(key, condition, initial, reduce, finalize)
	if documents:
		collection_n.insert(documents)
