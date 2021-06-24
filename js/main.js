let canvas, 
		c, 
		invaders, 
		w, 
		h, 
		dt, 
		player, 
		lives,
		lastUpdate,
		leftBtn,
		rightBtn,
		fireBtn,
		div,
		generation,
		pausedTime = 0,
		ispaused = false,
		isGameOver = true;

const shootSound = new Audio('/sound/hit.wav');

canvas = document.createElement('canvas');
canvas.width = w = 234;
canvas.height = h = 288;
c = canvas.getContext('2d',{alpha: false});
if (window.devicePixelRatio > 1) {
	c.canvas.width = c.canvas.width * window.devicePixelRatio;
	c.canvas.height = c.canvas.height * window.devicePixelRatio;
	c.canvas.style.width = w+'px';
	c.canvas.style.height = h+'px';
	c.scale(window.devicePixelRatio, window.devicePixelRatio);
}

function displayKaiAds() {
	var display = true;
	if (window['kaiadstimer'] == null) {
		window['kaiadstimer'] = new Date();
	} else {
		var now = new Date();
		if ((now - window['kaiadstimer']) < 300000) {
			display = false;
		} else {
			window['kaiadstimer'] = now;
		}
	}
	console.log('Display Ads:', display);
	if (!display)
		return;
	getKaiAd({
		publisher: 'ac3140f7-08d6-46d9-aa6f-d861720fba66',
		app: 'alien-invaderz',
		slot: 'kaios',
		onerror: err => console.error(err),
		onready: ad => {
			ad.call('display');
			ad.on('close', () => {
				pausedGame();
			});
			ad.on('display', () => {
				pausedGame();
			});
		}
	})
}

function getRandomColor() {
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += Math.floor(Math.random() * 10);
	}
	return color;
}

function init() {
	lives = 0;
	generation = 1;
	dt = 0;
	lastUpdate = Date.now();
	invaders = new Genetics();
	invaders.createPopulation();
	player = new Player( w/4/2, h/4-4 );
	update();
}

function deltaTime() {
	let now = Date.now();
	dt = now - lastUpdate;
	lastUpdate = now;
}

function getBestOfGeneration() {
	let index = 0, best = 0;
	for(let i = 0; i < invaders.population.length; i++) {
		if( invaders.population[i].fit > best ) {
			best = invaders.population[i].fit;
			index = i;
		}
	}
	if( !invaders.bestOfGeneration || invaders.population[index].fit > invaders.bestOfGeneration.fit ) {
		invaders.bestOfGeneration = invaders.population[index];
	}
}

function welcome() {
	lives = 0;
	generation = 0;
	canvas.style.border = "solid";
	document.body.appendChild(canvas);
	c.fillStyle = "#C2C2C2";
	c.fillRect(0,0,w,h);
	c.fillStyle = "black";
	c.font = "12px Arial";
	c.fillText("Generation: "+generation, 5, 11);
	c.fillStyle = "red";
	c.fillText("Invaders: "+lives, 5, 21);

	c.fillStyle = "black";
	let faq = "How to Play:"
	c.font = "14px Arial";
	c.fillText(faq, (w-c.measureText(faq).width)/2, h/7 - 10);

	let guide1 = "You are the last hope of the human kind as the"
	c.font = "11px Arial";
	c.fillText(guide1, (w-c.measureText(guide1).width)/2, h/7);

	let guide2 = "defense against the InvaderZ. They're deployed"
	c.font = "11px Arial";
	c.fillText(guide2, (w-c.measureText(guide2).width)/2, h/7 + (12 * 1));

	let guide3 = "by their mothership with the sole purpose of "
	c.font = "11px Arial";
	c.fillText(guide3, (w-c.measureText(guide3).width)/2, h/7 + (12 * 2));

	let guide4 = "entering earth's atmosphere. Although they're"
	c.font = "11px Arial";
	c.fillText(guide4, (w-c.measureText(guide4).width)/2, h/7 + (12 * 3));

	let guide5 = "are not a danger for you as an individual, if 5"
	c.font = "11px Arial";
	c.fillText(guide5, (w-c.measureText(guide5).width)/2, h/7 + (12 * 4));

	let guide6 = "of them gets through, everything is doomed"
	c.font = "11px Arial";
	c.fillText(guide6, (w-c.measureText(guide6).width)/2, h/7 + (12 * 5));

	let faq1 = "1) Left Arrow - move the cannon to the left     "
	c.font = "11px Arial";
	c.fillText(faq1, (w-c.measureText(faq1).width)/2, h/3.5 + (12 * 4));

	let faq2 = "2) Right Arrow - move the cannon to the right"
	c.font = "11px Arial";
	c.fillText(faq2, (w-c.measureText(faq2).width)/2, h/3.5 + (12 * 5));

	let faq3 = "3) Button # - Shoots                                         "
	c.font = "11px Arial";
	c.fillText(faq3, (w-c.measureText(faq3).width)/2, h/3.5 + (12 * 6));

	let faq4 = "4) RSK/SoftRight - Exit App                              "
	c.font = "11px Arial";
	c.fillText(faq4, (w-c.measureText(faq4).width)/2, h/3.5 + (12 * 7));

	let h1 = "Are you ready ?";
	c.font = "30px Arial";
	c.fillText(h1, (w-c.measureText(h1).width)/2, h/3 + 95);
	let h2 = "Press Enter";
	c.font = "20px Arial";
	c.fillText(h2, (w-c.measureText(h2).width)/2, h/3 + 135);
}

function gameOver() {
	displayKaiAds();
	ispaused = true;
	isGameOver = true;
	c.fillStyle = "#C2C2C2";
	c.fillRect(0,0,w,h);
	c.fillStyle = "black";
	c.font = "12px Arial";
	c.fillText("Generation: "+generation, 5, 11);
	c.fillStyle = "red";
	c.fillText("Invaders: "+lives, 5, 21);
	let txt = "Game Over!";
	c.font = "30px Arial";
	c.fillText(txt, (w-c.measureText(txt).width)/2, h/2);
	let txt2 = "Press Enter";
	c.font = "20px Arial";
	c.fillText(txt2, (w-c.measureText(txt2).width)/2, h/2 + 30);
}

function startGame() {
	ispaused = false;
	isGameOver = false;
	init();
}

function pausedGame() {
	if (!isGameOver) {
		if (ispaused) {
			lastUpdate = Date.now();
			ispaused = false;
			update();
		} else {
			ispaused = true;
		}
	}
}

function update() {
	if (ispaused)
		return
	c.fillStyle = "#C2C2C2";
	c.fillRect(0,0,w,h);
	c.fillStyle = "black";
	c.font = "12px Arial";
	c.fillText("Generation: "+generation, 5, 11);
	c.fillStyle = "red";
	c.fillText("Invaders: "+lives, 5, 21);
	for(let i = 0; i < invaders.population.length; i++) {
		invaders.population[i].show();
	}
	player.show();
	let allDead = true;
	for(let i = 0; i < invaders.population.length; i++) {
		if( invaders.population[i].isAlive ) {
			allDead = false;
			break;
		}
	}
	if(allDead) {
		getBestOfGeneration();
		if(generation%7) {
			invaders.evolve();
		}else{
			invaders.elitism();
		}
		generation++;
	}
	if(lives > 4) {
		gameOver();
		return;
	}
	deltaTime();
	requestAnimationFrame(update);
}

function addEvents() {
	document.addEventListener("keydown",function(e) {
		console.log(e.key, e.keyCode);
		switch(e.keyCode) {
			case 13 :
				if (isGameOver)
					startGame();
				break;
			case 35 :
			case 163 :
				if (!isGameOver)
					player.shoot();
				break;
			case 37 :
			case 65 :
				player.isMovingLeft = true;
				break;
			case 39 :
			case 68 :
				player.isMovingRight = true;
				break;
			case 8 :
				if (!isGameOver && !ispaused)
					pausedGame();
				break;
		}
		if (e.key === 'SoftRight')
			window.close();
	});

	document.addEventListener("keyup",function(e) {
		switch(e.keyCode) {
			case 37 :
			case 65 :
					player.isMovingLeft = false;
				break;
			case 39 :
			case 68 :
					player.isMovingRight = false;
				break;
		}
	});

	window.addEventListener('load', function(e) {
		welcome();

		displayKaiAds();

		document.addEventListener('visibilitychange', function(ev) {
			if (document.visibilityState === 'visible') {
				displayKaiAds();
				if (!isGameOver && ispaused)
					setTimeout(pausedGame, 1000);
			}
		});

	}, false);

}

addEvents();

