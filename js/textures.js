
var Textures = {
	
	textureTypes:['ceiling','floor','wall'],
	texturePositions:['left','center','right','frontal'],
	
	getTextureSetFileList:function(textureSetId)
	{
		var temp_texturePosition;
		var textureSet = {};
		
		// Alle Tiefen durchlaufen
		for(var depth=0; depth<4; depth++)
		{
			// Alle Texturtype durchlaufen
			for(var textureType=0; textureType<3; textureType++)
			{
				// Alle Texturpositionen durchlaufen
				for(var texturePosition=0; texturePosition<3; texturePosition++)
				{
					if(this.textureTypes[textureType] == 'wall' && texturePosition == 1)
					{
						temp_texturePosition = 3;
					}
					else
					{
						temp_texturePosition = texturePosition;
					}
					if(depth == 0 && temp_texturePosition == 3)
					{
					}
					else
					{
						textureSet['file_'+depth+'_'+this.textureTypes[textureType]+'_'+this.texturePositions[temp_texturePosition]] = Config.image_folder+'textures/'+textureSetId+'/'+this.textureTypes[textureType]+'-'+depth+'-'+this.texturePositions[temp_texturePosition]+'.png';
					}
				}
			}
		}
		return textureSet;
	}
};