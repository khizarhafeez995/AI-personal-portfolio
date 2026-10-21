import os
import json
import time
from pathlib import Path

from fastapi import FastAPI
from dotenv import load_dotenv
from groq import Groq
from pydantic import BaseModel,Field
from pypdf import PdfReader
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

load_dotenv()
my_api_key = os.getenv("GROQ_API_KEY")

if not my_api_key:
    raise ValueError("api error")

client = Groq(api_key=my_api_key)
model="openai/gpt-oss-120b"

# make python code an application that runs on the browser
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Experience(BaseModel):
    company: str | None = None
    role: str | None = None
    duration: str | None = None
    description: str | None = None
    skills_used: list[str] = []

class Resume(BaseModel):
    name:str | None=None
    email:str | None=None
    phone:str | None=None
    
    total_experience_years : float | None
    
    skills: list[str] = []
    experiences: list[Experience] = []
    education: list[str] = []
    projects: list[str] = []
    certifications: list[str] = []
    
resume_schema = Resume.model_json_schema()

class ChatRequest(BaseModel):
    question:str

def ask_candidate(question:str, resume:Resume):
    system_prompt = f"""
    You are an AI interview assistant representing a job candidate.

    Here is the candidate's actual parsed resume:
    {resume.model_dump_json(indent=2)}

    Rules:
    1. Answer HR questions using the resume information.
    2. Never invent skills, experience, qualifications, or projects.
    3. You may explain the relevance of the candidate's actual
       experience, but do not present assumptions as facts.
    4. If the resume does not contain the answer, say:
       "I don't have enough information to answer that from
       the candidate's resume."
    5. Keep answers professional, natural, and suitable for an interview.
    6. Answer directly whenever relevant resume information is available.
    
    """
    
    response = client.chat.completions.create(
        model = model,
        messages = [
            {
                "role":"system",
                "content":system_prompt
            },
            {
                "role":"user",
                "content":question
            }
        ]
        )
    
    return response.choices[0].message.content
    

#parse resume
def parse_resume(resume_text):
    system_prompt=f"""
    You are an expert resume parser.
    
    Extract information from the resume based on its meaning, not only based on exact section headings.
    
    Different resumes may use different headings.
    For example:
    - Experience
    - Professional Experience
    - Work History
    - Employment
    - Internship
    
    These may all contain relevant experience.
    
    Skills may also appear in the skills section,work experience,internships or projects.
    
    Return only valid JSON matching this scehma:
    {resume_schema} 
    
    Important rules:

    1. Do not invent information.
    2. If a value is not available, return null.
    3. If a list has no information, return an empty list.
    4. Include internships inside experiences.
    5. Extract skills mentioned across the entire resume.
    """
    
    user_prompt=f"""
    Parse the following resume:
    {resume_text}
    """
    
    message_system = {
        "role":"system",
        "content":system_prompt
    }
    
    message_user = {
        "role":"user",
        "content":user_prompt
    }
    
    response_format={
            "type": "json_object"
    }
    
    messages=[message_system, message_user]

    response=client.chat.completions.create(model=model, messages=messages, response_format=response_format)
    
    raw_output = response.choices[0].message.content
    data = json.loads(raw_output)
    resume = Resume(**data)
    return resume  

#pdf extraction
def read_pdf(file_path: Path):
    reader = PdfReader(file_path)
    
    text = ""
    
    for page in reader.pages:
        page_text = page.extract_text()
        
        if page_text:
            text += page_text + "\n"
            
    return text

# get mn koi request ni ata , khusi sy kuch response de dety hai
@app.get("/")
def home():
    #resume_text = read_pdf(Path("Khizar_Hafeez_Resume.pdf"))
    #resume = parse_resume(resume_text)
    #print(resume.model_dump_json(indent=2))
    
    return{
        "message": "This is home page."
    }
    

@app.get("/download-resume")
def download_resume():
    resume_path = Path(__file__).resolve().parent / "Khizar_Hafeez_Resume.pdf"

    if not resume_path.exists():
        return {"error": "Resume PDF not found"}

    return FileResponse(
        path=resume_path,
        filename="Khizar_Hafeez_Resume.pdf",
        media_type="application/pdf"
    )


# chatgpt.com 
#post mn request ati hai, us request ka answer dety hai
@app.post("/chat")
def chat(request:ChatRequest):
    resume_text = read_pdf(Path("Khizar_Hafeez_Resume.pdf"))
    resume = parse_resume(resume_text)
    answer = ask_candidate(request.question, resume)
    return{
        "answer": answer
    }