
var lastFrameTime = Date.now();
var currentFrameTime = Date.now();
var timeElapsed = 0;
var updateInterval = 1000 / Config.fps;
var frame = 0;
//var second = 0;
var map,tempMap;
var display = '';
var running = false;
var chars = [];
var charDetailId = null;
var mapText = null;

window.onload = function()
{
	//document.getElementById('data').value = convertToText(mapData,0);
	Html.create('canvas');
	
	// Neuen Bitmap-Text
	mapText = new BitmapFont();
	mapText.init();
	
	// Interface initialisieren
	Interface.init();
	
	Html.canvas.focus();
};


function gameInit()
{
	// Party Init
	Player.init();
	
	// Hauptchar erstellen
	var char = new Character(); 
	chars.push(char);
	delete char;
	chars[0].init('char_1',50,100,'Steph',20,5);
	

	// Test: zweiter Char erstellen
	var char = new Character(); 
	chars.push(char);
	chars[1].init('char_2',100,100,'Igor',10,7);

	
	// Karte anlegen
	map = new Map();
	map.init('map',true);
	map.setTileAsExplored(Player.position.x,Player.position.y);
	
	// Steuerung Init
	initKeyboard();
	initMouse();
	
	// Testgegenstände in Inventar legen
	Inventory.addItem(new Item('potion_of_health'),1);
	Inventory.addItem(new Item('potion_of_mana'),35);
}


function gameLoop()
{
	if(running == false)
	{
		running = true;
	}
	window.requestAnimationFrame(gameLoop);
	lastFrameTime = currentFrameTime;
	currentFrameTime = Date.now();
	timeElapsed +=  currentFrameTime - lastFrameTime;
	if(timeElapsed >= updateInterval)
	{ 
		frame++;
		timeElapsed = 0;
		update();
		if(frame == Config.fps)
		{
			//second++;
			frame = 0;
		}
	}
	render();
}


function update()
{
	if(display == 'action')
	{
		map.handleTextureAnimation();
		map.handleCameraAnimation();
		Player.moveHandler();
	}
}


function render()
{
	Html.context.clearRect(0,0,Html.canvas.width,Html.canvas.height);
	
	// Spiel läuft
	if(display == 'action')
	{
		if(tempMap != null)
		{
			tempMap.draw(tempMap.cameraAnimation.newDirection);
		}
		map.draw(Player.direction);
		Interface.draw();
	}
	
	// Preloading...
	else if(display == 'preloading')
	{
		Interface.draw();
	}
	
	// Spiel zeigt die Automap
	else if(display == 'automap')
	{
		Automap.draw();
	}
	
	// Charakter-Detail
	else if(display == 'character')
	{
		chars[charDetailId].drawDetail();
		Interface.draw();
		
	}
}