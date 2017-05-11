function renderPhotos(responseJSON, clearPhotos) {
	var len = responseJSON.photos.photo.length;
	var photos = responseJSON.photos.photo;
	this.lightbox = new Lightbox();
	if (clearPhotos) {
		this.lightbox.ul.innerHTML = '';
	}
	var self = this;
	
	for (var i = 0; i < len-1; i++) {
		var photo = photos[i];
		this.flickrService.getPhotoInfo(photo.id, photo.secret, this.lightbox.appendPhoto, i);
	}

	addEventListeners();

	/*var nextImageNodes = document.getElementsByClassName('nextImgNode');
	for (var i = 0; i < nextImageNodes.length; i++) {
		var nextImageNode = nextImageNodes[i];
		nextImageNode.addEventListener('click', function(event) {
			if (event.target && event.target.src) {
				var index = event.target.getAttribute('data-image-num');
				console.log(index);
				self.lightbox.renderSlide(index);			
			}				
		});
	}	*/
}

function addEventListeners() {
	var modal = document.getElementsByClassName('modal')[0];
	var escape = document.getElementsByClassName('escape')[0];
	var prev = document.getElementsByClassName('prev')[0];
	var next = document.getElementsByClassName('next')[0];
	var currImage = document.getElementsByClassName('currImageNode')[0];

	modal.addEventListener('click', function(event) {
		self.lightbox.closeModal();
	});	
	currImage.addEventListener('click', function(event) {
		event.stopPropagation();
	});	
	escape.addEventListener('click', function(event) {
		self.lightbox.closeModal();
	});
	prev.addEventListener('click', function(event) {
		event.stopPropagation();		
		self.lightbox.renderSlide(self.lightbox.currIndex-1)
	});
	next.addEventListener('click', function(event) {
		event.stopPropagation();		
		self.lightbox.renderSlide(self.lightbox.currIndex+1)
	});	

	document.onkeydown = function(evt) {
	    evt = evt || window.event;
	    var isEscape = false;
	    var isNext = false;
	    var isPrev = false;

	    if ("key" in evt) {
	        isEscape = (evt.key === "Escape" || evt.key === "Esc");
	        isNext = (evt.key === "ArrowRight") || (evt.key === "Right");
	        isPrev = (evt.key === "ArrowLeft") || (evt.key === "Left");
	    } else {
	        isEscape = (evt.keyCode === 27);
	        isNext = (evt.keyCode === 39);
	        isPrev = (evt.keyCode === 37);
	    }
	    if (isEscape) {
	    	self.lightbox.closeModal();
	    	self.lightbox.clearCurrentImg();
	    }
	    if (isNext) {
	    	self.lightbox.clearCurrentImg();
	    	self.lightbox.renderSlide(self.lightbox.currIndex+1);

	    }
	    if (isPrev) {
	    	self.lightbox.clearCurrentImg();	    	
	    	self.lightbox.renderSlide(self.lightbox.currIndex-1);
	    }
	};	
}	

if (window.addEventListener) {
	var self = this;
	window.addEventListener('load', function() {
		var link = document.getElementsByClassName('imgSrcLink')[0];  
		link.addEventListener('keypress', function(event) {
		    if ("key" in event && event.key === "Enter") {
		    	self.flickrService.getUsername(event.target.value);
		    }
		});  	
	});

	window.onscroll = function(ev) {
	    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
	    	self.flickrService.pageCount += 1;
	    	self.flickrService.getPhotos(false);
	    }
	};

}

this.flickrService = new FlickrPhotoService();
this.flickrService.getPhotos(false);