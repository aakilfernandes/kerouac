var lightbox = $('#lightbox').monarch();

lightbox.params = {
	lightboxX:		800,	//Starting width of the lightbox
	bodyY:			2000,	//Height of the body
	imageboxN:		6,		//Number of imageboxes
	imageboxRatio:	.75,	//The ratio of height to width (height/width)
	margin:			10,		//The space between image boxes, doesn't effect outer margin
	//img bank
	imgSrc:			window.location.href.replace('index.html','')+'img/imagebox/',
	imgs:			[
						'a.gif',
						'b.gif',
						'c.gif',
						'd.gif',
						'e.gif',
						'f.gif',
					]
}

//Imagebox Class
var Imagebox = function(imgSrc,imgs){
	return function(monarch){
		monarch
			.declare('onScroll',function(x,y,extra){
				//round down by default
				x = Math.floor(x);
				y = Math.floor(y);
				
				if(monarch.n!=0 && monarch.n%extra==0){
					x++;
				}
				
				monarch
					.width(x)
					.height(y)
			})
			.bestow('img')
				.attr('src',imgSrc+imgs[monarch.n])
		
		if(monarch.n==monarch.N-1){
			monarch.css('margin-right','0px')
		}
	}
}

lightbox
	.declare('onScroll',function(scrollTop,windowHeight){
		//Find dimensions
		var x = Math.ceil(this.params.lightboxX/(1+2*(scrollTop/(this.params.bodyY-$(window).height()))))
		
		//Adjust imageboxes
		var imageboxX=(x-(this.params.imageboxN+1)*(this.params.margin))/this.params.imageboxN;
		var imageboxY=imageboxX*this.params.imageboxRatio;
		var imageboxExtra=Math.ceil(Math.pow(imageboxX%1,-1));
		$(this).find('.imagebox').each(function(){
			this.monarch.onScroll(imageboxX,imageboxY,imageboxExtra)
		})
		
		//Adjust dimensions
		this.width(x-2*this.params.margin);
		this.css('margin-left','-'+(x/2).toString()+'px');
		var y = this.height();
		this.css('margin-top','-'+(y/2).toString()+'px');
	})
	.declare('imageboxes',lightbox.find('.imageboxes'))
	.imageboxes
		.bestow('div.imagebox',lightbox.params.imageboxN,Imagebox(lightbox.params.imgSrc,lightbox.params.imgs))
			.lord
		.bestow('div.clear')

$(window).scroll(function(){
	lightbox.onScroll($(this).scrollTop(),$(this).height())
})

//Fire window.scroll, doesn't work when set to 0.
$(window).scrollTop(1)

