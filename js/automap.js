
var Automap = {

	startX:10,
	startY:10,
	mapItemSize:10,
	
	isNotSolid:function(_x,_y)
	{
		if(	mapData['map'+Config.current_map].geometrics[_y] != undefined &&
				mapData['map'+Config.current_map].geometrics[_y][_x] != undefined)
		{
			if(	mapData['map'+Config.current_map].geometrics[_y][_x].solid == 0 ||
					(mapData['map'+Config.current_map].geometrics[_y][_x].interaction != undefined &&
						(mapData['map'+Config.current_map].geometrics[_y][_x].interaction.action == "Door" ||
						mapData['map'+Config.current_map].geometrics[_y][_x].interaction.action == "Teleport")))
			{
				return true;
			}
			else
			{
				return false;
			}
		}
		else
		{
			return false;
		}
	},
	
	draw:function()
	{
		// Legenden-Container
		var legend = [];
		
		// Kartenhintergrund
		Interface.sprites['interface_automap'].draw(0,0);
		
		// Alle Kartenteile durchlaufen
		for(var y=0; y<mapData['map'+Config.current_map].geometrics.length; y++)
		{
			for(var x=0; x<mapData['map'+Config.current_map].geometrics[y].length; x++)
			{
				if(mapData['map'+Config.current_map].geometrics[y][x].explored == 1)
				{
					// Den Weg zeichnen
					if(this.isNotSolid(x,y))
					{
						var spritePos = 15;
						
						// Im Norden ist eine Wand
						if(!this.isNotSolid(x,y-1))
						{
							// Im Westen ist eine Wand
							if(!this.isNotSolid(x-1,y))
							{
								// Im Süden ist eine Wand
								if(!this.isNotSolid(x,y+1))
								{
									// Im Osten ist eine Wand
									if(!this.isNotSolid(x+1,y))
									{
									}
									// Im Osten ist keine Wand
									else
									{
										spritePos = 9;
									}
								}
								// im Süden ist keine Wand
								else
								{
									// Im Osten ist eine Wand
									if(!this.isNotSolid(x+1,y))
									{
										spritePos = 12;
									}
									else
									{
										spritePos = 0;
									}
								}
							}
							// Im Westen ist keine Wand
							else
							{
								// Im Süden ist eine Wand
								if(!this.isNotSolid(x,y+1))
								{
									// Im Osten ist eine Wand
									if(!this.isNotSolid(x+1,y))
									{
										spritePos = 11;
									}
									else
									{
										spritePos = 10;
									}
								}
								// Im Süden ist keine Wand
								else
								{
									// Im Osten ist keine Wand
									if(!this.isNotSolid(x+1,y))
									{
										spritePos = 2;
									}
									// Im Osten ist eine Wand
									else
									{
										spritePos = 1;
									}
								}
							}
						}
						// Im Norden ist keine Wand
						else
						{
							// Im Westen ist eine Wand
							if(!this.isNotSolid(x-1,y))
							{
								// Im Süden ist eine Wand
								if(!this.isNotSolid(x,y+1))
								{
									// Im Osten ist eine Wand
									if(!this.isNotSolid(x+1,y))
									{
										spritePos = 13;
									}
									// Osten keine Wand
									else
									{
										spritePos = 6;
									}
								}
								// Im Süden keine Wand
								else
								{
									// Im Osten ist eine Wand
									if(!this.isNotSolid(x+1,y))
									{
										spritePos = 14;
									}
									// Osten keine Wand
									else
									{
										spritePos = 3;
									}
								}
							}
							// Im Westen ist keine Wand
							else
							{
								// Im Süden ist eine Wand
								if(!this.isNotSolid(x,y+1))
								{
									// Im Osten ist eine Wand
									if(!this.isNotSolid(x+1,y))
									{
										spritePos = 8;
									}
									// Im Osten ist keine Wand
									else
									{
										spritePos = 7;
									}
								}
								// Im Süden ist keine Wand
								else
								{
									// Im Osten ist eine Wand
									if(!this.isNotSolid(x+1,y))
									{
										spritePos = 5;
									}
									// Im Osten ist keine Wand
									else
									{
										spritePos = 4;
									}
								}
							}
						}
						
						Interface.sprites['interface_automap_sprites'].draw(
							this.startX+(x*this.mapItemSize),
							this.startY+(y*this.mapItemSize),
							this.mapItemSize,
							this.mapItemSize,
							spritePos * this.mapItemSize,
							0,
							this.mapItemSize,
							this.mapItemSize
						);
					}
					// Eine Tür zeichnen
					if(	mapData['map'+Config.current_map].geometrics[y][x].explored == 1 &&
							mapData['map'+Config.current_map].geometrics[y][x].interaction != undefined &&
							mapData['map'+Config.current_map].geometrics[y][x].interaction.action == 'Door')
					{
						if(this.isNotSolid(x-1,y))
						{
							spritePos = 19;
						}
						else
						{
							spritePos = 20;
						}
						
						// Tür in die Legende schreiben
						legend.push([spritePos,'Tor']);
						
						// Türe in die Karte zeichnen
						Interface.sprites['interface_automap_sprites'].draw(
							this.startX+(x*this.mapItemSize),
							this.startY+(y*this.mapItemSize),
							this.mapItemSize,
							this.mapItemSize,
							spritePos * this.mapItemSize,
							0,
							this.mapItemSize,
							this.mapItemSize
						);
					}
					// Teleport zeichnen
					if(	mapData['map'+Config.current_map].geometrics[y][x].explored == 1 &&
							mapData['map'+Config.current_map].geometrics[y][x].interaction != undefined &&
							mapData['map'+Config.current_map].geometrics[y][x].interaction.action == 'Teleport')
					{
						if(mapData['map'+Config.current_map].geometrics[y][x].interaction.type == 1)
						{
							spritePos = 21;
						}
						// Treppenaufstieg in Legede packen
						legend.push([spritePos,'Treppenaufstieg']);
						
						// Treppenaufstieg in die Karte zeichnen
						Interface.sprites['interface_automap_sprites'].draw(
							this.startX+(x*this.mapItemSize),
							this.startY+(y*this.mapItemSize),
							this.mapItemSize,
							this.mapItemSize,
							spritePos * this.mapItemSize,
							0,
							this.mapItemSize,
							this.mapItemSize
						);
					}
					// Den Spieler einzeichnen
					if(x == Player.position.x && y == Player.position.y)
					{
						if(Player.direction == 'north')
						{
							spritePos = 15;
						}
						else if(Player.direction == 'west')
						{
							spritePos = 18;
						}
						else if(Player.direction == 'south')
						{
							spritePos = 17;
						}
						else if(Player.direction == 'east')
						{
							spritePos = 16;
						}
						
						// Player in Legende packen
						legend.push([spritePos,'Spieler']);
						
						Interface.sprites['interface_automap_sprites'].draw(
							this.startX+(x*this.mapItemSize),
							this.startY+(y*this.mapItemSize),
							this.mapItemSize,
							this.mapItemSize,
							spritePos * this.mapItemSize,
							0,
							this.mapItemSize,
							this.mapItemSize
						);
					}
				}
			}
		}
		
		
		// Kartenname
		mapText.writeText(
			mapData['map'+Config.current_map].title,
			20,
			215,
			this.startX,
			0
		);
		
		// Legende
		for(var i=0; i<legend.length; i++)
		{
			var yPos = 10+this.startX+(i*this.mapItemSize)+5;
			
			Interface.sprites['interface_automap_sprites'].draw(
				200,
				yPos,
				this.mapItemSize,
				this.mapItemSize,
				legend[i][0] * this.mapItemSize,
				0,
				this.mapItemSize,
				this.mapItemSize
			);
			
			mapText.writeText(legend[i][1],20,215,yPos+2,0);
		}
	},
	
	drawRect:function(_x,_y,_width,_height,_backgroundColor)
	{
		Html.context.fillStyle = _backgroundColor;
		Html.context.fillRect(_x*Config.canvas_zoom,_y*Config.canvas_zoom,_width*Config.canvas_zoom,_height*Config.canvas_zoom);
	}
};