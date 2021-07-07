const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Url = require("./models/url")
require('dotenv').config();


const app = express();

// Middlewares
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())




// connecting to db
mongoose.connect(process.env.DB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true
}).then(response => console.log('db connected successfully...'))
  .catch(err => console.log(err));




app.get('/', async (req, res) => {
	try {
		const url = await Url.find().sort({"clicks":-1})
		res.render("index", {results : url})
	} catch(err) { console.log(err) }

})


/*
try {
} catch(err) { console.log(err) }

*/

app.post('/short', async (req, res) => {
	try {
		const { full_url } = req.body;
		const NewShortUrl = await Url.create({ full_url })
		await NewShortUrl.save()
		res.redirect("/")
	} catch(err) { console.log(err) }
})


app.get('/:slug', async (req, res) => {
	try {
		const url = await Url.findOne({ slug : req.params.slug })
		if (url == null) {
			res.sendStatus(404)
		}
		  await url.clicks++
		  await url.save()
		  res.redirect(url.full_url)

	} catch(err) { console.log(err) }
})




const port = process.env.PORT || 5000
app.listen(port, () => {
	try {
 		console.log(`Server running on ${port}`)
	}
	catch(err) { console.log("\n\n\n the error fro port : \n\n",err,"\n\n\n the error fro port : ") } 
})