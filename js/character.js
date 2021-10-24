
var Character = function()
{
	this.id = '';
	this.name = '';
	
	this.health = 0;
	this.mana = 0;
	
	this.strength = 0;
	this.baseStrength = 0;
	this.armor = 0;
	this.baseArmor = 0;
	
	this.portraitWidth = 31;
	this.portraitHeight = 35;
	this.portraitFrame = 0;
	
	this.animation = [];
	
	this.equipment = {
		helmet:{},
		bodyArmor:{},
		armArmor:{},
		weapon:{},
		shield:{},
		boots:{},
		ringLeft:{},
		ringRight:{}
	};
};


Character.prototype.init = function(_id,_health,_mana,_name,_strength,_armor)
{
	this.id = _id;
	this.name = _name;
	
	this.health = _health;
	this.mana = _mana;
	
	this.strength = _strength;
	this.baseStrength = _strength;
	this.armor = _armor;
	this.baseStrength = _armor;
};


Character.prototype.update = function()
{
	var tempStrength = this.baseStrength;
	var tempArmor = this.baseArmor;
	
	for(var itemCategory in this.equipment)
	{
		if(this.equipment[itemCategory].id != undefined)
		{
			if(this.equipment[itemCategory].strength != undefined)
			{
				tempStrength += this.equipment[itemCategory].strength;
			}
			else if(this.equipment[itemCategory].armor != undefined)
			{
				tempArmor += this.equipment[itemCategory].armor;
			}
		}
	}
};


Character.prototype.draw = function(_x,_y)
{
	// Hintergrund des Chars zeichnen
	Interface.sprites['interface_char'].draw(_x,_y);
	
	// Portrait
	Interface.sprites[this.id].draw(
		_x+2,
		_y+2,
		this.portraitWidth,
		this.portraitHeight,
		this.portraitFrame*this.portraitWidth,
		0,
		this.portraitWidth,
		this.portraitHeight
	);
	
	// Lebensbalken
	var healthHeight = Math.round(this.portraitHeight/100*this.health);
	map.drawRect(
		(_x+40)*Config.canvas_zoom,
		(_y+2+this.portraitHeight-healthHeight)*Config.canvas_zoom,
		5*Config.canvas_zoom,
		healthHeight*Config.canvas_zoom,
		'#4f7923'
	);
	
	// Manabalken
	var manaHeight = Math.round(this.portraitHeight/100*this.mana);
	map.drawRect(
		(_x+34)*Config.canvas_zoom,
		(_y+2+this.portraitHeight-manaHeight)*Config.canvas_zoom,
		5*Config.canvas_zoom,
		manaHeight*Config.canvas_zoom,
		'#165dcd'
	);
};


Character.prototype.drawDetail = function()
{
	// Detail-Hintergrund
	Interface.sprites['interface_character_detail'].draw(Config.window_x,Config.window_y);
	
	// Overlay für deaktivierte Elemente
	Interface.sprites['interface_character_detail_overlay'].draw(
		0,
		0,
		Config.canvas_width,
		Config.canvas_height,
		Config.interfaceCharDetailPosition[chars.length-1][charDetailId]*Config.canvas_width,
		0,
		Config.canvas_width,
		Config.canvas_height
	);
	
	// Name der Figur schreiben
	mapText.writeText(this.name,50,104,10,1);
	mapText.writeText(this.strength.toString(),50,104,44,1);
	mapText.writeText(this.armor.toString(),50,104,74,1);
};




Character.prototype.handleAnimation = function()
{
	if(this.animation.length > 0)
	{
		this.portraitFrame = this.animation.shift();
	}
	else
	{
		this.portraitFrame = 0;
	}
};