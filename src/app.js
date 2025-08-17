const http= require("http");

const app= http.createServer((req,res)=>{
    console.log("this is server ");
    res.end("Hello server");
});


app.listen(7777);