FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt \
    --extra-index-url https://download.pytorch.org/whl/cpu

COPY app ./app

ENV HOST=0.0.0.0
ENV PORT=8090
ENV OMP_NUM_THREADS=1
ENV MKL_NUM_THREADS=1
ENV OPENBLAS_NUM_THREADS=1
ENV NUMEXPR_NUM_THREADS=1
ENV TOKENIZERS_PARALLELISM=false
ENV SKIP_LANGUAGE_CHART=true
EXPOSE 8090

# Shell form: Render injects PORT; lazy ML load lets the process bind before Torch RAM spikes.
CMD exec python -m uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8090}"
