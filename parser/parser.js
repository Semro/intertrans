'use strict';

const express = require('express');
const mongoose = require('mongoose');
const mongodbURL = 'mongodb://localhost:27017/schedule_flight';
const https = require('https');
const request = require('request');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');
const jsonfile = require('jsonfile');

//mongoose.set('useFindAndModify', false);

mongoose.connect(mongodbURL, { useNewUrlParser: true }, (err) => {
  if (err) throw err;
  console.log('Connected successfully to MongoDB');
  createURLs(ways);
});

var schema_flight = mongoose.Schema({
  from: String,
  to: String,
  type: String,
  departure: Date,
  duration: Number,
  arrival: Date,
  seats: Number,
  seats_free: Number,
  price: Number,
});

var flight = mongoose.model('flight', schema_flight);

var first_run = true;

console.log('server.js started');

function save(obj, file) {
  jsonfile.writeFile(file, obj, function (err) {
    if (err != null) console.error(err);
    console.log(obj);
  });
}

function open(file) {
  let obj = JSON.parse(fs.readFileSync(file, 'utf8'));
  return obj;
}

function getData(url) {
  return new Promise((resolve, reject) => {
    request(
      {
        url: url,
        //				proxy: 'http://91.122.47.157:8081',
        //				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
        //				'Cookie': '_ym_wasSynced=%7B%22time%22%3A1539709112301%2C%22params%22%3A%7B%22eu%22%3A0%7D%2C%22bkParams%22%3A%7B%7D%7D; _ym_uid=1539709112842951987; _ym_d=1539709112; mda=0; _ym_isad=1; yandexuid=9020274761539709061; yabs-sid=2177482891539709061; yp=1855069061.yrts.1539709061#1855069061.yrtsi.1539709061; i=RZn5oSdhhZWWgG6Pau6NFg3/o6olTAd46p/8eBgdo7H9oRxlRtPrrxsTanc4YAuKs9RFYwtFMP/5xOx8pao+4/fb/ss=; _ym_visorc_10630330=w; spravka=dD0xNTM5NzA5MTE4O2k9MTkzLjE2OS4zMi41Nzt1PTE1Mzk3MDkxMTgyNzQxNjE0NDk7aD1lMWE3OTNmMmJkYTRkZDMyMzhiZTJmNjkyZmMyMTkzOA==',
        //				'Accept': '/',
        //    			'Connection': 'keep-alive',
        json: true,
      },
      (err, res, body) => {
        if (err) {
          throw err;
        }
        let DOM = new JSDOM(body);
        let data = DOM.window.document.getElementsByTagName('script')[4].innerHTML;
        data = data.substring(data.indexOf('{'), data.length);
        let k = 0,
          i = data.length;
        while (k != 2) {
          i--;
          if (data[i] === ';') k++;
        }
        data = data.substring(0, i);
        data = JSON.parse(data);
        resolve(data);
      }
    );
  });
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function randomArrValue(arr) {
  return arr[random(0, arr.length)];
}

function randomSeats(type) {
  if (type == 'bus') return randomArrValue([40, 50, 60]);
  if (type == 'train') return randomArrValue([350, 450, 750, 1100]);
  if (type == 'plane') return randomArrValue([150, 170, 200, 220]);
}

function randomPrice(type) {
  if (type == 'bus') return random(900, 1300);
  if (type == 'train') return random(1300, 3500);
  if (type == 'plane') return random(3900, 7000);
}

function transform(arr, day, fromName, toName) {
  for (let val of arr) {
    let type = val.transport.code;
    if (type == 'suburban') type = 'train';
    else if (type != 'train' && type != 'plane' && type != 'bus') continue;
    let seats = randomSeats(type);
    let flight = {
      from: fromName,
      to: toName,
      type: type,
      departure: val.departure,
      duration: val.duration,
      arrival: val.arrival,
      seats: seats,
      seats_free: random(10, Math.floor(seats / 2)),
      price: randomPrice(type),
    };
    addDataToDB(flight);
  }
  console.log('Added ' + day + ' ' + fromName + ' ' + toName);
}

function addDataToDB(obj) {
  flight.create(obj, (err, obj) => {
    if (err) return handleError(err);
  });
}

async function createURL(fromName, toName, day, month) {
  fromName = fromName.toLowerCase();
  toName = toName.toLowerCase();
  let url = 'https://rasp.yandex.ru/search/';
  url += '?fromName=' + ways.from[fromName];
  url += '&toName=' + ways.to[toName] + '&when=' + day + '+' + month;

  console.log('Do ' + day + ' ' + fromName + ' ' + toName);
  let flights = await getData(url);
  console.log('Done ' + day + ' ' + fromName + ' ' + toName);
  transform(flights.search.segments, day, fromName, toName);
  /*	if (k < 3)
	{
		flights_arr.push(flights);
		k++;
	}
	
	if (k == 3)
	{
		for (let flights of flights_arr) transform(flights.search.segments, day, fromName, toName);
		flights_arr = [];
		k = 0;
	}*/
}

function createURLs(ways) {
  let month = '%D0%BE%D0%BA%D1%82%D1%8F%D0%B1%D1%80%D1%8F'; // october
  let i = 1;
  for (let day = 18; day <= 20; day++) {
    for (let toName in ways.to) {
      if (first_run) {
        createURL('москва', toName, day, month);
        //				createURL(toName, 'москва', day, month);
        first_run = false;
      } else {
        setTimeout(() => {
          createURL('москва', toName, day, month);
          //					createURL(toName, 'москва', day, month);
        }, random(15000, 20000) * i);
      }
      i++;
      //			createURL(toName, 'москва', day, month);
    }
  }
}

let ways = {
  from: {
    москва: '%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0',
  },
  to: {
    'санкт-петербург':
      '%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3',
    минск: '%D0%9C%D0%B8%D0%BD%D1%81%D0%BA',
    рига: '%D0%A0%D0%B8%D0%B3%D0%B0',
  },
};

createURLs(ways);
