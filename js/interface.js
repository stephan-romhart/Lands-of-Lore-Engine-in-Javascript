
Interface = {
	
	imageSources:[
		Config.image_folder+'interface.png',
		Config.image_folder+'interface_compass.png',
		Config.image_folder+'interface_move_buttons.png',
		Config.image_folder+'interface_automap.png',
		Config.image_folder+'interface_automap_sprites.png',
		Config.image_folder+'interface_bitmap_font.png',
		Config.image_folder+'interface_char.png',
		Config.image_folder+'interface_character_detail.png',
		Config.image_folder+'interface_character_detail_overlay.png',
		Config.image_folder+'char_1.png',
		Config.image_folder+'char_2.png'
	],
	soundSources:[
		Config.sound_folder+'footstep.mp3',
		Config.sound_folder+'wallHit.mp3',
		Config.sound_folder+'gate.mp3'
	],
	sprites:{},
	audio:{},
	
	
	init:function()
	{
		// Alle Sounds laden
		for(var sound=0; sound<this.soundSources.length; sound++)
		{
			var soundId = this.soundSources[sound].split('.')[0].split('/')[1];
			this.audio[soundId] = new Audio(this.soundSources[sound]);
		}
		
		// Items in die ImageSources laden
		for(var item in itemData)
		{
			this.imageSources.push(itemData[item].filename);
		}
		var that = this;
		
		// Preloader
		var interfacePreloader = new Asset();
		interfacePreloader.progressBarX = (Config.canvas_width*Config.canvas_zoom - interfacePreloader.progressBarWidth)/2;
		interfacePreloader.progressBarY = (Config.canvas_height*Config.canvas_zoom - interfacePreloader.progressBarHeight)/2;
		for(var i=0; i<that.imageSources.length; i++)
		{
			interfacePreloader.queueDownload(that.imageSources[i]);
		}
		interfacePreloader.downloadAll(function(){
			for(var i=0; i<that.imageSources.length; i++)
			{
				var tempSpriteName = that.imageSources[i].split('/')[1].split('.')[0];
				that.sprites[tempSpriteName] = new Sprite(that.imageSources[i]);
			}
			
			// Der Preloader hat alle Interface-Bilder geladen
			gameInit();
		});
	},
	
	clickRects:{
		
		automap:{ x:52,y:9,width:28,height:19 },
		automapButtonClose:{ x:288,y:209,width:22,height:22 },
		
		inventoryButtonLeft:{ x:89,y:218,width:22,height:22 },
		inventoryButtonRight:{ x:299,y:218,width:22,height:22 },
		inventory:{ x:110,y:219,width:189,height:22 },
		
		partyMove:{
			TurnLeft:{ x:14,y:172,width:21,height:18 },
			TurnRight:{ x:56,y:172,width:21,height:18 },
			Up:{ x:35,y:172,width:21,height:18 },
			Left:{ x:14,y:190,width:21,height:18 },
			Right:{ x:56,y:190,width:21,height:18 },
			Down:{ x:35,y:190,width:21,height:18 }
		},
		
		characterDetail:[
			[{ x:173,y:171,width:31,height:35 }],
			[{ x:135,y:171,width:31,height:35 },{ x:210,y:171,width:31,height:35 }],
			[{ x:98,y:171,width:31,height:35 },{ x:173,y:171,width:31,height:35 },{ x:248,y:171,width:31,height:35 }]
		],
		characterDetailButtonClose: { x:200,y:115,width:21,height:19 },
		characterDetailItems:{
			helmet:{ x:62,y:4,width:24,height:24 },
			amulet:{ x:142,y:4,width:24,height:24},
			bodyArmor:{ x:62,y:34,width:24,height:24 },
			armArmor:{ x:142,y:34,width:24,height:24},
			leftHand:{ x:142,y:64,width:24,height:24},
			rightHand:{ x:62,y:64,width:24,height:24 },
			feet:{ x:62,y:109,width:24,height:24 }
			/*
			ringLeft:{},
			ringRight:{}
			*/
		}
	},
	
	
	draw:function()
	{
		// Alles ab Interface wird opaque;
		Html.context.globalAlpha = 1;
		
		// Interface-Hintergrund zeichnen
		this.sprites['interface'].draw(0,0);
		
		// Kompass zeichnen
		this.drawCompass();
		
		// Movebuttons zeichnen
		this.drawMoveButtons();
		
		// Charaktere zeichnen
		for(var charCount=0; charCount<chars.length; charCount++)
		{
			chars[charCount].handleAnimation();
			chars[charCount].draw(Config.interfaceCharPositionX[chars.length-1]+(charCount*75),171);
		}
		
		// Equipment eines Chars
		if(display == 'character')
		{
			for(var itemCategory in chars[charDetailId].equipment)
			{
				if(chars[charDetailId].equipment[itemCategory].id != undefined)
				{
					chars[charDetailId].equipment[itemCategory].sprite.draw(
						Config.window_x + Interface.clickRects.characterDetailItems[itemCategory].x+2,
						Config.window_y + Interface.clickRects.characterDetailItems[itemCategory].y+2,
						20,
						20,
						0,
						0,
						20,
						20
					);
				}
			}
		}
		
		// Inventar zeichnen
		Inventory.draw();
		
		// Wenn es ein Item gibt, das an den MouseCursor gehängt werden muss, zeichnen
		MouseCursor.draw(Input.mouse.x,Input.mouse.y);
	},
	
	
	drawCompass:function()
	{
		var directionId = Config.directions.indexOf(Player.direction);
		this.sprites['interface_compass'].draw(22,12,14,14,14*directionId,0,14,14);
	},
	
	
	drawMoveButtons:function()
	{
		var move_buttons = ['up','down','left','right','turnLeft','turnRight'];
		for(button in Input)
		{
			if(Input[button] === true)
			{
				var button_id = move_buttons.indexOf(button);
				this.sprites['interface_move_buttons'].draw(14,172,64,37,64*button_id,0,64,37);
				break;
			}
		}
	}
};