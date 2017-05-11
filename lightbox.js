var Lightbox = function() {
	this.photos = []
	this.currIndex = 0;
	this.ul = document.getElementsByClassName('photo-list')[0];
};

Lightbox.prototype.constructPhoto = function(jsonResponse) {
	var mediumURL = this.constructImageURL(jsonResponse, '_z');
	var highResURL = this.constructImageURL(jsonResponse, '_o');
	var title = jsonResponse.title._content;	
	return new Photo(mediumURL, highResURL, title);
};

Lightbox.prototype.appendPhoto = function(response, index) {
	var photoInfoJSON = JSON.parse(response.responseText);
	var photoObj = this.constructPhoto(photoInfoJSON.photo);
	this.photos.push(photoObj);

	var li = document.createElement('li');
	var img = document.createElement('img');
	img.src = photoObj.getMediumSizeURL();
	img.title = photoObj.getTitle();
	img.setAttribute('data-image-num', this.photos.length - 1)
	this.ul.appendChild(li);
	var self = this;
	li.addEventListener('click', function(event) {
		event.preventDefault();
		if (event.target && event.target.src) {
			var index = event.target.getAttribute('data-image-num');
			self.openModal();
			self.renderSlide(index);			
		}
	});
	li.appendChild(img);		
};

Lightbox.prototype.openModal = function() {
	this.modal = document.getElementsByClassName('modal')[0];
	this.modal.style.display = 'block';	
	document.body.className += 'modal-open';
};

Lightbox.prototype.closeModal = function() {
	this.modal = document.getElementsByClassName('modal')[0];
	this.modal.style.display = 'none';
	document.body.className = document.body.className.replace("modal-open","");
};

Lightbox.prototype.renderSlide = function(num) {
	if (num < 0 || num > this.photos.length-1) {
		alert('Photo not found!');
		return;
	}
    this.clearCurrentImg();
	var photo = this.photos[num];
	var imgURL = photo.getHighResURL();
	var imgTitle = photo.getTitle();
	var currentImage = document.getElementsByClassName('currImage')[0];
	var currentImageNode = document.getElementsByClassName('currImageNode')[0];
	var currentTitle = document.getElementsByClassName('currTitle')[0];
	currentTitle.textContent = imgTitle;
	currentImageNode.src = imgURL;
	this.currIndex = parseInt(num,10);
	this.preloadNextAndPrevImgs();
};

Lightbox.prototype.clearCurrentImg = function() {
	var currentImageNode = document.getElementsByClassName('currImageNode')[0];
	// REPLACE THIS LINK
	currentImageNode.src = 'https://playerslounge.co/images/loading.gif';		
};

Lightbox.prototype.preloadNextAndPrevImgs = function() {
	var img = new Image();
	var next = this.currIndex + 1;
	var prev = this.currIndex - 1;
	if (prev >= 0) {
		img.src = this.photos[prev].getHighResURL();
	}
	if (next <= this.photos.length-1) {
		img.src = this.photos[next].getHighResURL();
	}
};


Lightbox.prototype.constructImageURL = function(photoJSON, size) {
	var farm = photoJSON.farm;
	var server = photoJSON.server;
	var id = photoJSON.id;
	var secret = photoJSON.secret;
	if (size === '_o'){
		if (!photoJSON.originalsecret) {
			size = '';
		}
		secret = photoJSON.originalsecret || photoJSON.secret;
	}
	return 'https://farm' + farm + '.staticflickr.com/' + server + '/' + id + '_' + secret + size + '.jpg'

};