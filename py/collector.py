#!/usr/bin/python
# -*- coding:utf-8 -*-

import subprocess
from config import SFLOWTOOL, METRICS, db

#将监控数据转换为适当的数据类型
def data_convert(key, data):
    if METRICS[key]['type'] == 'float':
        return float(data)
    elif METRICS[key]['type'] == 'int':
        return int(data)
    else:
        return data

def collect():
    #创建子进程执行sflowtool命令
    sp = subprocess.Popen(SFLOWTOOL, stdout=subprocess.PIPE)
    while True:
        #循环逐行读取标准输出
        line = sp.stdout.readline()
        symbol = line.split()[0]
        if symbol == 'startDatagram':
            header = {}
            samples = []
            i = 0
        elif symbol == 'endDatagram':
            for item in samples:
                tmp = header.copy()
                tmp.update(item)
                db['origin'].insert(tmp)
                print tmp['unixSecondsUTC']
        else:
            if symbol == 'startSample':
                samples.append({'status':0})
            elif symbol == 'endSample':
                i += 1
            else:
                [key,value] = line.rstrip('\r\n').replace(' ','\n',1).split('\n')[:2]
                if METRICS.has_key(key):
                    if METRICS[key]['group'] == 'common':
                        header[key] = data_convert(key, value)
                    else:
                        samples[i][key] = data_convert(key, value)