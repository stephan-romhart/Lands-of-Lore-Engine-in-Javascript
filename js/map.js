
var Map = function()
{
	this.images = null;
	this.sprites = null;
	this.zoomX = 0;
	this.zoomY = 0;
	this.opacity = 1;
	this.textureAnimations = {};
	this.cameraAnimation = null;
	this.objectName = '';
	this.textureSetFiles = {};
	this.preloadImageList = [];
	this.mode = 'game';
};


Map.prototype.init = function(_objectName,_fadeIn,_mode)
{
	this.sprites = {};
	this.objectName = _objectName;
	
	if(_mode != undefined)
	{
		this.mode = _mode;
	}
	
	if(_fadeIn != undefined && _fadeIn == true)
	{
		// Karte einfaden
		this.cameraAnimation = {
			action:'Fade',
			frame:0,
			frameLength:20,
			direction:'in'
		};
	}
	
	// Alle Textur-Sets der Karte durchlaufen
	for(var i=0; i < mapData['map'+Config.current_map].textureSets.length; i++)
	{
		// Textur-Set-Id
		var textureSetId = mapData['map'+Config.current_map].textureSets[i];
		
		// Textur-Set-Dateien erzeugen
		this.textureSetFiles[textureSetId] = Textures.getTextureSetFileList(textureSetId);
	}
	
	// Texturen-Ladeliste erstellen
	for(var textureSetId in this.textureSetFiles)
	{
		for(var key in this.textureSetFiles[textureSetId])
		{
			this.preloadImageList.push(this.textureSetFiles[textureSetId][key]);
		}
	}
	
	// Bei der Karte den Preloader starten
	// Auf keinen Fall bei der tempMap
	if(this.objectName == 'map')
	{
		var that = this;
		var texturesPreloader = new Asset();
		texturesPreloader.progressBarX = (Config.canvas_width*Config.canvas_zoom - texturesPreloader.progressBarWidth)/2;
		texturesPreloader.progressBarY = (Config.canvas_height*Config.canvas_zoom - texturesPreloader.progressBarHeight)/2;
		for(var i=0; i<that.preloadImageList.length; i++)
		{
			texturesPreloader.queueDownload(that.preloadImageList[i]);
		}
		texturesPreloader.downloadAll(function(){ that.initSprites(); });
	}
	// Bei der tempMap nur die Sprites initialisieren
	else
	{
		this.initSprites();
	}
};


Map.prototype.initSprites = function()
{
	for(var textureSetId in this.textureSetFiles)
	{
		for(var key in this.textureSetFiles[textureSetId])
		{
			this.sprites['texture_'+textureSetId+'_'+key] = new Sprite(this.textureSetFiles[textureSetId][key]);
		}
	}
	
	// Bei der Karten den gameLoop starten
	if(this.objectName == 'map')
	{
		window.display = 'action';
		if(this.mode == 'game' && running == false)
		{
			window.gameLoop();
		}
		else if(this.mode == 'map-editor')
		{
			Gameeditor.drawPreview();
		}
	}
};


Map.prototype.setTileAsExplored = function(_x,_y)
{
	var positions = [[-1,0,1],[-1,0,1],[-1,0,1]];
	for(var y=0; y<positions.length; y++)
	{
		for(var x=0; x<positions[y].length; x++)
		{
			var tempY = _y + y - 1;
			var tempX = _x + positions[y][x];
			if(	mapData['map'+Config.current_map].geometrics[tempY] != undefined &&
					mapData['map'+Config.current_map].geometrics[tempY][tempX] != undefined)
			{
				mapData['map'+Config.current_map].geometrics[tempY][tempX].explored = 1;
			}
		}
	}
};


Map.prototype.getSpriteZoomData = function(_zoomX,_zoomY,_textureSize,_spriteX,_spriteY)
{
	// Y-Zentrum nicht in der Mitte, sondern um 28px noch oben verschoben
	var y_center = (Config.window_height/2)-28;
	
	var distance_init_x = (Config.window_width/2) - (_spriteX) - (_textureSize[0]/2);
	var distance_init_y = _spriteY + (Math.ceil(_textureSize[1]/2)) - y_center;
		
	var sprite_zoom_width = Math.ceil(_textureSize[0] * _zoomX);
	var sprite_zoom_height = Math.ceil(_textureSize[1] * _zoomY);
	var sprite_zoom_x = Math.ceil((Config.window_width/2) - (distance_init_x*_zoomX) - (sprite_zoom_width/2));
	var sprite_zoom_y = Math.ceil(y_center + (distance_init_y*_zoomY) - (sprite_zoom_height/2));
	
	return {
		new_width:sprite_zoom_width,
		new_height:sprite_zoom_height,
		new_x:sprite_zoom_x,
		new_y:sprite_zoom_y
	};
};


// Gibt die MapItemData der Wand vor der der Spieler steht zurück
Map.prototype.getTileDataInFrontOfPlayer = function()
{
	var move_rule = Config.move_rules[Player.direction];
	var move_type = 'up';
	
	check_texture_id = move_rule[move_type]['check_texture_id'];
	if(move_rule[move_type]['move_axis'] == 'y')
	{
		check_y = 1 * move_rule[move_type]['y'];
		check_x = move_rule[move_type]['x'];
	}
	else
	{
		check_y = move_rule[move_type]['y'];
		check_x = 1 * move_rule[move_type]['x'];
	}
	var texture_id = this.getTextureSetId(check_x,check_y,check_texture_id);
	
	return {
		textureSetId:texture_id,
		checkTexture:check_texture_id,
		x:Player.position.x+check_x,
		y:Player.position.y+check_y
	};
};


Map.prototype.getTextureSetId = function(check_x,check_y,check_texture_id)
{
	return mapData['map'+Config.current_map].geometrics[Player.position.y+check_y][Player.position.x+check_x].textures[check_texture_id];
};


Map.prototype.drawTexture = function(_windowX,_windowY,_textureSize,_spriteName,_textureCoordinates,_frame,_door)
{
	var source_size = _textureSize;
	var source_coordinates = [0,0];
	var destination_size = _textureSize;
	var destination_coordinates = _textureCoordinates;
	var source_full_width = source_size[0];
	
	// Bei einer Länge von 4 muss das Sprite beschnitten werden
	if(destination_coordinates.length == 4)
	{
		source_coordinates = [destination_coordinates[2],destination_coordinates[3]];
		source_full_width = source_size[2];
	}
	
	// Es muss nur ein bestimmter Frame eines Sprites gezeichnet werden
	if(_frame != -1)
	{
		source_coordinates[0] = (source_full_width * _frame) + source_coordinates[0];
	}
	
	// Das Sprite muss gezoomt werden
	if(this.zoomX != 0 || this.zoomY != 0)
	{
		var spriteZoomData = this.getSpriteZoomData(
			this.zoomX,
			this.zoomY,
			source_size,
			destination_coordinates[0],
			destination_coordinates[1]
		);
		
		destination_coordinates = [spriteZoomData.new_x,spriteZoomData.new_y];
		destination_size = [spriteZoomData.new_width,spriteZoomData.new_height];
	}
	
	// Das Sprite zeichnen
	if(this.sprites[_spriteName] != undefined)
	{
		this.sprites[_spriteName].draw(
			_windowX+destination_coordinates[0],
			_windowY+destination_coordinates[1],
			destination_size[0],
			destination_size[1],
			source_coordinates[0]+_door,
			source_coordinates[1],
			source_size[0],
			source_size[1]
		);
	}
};


Map.prototype.drawItem = function(_sprite,_windowX,_windowY,_itemDestSize,_itemCoordinates)
{
	var source_size = _itemDestSize;
	var source_coordinates = [_itemDestSize[2],0];
	var destination_size = _itemDestSize;
	var destination_coordinates = _itemCoordinates;
	
	// Das Sprite muss gezoomt werden
	if(this.zoomX != 0 || this.zoomY != 0)
	{
		var spriteZoomData = this.getSpriteZoomData(
			this.zoomX,
			this.zoomY,
			destination_size, // zuvor source_size
			destination_coordinates[0],
			destination_coordinates[1]
		);
		
		destination_coordinates = [spriteZoomData.new_x,spriteZoomData.new_y];
		destination_size = [spriteZoomData.new_width,spriteZoomData.new_height];
	}
	
	// Das Sprite zeichnen
	if(_sprite != undefined)
	{
		_sprite.draw(
			_windowX+destination_coordinates[0],	//dx
			_windowY+destination_coordinates[1],	//dy
			destination_size[0],									//dw 14
			destination_size[1],									//dh 20
			source_coordinates[0],								//sx 20
			source_coordinates[1],								//sy 0
			source_size[0],									//sw 14
			source_size[1]										//sh 20
		);
	}
	else
	{
		console.log(_sprite);
	}
};


Map.prototype.drawRect = function(_x,_y,_width,_height,_backgroundColor)
{
	Html.context.fillStyle = _backgroundColor;
	Html.context.fillRect(_x,_y,_width,_height);
};


Map.prototype.draw = function(_playerDirection)
{
	var frame,wallSpriteId,check_x,check_y,check_texture_id,textureIdSegments;
	var items = [];
	
	var windowX = Config.window_x;
	var windowY = Config.window_y;
	var playerPosition = { x:parseInt(Player.position.x),y:parseInt(Player.position.y) };
	var windowWidthHalf = Config.window_width / 2;
	
	// Die Kamera wird animiert
	if(this.cameraAnimation != null)
	{
		// Die Kamera wird bewegt
		if(this.cameraAnimation.newX != undefined)
		{
			windowX = Config.window_x + this.cameraAnimation.newX;
			windowY = Config.window_y + this.cameraAnimation.newY;
		}
		// Die Tempmap bewegen
		if(this.cameraAnimation.newPosition != undefined && this.objectName == 'tempMap')
		{
			playerPosition[this.cameraAnimation.newPosition[0]] = this.cameraAnimation.newPosition[1];
		}
	}
	
	
	// Transparenz aller Texturen auf 1 stellen
	// Warum nochmal?
	Html.context.globalAlpha = 1;
	
	// Hintergrundfarbe des Levels
	this.drawRect(
		windowX*Config.canvas_zoom,
		windowY*Config.canvas_zoom,
		Config.window_width*Config.canvas_zoom,
		Config.window_height*Config.canvas_zoom,
		mapData['map'+Config.current_map].backgroundColor
	);
	
	// Alle sichtbaren Tiefen durchlaufen,
	// bei 3 beginnen, bei 0 beenden
	for(var depth=3; depth>-1; depth--)
	{
		// Regeln für die aktuelle Spieler-Richtung auslesen
		var textureRules = Config.mapTextureRules[_playerDirection];
		
		// Items leeren
		items = [[],[],[],[]];
		
		// Alle Texturen durchlaufen
		for(var textureId in textureRules)
		{
			// Frame für die Textur zurücksetzen
			var frame = -1;
			var door = 0;
			
			
			// Segmente der TextureId
			var textureIdSegments = textureId.split('_');
			
			// Die TexturId für die Sichtbarkeitsprüfung
			var check_texture_id = textureRules[textureId]['check_texture_id'];
			
			// Die TexturId für die Darstellung
			var display_texture_id = textureRules[textureId]['display_texture_id'];
			
			// Bei Tiefe 0 und Texturen mit dem Segment 'frontal'
			// einfach nichts machen
			if(depth == 0 && textureIdSegments[1] == 'frontal')
			{
			}
			
			// Bei allen anderen Tiefen
			else
			{
				// Die zu prüfenden Felder bestimmen
				if(textureRules[textureId]['axis'] == 'y')
				{
					check_y = depth * textureRules[textureId]['y'];
					check_x = textureRules[textureId]['x'];
				}
				else
				{
					check_y = textureRules[textureId]['y'];
					check_x = depth * textureRules[textureId]['x'];
				}
				var mapItemX = playerPosition.x + check_x;
				var mapItemY = playerPosition.y + check_y;
				
				// Der zu prüfende Karteneintrag existiert
				if(	mapData['map'+Config.current_map].geometrics[mapItemY] != undefined &&
						mapData['map'+Config.current_map].geometrics[mapItemY][mapItemX] != undefined)
				{
					// Nur bei Floor-Elementen prüfen
					// Das soll die Anzahl der For-Schleifen reduzieren
					if(textureIdSegments[0] == 'floor')
					{
						// Das Feld hat Items
						for(var itemPos=0; itemPos<4; itemPos++)
						{
							if(mapData['map'+Config.current_map].geometrics[mapItemY][mapItemX].items[itemPos].length > 0)
							{
								var tileItemList = mapData['map'+Config.current_map].geometrics[mapItemY][mapItemX].items[itemPos];
								
								for(var item=0; item<tileItemList.length; item++)
								{
									items[itemPos].push(new Item(
										tileItemList[item].id,
										tileItemList[item].mapPosition,
										depth,
										check_x,
										check_y,
										textureIdSegments[1]
									));
									
									// ItemData muss für die controls erstellt werden, um das Item in den Mouse-Cursor zu kopieren
									mapData['map'+Config.current_map].geometrics[mapItemY][mapItemX].items[itemPos][item].itemData = new Item(
										tileItemList[item].id,
										tileItemList[item].mapPosition,
										depth,
										check_x,
										check_y,
										textureIdSegments[1]
									);
									
								}
							}
						}
					}
					
					// Die Textur ist sichtbar
					if(this.checkTextureVisibility(mapItemX,mapItemY,check_texture_id,textureIdSegments[0]))
					{
						// Texturset
						var textureSetId = mapData['map'+Config.current_map].geometrics[mapItemY][mapItemX].textures[display_texture_id];
						
						//
						var wallSpriteId = textureIdSegments[0]+'_'+textureIdSegments[1];
						
						// Prüfen, ob das Kartenelement eine Animation hat
						if(	mapData['map'+Config.current_map].geometrics[mapItemY][mapItemX].interaction != undefined &&
								mapData['map'+Config.current_map].geometrics[mapItemY][mapItemX].interaction.animatedTextureIds != undefined)
						{
							if(mapData['map'+Config.current_map].geometrics[mapItemY][mapItemX].interaction.animatedTextureIds.indexOf(display_texture_id) > -1)
							{
								frame = mapData['map'+Config.current_map].geometrics[mapItemY][mapItemX].interaction.frame;
							}
						}
						// Prüfen, ob die Textur eine Tür ist
						if(	mapData['map'+Config.current_map].geometrics[mapItemY][mapItemX].interaction != undefined &&
								mapData['map'+Config.current_map].geometrics[mapItemY][mapItemX].interaction.action == 'Door')
						{
							// Bei Türen muss wegen der Transparenz des Rahmens der Ausschnitt verschoben werden
							if(textureIdSegments[1] == 'frontal' && textureIdSegments[2] == 'left')
							{
								door = -15;
							}
							else if (textureIdSegments[1] == 'frontal' && textureIdSegments[2] == 'right')
							{
								door = 15;
							}
						}
						
						// Textur zeichnen
						this.drawTexture(
							windowX,
							windowY,
							Config.textures['depth_'+depth].sizes[textureId],
							'texture_'+textureSetId+'_file_'+depth+'_'+wallSpriteId,
							Config.textures['depth_'+depth].coordinates[textureId],
							frame,
							door
						);
					}
				}
			}
		}
		
		// Items der Tiefe zeichnen
		// Je nach Bickrichtung wird die Reihenfolge der Itemplätze geändert
		for(var temp=0; temp<Config.tileItemPositions[Player.direction].length; temp++)
		{
			//
			var itemPos = Config.tileItemPositions[Player.direction][temp];
			
			// Items durchlaufen
			for(var item=0; item<items[itemPos].length; item++)
			{
				var itemData = items[itemPos][item];
				
				var itemWidth = itemData.sprite.getWidth();
				var itemHeight = itemData.sprite.getHeight();
				
				var itemDepthWidth = itemData.actionSize[itemData.mapDepth][0];
				var itemDepthWidthHalf = itemDepthWidth/2;
				var itemDepthHeight = itemData.actionSize[itemData.mapDepth][1];
				var itemDepthHeightHalf = itemDepthHeight/2;
				var itemSpriteStartX = itemData.actionSize[itemData.mapDepth][2];
				
				var itemX = 0;
				var itemY = 0;
				
				if(itemData.texturePosX == 'left')
				{
					itemX = itemDepthWidthHalf * -1;
				}
				else if(itemData.texturePosX == 'center')
				{
					itemX = windowWidthHalf - itemDepthWidthHalf;
				}
				else if(itemData.texturePosX == 'right')
				{
					itemX = Config.window_width - itemDepthWidthHalf;
				}
				
				// Bei einer Tiefe von 0
				if(itemData.mapDepth == 0)
				{
					itemY = (temp < 2) ? 100 : 200;
				}
				else if(itemData.mapDepth == 1)
				{
					Html.context.globalAlpha = 0.75;
					itemY = (temp < 2) ? 70 : 85;
				}
				else if(itemData.mapDepth == 2)
				{
					Html.context.globalAlpha = 0.5;
					itemY = (temp < 2) ? 52 : 58;
				}
				
				itemY = itemY + itemDepthHeightHalf;
				itemX = itemX + Config.tileItemAddons['depth_'+itemData.mapDepth][itemData.texturePosX][temp];
				
				this.drawItem(
					itemData.sprite,
					windowX,
					windowY,
					[itemDepthWidth,itemDepthHeight,itemSpriteStartX],
					[itemX,itemY]
				);
				Html.context.globalAlpha = 1;
			}
		}
	}
	
	// Hier passiert der Fadein und Fadeout der Map
	// Anstatt die Map zu faden, ein schwarzes Rechteck blenden
	if(this.cameraAnimation != null)
	{
		if(this.cameraAnimation.opacity != undefined)
		{
			Html.context.globalAlpha = this.cameraAnimation.opacity;
			// Hintergrundfarbe des Levels
			
			this.drawRect(
				windowX*Config.canvas_zoom,
				windowY*Config.canvas_zoom,
				Config.window_width*Config.canvas_zoom,
				Config.window_height*Config.canvas_zoom,
				'#000000'
			);
		}
	}
};


Map.prototype.handleTextureAnimation = function()
{
	// Alle Animationen durchlaufen
	for(var y in this.textureAnimations)
	{
		for(var x in this.textureAnimations[y])
		{
			this['textureAnimation'+this.textureAnimations[y][x].action](x,y,this.textureAnimations[y][x]);
		}
	}
};


Map.prototype.textureAnimationDoor = function(_x,_y,_animationData)
{
	if(_animationData.status == 'closed')
	{
		if(mapData['map'+Config.current_map].geometrics[_y][_x].interaction.frame < _animationData.animationLength)
		{
			Interface.audio['gate'].play();
			mapData['map'+Config.current_map].geometrics[_y][_x].interaction.frame++;
		}
		else if(mapData['map'+Config.current_map].geometrics[_y][_x].interaction.frame == _animationData.animationLength)
		{
			mapData['map'+Config.current_map].geometrics[_y][_x].solid = 0;
			mapData['map'+Config.current_map].geometrics[_y][_x].interaction.status = 'open';
			//Interface.audio['gate'].pause();
			//Interface.audio['gate'].currentTime = 0;
			delete this.textureAnimations[_y][_x];
		}
	}
	else if(_animationData.status == 'open')
	{
		if(mapData['map'+Config.current_map].geometrics[_y][_x].interaction.frame > 0)
		{
			Interface.audio['gate'].play();
			mapData['map'+Config.current_map].geometrics[_y][_x].interaction.frame--;
		}
		else if(mapData['map'+Config.current_map].geometrics[_y][_x].interaction.frame == 0)
		{
			mapData['map'+Config.current_map].geometrics[_y][_x].solid = 1;
			mapData['map'+Config.current_map].geometrics[_y][_x].interaction.status = 'closed';
			//Interface.audio['gate'].pause();
			//Interface.audio['gate'].currentTime = 0;
			delete this.textureAnimations[_y][_x];
		}
	}
};


Map.prototype.cameraAnimationStepForward = function()
{
	if(this.cameraAnimation.frame == 0)
	{
		map.zoomX = this.cameraAnimation.zoomStart;
		map.zoomY = this.cameraAnimation.zoomStart;
		this.cameraAnimation.frame++;
	}
	else if(this.cameraAnimation.frame < this.cameraAnimation.frameLength)
	{
		map.zoomX += this.cameraAnimation.zoomStep;
		map.zoomY += this.cameraAnimation.zoomStep;
		this.cameraAnimation.frame++;
	}
	else if(this.cameraAnimation.frame == this.cameraAnimation.frameLength)
	{
		// Prüfen, ob teleportiert werden muss
		if(this.cameraAnimation.teleportData != undefined)
		{
			this.cameraAnimation = {
				action:'Fade',
				frame:0,
				frameLength:20,
				direction:'out',
				teleportData:this.cameraAnimation.teleportData
			};
		}
		else
		{
			Player.position.x = this.cameraAnimation.newPosition[0];
			Player.position.y = this.cameraAnimation.newPosition[1];
			map.setTileAsExplored(Player.position.x,Player.position.y);
			this.cameraAnimation = null;
			map.zoomX = 0;
			map.zoomY = 0;
		}
	}
};


Map.prototype.cameraAnimationStepBackward = function()
{
	
	if(this.cameraAnimation.frame == 0)
	{
		map.zoomX = this.cameraAnimation.zoomStart;
		map.zoomY = this.cameraAnimation.zoomStart;
		this.cameraAnimation.frame++;
	}
	else if(this.cameraAnimation.frame < this.cameraAnimation.frameLength)
	{
		map.zoomX -= this.cameraAnimation.zoomStep;
		map.zoomY -= this.cameraAnimation.zoomStep;
		this.cameraAnimation.frame++;
	}
	else if(this.cameraAnimation.frame == this.cameraAnimation.frameLength)
	{
		// Prüfen, ob teleportiert werden muss
		if(this.cameraAnimation.teleportData != undefined)
		{
			this.cameraAnimation = {
				action:'Fade',
				frame:0,
				frameLength:20,
				direction:'out',
				teleportData:this.cameraAnimation.teleportData
			};
		}
		else
		{
			map.zoomX = 0;
			map.zoomY = 0;
			Player.position.x = this.cameraAnimation.newPosition[0];
			Player.position.y = this.cameraAnimation.newPosition[1];
			map.setTileAsExplored(Player.position.x,Player.position.y);
			this.cameraAnimation = null;
		}
	}
};


Map.prototype.cameraAnimationFade = function()
{
	var direction = this.cameraAnimation.direction;
	
	// Fade In
	if(direction == 'in')
	{
		if(this.cameraAnimation.frame == 0)
		{
			this.cameraAnimation.opacity = 1;
			this.cameraAnimation.frame++;
		}
		else if(this.cameraAnimation.frame < this.cameraAnimation.frameLength)
		{
			this.cameraAnimation.opacity -= 0.05;
			this.cameraAnimation.frame++;
		}
		else if(this.cameraAnimation.frame == this.cameraAnimation.frameLength)
		{
			Html.context.globalAlpha = 1;
			this.cameraAnimation = null;
		}
	}
	// Fade Out
	else if(direction == 'out')
	{
		if(this.cameraAnimation.frame == 0)
		{
			this.cameraAnimation.opacity = 0;
			this.cameraAnimation.frame++;
		}
		else if(this.cameraAnimation.frame < this.cameraAnimation.frameLength)
		{
			this.cameraAnimation.opacity += 0.1;
			this.cameraAnimation.frame++;
		}
		else if(this.cameraAnimation.frame == this.cameraAnimation.frameLength)
		{
			if(this.cameraAnimation.teleportData != undefined)
			{
				this.changeMap(
					this.cameraAnimation.teleportData.mapId,
					this.cameraAnimation.teleportData.mapStartPosition,
					this.cameraAnimation.teleportData.type
				);
			}
			else
			{
				this.cameraAnimation = null;
			}
		}
	}
};


Map.prototype.changeMap = function(_newMapId,_newMapStartPosition,_teleportType)
{
	display = 'preloading';
	Config.current_map = _newMapId;
	map.init('map',true);
	map.zoomX = 0;
	map.zoomY = 0;
	Player.startPosition = _newMapStartPosition;
	Player.init();
	map.setTileAsExplored(Player.position.x,Player.position.y);
};


Map.prototype.cameraAnimationWallHit = function()
{
	var direction = this.cameraAnimation.direction;
	
	if(direction == 'up')
	{
		if(this.cameraAnimation.frame == 0)
		{
			this.zoomX = 1.05;
			this.zoomY = 1.05;
			this.cameraAnimation.frame++;
		}
		if(this.cameraAnimation.frame > 0 && this.cameraAnimation.frame < 5)
		{
			this.zoomX += 0.05;
			this.zoomY += 0.05;
			this.cameraAnimation.frame++;
		}
		if(this.cameraAnimation.frame == 5)
		{
			this.zoomX = 0;
			this.zoomY = 0;
			this.cameraAnimation = null;
		}
	}
	else if(direction == 'down')
	{
		if(this.cameraAnimation.frame == 0)
		{
			this.zoomX = 0.95;
			this.zoomY = 0.95;
			this.cameraAnimation.frame++;
		}
		else if(this.cameraAnimation.frame > 0 && this.cameraAnimation.frame < 4)
		{
			this.zoomX -= 0.025;
			this.zoomY -= 0.025;
			this.cameraAnimation.frame++;
		}
		else if(this.cameraAnimation.frame == 4)
		{
			this.zoomX = 0;
			this.zoomY = 0;
			this.cameraAnimation = null;
		}
	}
	else if(direction == 'left')
	{
		if(this.cameraAnimation.frame == 0)
		{
			this.cameraAnimation.newX = -13;
			this.cameraAnimation.frame++;
		}
		else if(this.cameraAnimation.frame == 1)
		{
			this.cameraAnimation.newX = -3;
			this.cameraAnimation.frame++;
		}
		else if(this.cameraAnimation.frame == 2)
		{
			this.cameraAnimation = null;
		}
	}
	else if(direction == 'right')
	{
		if(this.cameraAnimation.frame == 0)
		{
			this.cameraAnimation.newX = -3;
			this.cameraAnimation.frame++;
		}
		else if(this.cameraAnimation.frame == 1)
		{
			this.cameraAnimation.newX = -13;
			this.cameraAnimation.frame++;
		}
		else if(this.cameraAnimation.frame == 2)
		{
			this.cameraAnimation = null;
		}
	}
},


Map.prototype.cameraAnimationStepLeft = function()
{
	if(this.cameraAnimation.frame == 0)
	{
		map.cameraAnimation.newX = 53;
		tempMap.cameraAnimation.newX = -51;
		this.cameraAnimation.frame++;
	}
	else if(this.cameraAnimation.frame == 1)
	{
		map.cameraAnimation.newX = 83;
		tempMap.cameraAnimation.newX = -21;
		this.cameraAnimation.frame++;
	}
	else if(this.cameraAnimation.frame == 2)
	{
		var playerPosition = [tempMap.cameraAnimation.newPosition[0],tempMap.cameraAnimation.newPosition[1]];
		delete tempMap;
		tempMap = null;
		this.cameraAnimation = null;
		this.zoomX = 0;
		this.zoomY = 0;
		Player.position[playerPosition[0]] = playerPosition[1];
		map.setTileAsExplored(Player.position.x,Player.position.y);
		Player.newPosition = [];
	}
};


Map.prototype.cameraAnimationStepRight = function()
{
	if(this.cameraAnimation.frame == 0)
	{
		map.cameraAnimation.newX = -53;
		tempMap.cameraAnimation.newX = 51;
		this.cameraAnimation.frame++;
	}
	else if(this.cameraAnimation.frame == 1)
	{
		map.cameraAnimation.newX = -83;
		tempMap.cameraAnimation.newX = 21;
		this.cameraAnimation.frame++;
	}
	else if(this.cameraAnimation.frame == 2)
	{
		var playerPosition = [tempMap.cameraAnimation.newPosition[0],tempMap.cameraAnimation.newPosition[1]];
		delete tempMap;
		tempMap = null;
		this.cameraAnimation = null;
		this.zoomX = 0;
		this.zoomY = 0;
		Player.position[playerPosition[0]] = playerPosition[1];
		map.setTileAsExplored(Player.position.x,Player.position.y);
		Player.newPosition = [];
	}
};


Map.prototype.cameraAnimationTurnLeft = function()
{
	if(this.cameraAnimation.frame == 0)
	{
		map.cameraAnimation.newX = 230;
		tempMap.cameraAnimation.newX = -310;
		this.cameraAnimation.frame++;
	}
	else if(this.cameraAnimation.frame == 1)
	{
		map.cameraAnimation.newX = 310;
		tempMap.cameraAnimation.newX = -230;
		this.cameraAnimation.frame++;
	}
	else if(this.cameraAnimation.frame == 2)
	{
		delete tempMap;
		tempMap = null;
		this.cameraAnimation = null;
		this.zoomX = 0;
		this.zoomY = 0;
		Player.direction = Player.newDirection;
	}
};


Map.prototype.cameraAnimationTurnRight = function()
{
	if(this.cameraAnimation.frame == 0)
	{
		map.cameraAnimation.newX = -230; // -270+40;
		tempMap.cameraAnimation.newX = 310; //270+40;
		this.cameraAnimation.frame++;
	}
	else if(this.cameraAnimation.frame == 1)
	{
		map.cameraAnimation.newX = -310; //-270-40;
		tempMap.cameraAnimation.newX = 230; //270-40;
		this.cameraAnimation.frame++;
	}
	else if(this.cameraAnimation.frame == 2)
	{
		delete tempMap;
		tempMap = null;
		this.cameraAnimation = null;
		this.zoomX = 0;
		this.zoomY = 0;
		Player.direction = Player.newDirection;
	}
};


Map.prototype.handleCameraAnimation = function()
{
	if(this.cameraAnimation != null)
	{
		this['cameraAnimation'+this.cameraAnimation.action]();
	}
};


Map.prototype.checkMapItemAnimationExists = function(_mapItemX,_mapItemY)
{
	if(this.textureAnimations[_mapItemY] != undefined)
	{
		if(this.textureAnimations[_mapItemY][_mapItemX] != undefined)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	return false;
};


// Neue Textur-Animation hinzufügen
Map.prototype.startTextureAnimation = function(_mapItemX,_mapItemY,_animationData)
{
	if(!this.checkMapItemAnimationExists(_mapItemX,_mapItemY))
	{
		this.textureAnimations[_mapItemY] = {};
		this.textureAnimations[_mapItemY][_mapItemX] = _animationData;
	}
},


Map.prototype.checkTextureVisibility = function(_mapItemX,_mapItemY,_checkTextureId,_textureType)
{
	if(_textureType == 'wall')
	{
		if(	mapData['map'+Config.current_map].geometrics[_mapItemY][_mapItemX] != undefined &&
				mapData['map'+Config.current_map].geometrics[_mapItemY][_mapItemX].textures[_checkTextureId] >= 50)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	else if(_textureType == 'floor' || _textureType == 'ceiling')
	{
		if(	mapData['map'+Config.current_map].geometrics[_mapItemY][_mapItemX] != undefined &&
				mapData['map'+Config.current_map].geometrics[_mapItemY][_mapItemX].textures[_checkTextureId] < 100)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
};


Map.prototype.getTileItemsByPositionId = function(_x,_y,_tileItemPositionId)
{
	return mapData['map'+Config.current_map].geometrics[_y][_x].items[_tileItemPositionId];
};


Map.prototype.getTileItemsLastItem = function(_x,_y,_tileItemPositionId,_tileItemPositionIdItems)
{
	return mapData['map'+Config.current_map].geometrics[_y][_x].items[_tileItemPositionId][_tileItemPositionIdItems.length-1].itemData;
};


Map.prototype.removeTileItemsLastItem = function(_x,_y,_tileItemPositionId)
{
	mapData['map'+Config.current_map].geometrics[_y][_x].items[_tileItemPositionId].pop();
};


Map.prototype.setTileItemsLastItem = function(_x,_y,_tileItemPositionId,_item)
{
	//console.log('setTileItemsLastItem');
	mapData['map'+Config.current_map].geometrics[_y][_x].items[_tileItemPositionId].push(_item);
};



