FROM python:3.12-slim
LABEL org.opencontainers.image.source=https://github.com/FABKoblenz/fab-app
LABEL org.opencontainers.image.description="Container Image for the Billard Team FAB Koblenz e.V. REST API"
LABEL org.opencontainers.image.licenses=MIT

WORKDIR /code

COPY ./requirements.txt ./requirements.txt

RUN pip install --no-cache-dir --upgrade -r ./requirements.txt

COPY . .

CMD ["fastapi", "run", "main.py", "--port", "80", "--proxy-headers"]

