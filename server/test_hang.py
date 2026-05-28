import faulthandler, threading, sys, time
faulthandler.enable()
def dump_trace():
    time.sleep(2)
    print('--- DUMPING TRACEBACK ---')
    faulthandler.dump_traceback(file=sys.stdout, all_threads=True)
t = threading.Thread(target=dump_trace)
t.daemon = True
t.start()
import main
