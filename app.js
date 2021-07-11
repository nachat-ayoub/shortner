const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Url = require("./models/url");
const cookieParser = require('cookie-parser');
require('dotenv').config();


const app = express();

// Middlewares
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cookieParser());



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



app.get('/test', async (req, res) => {
	res.render("timer")
})

app.get('/test2', async (req, res) => {
	res.render("timer2")
})


app.post('/short', async (req, res) => {
	try {
		const { full_url } = req.body;
		const NewShortUrl = await Url.create({ full_url })
		await NewShortUrl.save()
		res.redirect("/")
	} catch(err) { console.log(err) }
})

// cookies.set('testtoken', {maxAge: 0});
app.get('/:slug', async (req, res) => {
	try {
		const url = await Url.findOne({ slug : req.params.slug })
		if (url == null) {
			res.sendStatus(404)
		} else {
			res.cookie('linkSlug', url.slug);
			const token = req.cookies.isPassed;
			if (token) {
				if (token == "true") {
					url.clicks++
					url.save()
					res.cookie('isPassed', '', { maxAge: 1 });
					res.cookie('linkSlug', ' ', { maxAge: 1 });

					res.redirect(url.full_url)
				} else {
					res.redirect(`/test`)
				}
			}else {res.redirect(`/test`)}
		}


			
	} catch(err) { console.log(err) }
})



const port = process.env.PORT || 5000
app.listen(port, () => {
	try {
 		console.log(`Server running on ${port}`)
	}
	catch(err) { console.log(err) } 
})