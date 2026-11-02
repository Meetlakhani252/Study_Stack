import pdfplumber

class PDFParser:
    def parse_pdf_bytes(self, pdf_bytes: bytes) -> str:
        """Extracts text from PDF bytes."""
        import io
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            text = "\n".join([page.extract_text() for page in pdf.pages if page.extract_text()])
        return text.strip()

    def parse_pdf(self, file_path: str) -> str:
        """Extracts text from a PDF file path."""
        with pdfplumber.open(file_path) as pdf:
            text = "\n".join([page.extract_text() for page in pdf.pages if page.extract_text()])
        return text.strip()
