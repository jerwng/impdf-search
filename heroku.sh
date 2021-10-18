#!/bin/bash
gunicorn server:app 00daemon
python worker.py