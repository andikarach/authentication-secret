require('dotenv').config()
const express = require('express')
const ejs = require('ejs')
const bodyParser =  require('body-parser')
const mongoose = require('mongoose')
const encrypt =  require('mongoose-encryption')

const app = express()
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
	extended:true
}))

const uri = 'mongodb://localhost:27017/auth'

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true})

const userSchema = new mongoose.Schema({
	email: String,
	password: String
})

secret = process.env.SECRET
userSchema.plugin(encrypt, { secret, encryptedFields: ["password"] })


const User = new mongoose.model("User", userSchema)

app.get('/', (req, res) => {
	res.render('home')
})

app.get('/login', (req, res) => {
	res.render('login')
})

app.get('/register', (req, res) => {
	res.render('register')
})

app.post('/register', (req, res) => {
	const newUser = new User({
		email: req.body.username,
		password: req.body.password
	})

	newUser.save( err => {
		if (err) {
			console.log(err)
		} else {
			res.render('secrets')
		}
	})
})


app.post('/login', (req, res) => {
	const email = req.body.username
	const password = req.body.password

	User.findOne({email}, (err, data) => {
		if (err) {
			console.log(err)
		} else {
			if (data) {
				if (data.password === password) {
					res.render('secrets')
				} else {
					res.send('Wrong password')
				}
			} else {
				res.send('Not Found')
			}
		}
	})
})


app.listen(3000, () => {
	console.log('server is running')
})