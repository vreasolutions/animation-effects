
jQuery(document).ready(function($) {
    $(window).load(function(){

        $('body').addClass('loaded');
    });
});
$(window).on('beforeunload', function(){
  $(window).scrollTop(0);
});
$('.toggle-box').click(function(){
	$('#main-menu').slideToggle("slow", function() { });
});
$(window).scroll(function () {
		if ($(document).scrollTop() > 80) {
  			$(".header-container").addClass("header-top-fix");
  		}
  		else{
			$(".header-container").removeClass("header-top-fix");
  		}
	});
	
jQuery(document).ready(function() {

	jQuery('#work-container').mixItUp();				
	jQuery('.tp-banner').show().revolution(
	{
								dottedOverlay:"none",
						delay:9000,
						startwidth:1170,
						startheight:500,
						hideThumbs:200,

						thumbWidth:100,
						thumbHeight:50,
						thumbAmount:3,
						
												
						simplifyAll:"off",

						navigationType:"none",
						navigationArrows:"solo",
						navigationStyle:"preview4",

						touchenabled:"on",
						onHoverStop:"on",
						nextSlideOnWindowFocus:"off",

						swipe_threshold: 0.7,
						swipe_min_touches: 1,
						drag_block_vertical: false,
						
												
												
						keyboardNavigation:"on",

						navigationHAlign:"center",
						navigationVAlign:"bottom",
						navigationHOffset:0,
						navigationVOffset:20,

						soloArrowLeftHalign:"left",
						soloArrowLeftValign:"center",
						soloArrowLeftHOffset:20,
						soloArrowLeftVOffset:0,

						soloArrowRightHalign:"right",
						soloArrowRightValign:"center",
						soloArrowRightHOffset:20,
						soloArrowRightVOffset:0,

						shadow:0,
						fullWidth:"off",
						fullScreen:"on",

												spinner:"spinner0",
												
						stopLoop:"off",
						stopAfterLoops:-1,
						stopAtSlide:-1,

						shuffle:"off",

						
						forceFullWidth:"off",
						fullScreenAlignForce:"off",
						minFullScreenHeight:"400",
						
						hideThumbsOnMobile:"off",
						hideNavDelayOnMobile:1500,
						hideBulletsOnMobile:"off",
						hideArrowsOnMobile:"off",
						hideThumbsUnderResolution:0,

												fullScreenOffsetContainer: ".headerwrap, .headertopwrap",
						fullScreenOffset: "",
												hideSliderAtLimit:0,
						hideCaptionAtLimit:0,
						hideAllCaptionAtLilmit:0,
						startWithSlide:0					
						});



									
	
					
});	//ready



