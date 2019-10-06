const express = require("express");
const sqlite3 = require("sqlite3");
const app = express();
const body = require("body-parser");
app.use(express.json());
app.use(body.json());



let db = new sqlite3.Database("saraldb",(err)=>{
    if (err) {console.log(err)}
    else{
        console.log("database created")

    }
})
//============================================================================================================

db.run("create table if not exists course(id integer primary key autoincrement, name text, decription text)",(err)=>{
    if (err) {console.log(err)}
    else{
        console.log("table created")
    }
})
//=================================================================================================




app.get('/allcourses',(req,res)=>{
    db.all('select * from course',(err,data)=>{
        if(err) {console.log(err,"errom is coming in your data")}
        else{
            console.log("data fecthed!")
            res.send(data)
        }
    })
})

//==================================================================================================================================
app.get('/course/:id',(req,res)=>{
    var id = req.params.id
    db.all("select * from course where id = "+id+"",(err,data)=>{
        if (err) {console.log(err,"your get method is not sucessful")}
        else{
            console.log("sucess ful")
            res.send(data)
        }
    })
})
//============================================================================================================

app.get('/course/:id/exersices',(req,res)=>{
    let courseId = req.params.id
    db.all(`select * from exercise${courseId}`,(err,data)=>{
        if(err) {console.log(err),"your get method not working"}
        else{
            console.log("working")
            res.send(data)
        }
    })
})
app.get('/course/:cid/exersices/:exId',(req,res)=>{
    let exId = req.params.exId
    let courseId = req.params.cid

    db.all(`select * from exercise${courseId} where id = ${exId}`,(err,data)=>{
        if(err) {console.log(err,"your get method is failed!")}
        else{
            console.log("data fetched!")
            res.send(data)
        }
    })
})

//========================================================================================


app.get('/courses/:cid/exercises/:exid/submissions',(req,res)=>{
    let exid = req.params.exid
    let courseId = req.params.cid
    db.all(`select * from submissions${courseId}_${exid}`,(err,data)=>{
        if (err) console.log(err)
        else{
            console.log("data fatched")
            res.send(data)
        }
    })
})


//==========================================================================================================


app.post('/createcourse',(req,res)=>{
    var dict = req.body;
    db.run('insert into course(name, decription) values("'+dict.name+'","'+dict.decription+'")',(err)=>{
        if(err) {console.log(err,"your post method failed!")}
        else{
            console.log("data fected!")
            res.send("post successful")
        }
    })
})

//=============================================================================================================



app.post("/course/:id/exercise",(req,res)=>{
    let courseId=req.params.id;
    db.run(`create table if not exists exercise${courseId} (id integer primary key autoincrement,courseId integer, name text,content text,hint text)`,(err)=>{
        if (err) console.log(err)
        else{
            console.log(`table exercise${courseId} successful`)
            db.run(`insert into  exercise${courseId} (courseId,name,content,hint) values(${courseId},"${req.body.name}","${req.body.content}","${req.body.hint}")`,(err)=>{
                if (err) console.log(err)
                else {
                    console.log("exersise insert successful")
                    res.send("success!")
                }
            })
        }
    })
})
//==
app.post('/courses/:cid/exercises/:exid/submissions',(req,res)=>{
    let exid = req.params.exid
    let courseId = req.params.cid

    db.run(`create table if not exists submissions${courseId}_${exid}(id integer primary key autoincrement,courseId integer,exerciseId integer,content text,username text)`,(err)=>{
        if(err) {console.log(err,"not working!")}
        else{
            console.log("create summison table")
            db.run(`insert into submissions${courseId}_${exid} (courseId,exerciseId,content,username) values(${courseId},${exid},"${req.body.content}","${req.body.username}")`,(err)=>{
                if (err) console.log(err)
                else {
                    console.log("submission put seccessful")
                    res.send("Success!")
                }
            })
        }

    })
})

app.put('/editcourse',(req,res)=>{
    db.run(`update course set name = "${req.body.name}",decription = "${req.body.decription}"`,(err,data)=>{
        if(err) {console.log(err)}
        else{
            console.log("working")
            res.send(data)
        }
    })
})

app.put('/course/:cid/exersices/:exId',(req,res)=>{
    let courseId = req.params.cid
    let exId = req.params.exId
    db.run(`update exercise${courseId} set name = "${req.body.name}",content = "${req.body.content}",hint = "${req.body.hint}" where id = ${exId}`,(err)=>{
        if(err) {console.log(err,"err is coming")}
        else{
            console.log("data update")
            res.send("sucessful")

        }
    })

})





//=========================================================================

var server = app.listen(4000,()=>{
    console.log(`your app is listening at ${server.address().port}`);
})

