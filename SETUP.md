# Installation and Deployment

## Install and Running Locally

#### Front End

- Change directory to `frontend`

##### Create `.env` for Environment Variables

```
REACT_APP_API_URL=http://localhost:5001
```

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

##### Create `.env` for Environment Variables

```
AWS_ACCESS_KEY_ID=(secret)
AWS_SECRET_ACCESS_KEY= (secret)
REDIS_URL=redis://localhost:6379
HEROKU_ENV=False
```

- Add `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
  - See [AWS S3](#aws-s3) Section
- Add `REDIS_URL=redis://localhost:6379`
  - See [Starting Redis Server](#starting-redis-server) and verify correct port
- Add `HEROKU_ENV=False`
  - This environment variable is only used on Heroku environment, where it is necessary to update Tesseract path.

##### Create `.flaskenv` for Flask Configuration

```
FLASK_APP=server.py
FLASK_DEBUG=True
FLASK_RUN_HOST=localhost
FLASK_RUN_PORT=5001
```

##### Starting Redis Server

- In new terminal window (venv), cd to `backend`
- Start Redis server: `redis-server`

##### Starting Flask Server

- In new terminal window (venv), cd to `backend`
- Start Flask: `flask run`

##### Starting Redis Worker

- In new terminal window (venv), cd to `backend`
- Start worker:
  ```
  export OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES
  python worker.py
  ```
- On macOS, `export OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES` is required to [bypass fork error with Redis and `rq` ](https://github.com/rq/rq/issues/1418).
- Note this environment variable is required before starting `worker.py`. Including this in `.env` and calling `load_dotenv()` will not resolve the issue.

## Deployment

#### AWS S3

- Create bucket with name `impdf-searcher`

#### Render

- Host React application with Render
- Create a new Static Site
  - Set root directory to `frontend`
  - Set build command to `npm run build`
  - Set publish directory to `build`
  - Add `REACT_APP_API_URL` environment variable to server API URL
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
      - Flag for Heroku Environment, used to indicate updating Tesseract path is required
    - `TESSERACT_PATH: /app/.apt/usr/bin/tesseract`
      - Updates installed Tesseract path on Heroku
  - Add addon - Heroku Data for Redis:
    - Automatically adds `REDIS_URL` and `REDIS_TLS_URL` config vars
  - Deploy `main` branch
