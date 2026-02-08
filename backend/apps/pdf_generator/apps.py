from django.apps import AppConfig


class PdfGeneratorConfig(AppConfig):
    """Configuration for the PDF generator app."""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.pdf_generator'
    verbose_name = 'PDF Generator'
