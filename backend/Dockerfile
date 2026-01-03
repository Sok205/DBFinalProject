FROM python:3.13-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    postgresql-client \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml ./
RUN pip install uv && \
    uv pip install --system -r pyproject.toml

COPY . .

RUN chmod +x /app/entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
