const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express();


mongoose.connect("mongodb://localhost:27017/myUrlShortener");

const { UrlModel } = require('./models/urlshort') // Here we are importing the package that we created
// as urlshort.js

app.set("name", "Shankar") // Here we can set any value in express to use it later

// Middle Ware

app.use(express.static('public'));
app.set('view engine', 'ejs'); // EJS is a package to render HTML directly from JS
app.use(bodyParser.urlencoded({ extended: true })) // What this does it that it acts as a middleware
// to parse only url data


app.get('/', function (req, res) {

    let allUrl = UrlModel.find(function (err, result) {


        res.render('home', {
            urlResult: result

        })
    })

})

app.post('/create', function (req, res) {
    //console.log(req.body.longurl) 

    //console.log(generateUrl()); Just to check if it is working
    // Create a short URl


    let urlShort = new UrlModel({
        longUrl: req.body.longurl,
        shortUrl: generateUrl()
    })

    urlShort.save(function (err, data) {
        if (err) throw err;
        //console.log(data);
        res.redirect('/'); // We want to come back to home page after it is done

    })

});



// res.send() is server side rendering

// REST api is done in client side rendering 
app.get('/name', function (req, res) {
    res.send(app.get('name')) // I'm getting the value by simply using app.get()
    // method
})




app.get('/about', function (req, res) {
    res.send("<h1>About us page </h1>")
})

app.get('/:urlId', function (req, res) {
    UrlModel.findOne({ shortUrl: req.params.urlId }, function (err, data) { // WE need to update the data for the counter
        if (err) throw err;

        UrlModel.findByIdAndUpdate({ _id: data.id }, { $inc: { clickCount: 1 } }, function (err, updatedData) {
            if (err) throw err;
            res.redirect(data.longUrl) // If no error redirect to the actual URL
        })

    })
})

app.get('/delete/:id',function(req,res){
    UrlModel.findByIdAndDelete({_id:req.params.id},function(err,deleteData){
        if(err) throw err;
        res.redirect('/')
    })
})

app.listen(3000, function () {
    console.log("Port is running at 3000")
})

function generateUrl() {
    var rndResult = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    var charactersLength = characters.length;

    for (var i = 0; i < 5; i++) {
        rndResult += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    console.log(rndResult)
    return rndResult

}