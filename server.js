'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const mongodbURL = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_DB_NAME}.tghpe.mongodb.net/${MONGODB_DB_COLLECTION}?retryWrites=true&w=majority`;
const jsonParser = bodyParser.json();

const PORT = process.env.PORT || 9090;

const server = express()
	.use(express.static(__dirname + '/public'))
	.post('/search', jsonParser, sendResults)
	.listen(PORT, () => console.log(`Listening on ${ PORT } port`));

mongoose.connect(mongodbURL, { useNewUrlParser: true }, (err)=>
{
	if (err) throw err;
	console.log('Connected successfully to MongoDB');
})

var schema_flight = mongoose.Schema(
{	
	from: String,
	to: String,
	type: String,
	departure: Date,
	duration: Number,
	arrival: Date,
	seats: Number,
	seats_free: Number,
	price: Number
})

var flight = mongoose.model('flight', schema_flight);

function sendResults(req, res)
{
	req = req.body;
	req.departure = Date.parse(req.departure);
	let sort = {};
	sort[req.priority] = req.priority == 'seats_free'? -1: 1;
	if (req.departure != NaN)
	{	
		flight.find(
		{
			type: req.type,
			from: req.from.toLowerCase(),
			to: req.to.toLowerCase(),
			departure: 
			{
				'$gte': new Date(req.departure),
				'$lt': new Date(req.departure + 86400000)
			}
		},
		{
			_id: 0,
			type: 1,
			departure: 1,
			duration: 1,
			arrival: 1,
			seats: 1,
			seats_free: 1,
			price: 1
		},
		(err, arr)=>
		{
			if (err)
			{
				console.log(err);
				res.json([]);
			}
			else res.json(arr);
		})
		.sort(sort);
	}
	else
	{
		res.json([]);
	}
}