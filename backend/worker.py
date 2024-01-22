import os
import redis

from dotenv import load_dotenv
from rq import Worker, Queue, Connection

load_dotenv()

listen = ['default']

conn = redis.from_url(os.getenv("REDIS_URL"))

if __name__ == "__main__":
    with Connection(conn):
        worker = Worker(list(map(Queue, listen)))
        worker.work()
