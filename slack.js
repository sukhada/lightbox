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

	document.onkeydown = function(evt) {
	    evt = evt || window.event;
	    var isEscape = false;
	    var isNext = false;
	    var isPrev = false;

	    if ("key" in evt) {
	        isEscape = (evt.key == "Escape" || evt.key == "Esc");
	        isNext = (evt.key == "ArrowRight");
	        isPrev = (evt.key == "ArrowLeft");
	    } else {
	        isEscape = (evt.keyCode === 27);
	        isNext = (evt.keyCode === 39);
	        isPrev = (evt.keyCode === 37);
	    }
	    if (isEscape) {
	    	self.lightbox.closeModal();
	    }
	    if (isNext) {
	    	self.lightbox.renderSlide(self.lightbox.currIndex+1)
	    }
	    if (isPrev) {
	    	self.lightbox.renderSlide(self.lightbox.currIndex-1)
	    }
	};
	
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
		self.lightbox.renderSlide(self.lightbox.currIndex-1)
	});
	next.addEventListener('click', function(event) {
		self.lightbox.renderSlide(self.lightbox.currIndex+1)
	});	
	var nextImageNodes = document.getElementsByClassName('nextImgNode');
	for (var i = 0; i < nextImageNodes.length; i++) {
		var nextImageNode = nextImageNodes[i];
		nextImageNode.addEventListener('click', function(event) {
			if (event.srcElement && event.srcElement.src) {
				var index = event.srcElement.getAttribute('data-image-num');
				console.log(index);
				self.lightbox.renderSlide(index);			
			}				
		});
	}	
}

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

function constructPhoto(jsonResponse) {
	var mediumURL = constructImageURL(jsonResponse, 'z');
	var highResURL = constructImageURL(jsonResponse, 'h');
	var title = jsonResponse.title._content;	
	return new Photo(mediumURL, highResURL, title);
}

function constructImageURL(photoJSON, size) {
	var farm = photoJSON.farm;
	var server = photoJSON.server;
	var id = photoJSON.id;
	var secret = photoJSON.secret;
	return 'https://farm' + farm + '.staticflickr.com/' + server + '/' + id + '_' + secret + '_' + size + '.jpg'
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
		img.src = photoObj.getMediumSizeURL();
		img.title = photoObj.getTitle();
		img.setAttribute('data-image-num', self.photos.length - 1)
		li.append(img);
		ul.append(li);
		li.addEventListener('click', function(event) {
			event.preventDefault();
			if (event.srcElement && event.srcElement.src) {
				var index = event.srcElement.getAttribute('data-image-num');
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
		var imgURL = photo.getHighResURL();
		var imgTitle = photo.getTitle();
		var currentImage = document.getElementsByClassName('currImage')[0];
		var currentImageNode = document.getElementsByClassName('currImageNode')[0];
		var currentTitle = document.getElementsByClassName('currTitle')[0];
		currentTitle.textContent = imgTitle;
		currentImageNode.src = imgURL;
		this.currIndex = parseInt(num,10);
		var nextImages = document.getElementsByClassName('nextImages')[0];
		var nextPhotos = this.getNextPhotos(parseInt(num,10));
	}

	this.getNextPhotos = function(num) {
		for (var i = 1; i < 5; i++) {
			var nextPhoto = this.photos[num+i];
			var nextImageNode = document.getElementsByClassName('nextImgNode' + i)[0];
			nextImageNode.src = nextPhoto.getMediumSizeURL();
			nextImageNode.setAttribute('data-image-num', num+i);
		}
	}
}
	

this.flickrService = new FlickrPhotoService();
this.flickrService.getPhotos();