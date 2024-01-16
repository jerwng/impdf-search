import os
import redis

from rq import Worker, Queue, Connection

# This is to disable fork issue with rq and macOS
# Bypass this check to prevent enqueue calls from being blocked
# https://github.com/rq/rq/issues/1418
# os.environ['OBJC_DISABLE_INITIALIZE_FORK_SAFETY'] = 'YES'

listen = ['default']

conn = redis.from_url(os.environ.get("REDIS_URL"))

if __name__ == "__main__":
    with Connection(conn):
        worker = Worker(list(map(Queue, listen)))
        worker.work()
