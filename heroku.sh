#!/bin/bash
gunicorn server:app --daemon
python worker.py