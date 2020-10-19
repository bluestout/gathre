
$(document).ready(() => {
  const delay = $('.carousel').attr('delay-time') * 1000;
  $('.homepage_slideshow').flickity({
        // options
    cellAlign: 'left',
    contain: true,
    fullscreen: true,
    lazyLoad: 1,
    wrapAround: true,
    autoPlay: delay,
    prevNextButtons: false,
    pageDots: false,
    adaptiveHeight: true,
  });

  $('.feature-products').flickity({
    lazyLoad: 1,
    cellAlign: 'left',
    wrapAround: true,
    contain: true,
    pageDots: true,
    arrowShape: 'm54 30h-39.899l15.278-14.552c.8-.762.831-2.028.069-2.828-.761-.799-2.027-.831-2.828-.069l-17.448 16.62c-.755.756-1.172 1.76-1.172 2.829 0 1.068.417 2.073 1.207 2.862l17.414 16.586c.387.369.883.552 1.379.552.528 0 1.056-.208 1.449-.621.762-.8.731-2.065-.069-2.827l-15.342-14.552h39.962c1.104 0 2-.896 2-2s-.896-2-2-2z',
  });

  $('.premium').flickity({
    imagesLoaded: true,
    autoPlay: delay,
    contain: true,
    cellAlign: 'left',
    wrapAround: true,
    prevNextButtons: false,
    pageDots: false,
    freeScroll: true,
    freeScrollFriction: 0.03,
  });

  $('.banner-carousel').flickity({
    imagesLoaded: true,
    autoPlay: delay,
    contain: true,
    cellAlign: 'left',
    wrapAround: true,
    pageDots: false,
    prevNextButtons: true,
    arrowShape: 'm54 30h-39.899l15.278-14.552c.8-.762.831-2.028.069-2.828-.761-.799-2.027-.831-2.828-.069l-17.448 16.62c-.755.756-1.172 1.76-1.172 2.829 0 1.068.417 2.073 1.207 2.862l17.414 16.586c.387.369.883.552 1.379.552.528 0 1.056-.208 1.449-.621.762-.8.731-2.065-.069-2.827l-15.342-14.552h39.962c1.104 0 2-.896 2-2s-.896-2-2-2z',
  });

  $('.related-collection-section .carousel').flickity({
    imagesLoaded: true,
    autoPlay: delay,
    contain: true,
    cellAlign: 'left',
    wrapAround: true,
    prevNextButtons: false,
    pageDots: false,
  });

  $('.testimonials').flickity({
    lazyLoad: 1,
    cellAlign: 'left',
    wrapAround: true,
    contain: true,
    pageDots: $(this).data('dot'),
    prevNextButtons: $(this).data('arrow'),
    arrowShape: 'm54 30h-39.899l15.278-14.552c.8-.762.831-2.028.069-2.828-.761-.799-2.027-.831-2.828-.069l-17.448 16.62c-.755.756-1.172 1.76-1.172 2.829 0 1.068.417 2.073 1.207 2.862l17.414 16.586c.387.369.883.552 1.379.552.528 0 1.056-.208 1.449-.621.762-.8.731-2.065-.069-2.827l-15.342-14.552h39.962c1.104 0 2-.896 2-2s-.896-2-2-2z',
  });
});
