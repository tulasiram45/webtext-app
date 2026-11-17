FROM python:3.12-slim

LABEL maintainer="DevOps Engineer"
LABEL application="webtext-app"

ENV PYTHONUNBUFFERED=1
ENV WEBTEXT="Hello World!"

WORKDIR /app

COPY app/server.py /app/server.py

RUN useradd --no-create-home --shell /usr/sbin/nologin appuser

USER appuser

EXPOSE 80

CMD ["python", "/app/server.py"]
