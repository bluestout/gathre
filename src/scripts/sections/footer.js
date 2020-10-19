/* eslint-disable shopify/jquery-dollar-sign-reference */
/* eslint-disable shopify/prefer-early-return */
/* eslint-disable id-length */
/* eslint-disable no-undef */
/* eslint-disable no-negated-condition */

const {parseInt, update} = require('lodash-es');

let productZoom;

$(document).ready(() => {
  if (relatedProduct !== null) {
    addSwatchPannel();
  }

  addSwatchForm();

  $('.mini-cart .related-product .item-panel .swatch .swatch-button').click(() => {
    $('.swatch-pannel').toggle();
  });

  $('.swatch-pannel .option .type a').click(function() {
    $(this).parent().find('a')
      .removeClass('active');
    const cls = `.${$(this).attr('class')}`;
    $(this).parent().parent()
      .find('.content')
      .find('a')
      .hide();
    $(this).parent().parent()
      .find('.content')
      .find(cls)
      .show();
    $(this).addClass('active');
  });

  $('#shopify-section-work-with-us .content_btn').click(function() {
    if ($(this).hasClass('active')) {
      $('.content_btn span').text('read more');
      $('.content_btn').removeClass('active');
      $('.content_block').removeClass('active');
    } else {
      $('.content_btn span').text('read less');
      $('.content_btn').removeClass('active');
      $('.content_block').addClass('active');
      $(this).addClass('active');
    }
  });

  $('.request-button').click(() => {
    $('.request-form').css('display', 'flex');
  });

  $('.slide_btn').click(function() {
    if ($(this).hasClass('active')) {
      $('.slide_btn').removeClass('active');
      $('.slide_content').removeClass('active');
    } else {
      $('.slide_btn').removeClass('active');
      $('.slide_content').removeClass('active');
      $(this).addClass('active');
      $(this).parent().find('.slide_content')
        .addClass('active');
    }
  });

  $('.mega_menu .links .child_link li').mouseover(function() {
    $(this).addClass('active');
    let bannerClass = '';
    // eslint-disable-next-line no-negated-condition
    if ($(this).attr('data-target') !== '') {
      bannerClass = `.${$(this).attr('data-target')}`;
    } else {
      bannerClass = '.default';
    }
    $(bannerClass).show();
  });

  $('.swatch-container .swatch-wrapper .variant_item').click(function(e) {
    let status = false;
    e.preventDefault();
    const varid = $(this).data('varid');
    const varimg = `url(${$(this).data('src')})`;
    $('#followme .container-fluid .one-third').each(function() {
      const $swatch = $(this).find('.swatch-wrapper');
      if (!$swatch.hasClass('active') && !status) {
        $swatch.css('background', varimg);
        $swatch.attr('variant_id', varid);
        status = true;
        $($swatch).addClass('active');
      }
    });
    if (!$('#followme').hasClass('active')) {
      $('#followme').addClass('active');
    }
  });

  $('.wishlist.wishlist-notadded').click((e) => {
    e.preventDefault();
    const data = $('.wishlist .contact-form').serialize();
    $.ajax({
      type: 'POST',
      url: '/contact',
      data,
      success() {
        $('.wishlist-notadded').hide();
        $('.wishlist-added').show();
      },
      error() {
        $('.contact-form').append('<p class="errror">There was an error in submitting the form.</p>');
      },
    });
  });

  $('#followme  .button').click((e) => {
    e.preventDefault();
    let status = true;
    const postData = [];
    $('#followme .one-third').each(function() {
      const $swatch = $(this).find('.swatch-wrapper');
      if ($swatch.hasClass('active') && status) {
        const postItem = {
          id: $swatch.attr('variant_id'),
          quantity: 1,
        };
        postData.push(postItem);
      } else {
        status = false;
      }
    });
    const $addToCartForm = $('#followme');
    if (status) {
      $.ajax({
        url: '/cart/add.js',
        dataType: 'json',
        cache: false,
        type: 'post',
        data: postData[0],
        success() {
          $.ajax({
            url: '/cart/add.js',
            dataType: 'json',
            cache: false,
            type: 'post',
            data: postData[1],
            success() {
              $.ajax({
                url: '/cart/add.js',
                dataType: 'json',
                cache: false,
                type: 'post',
                data: postData[2],
                success() {
                  location = '/cart';
                },
                error(XMLHttpRequest) {
                  // eslint-disable-next-line no-eval
                  let response = eval(`(${XMLHttpRequest.responseText})`);
                  response = response.description;
                  $addToCartForm.find('.alert').find('p').text(response);
                  $addToCartForm.find('.alert').show();
                  // eslint-disable-next-line no-undef
                  setTimeout(() => {
                    $addToCartForm.find('.alert').hide();
                  }, 5000);
                },
              });
            },
            error(XMLHttpRequest) {
              // eslint-disable-next-line no-eval
              let response = eval(`(${XMLHttpRequest.responseText})`);
              response = response.description;
              $addToCartForm.find('.alert').find('p').text(response);
              $addToCartForm.find('.alert').show();
              // eslint-disable-next-line no-undef
              setTimeout(() => {
                $addToCartForm.find('.alert').hide();
              }, 5000);
            },
          });
        },
        error(XMLHttpRequest) {
          // eslint-disable-next-line no-eval
          let response = eval(`(${XMLHttpRequest.responseText})`);
          response = response.description;
          $addToCartForm.find('.alert').find('p').text(response);
          $addToCartForm.find('.alert').show();
          // eslint-disable-next-line no-undef
          setTimeout(() => {
            $addToCartForm.find('.alert').hide();
          }, 5000);
        },
      });
    } else {
      $addToCartForm.find('.alert').find('p').text('3 Swatches Required to Add To Cart');
      $addToCartForm.find('.alert').show();
      // eslint-disable-next-line no-undef
      setTimeout(() => {
        $addToCartForm.find('.alert').hide();
      }, 5000);
    }
  });

  $('#swatch-change').change(function() {
    const cls = `.${$(this).val()}`;
    $('.swatch-container .all').hide();
    $(cls).fadeIn('slow');
  });

  $('.mega_menu .links .child_link li').mouseout(function() {
    $(this).removeClass('active');
    let bannerClass = '';
    // eslint-disable-next-line no-negated-condition
    if ($(this).attr('data-target') !== '') {
      bannerClass = `.${$(this).attr('data-target')}`;
    } else {
      bannerClass = '.default';
    }
    $(bannerClass).hide();
  });

  $('.mobile_menu .links .menu-link').click(function() {
    if ($(this).parent().find('.child-link')
      .hasClass('active')) {
      $('.mobile_menu .links .menu-link').removeClass('active');
      $(this).parent().find('.child-link')
        .removeClass('active');
    } else {
      $('.mobile_menu .links .menu-link').removeClass('active');
      $(this).addClass('active');
      $('.child-link').removeClass('active');
      $(this).parent().find('.child-link')
        .addClass('active');
    }
  });

  $('.mobile_menu .links .child-link-menu').click(function() {
    if ($(this).parent().find('.gchild-link')
      .hasClass('active')) {
      $('.mobile_menu .links .child-link-menu').removeClass('active');
      $(this).next('.gchild-link')
        .removeClass('active');
    } else {
      $('.mobile_menu .links .child-link-menu').removeClass('active');
      $(this).addClass('active');
      $('.gchild-link').removeClass('active');
      $(this).next('.gchild-link')
        .addClass('active');
    }
  });


  $('.search .search_menu input').click((e) => {
    e.preventDefault();
    $('.search .search_menu').addClass('show');
    $('.blank-bg').show();
  });

  $('.blank-bg').click(function() {
    $(this).hide();
    $('.search .search_menu').removeClass('show');
  });

  $('.mobile-nav-btn').click(() => {
    $('.mobile_menu').toggle();
    if ($('body').hasClass('stop-scroll')) {
      $('body').removeClass('stop-scroll');
    } else {
      $('body').addClass('stop-scroll');
    }
  });

  $('.account-dashborad .collapse .heading').click(function() {
    $(this).parent().toggleClass('active');
    $(this).parent().parent()
      .find('.content-field')
      .slideToggle();
  });

  $('.close').click(function() {
    $(this).parent().parent()
      .parent()
      .hide();
    $('body').removeClass('stop-scroll');
    $('.dark-bg').hide();
  });

  $('.swatch-pannel .option a').click(function() {
    $(this).parent().parent()
      .find('a')
      .removeClass('active');
    $(this).addClass('active');
    const img = $(this).find('img').attr('src');
    const variant = findVariant();
    $('.swatch-button .text').text(variant.title);
    $('.swatch-button .color').find('img').attr('src', img);
    $('.mini-cart .add-cart-from .variant').val(variant.id);
    if (!variant.available) {
      $('.mini-cart .product_form .add_cart').addClass('disable');
    } else {
      $('.mini-cart .product_form .add_cart').removeClass('disable');
    }
  });


  setTimeout(() => {
    const reviewTitle = `<p class="text-center">${$('.stamped-widget-title').html()}</p>`;
  }, 5000);

  $('iframe[src*="youtube.com"]:not(.plyr__video-wrapper iframe[src*="youtube.com"], .lazyframe iframe[src*="youtube.com"])').wrap('<div class="lazyframe" data-ratio="16:9"></div>');
  $('iframe[src*="vimeo.com"]:not(.plyr__video-wrapper iframe[src*="vimeo.com"], .lazyframe iframe[src*="vimeo.com"])').wrap('<div class="lazyframe" data-ratio="16:9"></div>');

  $(window).on('scroll', () => {

    $('.slideanim').each(function() {
      const pos = $(this).offset().top;

      const winTop = $(window).scrollTop();
      if (pos < winTop + 600) {
        $(this).addClass('active');
      }
    });


    const headerPosition = $(document).scrollTop();

    if (headerPosition > 0) {
      $('#shopify-section-header').addClass('sticky');
    } else {
      $('#shopify-section-header').removeClass('sticky');
    }
  });
  setTimeout(() => {
    $('.loader_wrapper').hide();
  }, 2000);


});

$(document).on('click', '.cart a', (e) => {
  e.preventDefault();
  $('body').toggleClass('stop-scroll');
  $('.mini-cart').toggle();
  $('.dark-bg').toggle();
});

$(document).on('click', '.dark-bg', () => {
  $('.mini-cart').hide();
  $('.dark-bg').hide();
  $('body').removeClass('stop-scroll');
});

$(document).on('click', '.checkbox-label', function() {
  $(this).toggleClass('active');
  $('.checkbox').trigger('click');
});

$(document).on('click', '.remove', function() {
  const lineId = $(this).parent().find('.line-id')
.val();
  const postData = {
    line: lineId,
    quantity: 0,
  };
  $.ajax({
    url: '/cart/change.js',
    dataType: 'json',
    cache: false,
    type: 'post',
    data: postData,
    success() {
      $.ajax({
        url: '/cart.js',
        dataType: 'json',
        cache: false,
        beforeSend() {
          $('.loading').fadeIn('slow');
        },
        success(cart) {
          refreshCart(cart);
        },
      });
    },
  });
});

$(document).on('click', '.mini-cart .cart-content  .item .info', function() {
  const href = $(this).data('url');
  location = href;
});

$(document).on('click', '.ajax-submit', function(e) {
  e.preventDefault();

  const FormData = {
    addToCartForm: $(this).closest('form'),
    addToCartBtn: $(this),
    postData: $(this).closest('form').serialize(),
  };
  if (!$(this).hasClass('disable')) {
    addCart(FormData);
  }
});


$('.cart-section .cart-form .remove').on('click', function() {
  $(this).parent().parent()
    .find('.qty')
    .val(0);
  $(this).parent().parent()
    .hide();
  updateCart();
});

$('.cart-section .cart-items table tr td .info .qty').on('change', () => {
  updateCart();
});


window.top.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => {
  if (key === 'checkout_url') {
    const checkoutUrl = value;
    $('.return_url').val(checkoutUrl);
  }
  if (key === 'blog_title') {
    const blogTitle = value;
    $('.blog-section .pannel').removeClass('active');
    $('.blog-section .tab li').each(function() {
      $(this).removeClass('active');
      const href = $(this).find('a').attr('href');
      if (href === blogTitle) {
        $(this).addClass('active');
        $(blogTitle).addClass('active');
      }
    });
  }
});

$(document).on('click', '.gift_link', (e) => {
  e.preventDefault();
  $('.checkout_description').fadeToggle();
  $('.gift_link').toggleClass('active');
  $('.item-field').toggleClass('active');
  $(this).parent().find('.checkout_description').val(""); 
});

$(document).on('click', '.cart-form .checkout', (e) => {
  e.preventDefault();
  $('.cart-form').attr('action', '/checkout');
  $('.cart-form').submit();
});

$(document).on('click', '.close_open_btn', (e) => {
  e.preventDefault();
  $('#followme').toggleClass('active');
});

$('.product-image_gallery .image-block .wish-icon').click((e) => {
  e.preventDefault();
  $('.wishlist-btn').trigger('click');
});

$(document).ready(() => {
  $('.product-image_gallery .image-block .zoom-icon').bind('click', function(e) {
    e.preventDefault();
    const selector = $(this).data('target');
    console.log(selector)
    let html_val = '';
    let num = parseInt($(this).data('num'));
    if ($(window).innerWidth() < 769) {
      html_val = $(selector).find('.flickity-slider').html();
    } else {
      html_val = $(selector).html();
    }
    $.fancybox.open({
      src: `<div><div class="image-block carousel">${html_val}</div></div>`,
      type: 'html',
      opts: {
        beforeShow(instance, current){
          $('.fancybox-slide').css('visibility', 'hidden');
        },
        afterShow(instance, current) {
          $('.fancybox-content .carousel').flickity({
            lazyLoad: 1,
            cellAlign: 'left',
            wrapAround: true,
            contain: true,
            prevNextButtons: true,
            pageDots: false,
            initialIndex: num,
          });
          $('.fancybox-slide').css('visibility', 'visible');
        },
      },
    });

  });
  $('.mini-cart .cart-form .checkout_description').change(function () {
    updateCart();
  })
});


function updateCart() {
  const postData = $('.cart-form').serialize();
  $.ajax({
    url: '/cart/update.js',
    dataType: 'json',
    cache: false,
    type: 'post',
    data: postData,
    success(cart) {
      if (cart.item_count > 0) {
        $('.mini-cart .cart-form .checkout_description').val(cart.note);
        for (let i = 0; i < cart.items.length; i++) {
          const item = cart.items[i];
          const id = `#${item.id}--block`;
          $(id).find('.price').find('.bold')
            .text(`$${item.final_line_price / 100}`);
        }
        const subTotal = `$${cart.items_subtotal_price / 100}`;
        const limit = parseInt($('.cart-section .summary-content .free-shipping-progress-bar').data('limit'));
        const progress = cart.items_subtotal_price / limit;
        let msg = '';
        $('.cart-section .cart-summary .summary-content .sub-total-block p span').text(subTotal);
        $('.cart-section .summary-content .free-shipping-progress-bar .free-shipping-progress').css('width', `${cart.items_subtotal_price / limit}%`);
        if (progress >= 100) {
          msg = "✓ Congratulations! You've earned a FREE GIFT!";
        } else {
          msg = `Only $${limit - cart.items_subtotal_price / 100} away from FREE SHIPPING`;
        }

        $('.cart-section .cart-summary .summary-content .free-shipping-progress-bar span').text(msg);
      } else {
        $('.cart-section .cart-form').hide();
        $('.cart-section .empty-form').removeClass('hide');
      }

    },
  });
}

function refreshCart(cart) {
  if (cart.items.length !== 0) {
    $('.mini-cart .cart-form .checkout_description').val(cart.note);
    let html = '';
    var exclude_price = 0;
    var j = 0;
    for (let i = 0; i < cart.items.length; i++) {
      const item = cart.items[i];
      html += '<div class="item">';
      html += '<a class="remove"><svg width="14px" height="14px" viewBox="0 0 14 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="style-guide" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="square"><g id="icons" transform="translate(-201.000000, -9.000000)" stroke="#070707" stroke-width="2"><g id="ico/close_ico" transform="translate(208.000000, 16.000000) rotate(-360.000000) translate(-208.000000, -16.000000) translate(203.000000, 11.000000)"><path d="M10,10 L0,0" id="Line-2"></path><path d="M0,10 L10,0" id="Line-2"></path></g></g></g></svg></a>';
      html += `<img class="fleft" src="${item.featured_image.url}">`;
      html += `<div class="info fleft" data-url="${item.url}">`;
      html += `<p class="name">${item.title}</p>`;
      html += `<p class="price">${item.quantity} X ${currencyType}${item.price / 100}</p>`;
      html += `<input type="hidden" class="line-id" value="${i + 1}">`;
      html += '</div></div>';
      jQuery.getJSON(`/products/${item.handle}.js`, function(line_product) {
        if ($.inArray('nofreeship', line_product.tags) >= 0 ) {
          exclude_price += item.price*item.quantity;
          j ++;
        } else {
          j ++;
        }
        console.log($.inArray('nofreeship', line_product.tags) >= 0);
        console.log(exclude_price);
        console.log(j);
        
        if (j == cart.items.length) {
          var total_price = cart.total_price - exclude_price;
          if (freeShippingLimit > total_price) {
            const leftMoney = (freeShippingLimit - total_price) / 100;
            $('.cart-message h5').text(`Only ${currencyType}${leftMoney} away from FREE shipping!`);
          } else {
            $('.cart-message h5').text("✓ congratulations you’ve earned free shipping!");
          }
        }
        
      });
    }
    $('.mini-cart .cart-content .items').html(html);
    $('.cart-content').removeClass('hide');
    $('.empty-product').addClass('hide');

    $('.sub-total .price').text(`${currencyType}${cart.total_price / 100}`);

  } else {
    $('.cart-content').addClass('hide');
    $('.empty-product').removeClass('hide');
    $('.cart-message h5').text('YOU DON’T HAVE ANY ITEMS IN YOUR CART.');
  }

  $('.item-field').scrollTop(0);
  $('.loading').fadeOut('slow');
}

function addSwatchPannel() {
  let cartSwatchPannel = '';
  const activeProduct = [];
  const activeOptions = [];
  let variant = [];
  for (let i = 0; i < relatedProduct.variants.length; i++) {
    variant = relatedProduct.variants[i];
    if (variant.available) {
      activeProduct.push(variant);
    }
  }
  let status_type = false;
  for (let j = 0; j < relatedProduct.options.length; j++) {
    const option = relatedProduct.options[j];
    cartSwatchPannel += `<div class="option"><h4 class="uppercase bold">${option}</h4>`;
    if (option === 'Color') {
      cartSwatchPannel += '<div class="type">';
      cartSwatchPannel += '<a class="solids active">solids</a>';
      cartSwatchPannel += '<a class="prints">pattens</a>';
      cartSwatchPannel += '</div>';
    }
    cartSwatchPannel += '<div class="content grid">';
    // eslint-disable-next-line id-length
    const activeVals = activeProduct[0].options;
    for (let m = 0; m < activeProduct.length; m++) {
      variant = activeProduct[m];
      // eslint-disable-next-line id-length
      for (let n = 0; n < variant.options.length; n++) {
        // eslint-disable-next-line no-unused-vars
        let status = false;
        const variantOption = variant.options[n];
        for (let i = 0; i < activeOptions.length; i++) {
          if (activeOptions[i] === variantOption) {
            status = true;
          }
        }
        if (!status) {
          activeOptions.push(variantOption);
        }
      }
    }
    
    for (let t = 0; t < activeOptions.length; t++) {
      const id = activeOptions[t].replace(' ', '').toLowerCase();

      // eslint-disable-next-line no-undef
      const label = swatchs[id];
      if (label !== undefined) {
        let activeStatus = '';
        for (let index = 0; index < activeVals.length; index++) {
          if (label.title === activeVals[index].replace(' ', '').toLowerCase()) {
            activeStatus = 'active';
          }
        }
        if (label.type === option.toLowerCase()) {

          
          if (label.type === 'color') {
            if (label.sub_type === 'prints') {
              cartSwatchPannel += `<div class="grid__item one-sixth"><a class="${label.sub_type} ${activeStatus}" data-target="${label.title}" style="display:none;" varaint-id="${variant.id}" ><img src="${label.bg_image}"></a></div>`;

              status_type = true;
            } else {
              cartSwatchPannel += `<div class="grid__item one-sixth"><a class="${label.sub_type} ${activeStatus}" data-target="${label.title}" varaint-id="${variant.id}" ><img src="${label.bg_image}"></a></div>`;
            }
          } else {
            cartSwatchPannel += `<a class="${label.sub_type} ${activeStatus} label" data-target="${label.title}" varaint-id="${variant.id}" >${label.title}</a>`;
          }
        }
      }
    }
    cartSwatchPannel += '</div></div>';
  }

  $('.mini-cart .swatch-pannel').html(cartSwatchPannel);

  if (!status_type) {
    $('.mini-cart .swatch-pannel .type .prints').hide();
  }
  let label = '';
  let img = '';
  $('.swatch-pannel .content .active').each(function() {
    if (label != '') {
      label += ' / ';
    }
    label += $(this).data('target');
    if ($(this).find('img').attr('src') != undefined) {
      img = $(this).find('img').attr('src');
    }
  });
  $('.swatch-button').find('.text').text(label);
  $('.swatch-button').find('.color').find('img')
    .attr('src', img);
}

function addSwatchForm() {
  const swatchForm = $('#shopify-section-swatch .swatch').html();
  $('.product-pannel .swatch').html(swatchForm);
}

function findVariant() {
  let productVariantOption = '';
  $('.swatch-pannel .content a').each(function() {
    if ($(this).hasClass('active')) {
      productVariantOption += $(this).attr('data-target');
    }
  });

  let val = [];

  for (let i = 0; i < relatedProduct.variants.length; i++) {
    const variant = relatedProduct.variants[i];
    let option = '';
    for (let j = 0; j < variant.options.length; j++) {
      option += variant.options[j].toLowerCase().replace(' ', '').replace('/', '');
    }

    if (productVariantOption === option) {
      val = variant;
    }
  }

  if (val.length === 0) {
    return false;
  } else {
    return val;
  }
}

function addCart(formData) {
  const $addToCartForm = formData.addToCartForm;
  const $addToCartBtn = formData.addToCartBtn;
  const postData = formData.postData;
  $.ajax({
    url: '/cart/add.js',
    dataType: 'json',
    cache: false,
    type: 'post',
    data: postData,
    beforeSend() {

      $addToCartBtn.addClass('disabled');
      $addToCartBtn.find('span').removeClass('fadeInDown').addClass('animated zoomOut');
    },
    success() {
      $.ajax({
        url: '/cart.js',
        dataType: 'json',
        cache: false,
        success(cart) {
          $addToCartBtn.find('.checkmark').addClass('checkmark-active');
          window.setTimeout(() => {
            $addToCartBtn.removeAttr('disabled').removeClass('disabled');
            $addToCartBtn.find('.checkmark').removeClass('checkmark-active');
            $addToCartBtn.find('span').removeClass('zoomOut').addClass('fadeInDown');
          }, 1000);

          refreshCart(cart);
          setTimeout(() => {
            $('#shopify-section-header header .side-form .cart a').trigger('click');
          }, 1500);

        },
      });
    },
    error(XMLHttpRequest) {
      // eslint-disable-next-line no-eval
      let response = eval(`(${XMLHttpRequest.responseText})`);
      response = response.description;
      $addToCartForm.find('.alert').find('p').text(response);
      $addToCartForm.find('.alert').show();
      // eslint-disable-next-line no-undef
      setTimeout(() => {
        $addToCartForm.find('.alert').hide();
      }, 5000);

      $addToCartBtn.removeClass('disabled');
      $addToCartBtn.find('.checkmark').hide();
      $addToCartBtn.find('span').removeClass('zoomOut').addClass('fadeInDown');
      $addToCartBtn.find('span.text').fadeIn();
    },
  });
}
