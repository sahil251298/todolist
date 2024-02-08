from fastapi import FastAPI, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson import ObjectId
from fastapi.responses import JSONResponse

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()




# Initialize FastAPI app
app = FastAPI()

# Setup CORS
origins = [
    "http://localhost",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# MongoDB Atlas connection string
connection_string = os.getenv("MONGO_URI")

# Connect to the MongoDB Atlas cluster
client = MongoClient(connection_string)
print("Connected")
db = client.todolist_db
collection = db.todolist







# Route to get all records
@app.get("/getItems", response_model=list)
async def get_records():
    try:
        records = list(collection.find())
        for record in records:
            record['_id'] = str(record['_id'])
        return records
    except Exception:
        print(Exception)
        raise HTTPException(status_code=500, detail="Internal error")




@app.post("/addItem")
async def add_item(item: str = Form(...)):

    if(item is None or item==''):
        return JSONResponse(status_code=400, content={"message": "Missing parameter"})

    result = collection.insert_one({"item": item})
    
    # Check if the insertion was successful
    if result.inserted_id:
        return {"message": "Item added successfully"}
    else:
        raise HTTPException(status_code=500, detail="Item could not be added")
    

@app.post("/updateItem")
async def update_item(id: str = Form(...),item: str = Form(...)):
    try:
        object_id = ObjectId(id)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid ID format")

    # Find the document with the specified ID in the MongoDB collection
    result = collection.update_one({"_id": object_id}, {"$set": {"item": item}})

    # Check if the update was successful
    if result.matched_count == 1 and result.modified_count == 1:
        return {"message": "Item modified successfully"}
    else:
        raise HTTPException(status_code=404, detail="Item not found or could not be modified")
    
@app.post("/deleteItem")
async def update_item(id: str = Form(...)):
    try:
        object_id = ObjectId(id)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid ID format")
    # Find the document with the specified ID in the MongoDB collection and delete it
    result = collection.delete_one({"_id": object_id})

    # Check if the deletion was successful
    if result.deleted_count == 1:
        return {"message": "Item deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Item not found or could not be deleted")



