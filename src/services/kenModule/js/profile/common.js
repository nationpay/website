$(document).ready(function() {

    // Всплывающее окно обратной связи
    $('.form-email-success').magnificPopup({
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

	// Всплывающее окно обратной связи
	$('.form-login-btn').magnificPopup({
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

	$('.form-register-btn').magnificPopup({
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

    $('.form-edit-btn').magnificPopup({
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

    $('.form-password-btn').magnificPopup({
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

	// Плавный скролл
	$(".slowly").on("click", function (event) {
		event.preventDefault();
		var id  = $(this).attr('href'),
		top = $(id).offset().top + 0;
		$('body,html').animate({scrollTop: top}, 1000);
	});

	// Выпадющие языки при наведение
	$('.lang > li').hover(function(){
		$(this).children('.header-lang-drop').stop(false, true).fadeIn(300);
	}, function(){
		$(this).children('.header-lang-drop').stop(false, true).fadeOut(300);
	});

	$('.header-user').hover(function(){
		$(this).children('.header-user-drop').stop(false, true).fadeIn(300);
	}, function(){
		$(this).children('.header-user-drop').stop(false, true).fadeOut(300);
	});

	// Humburger
	$(".toggle-nav").click(function() {
		$(this).toggleClass("on");
		$(".header-mnu-mobile").slideToggle();
		return false;
	});

});