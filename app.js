const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const firebase = require('firebase');
const Day = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
// let countDay = 0;
const MicroGear = require('microgear');
const microgear = MicroGear.create({
	key: 'hT1Rb59vBTW4Crf',
	secret: 'yukV5ZtpYhYsqKTsr0TCgUQhb',
	alias: 'Backend' /*  optional  */ ,
});
const toArray = str => {
	const arr = [];
	for (const key in str) {
		if (str.hasOwnProperty(key)) {
			const element = str[key];
			arr.push({ ...element,
				id: key
			});
		}
	}
	return arr;
};
microgear.connect('HappyPetGuardian');

// Initialize Firebase
var config = {
	apiKey: 'AIzaSyD2zJXM_xgleflxMQ5X2q7WHHD3d7ufMws',
	authDomain: 'happypetguardian.firebaseapp.com',
	databaseURL: 'https://happypetguardian.firebaseio.com',
	projectId: 'happypetguardian',
	storageBucket: 'happypetguardian.appspot.com',
	messagingSenderId: '803455364603',
};
firebase.initializeApp(config);

// Setting Endpoint (Middleware)
app.use(cors());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

// Microgear
microgear.on('connected', function () {
	console.log('connected');
});
microgear.on('message', async(topic, msg) => {
	const data = msg.toString('utf8');
	console.log(topic, data);
	if (data.includes('Summary')) {
		let countDay = 0;
		const snapshot = await firebase.database().ref('/feeding').once('value')
		countDay = snapshot.val().countDay
		let string = data.split(' ');
		string.splice(0, 1);
		let summary = {};
		summary[string[0].slice(0, string[0].length - 1)] = parseInt(string[1]),
			summary[string[3].slice(0, string[3].length - 1)] = parseInt(string[4]),
			summary[string[5].slice(0, string[5].length - 1)] = parseInt(string[6]),
			console.log(string);
		console.log(summary);
		let summaryFeed = {
			day: Day[countDay],
			feeding: summary.Food,
			eating: summary.CatEat
		}
		console.log('earth')
		countDay = (countDay + 1) % 7;
		console.log(summaryFeed)
		firebase.database().ref('feeding/summaryFeed').push(summaryFeed)
		firebase.database().ref('/feeding').update({
			currentFeed: 0,
			totalAmount:0,
			countDay: countDay
		})
	}

	if (data.includes('Feeding')) {
		let feed = 0;
		const snapshot = await firebase
			.database()
			.ref('feeding')
			.once('value')
		let data = snapshot.val()
		var feedData = {
			currentFeed: data.currentFeed + 1,
			totalAmount: data.totalAmount + data.amountPerMeal
		};
		await firebase
			.database()
			.ref('/feeding')
			.update(feedData);
	}
});

// Endpoints
app.get('/feeding', async (req, res) => {
	microgear.chat('NodeMCU', 'Feeding');
	res.send('Success Feeding!');
});
app.post('/edit', async (req, res) => {
	console.log(req.body)
	const data = req.body
	microgear.chat('NodeMCU', `config ${data.maximumNumFeed} ${data.amountPerMeal}`)
	res.send('Success Edit!')
})
app.listen(5000);
module.exports = app;