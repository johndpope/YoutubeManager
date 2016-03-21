define(function(){
	return function Video( id , title , description , uploadDate , thumbnail , author , authorId ){
		this.id = id;
		this.title = title;
		this.description = description;
		this.uploadDate	= uploadDate;
		this.thumbnail = thumbnail;
		this.authorId = authorId;
		this.author = author;
	};
});
