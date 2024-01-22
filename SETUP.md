# Installation and Deployment

## Install and Running Locally

Change branch to `dev`

#### Front End

- Change directory to `frontend`

##### Installing Front End Packages

- With `npm`, run `npm install` to install the required packages

##### Starting React Application

- Start application with `npm start`

#### Back End

- Change directory to `backend`

##### Installing Back End Packages

- Create a Python virtual environment (if required): `python3 -m venv venv`
- Start the virtual environment: `source venv/bin/activate`
- With `pip`, run `pip install -r '../requirements.txt'` to install the required packages

##### Starting Redis Server

- In new terminal window (venv), cd to `backend`
- Start Redis server: `redis-server`
- If running on macOS, add `export OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES` to `.env` to bypass fork error with `rq`

##### Starting Flask Server

- In new terminal window (venv), cd to `backend`
- Add `HEROKU_ENV=False` to `.env`
  - This environment variable is only used on Heroku environment, where it is necessary to update Tesseract path.
- Start Flask: `flask run`

##### Starting Redis Worker

- In new terminal window (venv), cd to `backend`
- Start worker: `python worker.py`

## Deployment

#### AWS S3

- Create bucket with name `impdf-searcher`
- Add `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` environment variables to `.env`

#### Render

- Host React application with Render
- Create a new Static Site
  - Set root directory to `frontend`
  - Set build command to `npm run build`
  - Set publish directory to `build`
  - Deploy `main` branch

#### Heroku

- Host Flask and Redis worker on Heroku
- Create a new Heroku application
  - Choose deploy from GitHub and link GitHub repo
  - Add buildpacks:
    - heroku/python
    - [heroku-buildpack-apt](https://github.com/heroku/heroku-buildpack-apt)
  - Add Config vars:
    - `AWS_ACCESS_KEY_ID`
    - `AWS_SECRET_ACCESS_KEY`
    - `TESSDATA_PREFIX: ../.apt/usr/share/tesseract-ocr/4.00/tessdata`
      - Note `../`. Directory is changed to `backend` by `heroku.sh`. The `.apt` folder is located in the root directory.
    - `HEROKU_ENV: True`
      - Updates Tesseract path to correct location when on Heroku Environment
  - Add addon - Heroku Data for Redis:
    - Automatically adds `REDIS_URL` and `REDIS_TLS_URL` config vars
  - Deploy `main` branch
