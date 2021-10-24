
var Sprite = function(filename)
{
	this.image = null;
	this.load = function(filename)
	{
		this.image = new Image();
		this.image.src = filename;
		return this;
	};
	
	if(filename != undefined && filename != '' && filename != null)
	{
		this.load(filename);
	}
	else
	{
		console.log('Die Datei "'+filename+'" konnte nicht geladen werden');
	}
};


Sprite.prototype.draw = function(dx,dy,dw,dh,sx,sy,sw,sh)
{
	if(sw != undefined)
	{
		Html.context.drawImage(
			this.image,
			sx,
			sy,
			sw,
			sh,
			dx*Config.canvas_zoom,
			dy*Config.canvas_zoom,
			dw*Config.canvas_zoom,
			dh*Config.canvas_zoom
		);
	}
	else
	{
		Html.context.drawImage(
			this.image,
			dx*Config.canvas_zoom,
			dy*Config.canvas_zoom,
			this.image.width*Config.canvas_zoom,
			this.image.height*Config.canvas_zoom
		);
	}
};


Sprite.prototype.getWidth = function()
{
	return this.image.width;
}


Sprite.prototype.getHeight = function()
{
	return this.image.height;
}