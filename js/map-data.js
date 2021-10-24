
// Map
// Reihenfolge der Wände
// 0=South,1=West,2=North,3=East,4=Ceiling,5=Floor

// Interaction
// AnimatedTextureIds sind die betroffenen Ids der Texturliste textures [0,1,2,3,4,5]


var mapData = {
	
	// Karte 0
	map0:{
		
		title:'Burg Level 1',
		
		// Kartendaten
		geometrics:[
			[
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]},
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]},
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]},
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]},
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]},
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]},
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]}
			],
			[
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]},
				{solid:0,textures:[0,0,0,0,100,100],explored:0,items:[[],[],[],[]]},
				{solid:0,textures:[0,0,0,0,100,100],explored:0,items:[[],[],[],[]]},
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]},
				{solid:0,textures:[0,0,0,0,100,100],explored:0,items:[[],[],[],[]]},
				{solid:0,textures:[0,0,0,0,100,100],explored:0,items:[[],[],[],[]]},
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]}
			],
			[
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]},
				{solid:0,textures:[0,0,0,0,100,100],explored:0,items:[[],[],[],[]]},
				{solid:0,textures:[0,0,0,0,100,100],explored:0,items:[
					[{id:'potion_of_health',mapPosition:'floor'},{id:'sword_1',mapPosition:'floor'}],
					[],
					[{id:'potion_of_mana',mapPosition:'floor'}],
					[]
				]},
				{solid:1,textures:[0,50,0,50,100,100],explored:0,items:[[],[],[],[]],interaction:{action:'Door',animatedTextureIds:[1,3],clickRect:{x:167,y:54,width:8,height:10},frame:0,animationLength:5,status:'closed'}},
				{solid:0,textures:[0,0,0,0,100,100],explored:0,items:[[],[],[],[]]},
				{solid:0,textures:[0,0,0,0,100,100],explored:0,items:[[],[],[],[]]},
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]}
			],
			[
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]},
				{solid:0,textures:[0,0,0,0,100,100],explored:0,items:[[],[],[],[]]},
				{solid:0,textures:[0,0,0,0,100,100],explored:0,items:[[],[],[],[]]},
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]},
				{solid:0,textures:[0,0,0,0,100,100],explored:0,items:[[],[],[],[]]},
				{solid:0,textures:[0,0,0,0,100,100],explored:0,items:[[],[],[],[]]},
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]}
			],
			[
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]},
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]},
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]},
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]},
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]},
				{solid:0,textures:[51,51,51,51,100,100],explored:0,items:[[],[],[],[]],interaction:{action:'Teleport',type:1,mapId:1,mapStartPosition:0}},
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]}
			],
			[
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]},
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]},
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]},
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]},
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]},
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]},
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]}
			]
		],
		
		// Startpositionen X,Y,Direction
		startPositions:[
			[1,1,'north'],
			[5,3,'north']
		],
		
		// Verwendete Textursets
		textureSets:[50,51,100],
		
		// Hintergrundfarbe des Levels
		backgroundColor:'#000000' 
	},
	
	
	// Karte 1
	map1:{
		
		title:'Burg Level 2',
		
		// Kartendaten
		geometrics:[
			[
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]},
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]},
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]},
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]},
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]},
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]}
			],
			[
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]},
				{solid:0,textures:[0,0,0,0,100,100],explored:0,items:[[],[],[],[]]},
				{solid:0,textures:[0,0,0,0,100,100],explored:0,items:[[],[],[],[]]},
				{solid:1,textures:[0,50,0,50,100,100],explored:0,items:[[],[],[],[]],interaction:{action:'Door',animatedTextureIds:[1,3],clickRect:{x:167,y:54,width:8,height:10},frame:0,animationLength:5,status:'closed'}},
				{solid:0,textures:[0,0,0,0,100,100],explored:0,items:[[],[],[],[]]},
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]}
			],
			[
				{solid:0,textures:[51,51,51,51,100,100],explored:0,items:[[],[],[],[]],interaction:{action:'Teleport',type:2,mapId:0,mapStartPosition:1}},
				{solid:0,textures:[0,0,0,0,100,100],explored:0,items:[[],[],[],[]]},
				{solid:0,textures:[0,0,0,0,100,100],explored:0,items:[[],[],[],[]]},
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]},
				{solid:0,textures:[0,0,0,0,100,100],explored:0,items:[[],[],[],[]]},
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]}
			],
			[
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]},
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]},
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]},
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]},
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]},
				{solid:1,textures:[100,100,100,100,100,100],explored:0,items:[[],[],[],[]]}
			],
		],
		
		// Startpositionen X,Y,Direction
		startPositions:[
			[1,2,'east']
		],
		
		// Verwendete Textursets
		textureSets:[100,50,51],
		
		// Hintergrundfarbe des Levels
		backgroundColor:'#000000' 
	}
};




function convertToText(_obj)
{
	// create an array that will later be joined into a string.
	var string = [];
	
	// is _object
	if(typeof(_obj) == 'object' && (_obj.join == undefined))
	{
		string.push('{');
		for (prop in _obj)
		{
			string.push(prop,':',convertToText(_obj[prop]),',');
		}
		string.push('}');
	}
	
	// is array
	else if(typeof(_obj) == 'object' && !(_obj.join == undefined))
	{
		string.push('[');
		for(prop in _obj)
		{
			string.push(convertToText(_obj[prop]),',');
		}
		string.push(']');
	}
	
	// is function
	else if(typeof(_obj) == 'function')
	{
		string.push(_obj.toString())
	}
	
	// all other values can be done with JSON.stringify
	else
	{
		string.push(JSON.stringify(_obj));
	}
	
	return string.join('');
}




