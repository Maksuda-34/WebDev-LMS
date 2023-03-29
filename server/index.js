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

//get all books
app.get("/books", (req, res) => {
    const q = "SELECT * FROM books";
    db.query(q, (err,data)=> {
        if (err) return res.json(err)
        return res.json(data);

    }) 
})

//insert a book
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

//delete books
app.delete("/books/:id", (req, res) => {
    const bookId = req.params.id;
    const q = " DELETE FROM books WHERE id = ? ";
  
    db.query(q, [bookId], (err, data) => {
      if (err) return res.send(err);
      return res.json(data);
    });
  });

//update book
app.put("/books/:id", (req, res) => {
    const bookId = req.params.id;
    const q = "UPDATE books SET `title`= ?, `desc`= ?, `copies`= ?, `cover`= ? ,`status`= ? WHERE id = ?";
  
    const values = [
      req.body.title,
      req.body.desc,
      req.body.copies,
      req.body.cover,
      req.body.status
    ];
  
    db.query(q, [...values,bookId], (err, data) => {
      if (err) return res.send(err);
      return res.json(data);
    });
  });

  app.get("/books", (req, res) => {
    const search = req.query.search;
    const filter = req.query.filter;

    let q = "SELECT * FROM books";

    const params = [];

    // Apply search filter
    if (search) {
        q += " WHERE title LIKE ? OR `desc` LIKE ?";
        params.push(`%${search}%`);
        params.push(`%${search}%`);
    }

    // Apply filter
    if (filter) {
        if (params.length === 0) {
            q += " WHERE";
        } else {
            q += " AND";
        }
        q += " status = ?";
        params.push(filter);
    }

    db.query(q, params, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.listen(5000, ()=>{
    console.log("Connected to the server");
})