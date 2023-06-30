var cards = []; // создаем колоду

var suits = [ 'spades', 'hearts', 'clubs', 'diams' ];  // 4 масти


//номиналы
var numb = [ 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K' ];

var playerCard = []; // массив который будет содержать карты плеера  

var dealerCard = [];  // массив который сод карты дилера
// переменные
var cardCount = 0;   // пер содержит первую карту и сколько карт было будет раздано
var mydollars = 100; // сколько у меня долларов
var endplay = false; // финишер
// Переменные
var message = document.getElementById('message');
var output = document.getElementById('output');
var dealerHolder = document.getElementById('dealerHolder'); // получаем инфу о дилерской руке
var playerHolder = document.getElementById('playerHolder');    // получаем инфу о руке игрока
var pValue = document.getElementById('pValue');
var dValue = document.getElementById('dValue');
var dollarValue = document.getElementById('dollars');

document.getElementById('mybet').onchange = function() {   //event listener
	if (this.value < 0) {
		this.value = 0;
	}                               // устанавливаем лимит для ставки (наша ставка не может быть больше нашего банка)
	if (this.value > mydollars) {
		this.value = mydollars;
	}
	message.innerHTML = 'Ставка изменилась на $' + this.value;
};

 // создаем колоду
for (s in suits) {
	var suit = suits[s][0].toUpperCase(); // случайная масть

	var bgcolor = suit == 'S' || suit == 'C' ? 'black' : 'red';
	for (n in numb) {
		var cardValue = n > 9 ? 10 : parseInt(n) + 1;

		var card = {
			suit: suit,
			icon: suits[s],
			bgcolor: bgcolor,
			cardnum: numb[n],
			cardvalue: cardValue // сколько очков карта
		};
		cards.push(card);
	}
}

function Start() {
	shuffleDeck(cards);  // перемешиваем колоду
  dealNew();      // раздаем
	document.getElementById('start').style.display = 'none';
	dollarValue.innerHTML = mydollars;
}

function dealNew() {       
  dValue.innerHTML = '?';
  playerCard = [];         // сбрасываем нашу руку
	dealerCard = [];            // и дилеру
	dealerHolder.innerHTML = '';   
	playerHolder.innerHTML = '';
	var betvalue = document.getElementById('mybet').value;
	mydollars = mydollars - betvalue;
	document.getElementById('dollars').innerHTML = mydollars;             
	document.getElementById('myactions').style.display = 'block';
	message.innerHTML = 'Наберите 21 или больше чем у дилера.<br>Текущая ставка $' + betvalue;
	document.getElementById('mybet').disabled = true;
	document.getElementById('maxbet').disabled = true;
	deal();
	document.getElementById('btndeal').style.display = 'none';
}

function redeal() {                              
	cardCount++;                                
	if (cardCount > 40) {                               
		console.log('Новая колода');
		shuffleDeck(cards);
		cardCount = 0;            
		message.innerHTML = 'шафд';
	}
}

function deal() {
	for (x = 0; x < 2; x++) {              // х м чем 2 потому что мы начинаем с 2 картами в открытую
		dealerCard.push(cards[cardCount]);   // пушим карты в дилерскую руку
		dealerHolder.innerHTML += cardOutput(cardCount, x);
		if (x == 0) {
			dealerHolder.innerHTML += '<div id="cover" style="left:100px;"></div>';  // закрываем ему одну
		}
		redeal();
		playerCard.push(cards[cardCount]);   // // пушим карты в руку игрока
		playerHolder.innerHTML += cardOutput(cardCount, x);   // вывод карты
		redeal();
	}
	var playervalue = checktotal(playerCard);
	if (playervalue == 21 && playerCard.length == 2) {   //если мы получили блекджек
		playend();       // если да то конец
	}
	pValue.innerHTML = playervalue;
}

function cardOutput(n, x) {        
	var hpos = x > 0 ? x * 60 + 100 : 100;  
	return (                              
		'<div class="icard ' +
		cards[n].icon +                     
		'" style="left:' +                           
		hpos +                                
		'px;">  <div class="top-card suit">' +
		cards[n].cardnum +
		'<br></div>  <div class="content-card suit"></div>  <div class="bottom-card suit">' +
		cards[n].cardnum +
		'<br></div> </div>'
	);
}

function maxbet() {
	document.getElementById('mybet').value = mydollars;    
	message.innerHTML = 'Bet changed to $' + mydollars;
}


function cardAction(a) {
	console.log(a);
	switch (a) {
		case 'hit':
			playucard(); // хитаем
			break;
		case 'hold':
			playend();
			break;
		case 'double':                 // дабл
			var betvalue = parseInt(document.getElementById('mybet').value);
			if (mydollars - betvalue < 0) {
				betvalue = betvalue + mydollars;
				mydollars = 0;
			} else {
				mydollars = mydollars - betvalue;
				betvalue = betvalue * 2;       
			}
			document.getElementById('dollars').innerHTML = mydollars;
			document.getElementById('mybet').value = betvalue;
			playucard(); // новая карта
			playend(); // финиш
			break;
		default:                          // стенд
			console.log('done');
			playend(); // финиш
	}
}


// добавление новой карты
function playucard() {
	playerCard.push(cards[cardCount]);   // тут
	playerHolder.innerHTML += cardOutput(cardCount, playerCard.length - 1);
	redeal();
	var rValu = checktotal(playerCard);   // рассчет тотал очков
	pValue.innerHTML = rValu;
	if (rValu > 21) {
		message.innerHTML = 'Перебор!';
		playend();
	}
}

function playend() {
	endplay = true;
	document.getElementById('cover').style.display = 'none';
	document.getElementById('myactions').style.display = 'none';
	document.getElementById('btndeal').style.display = 'block';
	document.getElementById('mybet').disabled = false;
	document.getElementById('maxbet').disabled = false;
	message.innerHTML = 'Игра закончена<br>';
	var payoutJack = 1;
	var dealervalue = checktotal(dealerCard);
	dValue.innerHTML = dealervalue;

	while (dealervalue < 17) {
		dealerCard.push(cards[cardCount]);
		dealerHolder.innerHTML += cardOutput(cardCount, dealerCard.length - 1);
		redeal();
		dealervalue = checktotal(dealerCard);
		dValue.innerHTML = dealervalue;
	}


	var playervalue = checktotal(playerCard);    // смотрим тотал игрока
	if (playervalue == 21 && playerCard.length == 2) {       //если бд при 2 начальн
		message.innerHTML = 'Player Blackjack';
		payoutJack = 1.5;
	}

	var betvalue = parseInt(document.getElementById('mybet').value) * payoutJack;
	if ((playervalue < 22 && dealervalue < playervalue) || (dealervalue > 21 && playervalue < 22)) {
		message.innerHTML += '<span style="color:green;">Победа! Вы выиграли $' + betvalue + '</span>';
		mydollars = mydollars + betvalue * 2
	} else if (playervalue > 21) {
		message.innerHTML += '<span style="color:red;">Дилер выиграл! Вы потеряли $' + betvalue + '</span>';
	} else if (playervalue == dealervalue) {
		message.innerHTML += '<span style="color:blue;">ПУШ</span>';
		mydollars = mydollars + betvalue;
	} else {
		message.innerHTML += '<span style="color:red;">Дилер выиграл! Вы потеряли $' + betvalue + '</span>';
	}
	pValue.innerHTML = playervalue;
	dollarValue.innerHTML = mydollars;
}

function checktotal(arr) {
	var rValue = 0;
	var aceAdjust = false;  // туз 1 или 11
	for (var i in arr) {
		if (arr[i].cardnum == 'A' && !aceAdjust) {
			aceAdjust = true;
			rValue = rValue + 10;
		}
		rValue = rValue + arr[i].cardvalue;
	}

	if (aceAdjust && rValue > 21) {
		rValue = rValue - 10;
	}
	return rValue;
}

function shuffleDeck(array) {    // перемешиваем
  for (var i = array.length - 1; i > 0; i--){
		var j = Math.floor(Math.random() * (i + 1));  // берем рандом
		var temp = array[i]; 
		array[i] = array[j]; 
		array[j] = temp;
	}
	return array;
}
