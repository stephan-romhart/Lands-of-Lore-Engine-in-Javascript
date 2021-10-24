
// Was für Item-Typen gibt?
//
// Equipment			= Waffen,Schilde,Kleidung,Ringe,Amulette,Helme,Schuhe
// Keys 					= Schlüssel
// Healings				= Heiltränke
// Questitems			= Quest-Gegenstände
// Textscrolls		= Schriftrollen für Texte
// Magic Scrolls	= Schriftrollen für Zaubersprüche

var Item = function(_id,_mapPosition,_mapDepth,_mapX,_mapY,_texturePosX)
{
	this.id = _id;
	this.mapPosition = _mapPosition;
	this.mapDepth = _mapDepth;
	this.mapX = _mapX;
	this.mapY = _mapY;
	this.texturePosX = _texturePosX;
	
	this.sprite = new Sprite(itemData[this.id].filename);
	this.actionSize = itemData[this.id].actionSize;
	this.type = itemData[this.id].type;
	this.category = itemData[this.id].category;
};