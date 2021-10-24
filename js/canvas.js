
var Html = {
	canvas:null,
	context:null,
	create:function(canvas_id){
		this.canvas = document.getElementById(canvas_id);
		this.context = this.canvas.getContext('2d');
		this.canvas.width = (Config.canvas_width*Config.canvas_zoom);
		this.canvas.height = (Config.canvas_height*Config.canvas_zoom);
		//this.context.mozImageSmoothingEnabled = false;
		//this.context.webkitImageSmoothingEnabled = false;
		//this.context.msImageSmoothingEnabled = false;
		this.context.imageSmoothingEnabled = false;
		return this.context;
	}
};