
// ActionSize =	Tiefe 0 1 2
// 							Breite, Höhe, Spritestart

var itemData = {
	potion_of_health:{
		filename:Config.image_folder+'items/potion-of-health.png',
		type:'healing',
		category:'health',
		name:'Heiltrank',
		actionSize:[[14,20,20],[11,20,34],[7,20,45],[7,20,45]]
	},
	potion_of_mana:{
		filename:Config.image_folder+'items/potion-of-mana.png',
		type:'healing',
		category:'mana',
		name:'Manatrank',
		actionSize:[[14,20,20],[11,20,34],[7,20,45],[7,20,45]]
	},
	sword_1:{
		filename:Config.image_folder+'items/sword-1.png',
		type:'equipment',
		category:'rightHand',
		name:'Kristallschwert',
		strength:30,
		actionSize:[[61,22,20],[46,22,81],[28,22,127],[28,22,127]]
	}
};