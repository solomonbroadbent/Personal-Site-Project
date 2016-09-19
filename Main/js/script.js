$(function(){
	"use strict";
	
	var portfolio = $('.portfolio-items'),
		blog = $('.blog-posts'),
		$testimonials = $('.testimonials-slider');
	
	
	/*=========================================================================
		Responsive Videos
	=========================================================================*/
	$('figure').fitVids();
	
	/*=========================================================================
		Magnific Popup (Project Popup initialization)
	=========================================================================*/
	$('.has-popup').magnificPopup({
		type: 'inline',
		fixedContentPos: false,
		fixedBgPos: true,
		overflowY: 'auto',
		closeBtnInside: true,
		preloader: false,
		midClick: true,
		removalDelay: 300,
		mainClass: 'my-mfp-zoom-in'
	});
	
	/*=========================================================================
		Section navigation by URL Hash
	=========================================================================*/
	var sect = window.location.hash;
	if ( $(sect).length == 1 ){
		$('.section.active').removeClass('active');
		$(sect).addClass('active');
		$('.menu-items > li > a.active').removeClass('active');
		$('.menu-items a[href='+sect+']').addClass('active');
		if( $(sect).data('color') == 'dark' ){
			$('body').addClass('dark-color');
		}else{
			$('body').removeClass('dark-color');
		}
		$('body, .nav').css('background-color', $(sect).data('bg'));	
	}
	
	$(window).on('load', function(){
		
		/* Blog Grid */
		blog.shuffle();
		
		/* Portfolio Grid */
		portfolio.shuffle();
		
		$('body').addClass('loaded');
	});
	
	
	/*=========================================================================
		Portfolio Filters
	=========================================================================*/
	$('.portfolio-filters > li > a').on('click', function (e) {
		e.preventDefault();
		var groupName = $(this).attr('data-group');
		$('.portfolio-filters > li > a').removeClass('active');
		$(this).addClass('active');
		portfolio.shuffle('shuffle', groupName );
	});
	
	
	/*=========================================================================
		Testimonials Initialize
	=========================================================================*/
	$testimonials.owlCarousel({
		items:1
	});
	
	/*=========================================================================
		Menu Functions
	=========================================================================*/
	$('.menu-btn').on('click', function(e){
		e.preventDefault();
		$('body').toggleClass('show-menu');
	});
	$('#main-wrapper').on('click', function(){
		$('body').removeClass('show-menu');
	});
	var cTimeout = false, color, timeout;
	$('.menu-items > li > a, .section-link').on('click', function(e){
		var section = $(this).attr('href');
		$('body').removeClass('show-menu');
		if( $(section).length == 1 && !$(section).hasClass('active') ){
			if(cTimeout){
				clearTimeout(timeout);
				$('body').removeClass('switch');
				$('.ripple').remove();
			}
			if( $(section).data('color') == 'dark' ){
				$('body').addClass('dark-color');
			}else{
				$('body').removeClass('dark-color');
			}
			color = $(section).data('bg');
			setTimeout(function(){
				$('<div class="ripple" ></div>').css({
					'background' : color,
					'top' : e.clientY,
					'left' : e.clientX
				}).appendTo('body');
			}, 0);
			$('.menu-items > li > a.active').removeClass('active');
			$('.menu-items a[href='+section+']').addClass('active');
			$('body').addClass('switch');
			cTimeout = true;
			setTimeout(function(){
				$('.section.active').removeClass('active');
				$(section).addClass('active');
			}, 500);
			timeout = setTimeout(function(){
				$('body').removeClass('switch');
				$('body, .nav').css('background-color', color);
				$('.ripple').remove();
				cTimeout = false;
			}, 1000);
			setTimeout(function(){
				portfolio.shuffle('destroy');
				portfolio.shuffle();
				blog.shuffle('destroy');
				blog.shuffle();
				$testimonials.data('owlCarousel').onResize();
			}, 500);
		}
	});
	/*=========================================================================
		Contact Form
	=========================================================================*/
	function isJSON(val){
		var str = val.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, '');
		return (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(str);
	}
	$('#contact-form').validator().on('submit', function (e) {
		if (!e.isDefaultPrevented()) {
			// If there is no any error in validation then send the message
			e.preventDefault();
			var $this = $(this),
				//You can edit alerts here
				alerts = {
					success: 
					"<div class='form-group' >\
						<div class='alert alert-success' role='alert'> \
							<strong>Message Sent!</strong> We'll be in touch as soon as possible\
						</div>\
					</div>",
					error: 
					"<div class='form-group' >\
						<div class='alert alert-danger' role='alert'> \
							<strong>Oops!</strong> Sorry, an error occurred. Try again.\
						</div>\
					</div>"
				};
			$.ajax({
				url: 'mail.php',
				type: 'post',
				data: $this.serialize(),
				success: function(data){
					if( isJSON(data) ){
						data = $.parseJSON(data);
						if(data['error'] == false){
							$('#contact-form-result').html(alerts.success);
							$('#contact-form').trigger('reset');
						}else{
							$('#contact-form-result').html(
							"<div class='form-group' >\
								<div class='alert alert-danger alert-dismissible' role='alert'> \
									<button type='button' class='close' data-dismiss='alert' aria-label='Close' > \
										<i class='ion-ios-close-empty' ></i> \
									</button> \
									"+ data['error'] +"\
								</div>\
							</div>"
							);
						}
					}else{
						$('#contact-form-result').html(alerts.error);
					}
				},
				error: function(){
					$('#contact-form-result').html(alerts.error);
				}
			});
		}
	});
	
	
});