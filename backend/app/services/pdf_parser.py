import pdfplumber

class PDFParser:
    def parse_pdf(self, file_path: str) -> str:
        with pdfplumber.open(file_path) as pdf:
            text = "\n".join([page.extract_text() for page in pdf.pages if page.extract_text()])
        return text
