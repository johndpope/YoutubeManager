define(function (){
	return function Channel( id , name , thumbnail , uploadId , videos, description){
		this.id = id;
		this.name = name;
		this.thumbnail = thumbnail;
		this.uploadId = uploadId;
		this.videos = videos;
		this.description = description;
	}
});	