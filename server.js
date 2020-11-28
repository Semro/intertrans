'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const mongodbURL = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER_NAME}.tghpe.mongodb.net/${process.env.MONGODB_DB_NAME}?retryWrites=true&w=majority`;
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


// для тестирования пересадок
/*
function sendInterResults(req, res)
{
	res.json(
		[
			[
				{
					type: "train",
					from: "Москва",
					arrival: "2018-10-18T09:30:00.000Z",
					departure: "2018-10-18T01:35:00.000Z",
					duration: 28500,
					price: 2823
				},
				{
					type: "plane",
					from: "Санкт-Петебрург",
					arrival: "2018-10-18T12:20:00.000Z",
					departure: "2018-10-18T10:55:00.000Z",
					duration: 5100,
					price: 4223
				}
			],
			{
				type: "bus",
				from: "Москва",
				arrival: "2018-10-19T04:00:00.000Z",
				departure: "2018-10-18T18:00:00.000Z",
				duration: 36000,
				price: 1224
			},
			[
				{
					type: "train",
					from: "Москва",
					arrival: "2018-10-18T09:30:00.000Z",
					departure: "2018-10-18T01:35:00.000Z",
					duration: 28500,
					price: 2823
				},
				{
					type: "plane",
					from: "Санкт-Петебрург",
					arrival: "2018-10-18T12:20:00.000Z",
					departure: "2018-10-18T10:55:00.000Z",
					duration: 5100,
					price: 4223
				},
				{
					type: "plane",
					from: "Рига",
					arrival: "2018-10-18T12:20:00.000Z",
					departure: "2018-10-18T10:55:00.000Z",
					duration: 5100,
					price: 4223
				}
			]
		]
	);
}
*/

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
			from: 1,
			departure: 1,
			duration: 1,
			arrival: 1,
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