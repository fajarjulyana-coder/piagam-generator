# Overview

This is a Flask-based web application that generates customized award certificates (Piagam Penghargaan) for students at an Islamic boarding school (Pondok Pesantren). The application takes student information and administrator names through a web form, then overlays this data onto a pre-existing PDF certificate template to create personalized certificates. The primary purpose is to automate the certificate generation process for recognizing student achievements.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Problem**: Need a user-friendly interface for inputting student and administrator data for certificate generation.

**Solution**: Single-page web application using vanilla HTML/CSS/JavaScript with server-side rendering via Flask's Jinja2 templating engine.

**Key Components**:

- Simple HTML form (`templates/index.html`) collecting 5 data points: student name, class, rank, homeroom teacher name, and school principal name
- CSS styling with gradient backgrounds and responsive design (`static/css/style.css`)
- Client-side validation and UI feedback using vanilla JavaScript (`static/js/script.js`)

**Rationale**: Keeps the frontend simple and maintainable without requiring complex build tools or frameworks. Server-side rendering ensures compatibility and reduces client-side complexity.

## Backend Architecture

**Problem**: Process form data and generate personalized PDF certificates by overlaying text on a template.

**Solution**: Flask web framework with Python-based PDF manipulation libraries.

**Key Components**:

- Flask application (`app.py`) with two routes:
  - `GET /` - Serves the form interface
  - `POST /generate` - Processes form data and generates PDF
- Session management with secret key configuration
- PDF generation using ReportLab for text overlay
- PyPDF for PDF template manipulation
- PIL (Pillow) for image-based text rendering

**Architectural Pattern**: Simple request-response pattern without database persistence. Each request is stateless and generates a certificate on-demand.

**Rationale**: Flask provides lightweight routing and templating capabilities suitable for this focused use case. The application doesn't require user accounts, data persistence, or complex business logic, making a simple stateless architecture appropriate.

## PDF Generation Strategy

**Problem**: Need to overlay custom text onto a fixed PDF template while maintaining visual quality and proper font rendering.

**Solution**: Hybrid approach using PIL for text-to-image conversion and ReportLab/PyPDF for PDF composition.

**Key Components**:

- `create_text_image()` function: Converts text to transparent PNG images using custom fonts
- Custom font registration: LibreBaskerville and PinyonScript fonts for aesthetic certificate text
- Template-based generation: Uses pre-designed PDF template (`attached_assets/Kosongan Penghargaan_1761063218435.pdf`)

**Rationale**: Image-based text rendering provides better control over font rendering and positioning compared to direct PDF text overlay. This ensures consistent visual quality across different PDF viewers.

## Configuration Management

**Problem**: Secure storage of application secrets while supporting different environments.

**Solution**: Environment variable-based configuration with fallback defaults.

**Implementation**:

- Session secret key loaded from `SESSION_SECRET` environment variable with development fallback
- Separation of configuration from code for security and flexibility

**Rationale**: Follows twelve-factor app principles, allowing easy deployment to cloud platforms like vscode while maintaining security best practices.

# External Dependencies

## Core Framework

- **Flask**: Web framework providing routing, templating, and request handling

## PDF Processing Libraries

- **ReportLab**: PDF generation library used for creating canvas, managing fonts (TTFont), and handling page dimensions
- **PyPDF (formerly PyPDF2)**: PDF manipulation library for reading template PDFs and writing modified versions
  - `PdfReader`: Reads the certificate template
  - `PdfWriter`: Outputs the final customized certificate

## Image Processing

- **Pillow (PIL)**: Image manipulation library used for:
  - Creating transparent text images
  - Loading and working with custom TrueType fonts (ImageFont)
  - Drawing text with anti-aliasing (ImageDraw)
  - Converting images to format compatible with ReportLab (ImageReader)

## Font Assets

- **LibreBaskerville-Regular.ttf**: Professional serif font for formal certificate text
- **PinyonScript-Regular.ttf**: Script/calligraphy font for decorative elements

**Font Location**: `fonts/` directory (implied by code references)

## Static Template Assets

- **Certificate Template**: Pre-designed PDF template stored at `attached_assets/Kosongan Penghargaan_1761063218435.pdf`
- Serves as the base layout onto which personalized information is overlaid

## Runtime Environment

- **Python Standard Library**:
  - `os`: Environment variable access
  - `io.BytesIO`: In-memory binary streams for PDF generation
- No external database system currently in use
- No external API integrations
- No authentication/authorization services

## Deployment Considerations

- Application designed for vscode deployment (references vscode environment patterns)
- Stateless architecture allows horizontal scaling
- File-based template storage assumes templates are bundled with application code
