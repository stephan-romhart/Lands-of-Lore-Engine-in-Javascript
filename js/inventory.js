
var Inventory = {
	x:110,
	y:219,
	itemWidth:21,
	itemHeight:21,
	startItem:0,
	items:[
		{},{},{},{},{},{},{},{},{},
		{},{},{},{},{},{},{},{},{},
		{},{},{},{},{},{},{},{},{},
		{},{},{},{},{},{},{},{},{}
	],
	
	// Item an bestimmer Stelle einfügen
	addItem:function(_item,_position)
	{
		this.items[_position] = _item;
	},
	
	removeItem:function(_position)
	{
		var item = this.items[_position];
		this.items[_position] = {};
		return item;
	},
	
	
	scrollLeft:function()
	{
		if(this.startItem == 0)
		{
			this.startItem = this.items.length-1;
		}
		else
		{
			this.startItem--;
		}
	},
	
	
	scrollRight:function()
	{
		if(this.startItem == this.items.length-1)
		{
			this.startItem = 0;
		}
		else
		{
			this.startItem++;
		}
	},
	
	
	// Inventar zeichnen
	draw:function()
	{
		var pos = this.startItem;
		for(var i=0; i<9; i++)
		{
			if(pos == this.items.length)
			{
				pos=0;
			}
			if(this.items[pos].sprite != undefined)
			{
				// Items im Inventar sind immer 20px x 20px
				this.items[pos].sprite.draw(this.x+i*this.itemWidth,this.y,20,20,0,0,20,20);
			}
			pos = pos+1;
		}
	}
};












