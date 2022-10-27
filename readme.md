Demo Django project, following the specifications in the document:

## Installation:
To set up this package, you may use the conda packages manager (https://www.anaconda.com/), to create a virtual environment for the project, with the commands:
``` [bash]
python -mvenv venv
source ./venv/bin/activate (on Linux) or & ./venv/Scripts/activate (on Windows)
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py collectstatic
python manage.py runserver 127.0.0.1:8000
```

## Execution:
If the conda virtual environment is not activated, you should activate it with the command:
`source ./venv/bin/activate` (on Linux) or `& ./venv/Scripts/activate` on Windows
Then spin up the web server with the command:
`python manage.py runserver 127.0.0.1:8000`

## Developing:
for developing you should install the developing dependencies in the virtual environment, like:
`source ./venv/bin/activate` (on Linux) or `& ./venv/Scripts/activate` on Windows
`pip install -r requirements.txt`
`pip install -r requirements_dev.txt`
Then, you do the required changes or addition. After finishing, before committing, execute:
`flake8; isort .; black .`
