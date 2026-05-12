import uvicorn

from app.config import get_settings
from app.main import app

if __name__ == "__main__":
    s = get_settings()
    uvicorn.run(app, host=s.host, port=s.port, reload=False)
