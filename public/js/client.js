'use strict'

var main = document.getElementsByTagName('main')[0];
var xhr = new XMLHttpRequest();

function clearView()
{
	main.innerHTML = '';
	let names = ['Транспорт', 'Отправление', 'Время в пути', 'Прибытие', 'Цена']
	for (let name of names)
	{
		let grid_head_element = document.createElement('div');
		grid_head_element.setAttribute('class', 'grid_head');
		grid_head_element.innerText = name;
		main.appendChild(grid_head_element);
	}
}

function getSearchData()
{
	let search_data =
	{
		from: '',
		to: '',
		departure: '',
		type: [],
		priority: ''
	}
	document.querySelectorAll('[name=location]').forEach((elem)=>
	{
		if (elem.id == 'departure') search_data[elem.id] = elem.value;
		else search_data[elem.id] = elem.value;
	});
	document.querySelectorAll('[name=transport]').forEach((elem)=>
	{
		if (elem.checked) search_data.type.push(elem.id);
	});
	search_data.priority = document.querySelectorAll('[name=priority]')[0].value;
	return search_data;
}

function search()
{
	let data = getSearchData();
	xhr.open('POST', '/search', true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	data = JSON.stringify(data);
	xhr.send(data);
}

function putFlight(obj)
{
	for (let key in obj)
	{
		let val = obj[key];
		let el = document.createElement('div');
		el.setAttribute('class', 'row');
		if (key == 'type')
		{
			let typeRUS =
			{
				train: 'Поезд',
				plane: 'Самолёт',
				bus: 'Автобус'
			}
			el.setAttribute('class', 'type');
			el.innerText = typeRUS[val];
		}
		else if (key == 'departure' || key == 'arrival')
		{	
			let date = new Date(val);
			let options = 
			{
				day: 'numeric',
				month: 'short',
				hour: 'numeric',
				minute: 'numeric'
			}
			el.innerText = date.toLocaleString('ru', options);
		}
		else if (key == 'duration')
		{
			let date = new Date();
			let offset = date.getTimezoneOffset() * 60000;
			date = new Date(val * 1000 + offset);
			date = date.getHours()+' ч '+date.getMinutes()+' мин';
			el.innerText = date;
		}
		else if (key == 'price')
		{
			el.innerText = val+' ₽';
		}
		else el.innerText = val;
		main.appendChild(el);
	}
}

function putData(arr)
{
	clearView();
	if (arr != '[]')
	{
		arr = JSON.parse(arr);
		for (let val of arr) putFlight(val);
	}
	else
	{
		alert('Ничего не найдено');
	}
}

document.getElementById('search_button').addEventListener('click', search, true);

xhr.onreadystatechange = ()=>
{
	if (xhr.readyState != 4) return;
	if (xhr.status != 200) alert('Ошибка подключения: '+xhr.status+': '+xhr.statusText)
	else putData(xhr.responseText);
}