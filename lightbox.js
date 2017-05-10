function Lightbox() {
	this.photos = [];
	this.currIndex = 0;
	this.ul = document.getElementsByClassName('photo-list')[0];	

	var self = this;
	this.appendPhoto = function(response, index) {
		var photoInfoJSON = JSON.parse(response.responseText);
		var photoObj = self.constructPhoto(photoInfoJSON.photo);
		self.photos.push(photoObj);

		var li = document.createElement('li');
		var img = document.createElement('img');
		img.src = photoObj.getMediumSizeURL();
		img.title = photoObj.getTitle();
		img.setAttribute('data-image-num', self.photos.length - 1)
		self.ul.appendChild(li);
		li.addEventListener('click', function(event) {
			event.preventDefault();
			if (event.target && event.target.src) {
				var index = event.target.getAttribute('data-image-num');
				self.openModal();
				self.renderSlide(index);			
			}
		});
		li.appendChild(img);		
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
		//var nextImages = document.getElementsByClassName('nextImages')[0];
		//var nextPhotos = this.getNextPhotos(parseInt(num,10));
	}

	this.getNextPhotos = function(num) {
		for (var i = 1; i < 5; i++) {
			var nextPhoto = this.photos[num+i];
			var nextImageNode = document.getElementsByClassName('nextImgNode' + i)[0];
			nextImageNode.src = nextPhoto.getMediumSizeURL();
			nextImageNode.setAttribute('data-image-num', num+i);
		}
	}

	this.clearCurrentImg = function() {
		var currentImageNode = document.getElementsByClassName('currImageNode')[0];
		// REPLACE THIS LINK
		currentImageNode.src = 'https://playerslounge.co/images/loading.gif';		
	}

	this.constructPhoto = function(jsonResponse) {
		var mediumURL = self.constructImageURL(jsonResponse, 'z');
		var highResURL = self.constructImageURL(jsonResponse, 'h');
		var title = jsonResponse.title._content;	
		return new Photo(mediumURL, highResURL, title);
	}

 	this.constructImageURL = function(photoJSON, size) {
		var farm = photoJSON.farm;
		var server = photoJSON.server;
		var id = photoJSON.id;
		var secret = photoJSON.secret;
		return 'https://farm' + farm + '.staticflickr.com/' + server + '/' + id + '_' + secret + '_' + size + '.jpg'
	}
}
