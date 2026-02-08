from fastapi import FastAPI, UploadFile, File, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import os
import base64
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Production: specify frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY") or "YOUR_NVIDIA_API_KEY_REDACTED"

# --- Models ---
class AnalysisRequest(BaseModel):
    imageUrl: str # For demo, we might use URL or base64
    prompt: str = "Describe the defect in this semiconductor wafer image. Identify anomalies like scratches or particles."

class RedactionRequest(BaseModel):
    text: str
    role: str # 'EQUIPMENT_ENG' or 'YIELD_ENG'

# --- Endpoints ---

@app.get("/")
def read_root():
    return {"status": "Agentic Backend Online", "services": ["Cosmos-2", "Safety-Guard"]}

# Global parsing of API Key to ensure it's loaded
print(f"Loaded API Key: {NVIDIA_API_KEY[:10]}...{NVIDIA_API_KEY[-5:] if NVIDIA_API_KEY else 'None'}")

if not NVIDIA_API_KEY:
    print("CRITICAL: NVIDIA_API_KEY is missing!")

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    import traceback
    error_msg = traceback.format_exc()
    print(f"GLOBAL ERROR: {error_msg}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error", "traceback": error_msg}
    )

from fastapi.responses import JSONResponse

@app.post("/analyze-image")
async def analyze_image(request: AnalysisRequest):
    # ... (Keep existing logic or simplified)
    return {"msg": "Analysis complete"}

@app.post("/redact-report")
async def redact_report(request: RedactionRequest):
    print(f"Received redaction request for role: {request.role}")
    
    if request.role == 'EQUIPMENT_ENG':
        return {"redacted_text": request.text, "actions": []}

    # Use the Integrate endpoint with Llama 3.1 70B
    invoke_url = "https://integrate.api.nvidia.com/v1/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {NVIDIA_API_KEY}",
        "Content-Type": "application/json",
    }
    
    prompt = f"""
    You are a Data Security Officer in a semiconductor fab.
    Redact any machine-specific parameters (Machine ID, pressure, flow rate, recipe names) from the following text.
    Replace redacted values with [REDACTED].
    
    IMPORTANT: 
    1. Do not change the structure or other words. 
    2. Only redact sensitive machine IDs, recipe names, and process numbers.
    3. DO NOT add any new markdown headers (like # or ##) or bold symbols if they were not in the original text.
    4. PRESERVE all original line breaks and indentation exactly as in the input text. Do not merge lines.
    
    Text:
    {request.text}
    """

    # Using the exact model name required by NVIDIA Integrate API
    # Some common aliases: "meta/llama-3.1-70b-instruct" or "nvidia/llama-3.1-nemotron-70b-instruct"
    # We will try the most standard one.
    payload = {
        "model": "meta/llama-3.1-70b-instruct",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.1,
        "max_tokens": 1024,
        "stream": False
    }

    print(f"Sending request to {invoke_url} with model {payload['model']}")

    async with httpx.AsyncClient(verify=False) as client: # verify=False to bypass SSL issues in corp environments
        try:
            response = await client.post(invoke_url, headers=headers, json=payload, timeout=60.0)
            
            if response.status_code != 200:
                error_body = response.text
                print(f"NVIDIA API Error ({response.status_code}): {error_body}")
                return JSONResponse(status_code=500, content={"detail": f"NVIDIA API Error {response.status_code}", "body": error_body})

            result = response.json()
            content = result['choices'][0]['message']['content']
            return {"redacted_text": content}
            
        except Exception as e:
            import traceback
            trace = traceback.format_exc()
            print(f"Backend Exception during API call: {trace}")
            return JSONResponse(status_code=500, content={"detail": str(e), "traceback": trace})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
