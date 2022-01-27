const express = require("express");
const app = express();
const cors = require("cors");
const mongodb = require("mongodb")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoClient = mongodb.MongoClient;
const URL = "mongodb+srv://Narendraprasath12:<Narendraprasath12>@cluster0.ymho1.mongodb.net?retryWrites=true&w=majority"
const secret = "jGa3BhjuS2Msg"
app.use(express.json());
app.use(cors({
    origin: "*",
}))

let authenticate = function (req, res, next) {
    if (req.headers.authorization) {
        try {
            let result = jwt.verify(req.headers.authorization, secret);
            next();
        } catch (error) {
            res.status(401).json({ message: "Token Invalid" })
        }
    } else {
        res.status(401).json({ message: "Not Authorized" })
    }
}



//user registeration
app.post("/register", async (req, res) => {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("ticket-booking-app");

        //Password encrypt
        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(req.body.password, salt);
        req.body.password = hash;
        await db.collection("userData").insertOne(req.body)
        await connection.close();
        res.json({ message: "user created!!" })
    } catch (error) {
        console.log(error)
    }
})

//user login

app.post("/login", async (req, res) => {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("ticket-booking-app");
        let user = await db.collection("userData").findOne({ email: req.body.email })
        if (user) {
            let passwordResult = await bcrypt.compare(req.body.password, user.password)
            if (passwordResult) {
                let token = jwt.sign({ userid: user._id }, secret, { expiresIn: "1h" });
                res.json({ token })
            } else {
                res.status(401).json({ message: "Email Id or Password did not match" })
            }
        } else {
            res.status(401).json({ message: "Email Id or Password did not match" })
        }
    } catch (error) {
        console.log(error)
    }
})

//userdashboard
app.get("/userdashboard", authenticate, function (req, res) {
    res.json({ authorization : "successful" })
})

//Threater apis for admin

//get all theaters
app.get("/theaters", async (req, res) => {
    try {
        let connection = await mongoClient.connect(URL)

        let db = connection.db("ticket-booking-app")
        let users = await db.collection("theaters").find({}).toArray()
        await connection.close();
        res.json(users)
    } catch (error) {
        console.log(error)
    }

})

//get a single theater
app.get("/theaters/:id", async function (req, res) {

    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("ticket-booking-app");
        let objId = mongodb.ObjectId(req.params.id)
        let user = await db.collection("theaters").findOne({ _id: objId })
        await connection.close()
        if (user) {
            res.json(user)
        } else {
            res.status(401).json({ message: "User Not Found" })
        }
    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong" })
    }
})

// create a theater
app.post("/create-theaters", async (req, res) => {

    try {
        let connection = await mongoClient.connect(URL)
        let db = connection.db("ticket-booking-app")
        await db.collection("theaters").insertOne(req.body)
        await connection.close();
        res.json({ message: "user added" })
    } catch (error) {
        console.log(error)
    }
})

//update theaters

app.put("/theaters/:id",async function (req,res){
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("ticket-booking-app");
        let objId = mongodb.ObjectId(req.params.id)
        await db.collection("theaters").updateOne({_id : objId},{$set : req.body})
        await connection.close()
        res.json({message : "user updated"})
    } catch (error) {
        console.log(error)
    }
})

//delete theaters
app.delete("/theaters/:id", async function (req, res) {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("ticket-booking-app");
        let objId = mongodb.ObjectId(req.params.id)
        await db.collection("theaters").deleteOne({ _id: objId })
        await connection.close();
        res.json({ message: "User Deleted" })
    } catch (error) {
        console.log(error)
    }
});


//Movie apis for admin

//get all movies
app.get("/movies", async (req, res) => {
    try {
        let connection = await mongoClient.connect(URL)

        let db = connection.db("ticket-booking-app")
        let users = await db.collection("movies").find({}).toArray()
        await connection.close();
        res.json(users)
    } catch (error) {
        console.log(error)
    }

})

//get a single movie
app.get("/movies/:id", async function (req, res) {

    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("ticket-booking-app");
        let objId = mongodb.ObjectId(req.params.id)
        let user = await db.collection("movies").findOne({ _id: objId })
        await connection.close()
        if (user) {
            res.json(user)
        } else {
            res.status(401).json({ message: "User Not Found" })
        }
    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong" })
    }
})

// create a movies
app.post("/create-movies", async (req, res) => {

    try {
        let connection = await mongoClient.connect(URL)  
        let db = connection.db("ticket-booking-app")  
        await db.collection("movies").insertOne(req.body)
        await connection.close();
        res.json({ message: "user added" })
    } catch (error) {
        console.log(error)
    }
})

//update movies

app.put("/movies/:id",async function (req,res){
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("ticket-booking-app");
        let objId = mongodb.ObjectId(req.params.id)
        await db.collection("movies").updateOne({_id : objId},{$set : req.body})
        await connection.close()
        res.json({message : "user updated"})
    } catch (error) {
        console.log(error)
    }
})

//delete movies
app.delete("/movies/:id", async function (req, res) {
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("ticket-booking-app");
        let objId = mongodb.ObjectId(req.params.id)
        await db.collection("movies").deleteOne({ _id: objId })
        await connection.close();
        res.json({ message: "User Deleted" })
    } catch (error) {
        console.log(error)
    }
});



app.listen(process.env.PORT || 3000)
