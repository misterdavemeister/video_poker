var deck, hand1, hand2, hand3, hand4, hand5, discards, betAmount = 1; 
var gameStarted = false, dealDealt = false, gameOver = true, gameScore;
var hold1 = false, hold2 = false, hold3 = false, hold4 = false, hold5 = false; 

function gameState(event) {
	/****************************************************** 
	*     checking game state before requested event      *
	*             event === requested event               *
	*    if checked conditions fail, event is denied      *
	******************************************************/ 
	var dbtn = document.getElementById('deal');
	var bbtn = document.getElementById('betButton');
	switch (event) {
	
		case "newGame":				// newgame and deal buttons enabled -- bet button disabled			 			
			if (gameOver) { 		// indicates that last game was completed / this is a fresh game 
				/**** change button and game states ****/
				toggleHoldBtns(); 	// visible if not currently visible, never invisible at this point
				gameStarted = true; 
				dealDealt = false; 
				gameOver = false; 
				dbtn.disabled = false;
				bbtn.disabled = true;
				/** end change button and game states **/
				newGame();
			} else {				// indicates that the game was started midgame 
				if (confirm("You are forfeiting this round. Are you sure?")) newGame();
				else return; 
			}	
			break;
			
		case "finalDeal": 			//newgame and bet buttons enabled -- deal disabled
			if (dealDealt || gameStarted === false) return; 
			else { 
				/**** change button and game states ****/
				gameStarted = false;
				dealDealt = true;
				gameOver = true;
				dbtn.disabled = true;
				bbtn.disabled = false;
				/** end change button and game states **/
				finalDeal();
			}	
			break;
			
		case "changeBet": 
			if (gameOver) changeBet();
			else return;
			break;
	}
}

function Score() {
	this.score = getCache();
	this.addScore = function(add) {
		this.score += add; 
	};
	this.getScore = function() {
		return "Bank: $" + addCommas(this.score);
	};
	this.getCacheScore = function() {
		return this.score;
	}
}

function newScore() {
	gameScore = new Score();	
}

function newGame() { 
	gameScore.score -= betAmount;
	document.getElementById("score").innerHTML = gameScore.getScore();
	document.getElementById("bet").innerHTML = "Bet: $" + addCommas(betAmount);
	var msg = document.getElementById("message");
	msg.innerHTML = "New hand dealt";
	hold1 = false;
	hold2 = false;
	hold3 = false;
	hold4 = false;
	hold5 = false;
	resetButtons();
	init();
	shuffle();
	deal();
	display();
}
		
function init() {
	deck     = new Stack();
	hand1    = new Stack();
	hand2	 = new Stack();
	hand3 	 = new Stack();
	hand4	 = new Stack();
	hand5 	 = new Stack();
	discards = new Stack();
	deck.makeDeck(1);
}
		
function shuffle() {
		
	if (deck == null) return;
		
	deck.shuffle(1);
}
		
function deal() {
  if (deck == null) return;
     hand1.addCard(deck.deal());
     hand2.addCard(deck.deal());
     hand3.addCard(deck.deal());
     hand4.addCard(deck.deal());
     hand5.addCard(deck.deal());
}
		
function discard(hand) {
  if (deck == null) return;		
  discards.combine(hand);
}
		
function reset() {
  var el;
  if (deck == null) return;
  discards.combine(hand1);
  discards.combine(hand2);
  discards.combine(hand3);
  discards.combine(hand4);
  discards.combine(hand5);
  deck.combine(discards);
}
		
function display() {
  var el, i;

  el = document.getElementById("card1");
  while (el.firstChild != null)
    el.removeChild(el.firstChild);
  for (var i = 0; i < hand1.cardCount(); i++) {
    node = hand1.cards[i].createNode();
    el.appendChild(node);
  }
  
  var el, i;

  el = document.getElementById("card2");
  while (el.firstChild != null)
    el.removeChild(el.firstChild);
  for (var i = 0; i < hand2.cardCount(); i++) {
    node = hand2.cards[i].createNode();
    el.appendChild(node);
  }
		  
  var el, i;

  el = document.getElementById("card3");
  while (el.firstChild != null)
    el.removeChild(el.firstChild);
  for (var i = 0; i < hand3.cardCount(); i++) {
    node = hand3.cards[i].createNode();
    el.appendChild(node);
  }
		  
  var el, i;

  el = document.getElementById("card4");
  while (el.firstChild != null)
    el.removeChild(el.firstChild);
  for (var i = 0; i < hand4.cardCount(); i++) {
    node = hand4.cards[i].createNode();
    el.appendChild(node);
  }
		  
  var el, i;

  el = document.getElementById("card5");
  while (el.firstChild != null)
    el.removeChild(el.firstChild);
  for (var i = 0; i < hand5.cardCount(); i++) {
    node = hand5.cards[i].createNode();
    el.appendChild(node);
  }
}

function hold(btn, card) {
	if (gameStarted && !(dealDealt)) {
		if (btn.value === "HOLD") {
			btn.value = "HELD";
			btn.style.color = "blue";
			if (card !== undefined) holdCard(card);
		} else {
			btn.value = "HOLD";
			btn.style.color = "black";
			if (card !== undefined) holdCard(card);
		}
	}
}

function holdCard(card) {
	switch (card) {
		case 'hand1':
			hold1 ? hold1 = false : hold1 = true;
			break;
		case 'hand2':
			hold2 ? hold2 = false : hold2 = true;
			break;
		case 'hand3':
			hold3 ? hold3 = false : hold3 = true;
			break;
		case 'hand4':
			hold4 ? hold4 = false : hold4 = true;
			break;
		case 'hand5':
			hold5 ? hold5 = false : hold5 = true;
			break;
		default:
			break;
	}
}

function finalDeal() { //------------- UI Deal button's function -------------//
	toggleHoldBtns();
	var handArr = [hand1, hand2, hand3, hand4, hand5];
	for (var i = 0; i < handArr.length; i++) {
		switch (i) {
			case 0:
				if (!(hold1)) { 
					discard(handArr[i]);
					handArr[i].addCard(deck.deal());
				}
				break;
			case 1:
				if (!(hold2)) {				
					discard(handArr[i]);
					handArr[i].addCard(deck.deal());
				}
				break;
			case 2:
				if (!(hold3)) {				
					discard(handArr[i]);
					handArr[i].addCard(deck.deal());
				}
				break;
			case 3:
				if (!(hold4)) {				
					discard(handArr[i]);
					handArr[i].addCard(deck.deal());
				}				
				break;		
			case 4:
				if (!(hold5)) {				
					discard(handArr[i]);
					handArr[i].addCard(deck.deal());
				}
				break;	
			default:	
				break;
		}
	}
	resetButtons();
	display();
	getScore();
	reset();
}

function toggleHoldBtns() {	
	var btnArr = ['hold1', 'hold2', 'hold3', 'hold4', 'hold5'];
	for (var i = 0; i < btnArr.length; i++) {
		document.getElementById(btnArr[i]).style.display = ((document.getElementById(btnArr[i]).style.display === 'none') || (document.getElementById(btnArr[i]).style.display === '')) ? 'inline' : 'none'; 
	}
}

function resetButtons() {
	var btnArr = ['hold1', 'hold2', 'hold3', 'hold4', 'hold5'];
	for (var i = 0; i < btnArr.length; i++) {
		if (document.getElementById(btnArr[i]).value === "HELD") 
			hold(document.getElementById(btnArr[i]));
	} 
}

function keyEvent(e) {
	var key = e.keyCode;
	switch (key) {
		case 49: 
			hold(document.getElementById("hold1"), "hand1");
			break;
		case 50:
			hold(document.getElementById("hold2"), "hand2");
			break;
		case 51:
			hold(document.getElementById("hold3"), "hand3");
			break;
		case 52:
			hold(document.getElementById("hold4"), "hand4");
			break;
		case 53:
			hold(document.getElementById("hold5"), "hand5");
			break;
		case 66:
			gameState('changeBet');
			break;
		case 67:
			gameState('changeBet');
			break;
		case 13:
			gameState('finalDeal');
			break;
		case 68:
			gameState('finalDeal');
			break;
		case 32:
			gameState('newGame');
			break;
		case 72:
			gameState('newGame');
			break;
		case 78:
			gameState('newGame');
			break;
		default:
			break;
	}
}

/************************* Determine Winning Hand & Score *************************/ 

function getScore() {
	var h1R = hand1.cards[0].getRank();
	var h2R = hand2.cards[0].getRank();
	var h3R = hand3.cards[0].getRank();
	var h4R = hand4.cards[0].getRank();
	var h5R = hand5.cards[0].getRank();
	
	var h1S = hand1.cards[0].getSuit();
	var h2S = hand2.cards[0].getSuit();
	var h3S = hand3.cards[0].getSuit();
	var h4S = hand4.cards[0].getSuit();
	var h5S = hand5.cards[0].getSuit();
	
	var rankArr = [h1R, h2R, h3R, h4R, h5R];
	var suitArr = [h1S, h2S, h3S, h4S, h5S];
	var score = winningHands(rankArr, suitArr); 
	postScore(score);
} 

function postScore(s) {
	var scr = document.getElementById("score");
	var msg = document.getElementById("message");
	s *= betAmount;
	gameScore.addScore(s);
	scr.innerHTML = gameScore.getScore(); 
	if (s > 0){
		msg.innerHTML += " You won $" + addCommas(s);
		animateMsg(msg);
	} 
	cacheScore();
	reset();
}

function animateMsg(el) {
	//TODO: ANIMATE IN A CELEBRATORY FASHION BECAUSE GOOD THINGS HAPPENED
	return;
}

function winningHands(ranks, suits) {
	var msg = document.getElementById("message");
	var r = convertRanks(ranks);
	
	if (checkRoyalFlush(r, suits) === true) {
		msg.innerHTML = "You got a royal flush!"; 
		return 1000;
	}
	else if (checkStraightFlush(r, suits)  === true) {
		msg.innerHTML = "You got a straight flush!"; 
		return 300;
	}

	else if (checkStraightFlushLow(r, suits)  === true) {
		msg.innerHTML = "You got a straight flush!"; 
		return 300;
	}
	
	else if (checkf_o_a_k(r, suits)  === true) {
		msg.innerHTML = "You got a four of a kind!";
		return 50;
	}
	else if (checkFullHouse(r, suits) === true) {
		msg.innerHTML = "You got a full house!"; 
		return 30;
	}
	else if (checkFlush(r, suits) === true) {
		msg.innerHTML = "You got a flush!"; 
		return 20;
	}
	else if (checkStraight(r, suits) === true) {
		msg.innerHTML = 'You got a straight!'; 
		return 15;
	}
	
	else if (checkStraightLow(r, suits) === true) {
		msg.innerHTML = 'You got a straight!'; 
		return 15;
	}	
	
	else if (checkt_o_a_k(r, suits)  === true) {
		msg.innerHTML = "You got a three of a kind!"; 
		return 10;
	}
	else if (checkTwoPair(r, suits)  === true) {
		msg.innerHTML = "You got a two pair!"; 
		return 5;
	}
	else if (checkJHPair(r, suits) === true) {
		msg.innerHTML = "You got jacks or better!"; 
		return 2;
	}
	else {
		msg.innerHTML = "You did not have a winning hand."; 
		return 0;
	}
}

function convertRanks(ranks) {
    var newRanks = ranks.map(function(rank) {
		if (rank === "J") return 11;
		else if (rank === "Q") return 12;
		else if (rank === "K") return 13;
	    else if (rank === "A") return 14;
        else return Number(rank);
	});
	return newRanks;
}

function convertRanksLow(ranks) {
    var newRanks = ranks.map(function(rank) {
	    if (rank === 14) return 1;
        else return Number(rank);
	});
	return newRanks;
}

function rankCounter(rankArray) {
    var rSorted = rankArray.sort(function(a, b) {return a-b;});
	var counter = 1;
    var highestCount = 1;
	for (var i = 1; i < rSorted.length; i++) {
		if (rSorted[i] === rSorted[i - 1]) 
			counter++;
           	 if (counter > highestCount) highestCount = counter;
		else 
			counter = 1;
	}
	return highestCount; 
}

function resetCacheScore() {
	var scr = document.getElementById("score");
	if (confirm("Reset Score?")) {
		localStorage['myScore'] = 25;
		gameScore.score = 25;
		scr.innerHTML = "Bank: $" + addCommas(gameScore.score);
	}
}

function cacheScore() {
	localStorage['myScore'] = gameScore.getCacheScore();
}

function getCache() {
	var cachedScore = localStorage['myScore'] || 25;
	return cachedScore;
}

function changeBet() {
		var blabel = document.getElementById('bet');
		var slabel = document.getElementById('score');
		var msgAmount = "You have $" + addCommas(gameScore.getCacheScore()) + "\n\n Enter new amount below (numbers only)"; 
		var amount = Number(prompt(msgAmount, betAmount)); 
		if (amount > 0 || amount < 9999999999999990) {
			betAmount = amount;
		}
		else betAmount = betAmount;
		blabel.innerHTML = "Bet: $" + addCommas(betAmount);
		slabel.innerHTML = gameScore.getScore();
}

function addCommas(num) {
	if (num > 999999999999999999999) return num;
    var numArr = String(num).split('').reverse();
    var tmpStr = [];
    if (Number(num) > 0) { 
	    for (var i = 0; i < numArr.length; i++) {
	        if (i % 3 === 0 && i !== 0) 
	      	  tmpStr.unshift(numArr[i] + ",");
	        else 
	      	  tmpStr.unshift(numArr[i]);
	    }
	    
	    return tmpStr.join('');
    }
    else {
    	tmpStr.push(numArr[0].shift);
	    for (var i = 0; i < numArr.length; i++) {
	        if (i % 3 === 0 && i !== 0) 
	      	  tmpStr.unshift(numArr[i] + ",");
	        else 
	      	  tmpStr.unshift(numArr[i]);
	    }
	    
	    return tmpStr.join('');
    }
}

/************************* Winning Hand Types *************************/ 
function checkRoyalFlush(r, s) {
    var ts = s[0];
    var t = false, j = false, q = false, k = false, a = false; 
	var flush = s.every(function(suit) {return ts === suit;});
    r.forEach(function(rank) {
        if (rank === 10) t = true;
        if (rank === 11) j = true;
        if (rank === 12) q = true;
        if (rank === 13) k = true;
        if (rank === 14) a = true;
    });
    if (flush && t && j && q && k && a) return true;
    else return false; 
}

function checkStraightFlush(r, s) {
    var ts = s[0];
	var rsorted = r.sort(function(a,b) {return a-b;});
	var flush = s.every(function(suit) {return ts === suit;});
    for (var i = 1; i < rsorted.length; i++) {
        if ((rsorted[i] - 1) !== (rsorted[i - 1])) return false;
    }
   if (flush) return true; 
   else return false;
}

function checkStraightFlushLow(r, s) {
	var nR = convertRanksLow(r);
	var ts = s[0];
	var rsorted = nR.sort(function(a,b) {return a-b;});
	var flush = s.every(function(suit) {return ts === suit;});
    for (var i = 1; i < rsorted.length; i++) {
        if ((rsorted[i] - 1) !== (rsorted[i - 1])) return false;
    }
   if (flush) return true; 
   else return false;
}


function checkf_o_a_k(r, s) {
	if (rankCounter(r) === 4) return true;
	else return false;
}

function checkFullHouse(r, s) {
    var rSorted = r.sort(function(a, b) {return a-b;});
	var counter = 1, secondCounter = false;
    var highestCount = 1;
    var secondHighestCount = 1;
    
	for (var i = 1; i < rSorted.length; i++) {
		if (rSorted[i] === rSorted[i - 1]) {
			counter++;
			if (secondCounter === false) {
           	 	if (counter > highestCount) {
           	 		highestCount = counter;
		   	 	}
			}
           	else {
           		 if (counter > secondHighestCount) {
			   		 secondHighestCount = counter; 
			   	 }
           	}
		}
		else { 
			counter = 1;
			secondCounter = true;
		}
	}
    if (highestCount === 3 && secondHighestCount === 2) return true;
	else if (highestCount === 2 && secondHighestCount === 3) return true;
	else return false;
}

function checkFlush(r, s) {
	var ts = s[0];
	var flush = s.every(function(suit) {return ts === suit;});
	return flush;
}

function checkStraight(r, s) {
	var rsorted = r.sort(function(a,b) {return a-b;});
	for (var i = 1; i < rsorted.length; i++) {
    	if ((rsorted[i] - 1) !== (rsorted[i - 1])) return false;
    }
    return true;
}

function checkStraightLow(r, s) {
	var nR = convertRanksLow(r);
	var rsorted = nR.sort(function(a,b) {return a-b;});
	for (var i = 1; i < rsorted.length; i++) {
    	if ((rsorted[i] - 1) !== (rsorted[i - 1])) return false;
    }
    return true;
}

function checkt_o_a_k(r, s) {
	if (rankCounter(r) === 3) return true;
	else return false;
}

function checkTwoPair(r, s) {
	var rSorted = r.sort(function(a, b) {return a-b;});
    var pairCounter = 0;
	for (var i = 1; i < rSorted.length; i++) {
		if (rSorted[i] === rSorted[i - 1]) 
			pairCounter++;
	}
	return pairCounter === 2; 
}

function checkJHPair(r, s) {
    var j = 0, q = 0, k = 0, a = 0; 
    r.forEach(function(rank) {
        if (rank === 11) j++;
        if (rank === 12) q++;
        if (rank === 13) k++;
        if (rank === 14) a++;
    });
    if (j === 2 || q === 2 || k === 2 || a === 2) return true;
    else return false; 
}