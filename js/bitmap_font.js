
function BitmapFont()
{
	this.charWidth = 6;
	this.charHeight = 7;
	this.width = 0;
	this.spritePos = {};
	this.x = 0;
	this.y = 0;
	// Farben
	// 0 = schwarz, 1 = weiß, 2 = Grau, 3 = rot
	this.color = 0;
}


BitmapFont.prototype.init = function()
{
	var a = 32;
	for(var i = 0; i<64; i++)
	{
		this.spritePos[String.fromCharCode(a+i)] = i;
	}
};


BitmapFont.prototype.writeText = function(_text,_width,_x,_y,_color)
{
	this.width = _width;
	this.x = _x;
	this.y = _y;
	this.color = _color;
	
	var text = _text.split(' ');
	var line = 0;
	var charCounter = 0;
	
	// Alle Wörter durchlaufen
	for(var word=0; word<text.length; word++)
	{
		// Zeilenumbruch
		if(charCounter + text[word].length > this.width)
		{
			line++;
			charCounter = 0;
		}
		
		// Alle Buchstaben durchlaufen
		for(var char=0; char<text[word].length; char++)
		{
			// Der aktuelle Buchstabe
			var currentChar = text[word].charAt(char).toUpperCase();
			
			// Die Position des Buchstabens im Sprite
			var currentCharPos = this.spritePos[currentChar];
			
			// Den Buchstaben zeichnen
			Interface.sprites['interface_bitmap_font'].draw(
				this.x + charCounter*this.charWidth,
				this.y + line*this.charHeight,
				this.charWidth,
				this.charHeight,
				currentCharPos*this.charWidth,
				this.color*this.charHeight,
				this.charWidth,
				this.charHeight
			);
			charCounter++;
			
			// Ein Leerzeichen machen zwischen den Wörtern
			if(char == text[word].length-1 && word != text.length-1)
			{
				Interface.sprites['interface_bitmap_font'].draw(
					this.x + charCounter*this.charWidth,
					this.y + line*this.charHeight,
					this.charWidth,
					this.charHeight,
					0,
					this.color*this.charHeight,
					this.charWidth,
					this.charHeight
				);
				charCounter++;
			}
		}
	}
};
