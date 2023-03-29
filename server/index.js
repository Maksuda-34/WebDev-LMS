import express from 'express';
import mysql from 'mysql2';
import cors from "cors";


const app = express();

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "5391@*makU",
    database: "lms"
})

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json("hello from server");
})

app.get("/books", (req, res) => {
    const q = "SELECT * FROM books";
    db.query(q, (err,data)=> {
        if (err) return res.json(err)
        return res.json(data);

    }) 
})

app.post("/books", (req, res) => {
    const q = "INSERT INTO books(`title`,`desc`,`copies`,`cover`,`status`) VALUES(?)"
    const values = [
        req.body.title,
        req.body.desc,
        req.body.copies,
        req.body.cover,
        req.body.status
    ];

    db.query(q, [values],(err,data)=>{
        if (err) return res.json(err)
        return res.json("Book has been created successfully"); 
    });
});

app.delete("/books/:id", (req, res) => {
    const bookId = req.params.id;
    const q = " DELETE FROM books WHERE id = ? ";
  
    db.query(q, [bookId], (err, data) => {
      if (err) return res.send(err);
      return res.json(data);
    });
  });
app.listen(5000, ()=>{
    console.log("Connected to the server");
})