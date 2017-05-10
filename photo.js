function Photo(mediumURL, highResURL, title) {
	this.mediumURL = mediumURL;
	this.highResURL = highResURL;
	this.title = title;

	this.getHighResURL = function() {
		return this.highResURL;
	}

	this.getMediumSizeURL = function() {
		return this.mediumURL;
	}

	this.getTitle = function() {
		return this.title;
	}
}