FROM python:3.12-slim
LABEL org.opencontainers.image.source=https://github.com/FABKoblenz/fab-app
LABEL org.opencontainers.image.description="Container Image for the Billard Team FAB Koblenz e.V. REST API"
LABEL org.opencontainers.image.licenses=MIT

RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install --no-install-recommends -y \
      libglib2.0-0 \
      libpango-1.0-0 \
      libpangoft2-1.0-0 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /code

COPY ./requirements.txt ./requirements.txt

RUN pip install --no-cache-dir --upgrade -r ./requirements.txt

COPY . .

CMD ["fastapi", "run", "main.py", "--port", "80", "--proxy-headers"]

