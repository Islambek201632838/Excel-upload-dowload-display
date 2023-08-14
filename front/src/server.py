from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:5173",  # Add your frontend URL here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


# Serve the static files (Excel files)
app.mount("/files", StaticFiles(directory="files"), name="files")

uploaded_files = []


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = f"files/{file.filename}"
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
    uploaded_files.append(file.filename)
    return {"filename": file.filename}



@app.get("/files")
def get_files(option: str, year: int, month: int):
    filename = f"{option}_{year}-{month:02d}.xlsx"
    filepath = Path(f"files/{filename}")

    if not filepath.exists():
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(filepath, filename=filename, media_type="application/vnd.ms-excel")


    # filtered_files = filter_files(option, period)
    # return {"files": filtered_files}

# def filter_files(option: str, period: str):
#     print(option, period)
#     # Implement logic to filter files based on the selected option and period
#     filtered_files = []
#     for file in uploaded_files:
#         if option in file and period in file:
#             filtered_files.append(file)
#     return filtered_files


@app.get("/download/{filename}")
def download_file(filename: str):
    file_path = f"files/{filename}"
    return FileResponse(file_path, filename=filename)


if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=23231, reload=True)
