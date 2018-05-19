FROM python:2.7
ENV PYTHONUNBUFFERED 1

WORKDIR /techbikers
COPY requirements.txt ./
COPY requirements-dev.txt ./
RUN pip install -r requirements.txt && pip install -r requirements-dev.txt

COPY . /techbikers/
