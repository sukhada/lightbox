function renderPhotos(responseJSON, clearPhotos) {
	var len = responseJSON.photos.photo.length;
	var errorDiv = document.getElementsByClassName('errors')[0];	

	if (len === 0) {
		this.renderError('No photos found for this user');
		return;
	}
	var photos = responseJSON.photos.photo;
	errorDiv.innerHTML = '';

	if (!this.lightbox) {
		this.lightbox = new Lightbox();
	}
	if (clearPhotos) {
		this.lightbox.ul.innerHTML = '';
		this.lightbox = new Lightbox();		
	}
	var self = this;
	
	for (var i = 0; i < len-1; i++) {
		var photo = photos[i];
		this.flickrService.getPhotoInfo(photo.id, photo.secret, this.lightbox, i);
	}

	addEventListeners();
}

function renderError(errorMsg) {
	var errorDiv = document.getElementsByClassName('errors')[0];	
	errorDiv.innerHTML = errorMsg;
	this.lightbox.ul.innerHTML = '';	
}

function addEventListeners() {
	var modal = document.getElementsByClassName('modal')[0];
	var escape = document.getElementsByClassName('escape')[0];
	var prev = document.getElementsByClassName('prev')[0];
	var next = document.getElementsByClassName('next')[0];
	var currImage = document.getElementsByClassName('currImageNode')[0];
	var submit = document.getElementsByClassName('submit')[0];

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
	submit.addEventListener('click', function(event) {
		var link = document.getElementsByClassName('imgSrcLink')[0];		
		self.flickrService.getUsername(link.value);
	});

	document.onkeydown = function(evt) {
	    evt = evt || window.event;
	    var isEscape = false;
	    var isNext = false;
	    var isPrev = false;

        isEscape = (evt.keyCode === 27);
        isNext = (evt.keyCode === 39);
        isPrev = (evt.keyCode === 37);

	    if (isEscape) {
	    	self.lightbox.closeModal();
	    	self.lightbox.clearCurrentImg();
	    }
	    if (isNext) {
	    	self.lightbox.renderSlide(self.lightbox.currIndex+1);

	    }
	    if (isPrev) {
	    	self.lightbox.renderSlide(self.lightbox.currIndex-1);
	    }
	};	
}	

if (window.addEventListener) {
	var self = this;
	window.addEventListener('load', function() {
		var link = document.getElementsByClassName('imgSrcLink')[0];  
		link.addEventListener('keypress', function(event) {
		    if (event.keyCode === 13) {
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