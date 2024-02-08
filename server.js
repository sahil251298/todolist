import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const app = express();


// Enable CORS for all routes
app.use(cors());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

const db_client = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
  });

db_client.connect();

app.get('/getItems', async (req, res) => {
    try {
        const result = await db_client.query('SELECT * FROM items_without_users order by id');
        console.log("Success in reading")
        res.json(result.rows); 
      } catch (error) {
        console.error('Error executing database query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
  });

app.post("/addItem", async (req,res)=>{
    try{
        const item= req.body.item;
    if(!item){
        return res.status(400).send("Missing parameter");
    }
    const result=await db_client.query("insert into items_without_users(item) values($1)",[item]);
    console.log("Success  in adding");
    return res.status(201).send("Success");;
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post("/deleteItem", async (req,res)=>{
  const id=req.body.id;
  try{
    await  db_client.query("DELETE from items_without_users WHERE id=$1", [id])
    console.log("Success in deletion");
    return res.status(201).send("Successfully deleted")
  }
  catch(err){
    console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post("/updateItem",async (req,res)=>{
  const newItem=req.body.item;
  const id=req.body.id;
  if(!newItem||newItem.length==0){
    return res.status(400).send("Missing parameter");
}
  try{
    await db_client.query("Update  items_without_users set item=$1  WHERE id=$2", [newItem,id])
    console.log("Success in updating");
    return res.status(201).send("Successfully updated")
  }
  catch(err){
    console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
  }
});
const port = process.env.PORT||8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
