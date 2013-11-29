#!/usr/bin/python
# -*- coding:utf-8 -*-

import pymongo

#MongoDB基本配置
MONGO_IP = '127.0.0.1'
MONGO_PORT = 27017
MONGO_DB = 'tag_monitor'
#数据库相关初始化
connection = pymongo.Connection(MONGO_IP, MONGO_PORT)
db = connection[MONGO_DB]
db.authenticate('tank','forlove')
# host.ensure_index([('unixSecondsUTC', pymongo.ASCENDING), ('UUID', pymongo.ASCENDING)])
# host.ensure_index([('UUID', pymongo.ASCENDING), ('unixSecondsUTC', pymongo.ASCENDING)])

#sFlow相关配置
SFLOWTOOL = 'sflowtool.exe'
#多分辨率数据配置
STEP = 5
RRA = [(1, '1d', 86400), (3, '1w', 604800), (15, '1m', 2592000), (30, '1y', 30758400)]
#数据分组的配置
GROUP = ['cpu','memory','network','disk','host']
#监控数据定义
METRICS = {
	'datagramSourceIP' :{ 'dst': 'GAUGE', 'group': 'common', 'type': 'str' },
	'unixSecondsUTC': { 'dst': 'GAUGE', 'group': 'common', 'type': 'int' },
	'agentSubId': { 'dst': 'GAUGE', 'group': 'common', 'type': 'int' },
	'agent'	: { 'dst': 'GAUGE', 'group': 'common', 'type': 'str' },
	'sysUpTime': { 'dst': 'GAUGE', 'group': 'common', 'type': 'int' },
	'packetSequenceNo': { 'dst': 'GAUGE', 'group': 'common', 'type': 'int' },
	'samplesInPacket': { 'dst': 'GAUGE', 'group': 'common', 'type': 'int' },

	'disk_total': { 'dst': 'GAUGE', 'group': GROUP[3], 'type': 'float' },
	'disk_free': { 'dst': 'GAUGE', 'group': GROUP[3], 'type': 'float' },
	'disk_partition_max_used': { 'dst': 'GAUGE', 'group': GROUP[3], 'type': 'float' },
	'disk_reads': { 'dst': 'COUNTER', 'group': GROUP[3], 'type': 'float' },
	'disk_bytes_read': { 'dst': 'COUNTER', 'group': GROUP[3], 'type': 'float' },
	'disk_read_time': { 'dst': 'GAUGE', 'group': GROUP[3], 'type': 'float' },
	'disk_writes': { 'dst': 'COUNTER', 'group': GROUP[3], 'type': 'float' },
	'disk_bytes_written': { 'dst': 'COUNTER', 'group': GROUP[3], 'type': 'float' },
	'disk_write_time': { 'dst': 'GAUGE', 'group': GROUP[3], 'type': 'float' },

	'mem_total': { 'dst': 'GAUGE', 'group': GROUP[1], 'type': 'float' },
	'mem_free': { 'dst': 'GAUGE', 'group': GROUP[1], 'type': 'float' },
	'mem_shared': { 'dst': 'GAUGE', 'group': GROUP[1], 'type': 'float' },
	'mem_buffers': { 'dst': 'GAUGE', 'group': GROUP[1], 'type': 'float' },
	'mem_cached': { 'dst': 'GAUGE', 'group': GROUP[1], 'type': 'float' },
	'swap_total': { 'dst': 'GAUGE', 'group': GROUP[1], 'type': 'float' },
	'swap_free': { 'dst': 'GAUGE', 'group': GROUP[1], 'type': 'float' },
	'page_in': { 'dst': 'COUNTER', 'group': GROUP[1], 'type': 'float' },
	'page_out': { 'dst': 'COUNTER', 'group': GROUP[1], 'type': 'float' },
	'swap_in': { 'dst': 'GAUGE', 'group': GROUP[1], 'type': 'float' },
	'swap_out': { 'dst': 'GAUGE', 'group': GROUP[1], 'type': 'float' },

	'cpu_load_one': { 'dst': 'GAUGE', 'group': GROUP[0], 'type': 'float' },
	'cpu_load_five': { 'dst': 'GAUGE', 'group': GROUP[0], 'type': 'float' },
	'cpu_load_fifteen': { 'dst': 'GAUGE', 'group': GROUP[0], 'type': 'float' },
	'cpu_proc_run': { 'dst': 'GAUGE', 'group': GROUP[0], 'type': 'int' },
	'cpu_proc_total': { 'dst': 'GAUGE', 'group': GROUP[0], 'type': 'int' },
	'cpu_num': { 'dst': 'GAUGE', 'group': GROUP[0], 'type': 'int' },
	'cpu_speed': { 'dst': 'GAUGE', 'group': GROUP[0], 'type': 'int' },
	'cpu_uptime': { 'dst': 'GAUGE', 'group': GROUP[0], 'type': 'int' },
	'cpu_user': { 'dst': 'GAUGE', 'group': GROUP[0], 'type': 'float' },
	'cpu_nice': { 'dst': 'GAUGE', 'group': GROUP[0], 'type': 'float' },
	'cpu_system': { 'dst': 'GAUGE', 'group': GROUP[0], 'type': 'float' },
	'cpu_idle': { 'dst': 'GAUGE', 'group': GROUP[0], 'type': 'float' },
	'cpu_wio': { 'dst': 'GAUGE', 'group': GROUP[0], 'type': 'float' },
	'cpuintr': { 'dst': 'GAUGE', 'group': GROUP[0], 'type': 'float' },
	'cpu_sintr': { 'dst': 'GAUGE', 'group': GROUP[0], 'type': 'float' },
	'cpuinterrupts': { 'dst': 'COUNTER', 'group': GROUP[0], 'type': 'float' },
	'cpu_contexts': { 'dst': 'COUNTER', 'group': GROUP[0], 'type': 'float' },

	'nio_bytes_in': { 'dst': 'COUNTER', 'group': GROUP[2], 'type': 'float' },
	'nio_pkts_in': { 'dst': 'COUNTER', 'group': GROUP[2], 'type': 'float' },
	'nio_errs_in': { 'dst': 'COUNTER', 'group': GROUP[2], 'type': 'float' },
	'nio_drops_in': { 'dst': 'COUNTER', 'group': GROUP[2], 'type': 'float' },
	'nio_bytes_out': { 'dst': 'COUNTER', 'group': GROUP[2], 'type': 'float' },
	'nio_pkts_out': { 'dst': 'COUNTER', 'group': GROUP[2], 'type': 'float' },
	'nio_errs_out': { 'dst': 'COUNTER', 'group': GROUP[2], 'type': 'float' },
	'nio_drops_out': { 'dst': 'COUNTER', 'group': GROUP[2], 'type': 'float' },

	'hostname': { 'dst': 'GAUGE', 'group': GROUP[4], 'type': 'str' },
	'UUID': { 'dst': 'GAUGE', 'group': GROUP[4], 'type': 'str' },
	'machine_type': { 'dst': 'GAUGE', 'group': GROUP[4], 'type': 'str' },
	'os_name': { 'dst': 'GAUGE', 'group': GROUP[4], 'type': 'str' },
	'os_release': { 'dst': 'GAUGE', 'group': GROUP[4], 'type': 'str' },
}
