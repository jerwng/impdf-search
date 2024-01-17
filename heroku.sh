#!/bin/bash
cd backend
gunicorn server:app --daemon
python worker.py