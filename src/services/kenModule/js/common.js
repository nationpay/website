$(document).ready(function() {

	$('.desc-slider').slick({
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 1,
		prevArrow: '<div class="arrow arrow-prev"><</div>',
		nextArrow: '<div class="arrow arrow-next">></div>',
		responsive: [
		{
			breakpoint: 769,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 1
			}
		},
		{
			breakpoint: 480,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1
			}
		}
		]
	});

	$('.partners-slider').slick({
		speed: 500,
		slidesToShow: 6,
		slidesToScroll: 1,
		prevArrow: '<div class="partners-arrow partners-arrow-prev"><</div>',
		nextArrow: '<div class="partners-arrow partners-arrow-next">></div>',
		dots: true,
		responsive: [
		{
			breakpoint: 768,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 1
			}
		},
		{
			breakpoint: 480,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1
			}
		}
		]
	});

	// Всплывающее окно
	$('.popup-form-new-btn').magnificPopup({
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

	// Изменение высоты при клике на блок в секции "Наши гарантии"
	$('.guarantees-item').click(function() {
		var el = $(this).find('.guarantees-item-words'),
		curHeight = el.height(),
		autoHeight = el.css('height', 'auto').height();
		if (curHeight == 90) {
			el.height(curHeight).animate({
				height: autoHeight
			}, 1000);
		} else {
			el.height(curHeight).animate({
				height: "90px"
			}, 1000);
		}
	});

	// Показать все
	$('.ecosystem-item-drop').hide()
	$('.ecosystem-btn').click(function(){
		$('.ecosystem-item-drop').slideToggle(250);
		return false;
	});

    $('.discount-item-drop').hide();
    $('.discount-btn').click(function(){
        $('.discount-item-drop').slideToggle(250);
        return false;
    });

	$('.teams-item-drop').hide()
	$('.teams-btn').click(function(){
		$('.teams-item-drop').slideToggle(250);
		return false;
	});

	$('.news-item-drop').hide()
	$('.news-btn').click(function(){
		$('.news-item-drop').slideToggle(250);
		return false;
	});

	if ($(window).width() > 768) {
		$('.guarantees-item').hover(function () {
			var item = $(this),
				textBlock = item.find('.guarantees-item-words');
			textBlock.animate({height: textBlock[0].scrollHeight}, 200);
			// console.log(textBlock[0].scrollHeight);
		}, function () {
			var item = $(this),
				textBlock = item.find('.guarantees-item-words');
			textBlock.animate({height: 90}, 200);
		});
		return false;
	}

    // Выпадющие языки при наведение
	$('.lang > li').hover(function(){
		$(this).children('.header-lang-drop').stop(false, true).fadeIn(300);
	}, function(){
		$(this).children('.header-lang-drop').stop(false, true).fadeOut(300);
	});

    // Humburger
	$(".toggle-nav").click(function() {
		// $(this).toggleClass("on");
		// $(".header-mnu-mobile").slideToggle();
		return false;
	});


	// Плавный скролл
	$(".slowly").on("click", function (event) {
		event.preventDefault();
		var id  = $(this).attr('href'),
		top = $(id).offset().top + 0;
		$('body,html').animate({scrollTop: top}, 1000);
	});

	new WOW().init();
});
