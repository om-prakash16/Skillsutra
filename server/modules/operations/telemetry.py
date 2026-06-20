from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor, ConsoleSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
# from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor
from fastapi import FastAPI
import os

def setup_telemetry(app: FastAPI):
    """
    Bootstraps OpenTelemetry distributed tracing across the platform.
    """
    # 1. Set the tracer provider
    provider = TracerProvider()
    
    # 2. Configure Exporter
    # In production, swap ConsoleSpanExporter with OTLPSpanExporter 
    # to send metrics to Datadog, Jaeger, or New Relic.
    exporter = ConsoleSpanExporter()
    if os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT"):
        # e.g., from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
        # exporter = OTLPSpanExporter()
        pass
        
    processor = BatchSpanProcessor(exporter)
    provider.add_span_processor(processor)
    trace.set_tracer_provider(provider)

    # 3. Instrument the FastAPI App
    FastAPIInstrumentor.instrument_app(app)
    
    # 4. Instrument SQLAlchemy (engine needs to be passed)
    # SQLAlchemyInstrumentor().instrument(engine=your_engine)
    
    # 5. Instrument Celery (usually done in the celery worker init)
    # from opentelemetry.instrumentation.celery import CeleryInstrumentor
    # CeleryInstrumentor().instrument()

    return provider
