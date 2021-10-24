
var KEY_LEFT = 37;
var KEY_RIGHT = 39;
var KEY_UP = 38;
var KEY_DOWN = 40;
var KEY_PAGE_DOWN = 34;
var KEY_DELETE = 46;


var Input = {
	up:false,
	down:false,
	left:false,
	right:false,
	turnLeft:false,
	turnRight:false,
	mouse:{}
};


var Controls = {
	setLeft:function()
	{
		Input.left  = true;
		Input.right = false;
		Input.up    = false;
		Input.down  = false;
		Input.turn  = false;
	},
	setRight:function()
	{
		Input.left  = false;
		Input.right = true;
		Input.up    = false;
		Input.down  = false;
		Input.turn  = false;
	},
	setUp:function()
	{
		Input.left  = false;
		Input.right = false;
		Input.up    = true;
		Input.down  = false;
		Input.turn  = false;
	},
	setDown:function()
	{
		Input.left  = false;
		Input.right = false;
		Input.up    = false;
		Input.down  = true;
		Input.turn  = false;
	},
	setTurnLeft:function()
	{
		Player.oldDirection = Player.direction;
		if(Player.oldDirection == 'east')
		{
			Player.newDirection = 'north';
		}
		else if(Player.oldDirection == 'north')
		{
			Player.newDirection = 'west';
		}
		else if(Player.oldDirection == 'west')
		{
			Player.newDirection = 'south';
		}
		else if(Player.oldDirection == 'south')
		{
			Player.newDirection = 'east';
		}
		Input.left  = false;
		Input.right = false;
		Input.up    = false;
		Input.down  = false;
		Input.turnLeft = true;
		Input.turnRight = false;
	},
	setTurnRight:function()
	{
		Player.oldDirection = Player.direction;
		if(Player.oldDirection == 'north')
		{
			Player.newDirection = 'east';
		}
		else if(Player.oldDirection == 'east')
		{
			Player.newDirection = 'south';
		}
		else if(Player.oldDirection == 'south')
		{
			Player.newDirection = 'west';
		}
		else if(Player.oldDirection == 'west')
		{
			Player.newDirection = 'north';
		}
		Input.left  = false;
		Input.right = false;
		Input.up    = false;
		Input.down  = false;
		Input.turnLeft = false;
		Input.turnRight = true;
	}
};


var MouseCursor = {
	item:{},
	
	init:function()
	{
		Html.canvas.addEventListener('mousemove',this.getMousePos,false);
	},
	
	getMousePos:function(event)
	{
		Input.mouse = getMousePos(Html.canvas,event);
	},
	
	draw:function(_x,_y)
	{
		if(this.item.id != undefined)
		{
			this.item.sprite.draw(_x-10,_y-10,20,20,0,0,20,20);
		}
	},
	
	destroy:function()
	{
		Html.canvas.removeEventListener('mousemove',this.getMousePos,false);
	}
};


function getMousePos(_canvas,_event)
{
	var rect = _canvas.getBoundingClientRect();
	return {
		x: Math.round((_event.clientX - rect.left)/Config.canvas_zoom),
		y: Math.round((_event.clientY - rect.top)/Config.canvas_zoom)
	};
}


function isClickInside(_mouse,_rect,_area)
{
	if(_area == 'window')
	{
		return	_mouse.x > _rect.x+Config.window_x &&
						_mouse.x < _rect.x+Config.window_x + _rect.width &&
						_mouse.y < _rect.y+Config.window_y + _rect.height &&
						_mouse.y > _rect.y+Config.window_y;
	}
	else
	{
		return	_mouse.x > _rect.x &&
						_mouse.x < _rect.x + _rect.width &&
						_mouse.y < _rect.y + _rect.height &&
						_mouse.y > _rect.y;
	}
}


function initMouse()
{
	Html.canvas.addEventListener('click', function(evt)
	{
		var interactionArea = 'window';
		
		Input.mouse = getMousePos(Html.canvas,evt);
		
		
		// Prüfen, ob der Spieler auf das Interface, oder das Sichtfeld geklickt hat
		if(Input.mouse.x < Config.window_x)
		{
			interactionArea = 'interface';
		}
		else
		{
			if(Input.mouse.y > Config.window_height)
			{
				interactionArea = 'interface';
			}
		}
		
		
		// Im Sichtfenster wurde geklickt
		if(interactionArea == 'window')
		{
			// Klick-Events im Charakter-Screen
			if(display == 'character')
			{
				// Charakter-Detail schliessen
				if(isClickInside(Input.mouse, Interface.clickRects.characterDetailButtonClose, interactionArea))
				{
					charDetailId = null;
					display = 'action';
				}
				
				// Alle Item-Positionen durchlaufen
				for(var itemCategory in Interface.clickRects.characterDetailItems)
				{
					// Treffer
					if(isClickInside(Input.mouse, Interface.clickRects.characterDetailItems[itemCategory], interactionArea))
					{
						// Der MouseCursor hat ein Item
						if(MouseCursor.item.id != undefined)
						{
							if(MouseCursor.item.type == 'equipment' && MouseCursor.item.category == itemCategory)
							{
								// Dem Charakter das Item an der EquipentPosition zuweisen
								chars[charDetailId].equipment[itemCategory] = MouseCursor.item;
								
								// Charakter-Werte neu berechnen
								chars[charDetailId].update();
								
								// MouseCursor leeren
								MouseCursor.item = {};
								
								// MouseMove-Event löschen
								MouseCursor.destroy();
							}
						}
						
						// Der MouseCursor hat kein Item
						else
						{
							// Der Item-Slot hat ein Item
							if(chars[charDetailId].equipment[itemCategory].id != undefined)
							{
								// Das Equipement-Item an den MouseCursor heften
								MouseCursor.item = chars[charDetailId].equipment[itemCategory];
								MouseCursor.init();
								
								// Das Item aus dem Charakter-Equipment entfernen
								chars[charDetailId].equipment[itemCategory] = {};
								
								// Charakter-Werte neu berechnen
								chars[charDetailId].update();
							}
						}
						
						break;
					}
				}
			}
			// Klick-Events im Spielmodus
			else if(display == 'action')
			{
				// Gibt X/Y-Pos des Wand und die Textur-Set-Id zurück
				var tileDataInFrontOfPlayer = map.getTileDataInFrontOfPlayer();
				
				// Prüft, ob die Wand, vor der wir stehen, Interaktion hat
				if(mapData['map'+Config.current_map].geometrics[tileDataInFrontOfPlayer.y][tileDataInFrontOfPlayer.x].interaction != undefined)
				{
					// Interaktionsdaten
					var interaction = mapData['map'+Config.current_map].geometrics[tileDataInFrontOfPlayer.y][tileDataInFrontOfPlayer.x].interaction;
					
					// Prüfen, ob eine Interaktion definiert ist
					if(interaction.clickRect != undefined)
					{
						// Auf ein Rect der Interaktion wurde geklickt
						if(isClickInside(Input.mouse,interaction.clickRect,interactionArea))
						{
							// Hier muss noch die jeweilige Interaktion gestartet werden
							map.startTextureAnimation(tileDataInFrontOfPlayer.x,tileDataInFrontOfPlayer.y,interaction);
							//console.log('Button auf Textur "'+tileDataInFrontOfPlayer.textureSetId+'" wurde gedrückt');
						}
					}
				}
				
				// Alle ClickRects für Items durchlaufen
				for(var itemClicRect in Config.tileItemClickRects)
				{
					// Treffer
					if(isClickInside(Input.mouse,Config.tileItemClickRects[itemClicRect],interactionArea))
					{
						// [1] = Depth, [2] = left / right
						var checkData = itemClicRect.split('_');
						
						// Tiefe 0
						if(checkData[1] == 0)
						{
							var tilePositionX = Player.position.x;
							var tilePositionY = Player.position.y;
							
							// Wurde links (0) oder rechts (1) gedrückt?
							var tileItemPositionIdIndex = (checkData[2] == 'left') ? 0 : 1;
						}
						// Tiefe 1
						else if(checkData[1] == 1)
						{
							var tilePositionX = tileDataInFrontOfPlayer.x;
							var tilePositionY = tileDataInFrontOfPlayer.y;
							
							// Wurde links (0) oder rechts (1) gedrückt?
							var tileItemPositionIdIndex = (checkData[2] == 'left') ? 2 : 3;
						}
						
						// Welche Position auf der Kachel ist durch den Klick angesprochen?
						var tileItemPositionId = Config.tileItemPositions[Player.direction][tileItemPositionIdIndex];
						
						// Items auf der Kachel
						var tileItems = map.getTileItemsByPositionId(tilePositionX,tilePositionY,tileItemPositionId);
						
						// Es gibt Items auf der Kachel im geklickten Bereich
						if(tileItems.length > 0)
						{
							// Die Maus hat ein Item angeheftet
							if(MouseCursor.item.id != undefined)
							{
								// Item ablegen
								map.setTileItemsLastItem(tilePositionX,tilePositionY,tileItemPositionId,MouseCursor.item);
								
								// Maus-Item entfernen
								MouseCursor.item = {};
							}
							else
							{
								// Das Item an den Mauszeiger heften
								MouseCursor.item = map.getTileItemsLastItem(tilePositionX,tilePositionY,tileItemPositionId,tileItems);
								MouseCursor.init();
								
								// Den letzten Item-Eintrag auf dieser Kachel auf dieser Position entfernen
								map.removeTileItemsLastItem(tilePositionX,tilePositionY,tileItemPositionId);
							}
						}
						// Es gibt keine Items auf der Kachel
						else
						{
							// Die Maus hat ein Item angeheftet
							if(MouseCursor.item.id != undefined)
							{
								// Das Maus-Item an die Kachel mit der geklickten Position übertragen
								map.setTileItemsLastItem(tilePositionX,tilePositionY,tileItemPositionId,MouseCursor.item);
								
								// Das Maus-Item entfernen
								MouseCursor.item = {};
							}
						}
					}
				}
			}
		}
		
		
		// Im Interface wurde geklickt
		else
		{
			if(display == 'action')
			{
				// Party-Bewegung
				for(var tempDirection in Interface.clickRects.partyMove)
				{
					if(isClickInside(Input.mouse, Interface.clickRects.partyMove[tempDirection], interactionArea))
					{
						Controls['set'+tempDirection]();
						delete tempDirection;
						break;
					}
				}
				
				
				// Automap öffnen
				if(isClickInside(Input.mouse, Interface.clickRects.automap, interactionArea))
				{
					display = 'automap';
				}
				// Automap schliessen
				if(isClickInside(Input.mouse, Interface.clickRects.automapButtonClose, interactionArea))
				{
					display = 'action';
				}
				
				
				// Auf ein Charakter-Portrait wurde geklickt
				var tempCharDetail = Interface.clickRects.characterDetail[chars.length-1];
				for(var char=0;char < tempCharDetail.length; char++)
				{
					if(isClickInside(Input.mouse,tempCharDetail[char],interactionArea))
					{
						// Id des Chars
						charDetailId = char;
						
						// Der MouseCursor hat ein Item
						if(MouseCursor.item.id != undefined)
						{
							if(MouseCursor.item.type == 'healing')
							{
								console.log('Heilung ausführen und danach Item zerstören');
							}
							else
							{
								display = 'character';
							}
						}
						else
						{
							display = 'character';
						}
					}
				}
			}
			else if(display == 'automap')
			{
				// Automap schliessen
				if(isClickInside(Input.mouse, Interface.clickRects.automapButtonClose, interactionArea))
				{
					display = 'action';
				}
			}
			
			if(display != 'automap')
			{
				// Inventar nach links scrollen
				if(isClickInside(Input.mouse, Interface.clickRects.inventoryButtonLeft, interactionArea))
				{
					Inventory.scrollLeft();
				}
				// Inventar nach rechts scrollen
				else if(isClickInside(Input.mouse, Interface.clickRects.inventoryButtonRight, interactionArea))
				{
					Inventory.scrollRight();
				}
				// Inventar-Items
				else if(isClickInside(Input.mouse, Interface.clickRects.inventory, interactionArea))
				{
					// Herausfinden, welche Position geklickt wurde 0-8
					var clickedPosition = Math.floor((Input.mouse.x - Inventory.x) / Inventory.itemWidth);
					
					// Welche Position im Inventory sollte das Item haben
					var clickedItem = Inventory.startItem+clickedPosition;
					if(clickedItem > Inventory.items.length-1)
					{
						clickedItem = clickedItem-Inventory.items.length-1+1;
					}
					
					// Das Feld ist leer, das Item ablegen
					if(Inventory.items[clickedItem].id == undefined)
					{
						// Das Item hinzufügen
						Inventory.addItem(MouseCursor.item,clickedItem);
						
						// Den MouseCursor leeren
						MouseCursor.item = {};
						
						// MouseMove-Event entfernen
						MouseCursor.destroy();
					}
					// Das Feld ist nicht leer
					else
					{
						// Der Mauscursor hat ein Item, also tauschen
						if(MouseCursor.item.id != undefined)
						{
							// Zwiwchenspeicher vom MouseCursor-Item
							var tempMouseCursorItem = MouseCursor.item;
							
							// Zwischenspeicherung des zu tauschenden Intentar-Items
							var tempInventoryItem = Inventory.items[clickedItem];
							
							// Das geklicke Item aus dem Inventar entfernen
							Inventory.removeItem(clickedItem);
							
							// Das MouseCursor-Item entfernen
							MouseCursor.item = {};
							
							// Dem Inventar das temporäre MouseCursor-Item hinzufügen
							Inventory.addItem(tempMouseCursorItem,clickedItem);
							
							// Dem MouseCursor das temporäre Inventar-Item hinzufügen
							MouseCursor.item = tempInventoryItem;
							
							// Temporäre Variablen löschen
							delete tempMouseCursorItem;
							delete tempInventoryItem;
						}
						// Der MouseCursor hat kein Item
						else
						{
							// Das geklickte Inventar-Item dem MouseCursor anheften
							MouseCursor.item = Inventory.removeItem(clickedItem);
							MouseCursor.init();
						}
					}
				}
			}
		}
	},false);
}



function initKeyboard()
{
	document.addEventListener('keyup', function(event)
	{
		if(map.cameraAnimation == null && display == 'action')
		{
			if(event.keyCode == KEY_LEFT)
			{
				Controls.setLeft();
			}
			if(event.keyCode == KEY_RIGHT)
			{
				Controls.setRight();
			}
			if(event.keyCode == KEY_UP)
			{
				Controls.setUp();
			}
			if(event.keyCode == KEY_DOWN)
			{
				Controls.setDown();
			}
			// Nach links drehen
			if(event.keyCode == KEY_DELETE)
			{
				Controls.setTurnLeft();
			}
			// Nach rechts drehen
			if(event.keyCode == KEY_PAGE_DOWN)
			{
				Controls.setTurnRight();
			}
		}
	});
}


