
function Asset()
{
	this.successCount = 0;
	this.errorCount = 0;
	this.cache = {};
	this.downloadQueue = [];
	this.progressBarX = 0*Config.canvas_zoom;
	this.progressBarY = 0*Config.canvas_zoom;
	this.progressBarWidth = 200*Config.canvas_zoom;
	this.progressBarHeight = 15*Config.canvas_zoom;
}


Asset.prototype.queueDownload = function(path)
{
	this.downloadQueue.push(path);
}


Asset.prototype.downloadAll = function(downloadCallback)
{
	if(this.downloadQueue.length === 0)
	{
		downloadCallback();
	}
	for(var i=0; i<this.downloadQueue.length; i++)
	{
		var path = this.downloadQueue[i];
		var img = new Image();
		var that = this;
		img.addEventListener("load", function()
		{
			that.successCount += 1;
			that.progressBar();
			if(that.isDone())
			{
				downloadCallback();
			}
		}, false);
		img.addEventListener("error", function()
		{
			that.errorCount += 1;
			that.progressBar();
			if(that.isDone())
			{
				downloadCallback();
			}
		}, false);
		img.src = path;
		this.cache[path] = img;
	}
}


Asset.prototype.progressBar = function()
{
	var percentage = Math.round((this.successCount + this.errorCount) / this.downloadQueue.length);
	
	Html.context.fillStyle = "#666666";
	Html.context.fillRect(this.progressBarX,this.progressBarY,this.progressBarWidth+2,this.progressBarHeight+2);
	Html.context.fillStyle = "#333333";
	Html.context.fillRect(this.progressBarX+1,this.progressBarY+1,percentage*this.progressBarWidth,this.progressBarHeight);
}


Asset.prototype.isDone = function()
{
	return (this.downloadQueue.length == this.successCount + this.errorCount);
}


Asset.prototype.getAsset = function(path)
{
	return this.cache[path];
}