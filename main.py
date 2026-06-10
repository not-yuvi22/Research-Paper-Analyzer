from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uuid
import os
#import shutil
from pypdf import PdfReader
from fastapi.responses import FileResponse
import logging





#LOGGING
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("server.log"),     #saves logs permanently to this file
        logging.StreamHandler()                #still prints logs live to terminal
    ]
)
logger= logging.getLogger("PaperAI")

app = FastAPI(
    title="Academic Paper AI Processor Backend",
    description="""
    This is an API backend designed to process academic papers and reports and similar files.
    This system allows users to safely upload PDFs, automatically parse and extract raw text contents,
    and retrieve files seamlessly using safe, collision-free identification structures.
    """,
    version="1.0.0",
    contact={
        "name" : "BACKEND DEVELOPER SUPPORT",
    }
)


@app.get("/")
def home():
    return {
        "status": "Backend Running",
        "service": "Academic Paper AI Processor"
    }

# Enable CORS so your frontend friend can connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins during local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


#storage structure setup
BASE_STORAGE_DIR = os.path.join(os.getcwd(), "storage")
UPLOAD_DIR = os.path.join(BASE_STORAGE_DIR, "uploaded_papers")
#automatically create the directory on server if they do not exist
os.makedirs(UPLOAD_DIR, exist_ok=True)

#defining constants for validation
MAX_FILE_SIZE = 10*1024*1024    #10MB in bytes


def extract_text_from_pdf(pdf_path: str) -> str:
   # """Opens a saved PDF file path, extracts all readable text, and returns it."""
    try:
        # Initialize the PDF reader with the file path
        reader = PdfReader(pdf_path)
        extracted_text = ""
        
        # Loop through every single page in the PDF and extract its text
        for page in reader.pages:
            text = page.extract_text()
            if text:  # Ensure the page actually contains readable text
                extracted_text += text + "\n"
        
        # Clean up any trailing whitespace or empty gaps
        return extracted_text.strip()
        
    except Exception as e:
        logger.error(f"Pypdf library failed parsing file {pdf_path}: {str(e)}")
        # If the file is corrupted or unreadable, raise an error
        raise ValueError("The PDF file structure appears corrupted or unreadable.")

  #  extracted_text = "This is dummy test extracted from a new file"
  #  return extracted_text

#UPLOAD_DIR = "uploaded_papers"
#if not os.path.exists(UPLOAD_DIR):
#   os.makedirs(UPLOAD_DIR)

@app.post("/upload-paper/",
    tags=["PAPER MANAGEMENT"],
    summary="Upload and securely parse a PDF file",
    response_description="A structural breakdown of the saved file and initial extraction metrics.")

async def upload_file(file: UploadFile = File(...)):
    """
    Upload an academic paper, report or similar PDF.
    this endpoint serves the following purposes:
    - **Validates** that the incoming file extension is strictly '.pdf'
    - Generates a **unique UUID string identifier** ('paper_id') to prevent a name collisions.
    - Streams the file chunks into a dedicated server directory ('/storage/uploaded_papers/').
    - Loops through the PDF layout to capture raw text and count characters.
    """
    logger.info(f"Received upload request for file: {file.filename}")

    # 1. Validation: Ensure the user is actually uploading a PDF
    if not file.filename.endswith('.pdf'):
        logger.warning(f"Rejected upload: File '{file.filename}' is not a PDF.")
        raise HTTPException(status_code=400, detail="Validation Failed: Only standard PDF files are allowed.")
    
    # 2. Generate a unique ID for this paper session
    paper_id = str(uuid.uuid4())
    
    # 3. Create a clean, unique file name to save inside your folder
    # Example: uploaded_papers/a1b2c3d4_sample.pdf
    secure_filename = f"{paper_id}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, secure_filename)
    
    try:
        #Validation rule 2: dynamic file size inspection
        #this reads chunks of the file stream to verify size without overloading the RAM
        file_size = 0
        # 4. File Handling: Open a new blank file on your hard drive in 'write-binary' (wb) mode
        with open(file_path, "wb") as buffer:
            while chunk := await file.read(1024*64):       #that is read in 64KB chunks
                file_size += len(chunk)
                if file_size > MAX_FILE_SIZE:
                    logger.warning(f"Rejected upload: '{file.filename}' exceeded size limit.")
                    raise HTTPException(status_code=413,
                        detail=f"Validation Failed: File exceeds the maximum allowed limit of {MAX_FILE_SIZE//(1024*1024)}MB.")
                buffer.write(chunk)
            # shutil.copyfileobj takes the incoming file stream from the frontend 
            # and pipes it directly into our open hard drive file buffer
           # shutil.copyfileobj(file.file, buffer)
            
        # 5. Extract text from the newly saved permanent file
        final_extracted_text = extract_text_from_pdf(file_path)
        text_length = len(final_extracted_text)

        logger.info(f"Successfully processed paper {paper_id}. Total characters extracted: {text_length}")
        
        # Note: We are NOT deleting the file today! 
        # Keeping it saved in 'uploaded_papers' means your AI teammate can access it later.

        return {
            "paper_id": paper_id,
            "filename": file.filename,
            "status": "Successfully Uploaded, Parsed and Validated.",
            "characters_extracted": text_length,
            "saved_at": True #file_path
        }
    
    except HTTPException as http_ex:
        #if it was an intentional validation rejection, clean up the file and re-raise it
        if os.path.exists(file_path):
            os.remove(file_path)
        raise http_ex
        
    except Exception as e:
        # Clean up and delete the broken file if the saving process crashes halfway
        if os.path.exists(file_path):
            os.remove(file_path)

        #Log the complete error stack trace on the server backend side
        logger.critical(f"Unexpected system crash during upload processing: {str(e)}", exc_info=True)
        #present a clean, secure error message to the user without leaking code tracebacks
        raise HTTPException(status_code=500, detail="A secure server-side error occurred while saving this paper. Please try again later.")




# 3. FILE DOWNLOAD / RETRIEVAL ROUTE
# ==========================================
@app.get("/download-paper/{paper_id}", tags=["Paper Management"], summary="Retrieve and download a saved pdf by its ID",
         response_description="Streams the raw binary PDF file back to the browser.")
async def download_file(paper_id: str):
    """
    Locate and download a previously uploaded PDF using its unique 'paper_id'.
    - **Path Parameter Requirement:** You must pass a 36-character UUID string.
    - **Behaviour:** Scans the local server disk directory. If a fiel match starting with the matching ID is located, it strips the internal tracking prefix and downloads the file back under its authentic clean name.
    - **Error Handling:** Returns a '404 Not Found ' response if the ID doesnot match any file stored on disk.
    """
    logger.info(f"Retrieval request initiated for Paper ID: {paper_id}")

    #Validation rule 3: basic format sanitisation to prevent path traversal attacks
    if "../" in paper_id or "/" in paper_id:
        logger.error(f"Malicious path traversal attempted via paper_id: {paper_id}")
        raise HTTPException(
            status_code=400, detail="Malicious imput format detected."
        )
 #   Locates the saved PDF file on the server using its unique paper_id 
  #  and streams it back to the user's computer as a download.
    
    # 1. Scan your storage directory to find a file that starts with this paper_id
    target_filename = None
    try:
        for filename in os.listdir(UPLOAD_DIR):
            if filename.startswith(paper_id):
                target_filename = filename
                break
    except Exception as disk_err:
        logger.error(f"Failed to scan storage directory: {str(disk_err)}")
        raise HTTPException(status_code=500, detail="Internal file registry unreadable.")
    
    # 2. If no file matches that ID, raise a 404 error
    if not target_filename:
        logger.warning(f"Retrieval failed: Paper ID {paper_id} does not exist.")
        raise HTTPException(status_code=404, detail="The requested Paper ID was not loacated on this server.")
        
    # 3. Reconstruct the absolute path to that specific file
    file_path = os.path.join(UPLOAD_DIR, target_filename)
    
    # 4. Extract the original filename (removing the uuid prefix) for the download presentation
    # Example: "uuid_EE GATE SYLLABUS.pdf" -> "EE GATE SYLLABUS.pdf"
    original_filename = target_filename.split("_", 1)[-1]

    logger.info(f"Streaming file download successful for: {original_filename}")
    
    # 5. Return the file stream
    return FileResponse(
        path=file_path, 
        filename=original_filename, 
        media_type="application/pdf"
    )

# 2. Summary Route (Mocked)
@app.get("/paper/{paper_id}/summary")
async def get_summary(paper_id: str):
    # Returning mock data so the frontend can design their UI blocks
    return {
        "paper_id": paper_id,
        "abstract": "This is a mock abstract summary of the research paper...",
        "key_findings": ["Finding A is significant", "Finding B relates to efficiency"],
        "limitations": "Small sample size used in experiments."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)