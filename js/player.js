
var Player = {
	position:null,
	newPosition:[],
	direction:null,
	oldDirection:null,
	newDirection:null,
	// Manuell die erste Startposition setzen
	startPosition:0,
	money:0,
	
	
	init:function()
	{
		this.direction = mapData['map'+Config.current_map].startPositions[this.startPosition][2];
		this.position = {
			'x':mapData['map'+Config.current_map].startPositions[this.startPosition][0],
			'y':mapData['map'+Config.current_map].startPositions[this.startPosition][1]
		};
	},
	
	
	isMovePossible:function(_checkX,_checkY)
	{
		if(	mapData['map'+Config.current_map].geometrics[Player.position.y+_checkY][Player.position.x+_checkX] != undefined &&
				mapData['map'+Config.current_map].geometrics[Player.position.y+_checkY][Player.position.x+_checkX].solid == 0)
		{
			return true;
		}
		else
		{
			return false;
		}
	},
	
	
	isTeleportPossible:function(_checkX,_checkY)
	{
		if(	mapData['map'+Config.current_map].geometrics[_checkY][_checkX].interaction != undefined &&
				mapData['map'+Config.current_map].geometrics[_checkY][_checkX].interaction.action == 'Teleport')
		{
			return true;
		}
		else
		{
			return false;
		}
	},
	
	
	move:function(_moveRule,_direction,_newPosition)
	{
		if(_direction == 'up')
		{
			this.animateStepForward(
				_newPosition,
				_direction
			);
		}
		
		else if(_direction == 'down')
		{
			this.animateStepBackward(
				_newPosition,
				_direction
			);
		}
		
		else if(_direction == 'left')
		{
			this.animateStepLeft(
				_moveRule['axis'],
				Player.position[_moveRule['axis']] + _moveRule[_moveRule['axis']]
			);
		}
		
		else if(_direction == 'right')
		{
			this.animateStepRight(
				_moveRule['axis'],
				Player.position[_moveRule['axis']] + _moveRule[_moveRule['axis']]
			);
		}
		Interface.audio['footstep'].play();
	},
	
	
	animateTeleport:function(_checkX,_checkY,_direction)
	{
		var teleportData = mapData['map'+Config.current_map].geometrics[_checkY][_checkX].interaction;
		map.cameraAnimation = { action:'fade', frame:0, newX:0, newY:0, frameLength:20, direction:'out', teleportData:teleportData };
	},
	
	
	animateWallHit:function(_direction)
	{
		map.cameraAnimation = {
			action:'WallHit',
			frame:0,
			direction:_direction,
			newX:0,
			newY:0
		};
		
		Input[_direction] = false;
	},
	
	
	// Animation beim vorwärts laufen
	animateStepForward:function(_newPosition,_direction)
	{
		map.cameraAnimation = {
			action:'StepForward',
			newPosition:_newPosition,
			direction:_direction,
			zoomStart:1.1,
			zoomStep:0.1,
			frame:0,
			frameLength:4
		};
		if(this.isTeleportPossible(_newPosition[0],_newPosition[1]))
		{
			map.cameraAnimation.teleportData = mapData['map'+Config.current_map].geometrics[_newPosition[1]][_newPosition[0]].interaction;
		}
		Input['up'] = false;
	},
	
	
	// Animation beim rückwärts laufen
	animateStepBackward:function(_newPosition,_direction)
	{
		map.cameraAnimation = {
			action:'StepBackward',
			newPosition:_newPosition,
			direction:_direction,
			zoomStart:0.95,
			zoomStep:0.05,
			frame:0,
			frameLength:3
		};
		if(this.isTeleportPossible(_newPosition[0],_newPosition[1]))
		{
			map.cameraAnimation.teleportData = mapData['map'+Config.current_map].geometrics[_newPosition[1]][_newPosition[0]].interaction;
		}
		Input['down'] = false;
	},
	
	
	animateStepLeft:function(_axis,_newPosition)
	{
		tempMap = new Map();
		tempMap.init('tempMap');
		
		map.cameraAnimation = { action:'StepLeft', frame:0, newX:53, newY:0 };
		tempMap.cameraAnimation = { newDirection: Player.direction, newPosition:[_axis,_newPosition], newX:-51, newY:0 };
		
		Input['left'] = false;
	},
	
	
	animateStepRight:function(_axis,_newPosition)
	{
		tempMap = new Map();
		tempMap.init('tempMap');
		
		map.cameraAnimation = { action:'StepRight', frame:0, newX:-53, newY:0 };
		tempMap.cameraAnimation = { newDirection: Player.direction, newPosition:[_axis,_newPosition], newX:51, newY:0 };
		
		Input['right'] = false;
	},
	
	
	animateTurnLeft:function()
	{
		tempMap = new Map();
		tempMap.init('tempMap');
		
		map.zoomX = 2;
		map.zoomY = 1;
		map.cameraAnimation = { action:'TurnLeft', frame:0, newX:230, newY:0 };
		tempMap.zoomX = 2;
		tempMap.zoomY = 1;
		tempMap.cameraAnimation = { newDirection: Player.newDirection, newX:-310, newY:0 };
		
		Input['turnLeft'] = false;
	},
	
	
	animateTurnRight:function()
	{
		tempMap = new Map();
		tempMap.init('tempMap');
		
		map.zoomX = 2;
		map.zoomY = 1;
		map.cameraAnimation = { action:'TurnRight', frame:0, newX:-230, newY:0 };
		tempMap.zoomX = 2;
		tempMap.zoomY = 1;
		tempMap.cameraAnimation = { newDirection: Player.newDirection, newX:310, newY:0 };
		
		Input['turnRight'] = false;
	},
	
	
	moveHandler:function()
	{
		var checkX = 0;
		var checkY = 0;
		
		if(Input['turnLeft'])
		{
			this.animateTurnLeft();
		}
		else if(Input['turnRight'])
		{
			this.animateTurnRight();
		}
		else
		{
			// Move-Regel auslesen
			var moveRule = Config.move_rules[Player.direction];
			
			// Alle Richtungen durchlaufen
			for(var direction in moveRule)
			{
				// Die Richtung, in die gegangen wird
				if(Input[direction])
				{
					// Welche Textur muss geprüft werden?
					checkTextureId = moveRule[direction]['check_texture_id'];
					
					// Ermittlung der zu prüfenden Kartenposition
					if(moveRule[direction]['axis'] == 'y')
					{
						checkY = 1 * moveRule[direction]['y'];
						checkX = moveRule[direction]['x'];
					}
					else
					{
						checkY = moveRule[direction]['y'];
						checkX = 1 * moveRule[direction]['x'];
					}
					
					// Der Spieler kann in die gewünschte Richtung laufen
					if(this.isMovePossible(checkX,checkY,checkTextureId))
					{
						this.move(moveRule[direction],direction,[Player.position.x+checkX,Player.position.y+checkY]);
					}
					
					// Der Spieler kann nicht in die gewünscht Richtung laufen
					else
					{
						for(var charCount=0; charCount<chars.length; charCount++)
						{
							chars[charCount].animation = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
							chars[charCount].health -= 1;
						}
						Interface.audio['wallHit'].play();
						this.animateWallHit(direction);
					}
					
					break;
				}
			}
		}
	}
};