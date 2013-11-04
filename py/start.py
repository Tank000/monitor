import time, sched, threading
from config import STEP
from collector import collect
from processor import process, aggregateForDay,aggregateForMonth


def perform(s, inc, func, args):
    s.enter(inc,0,perform,(s, inc, func, args))
    func(**args)
   
def schedule(s, inc, func, args):
    s.enter(0,0,perform,(s, inc, func, args))
    s.run()

if __name__ == '__main__':
	thread_pool = []
	args = {}
	th = threading.Thread(target=collect)
	thread_pool.append(th)

	scheduler = sched.scheduler(time.time,time.sleep)
	args = {}
	th = threading.Thread(target=schedule, args=(scheduler, 5, process, args))
	thread_pool.append(th)


	scheduler = sched.scheduler(time.time,time.sleep)
	
	th = threading.Thread(target=schedule, args=(scheduler, 300, aggregateForDay, args))
	thread_pool.append(th)

	scheduler = sched.scheduler(time.time,time.sleep)
	th = threading.Thread(target=schedule, args=(scheduler, 3600, aggregateForMonth, args))
	thread_pool.append(th)

	for i in range(len(thread_pool)):
		thread_pool[i].start()
