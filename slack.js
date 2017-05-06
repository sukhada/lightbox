function FlickrPhotoService() {
	this.flickrAPIKey = 'f1ee27af61a551f5132d9ae046d371e7';
	this.flickrUserID = '15778088%40N00';
	this.flickrGetPhotosURL = 'https://api.flickr.com/services/rest/?method=flickr.people.getPhotos&api_key=' + this.flickrAPIKey + '&user_id=' + this.flickrUserID + '&format=json';
	this.flickrGetInfoURL = 'https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=' + this.flickrAPIKey + '&format=json&nojsoncallback=1';

	this.getPhotoInfo = function(photoID, secret, fCallback, index) {
		var xmlHTTP = new XMLHttpRequest();
		xmlHTTP.onreadystatechange = function() {
			if (xmlHTTP.readyState === XMLHttpRequest.DONE) {
				if (xmlHTTP.status === 200) {
					fCallback(xmlHTTP, index);
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

	this.getPhotos = function() {
		var xmlHTTP = new XMLHttpRequest();
		var self = this;

		xmlHTTP.onreadystatechange = function() {
			if (xmlHTTP.readyState === XMLHttpRequest.DONE) {
				if (xmlHTTP.status === 200) {
					if (xmlHTTP.responseText.indexOf('jsonFlickrApi') >= 0) {
						responseJSON = self.processResponseText(xmlHTTP.responseText);
						renderPhotos(responseJSON);
					}
				}
	   			else if (xmlHTTP.status == 400) {
	            	console.log('There was an error 400');
	           }
	           else {
	            	console.log('something else other than 200 was returned');
	           }			
			}
		};
		xmlHTTP.open("GET", this.flickrGetPhotosURL, true);
	    xmlHTTP.send();
	}

	this.processResponseText = function(responseText) {
		// figure out a better way to do this!
		responseText = responseText.replace('jsonFlickrApi(', '');
		responseText = responseText.replace(')', '');
		responseJSON = JSON.parse(responseText);

		return responseJSON;		
	}
}

function renderPhotos(responseJSON) {
	var len = responseJSON.photos.photo.length;
	var photos = responseJSON.photos.photo;
	this.lightbox = new Lightbox();
	var self = this;
	for (var i = 0; i < len-1; i++) {
		var photo = photos[i];
		this.flickrService.getPhotoInfo(photo.id, photo.secret, this.lightbox.appendPhoto, i);
	}
	var escape = document.getElementsByClassName('escape')[0];
	var prev = document.getElementsByClassName('prev')[0];
	var next = document.getElementsByClassName('next')[0];
	escape.addEventListener('click', function(event) {
		self.lightbox.closeModal();
	});
	prev.addEventListener('click', function(event) {
		self.lightbox.renderSlide()
	});
}

function Photo(url, title) {
	this.url = url;
	this.title = title;

	this.getURL = function() {
		return this.url;
	}

	this.getTitle = function() {
		return this.title;
	}
}

function constructPhoto(jsonResponse) {
	var url = constructImageURL(jsonResponse);
	var title = jsonResponse.title._content;	
	return new Photo(url, title);
}

function constructImageURL(photoJSON) {
	var farm = photoJSON.farm;
	var server = photoJSON.server;
	var id = photoJSON.id;
	var secret = photoJSON.secret;
	return 'https://farm' + farm + '.staticflickr.com/' + server + '/' + id + '_' + secret + '.jpg'
}

function constructTitle(photoJSON) {
	return photoJSON.title;
}



function Lightbox() {
	this.photos = [];
	this.currIndex = 0;

	var self = this;
	this.appendPhoto = function(response, index) {
		var photoInfoJSON = JSON.parse(response.responseText);
		var photoObj = constructPhoto(photoInfoJSON.photo);
		self.photos.push(photoObj);

		var ul = document.getElementsByClassName('photo-list')[0];
		var li = document.createElement('li');
		var img = document.createElement('img');
		img.src = photoObj.getURL();
		img.title = photoObj.getTitle();
		img.setAttribute('data-image-num', index)
		li.append(img);
		ul.append(li);
		li.addEventListener('click', function(event) {
			event.preventDefault();
			if (event.srcElement && event.srcElement.src) {
				var index = event.srcElement.getAttribute('data-image-num');
				console.log(index);
				self.openModal();
				self.renderSlide(index);			
			}
		});
	}

	this.openModal = function() {
		this.modal = document.getElementsByClassName('modal')[0];
		this.modal.style.display = 'block';	
	}

	this.closeModal = function() {
		this.modal = document.getElementsByClassName('modal')[0];
		this.modal.style.display = 'none';	
	}

	this.renderSlide = function(num) {
		var photo = this.photos[num];
		var imgURL = photo.getURL();
		var imgTitle = photo.getTitle();
		var currentImage = document.getElementsByClassName('currImage')[0];
		var currentImageNode = document.getElementsByClassName('currImageNode')[0];
		var currentTitle = document.getElementsByClassName('currTitle')[0];
		currentTitle.textContent = imgTitle;
		currentImageNode.src = imgURL;	
	}
}

this.flickrService = new FlickrPhotoService();
this.flickrService.getPhotos();