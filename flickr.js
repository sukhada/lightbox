function FlickrPhotoService() {
	this.flickrAPIKey = 'f1ee27af61a551f5132d9ae046d371e7';
	this.flickrUserID = '15778088%40N00';
	this.pageCount = 1;	
	this.flickrGetPhotosURL = 'https://api.flickr.com/services/rest/?method=flickr.people.getPhotos&api_key=' + this.flickrAPIKey + '&user_id=' + this.flickrUserID + '&format=json&nojsoncallback=1&page=' + this.pageCount;
	this.flickrGetInfoURL = 'https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=' + this.flickrAPIKey + '&format=json&nojsoncallback=1';
	this.flickrUsername = 'http://www.flickr.com/photos/';
	this.flickrGetUsernameURL = 'https://api.flickr.com/services/rest/?method=flickr.urls.lookupUser&api_key=' + this.flickrAPIKey + '&username=' + this.flickrUsername + '&format=json&nojsoncallback=1';

	this.getPhotoInfo = function(photoID, secret, lightbox, index) {
		var xmlHTTP = new XMLHttpRequest();
		xmlHTTP.onreadystatechange = function() {
			if (xmlHTTP.readyState === XMLHttpRequest.DONE) {
				if (xmlHTTP.status === 200) {
					lightbox.appendPhoto.call(lightbox, xmlHTTP, index);
				}
	   			else if (xmlHTTP.status == 400) {
	            	console.log('There was an error 400');
	           }
	           else {
	            	console.log('something else other than 200 was returned');
	           }			
			}
		};
		xmlHTTP.open("GET", this.flickrGetInfoURL + '&photo_id=' + photoID + '&secret=' + secret, true);
	    xmlHTTP.send();		
	}

	this.getUsername = function(username) {
		var xmlHTTP = new XMLHttpRequest();
		var self = this;
		this.flickrUsername = 'http://www.flickr.com/photos/';
		this.flickrUsername += username;
		this.flickrGetUsernameURL = 'https://api.flickr.com/services/rest/?method=flickr.urls.lookupUser&api_key=' + this.flickrAPIKey + '&url=' + this.flickrUsername + '&format=json&nojsoncallback=1';
		xmlHTTP.onreadystatechange = function() {
					if (xmlHTTP.readyState === XMLHttpRequest.DONE) {
						if (xmlHTTP.status === 200) {
							if (xmlHTTP.responseText) {
								responseJSON = JSON.parse(xmlHTTP.responseText);
								if (responseJSON.user && responseJSON.user.id) {
									self.flickrUserID = responseJSON.user.id;
									self.pageCount = 1;
									self.getPhotos(true);
								}
								else if (responseJSON.stat === "fail" && responseJSON.message) {
									renderError(responseJSON.message);
								}
							}
						}
			   			else if (xmlHTTP.status == 400) {
			   				renderError("There was an error looking up this user");
			           }
			           else {
			   				renderError("There was an error looking up this user");
			           }
					}
				};
				xmlHTTP.open("GET", this.flickrGetUsernameURL, true);
			    xmlHTTP.send();

	}

	this.getPhotos = function(clearPhotos) {
		var xmlHTTP = new XMLHttpRequest();
		var self = this;

		this.flickrGetPhotosURL = 'https://api.flickr.com/services/rest/?method=flickr.people.getPhotos&api_key=' + this.flickrAPIKey + '&user_id=' + this.flickrUserID + '&format=json&nojsoncallback=1&page=' + this.pageCount;
		
		xmlHTTP.onreadystatechange = function() {
			if (xmlHTTP.readyState === XMLHttpRequest.DONE) {
				if (xmlHTTP.status === 200) {
						responseJSON = JSON.parse(xmlHTTP.responseText);
						renderPhotos(responseJSON, clearPhotos);
				}
	   			else if (xmlHTTP.status == 400) {
			   		renderError("There was an error fetching photos");
	           }
	           else {
			   		renderError("There was an error fetching photos");
	           }
			}
		};
		xmlHTTP.open("GET", this.flickrGetPhotosURL, true);
	    xmlHTTP.send();
	}
}
