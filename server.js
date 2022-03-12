const express = require("express");
const app = express();
const port = process.env.port || 9000
const axios = require('axios');
const path = require("path");
const cors = require("cors");
const fs = require('fs');
const config = require('./config.json')

const api_key = config.API_KEY

app.use(express.static(path.join(__dirname, 'site', 'public')));
app.use(cors());

var corsOpt = {
	origin: 'http://localhost:3000',
	optionSuccessStatus: 200
}
var words = [];

fs.readFile('words/mots_5.txt', 'utf8' ,(err, data) => {
	if(err){
		console.log("Erreur dans la lecture du fichier")
		throw err;
	}
	words = data.split('\n')
});

app.get("/puuid", cors(corsOpt), (req, res) => {
	let url = "https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + encodeURI(req.query.pseudo) + "?api_key=" + api_key;
	console.log("get puuid " + req.query.pseudo);
	axios.get(url)
			.then(response => {
				res.send(response.data);
			})
			.catch(function (error){
				console.log(error)
			});
});

app.get("/match", cors(corsOpt),(req, res) => {
	let url = "https://europe.api.riotgames.com/lol/match/v5/matches/"+ req.query.matchid + "?api_key=" + api_key;
	axios.get(url)
		.then(response => {
			res.send(response.data)
		})
		.catch(function (error){
			
		});
});

app.get("/matchs", cors(corsOpt), (req, res) => {
	axios.get("https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/" + req.query.puuid +  "/ids?queue=420&start=0&count=20&api_key=" + api_key)
	.then( function (match_response) {
		res.send(match_response.data)
	})
});


app.get("/word", cors(corsOpt), (req, res) => {
	let word = words[Math.floor(Math.random() * words.length)]
	console.log(word)
	res.send(word)
});

app.listen(port, err => {
	console.log("Listening on port " + port);
});



