"use strict";






var Menu = {
	menu: document.querySelector('.menu'),
	button: document.querySelector('.menu-open'),
	init: function(){ 
		this.menu.style.display = 'none'
		this.button.addEventListener("click",this.open.bind(this))
	},
	open: function(e){
		
		if(this.menu.style.display == 'none'){
			this.menu.style.display = 'block'
			this.button.style.transform = 'rotate(180deg)'
		}else{
			this.menu.style.display = 'none'
			this.button.style.transform = null
		}
	}
}

var Status =  {
	storage: 'изменить статус',
	formBlock: document.querySelector('.add-status'),
	button: document.querySelector(".user-status"),
	form: document.querySelector('.add-status form'),
	init: function(){ 
		this.addStatus()
		this.formBlock.style.display = 'none'
		this.form.addEventListener("submit",this.submit.bind(this))
		this.button.addEventListener("click",this.open.bind(this))
	},
	open:function(){
		
		if(this.formBlock.style.display == 'none'){
			this.formBlock.style.display = 'block'
		}else{
			this.formBlock.style.display = 'none'
		}
	},
	submit: function(e){
		e.preventDefault()
		var statusValue = e.currentTarget.elements[0].value
		localStorage.setItem('status', statusValue);
		this.addStatus()
	},
	addStatus: function(){
		this.button = document.querySelector(".user-status")
		
		if(localStorage.getItem('status') != null){
			this.storage = localStorage.getItem('status')
		}
		this.button.innerHTML = this.storage
	}
}

var Comments = {
	addComment: null,
	getComments: null,
	deleteComments: null,
	init: function(){
		this.addComment = new XMLHttpRequest();
		this.getComments = new XMLHttpRequest();
		this.deleteComments = new XMLHttpRequest();
		
		var form = document.querySelector('.comment-add')
		var button = document.querySelector('.comment-delete')

		form.addEventListener('submit',this.add.bind(this))
		this.ajaxEvents()
		this.getElements()
	},
	ajaxEvents: function(){
		var self = this
		this.addComment.addEventListener('load',function(){
			
			if(this.statusText == 'OK'){
				self.getElements()
			}
		})
		this.addComment.addEventListener('error',function(){
			console.log('Ошибка ajax запроса!')
		})
		this.deleteComments.addEventListener('load',function(){
			
			if(this.statusText == 'OK'){
				self.getElements()
			}
		})
		this.deleteComments.addEventListener('error',function(){
			console.log('Ошибка ajax запроса!')
		})
	},
	add: function(e){
		e.preventDefault()
		var nameValue = e.currentTarget.elements[0].value
		var textValue = e.currentTarget.elements[1].value
		this.addComment.open("POST", "/php/ajax.php")
		this.addComment.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
		this.addComment.send("ajax=&name="+nameValue+"&text="+textValue)
		
		
	},
	delete: function(id){
		console.log(id)
		this.deleteComments.open("GET", "/php/ajax.php?comment="+id)
		this.deleteComments.send()
	},
	getElements: function(){
		var self = this
		this.getComments.open("GET", "/php/ajax.php?comments")
		this.getComments.send()
		this.getComments.addEventListener('load',function(){
			var element = document.querySelector('.comments')
			if(this.responseText.length > 0){
				element.innerHTML = this.responseText
			}else{
				element.innerHTML = "Здесь пока пусто"
			}
		})
		this.getComments.addEventListener('error',function(){
			var element = document.querySelector('.comments')
			element.innerHTML = 'Ошибка! Не удалось загрузить комментарии'
		})
	}
}

var ScrollMobile = {
	gallery: document.querySelector(".gallery-images"),
	o: 0,
	slider: document.querySelector('.slider'),
	touchNumber: 0,
	start: true,
	rightPosition: 0,
	mobileWindow: false,
	desctopWindow: false,
	init: function(){
		var windowWidth = document.documentElement.clientWidth



		window.addEventListener("resize", this.updateWindowWidth.bind(this)); 
		if(windowWidth < 768){
			this.mobileWindow = true
			this.addEvents()
		}else{
			this.desctopWindow = true
		}
	},
	addEvents: function(){
		this.gallery.addEventListener("touchmove", this.touchMove.bind(this));
		this.gallery.addEventListener("touchstart", this.touchStart.bind(this));
		window.addEventListener("resize", this.resizeUpdate.bind(this));
		this.gallery.addEventListener("touchend", this.touchEnd.bind(this));
	},
	removeEvents: function(){
		this.gallery.removeEventListener("touchmove", this.touchMove);
		this.gallery.removeEventListener("touchstart", this.touchStart);
		window.removeEventListener("resize", this.resizeUpdate);
		this.gallery.removeEventListener("touchend", this.touchEnd);
	},
	touchStart: function(e){
	
		document.querySelector("body").style.overflow = 'hidden'
		if(this.start){
			this.updatePosition()
			this.slider.style.width = this.slider.clientWidth + 'px'
			this.slider.style.right = -this.rightPosition + 'px'
			this.slider.style.left = null
			this.start = false
		}
		var clientX = e.touches[0].clientX;
		var numberRight = Number(this.slider.style.right.slice(0,-2));
		this.o = numberRight - clientX;
		this.touchNumber =  clientX  +  this.o;
	},
	touchMove: function(e){
		var clientX = e.touches[0].clientX;
		var numberRight = Number(this.slider.style.right.slice(0,-2));
		this.touchNumber =  clientX  +  this.o;
		
		if(this.touchNumber > 0){
			this.touchNumber = 0
			this.o = numberRight - clientX;	
		}
		if(this.touchNumber < -this.rightPosition){
			this.touchNumber = -this.rightPosition
			this.o = numberRight - clientX;
		}
		
		this.slider.style.right = this.touchNumber + 'px';
   

	},
	updatePosition: function(){
		var widthSlider = this.slider.clientWidth;
		var widthGallery = this.gallery.clientWidth;
		this.rightPosition = (widthSlider - widthGallery) - 23;
	},
	resizeUpdate: function(){
		this.updatePosition()
	},
	touchEnd: function(){
		document.querySelector("body").style.overflow = 'auto'
		var numberRight = Number(this.slider.style.right.slice(0,-2));
		var startPosition =  (this.slider.clientWidth - this.gallery.clientWidth) -23;
		if(-startPosition == numberRight){
			this.slider.style.left = '0px'
			this.start = true
		}
	},
	updateWindowWidth: function(){
		var windowWidth = document.documentElement.clientWidth;
		if(windowWidth < 768 && !this.mobileWindow){
			this.addEvents()
			console.log('1')
			this.mobileWindow = true
			this.desctopWindow = false
		}
		if(windowWidth > 767 && !this.desctopWindow){
			this.removeEvents()
			this.slider.style.width = 'auto'
			this.desctopWindow = true
			this.mobileWindow = false
		}
	}
}

Comments.init();
ScrollMobile.init();
Menu.init();
Status.init();