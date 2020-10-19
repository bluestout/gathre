/* eslint-disable no-negated-condition */

const {functions} = require('lodash-es');

let stickySidebar,
  stickystatus = false;

$(window).on('load', () => {
  window.top.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => {
    if (key === 'variant') {
      const variantId = value;
      const variant = findVariantFromUrl(variantId);
      if (variant) {
        productFeature(variant);
        $('.varaint').val(variant.id);
      }
    }
  });
});

$(document).ready(() => {

  if ($('body').innerWidth() > 1023) {
    if (!$('.product-section').hasClass('gift')) {
      const infoHeight = $('.product-info').innerHeight();
      const imageHeight = $('.product-image_gallery').innerHeight() - 100;

      if (imageHeight > infoHeight) {
        stickySidebar = new StickySidebar('.product-info', {
          topSpacing: 150,
          containerSelector: '.product-content',
          innerWrapperSelector: '.info',
        });
        stickystatus = true;
      }
    }
  } else {
    $('.image-block.active').flickity({
      lazyLoad: 1,
      cellAlign: 'left',
      wrapAround: true,
      contain: true,
      prevNextButtons: false,
      pageDots: false,
    });
  }

  const current = getMountainTime();

  const startTime = current.time;
  const standardendTime = '13:00';
  const expressendTime = '14:00';
  const currentDateTime = current.dateTime;
  const standarddiffMin = getDiffTime(startTime, standardendTime);
  const expressdiffMin = getDiffTime(startTime, expressendTime);


  let shippingMessage = '';
  let dateArray = '';
  if (standarddiffMin > 0) {
    if (standarddiffMin > 120) {
      const leftHour = Math.round(standarddiffMin / 60);
      const leftMin = standarddiffMin % 60;
      var leftTime = `${leftHour} hours ${leftMin} minutes`;
    } else {
      var leftTime = standarddiffMin;
    }
    dateArray = String(new Date(getShippingDate(currentDateTime, 5))).split(' ');
    const standardShippingDate = `${dateArray[1]} ${dateArray[2]}`;
    dateArray = String(new Date(getShippingDate(currentDateTime, 2))).split(' ');
    const expressShippingDate = `${dateArray[1]} ${dateArray[2]}`;
    shippingMessage = `Buy in the next ${leftTime} minutes and your item ships today. Standard shipping arrival by ${standardShippingDate}. Expedited shipping arrival by ${expressShippingDate}.`;
  } else if (expressdiffMin > 0) {
    if (expressdiffMin > 120) {
      const leftHour = Math.round(expressdiffMin / 60);
      const leftMin = expressdiffMin % 60;
      var leftTime = `${leftHour} hours ${leftMin} minutes`;
    } else {
      var leftTime = standarddiffMin;
    }
    dateArray = String(new Date(getShippingDate(currentDateTime, 2))).split(' ');
    const expressShippingDate = `${dateArray[1]} ${dateArray[2]}`;
    shippingMessage = `Buy in the next ${leftTime} minutes and choose expedited shipping and your item ships today. Expedited shipping arrival by ${expressShippingDate}.`;
  } else {
    const leftTime = 24 * 60 + standarddiffMin;
    const leftHour = Math.round(leftTime / 60);
    const leftMin = leftTime % 60;
    dateArray = String(new Date(getShippingDate(currentDateTime, 6))).split(' ');
    const standardShippingDate = `${dateArray[1]} ${dateArray[2]}`;
    dateArray = String(new Date(getShippingDate(currentDateTime, 3))).split(' ');
    const expressShippingDate = `${dateArray[1]} ${dateArray[2]}`;
    shippingMessage = ` Buy in the next ${leftHour} hours ${leftMin} minutes and your item ships tomorrow. Standard shipping arrival by ${standardShippingDate}. Expedited shipping arrival by ${expressShippingDate}.`;
  }

  $('.product-section .product_form .shipping_message').text(shippingMessage);

  let activeClass = '';
  // eslint-disable-next-line shopify/prefer-early-return
  $('.sub_option').each(function() {
    if ($(this).hasClass('active')) {
      activeClass = `.option-pannel .${$(this).attr('data-target')}`;
      $(activeClass).addClass('showable');
    }
  });

  $('.sub_option').click(function() {
    $('.sub_option').removeClass('active');
    $(this).addClass('active');
    $(this).parent().parent()
      .find('.option')
      .removeClass('showable');
    activeClass = `.option-pannel .${$(this).attr('data-target')}`;
    if ($(activeClass).hasClass('available')) {
      $(activeClass).addClass('showable');
    }
  });

  $('.related-products .content').flickity({
    lazyLoad: 1,
    cellAlign: 'left',
    wrapAround: true,
    contain: true,
    prevNextButtons: false,
    pageDots: false,
  });
  $('.product-info .product-description .option-pannel .option-heading').click(function() {
    if ($(this).parent().hasClass('active')) {
      $('.product-info .product-description .option-pannel').removeClass('active');
    } else {
      $('.product-info .product-description .option-pannel').removeClass('active');
      $(this).parent().addClass('active');
    }

    setTimeout(() => {
      if ($('body').innerWidth() > 1023) {
        if (!$('.product-section').hasClass('gift')) {
          if (stickystatus) {
            stickySidebar.destroy();
            stickystatus = false;
          }

          const infoHeight = $('.product-info').innerHeight();
          const imageHeight = $('.product-image_gallery').innerHeight() - 100;
          if (imageHeight > infoHeight) {
            stickySidebar = new StickySidebar('.product-info', {
              topSpacing: 150,
              containerSelector: '.product-content',
              innerWrapperSelector: '.info',
            });
            stickystatus = true;
          }
        }
      }
    }, 500);
  });

  // eslint-disable-next-line shopify/prefer-early-return
  $('.swatch-form .option-pannel .option').click(function() {
    if ($(this).hasClass('available')) {
      $(this).parent().find('.option')
        .removeClass('active');
      $(this).addClass('active');
      const option = $(this).attr('variant-target');
      const options = findOptions(option);
      $('.swatch-form').removeClass('available');
      if (options.length !== 0) {
        for (let i = 0; i < options.length; i++) {
          const cls = `.${options[i]}`;
          $(`.swatch-form:has(${cls})`).find('.option').hide();
          if ($(`.swatch-form:has(${cls})`).hasClass('available')) {
            $(cls).addClass('available');
          } else {
            $(`.swatch-form:has(${cls})`).find('.option').removeClass('available');
            $(`.swatch-form:has(${cls})`).addClass('available');
            $(cls).addClass('available');
          }
        }
      }
      const variant = findVariant();
      if (variant) {
        productFeature(variant);
        $('.varaint').val(variant.id);
      }
    }

  });

  $('.gift-swatch .option').click(function() {
    const variantId = $(this).attr('variant-id');
    for (let i = 0; i < productVariant.length; i++) {
      const variant = productVariant[i];
      if (variantId == variant.id) {
        productFeature(variant);
        $('.product_form .variant').val(variantId);
      }
    }

  });
});

function getShippingDate(current, dateVal) {
  return formatDate([current.month, current.date + dateVal, current.year], [current.hour, current.minute]);
}

function getDiffTime(dt1, dt2) {
  const diffTime = parse24hToMin(dt2) - parse24hToMin(dt1);
  return diffTime;
}

function parse24hToMin(timeStr) {
  const matched = timeStr.split(':');
  const min = parseInt(matched[0]) * 60 + parseInt(matched[1]);
  return min;
}

function getOffset(month, date, day, hour) {
  // assume MST offset
  let offset = 7;
  // adjust to MDT offset as needed
  if ((month > 2 && month < 10) || (month === 2 && date > 14)) {
    offset = 6;
  } else if (month === 2 && date > 7 && date < 15) {
    if ((day && date - day > 7) || (day === 0 && hour - offset >= 2)) {
      offset = 6;
    }
  } else if (month === 10 && date < 8) {
    if ((day && date - day < 0) || (day === 0 && hour - offset < 1)) {
      offset = 6;
    }
  }
  return offset;
}

function formatDate(date, time) {
  date = date.map((x) => twoDigit(x)).join('/');
  time = time.map((x) => twoDigit(x)).join(':');
  return `${date} ${time}`;
}

function twoDigit(d) {
  return (d < 10 ? '0' : '') + d;
}

function getMountainTime() {
  const dt = new Date(); // current datetime
  let year = dt.getUTCFullYear(); // utc year
  let month = dt.getUTCMonth(); // utc month (jan is 0)
  let date = dt.getUTCDate(); // utc date
  let hour = dt.getUTCHours(); // utc hours (midnight is 0)
  const minute = dt.getUTCMinutes(); // utc minutes
  const second = dt.getUTCSeconds(); // utc seconds
  let day = dt.getUTCDay(); // utc weekday (sunday is 0)
  const offset = getOffset(month, date, day, hour);
  if (hour - offset < 0) {
    hour = 24 + hour - offset;
    day = day ? day - 1 : 6;
    if (date === 1) {
      if (!month) {
        year -= 1;
        month = 11;
      } else {
        month -= 1;
      }
      date = new Date(year, month + 1, 0).getDate();
    } else {
      date -= 1;
    }
  } else {
    hour -= offset;
  }
  month += 1;
  const dateVal = {
    dateTime: {
      year,
      month,
      date,
      hour,
      minute,
    },
    time: `${hour}:${minute}`,
  };
  return dateVal;
}

function findOptions(option) {
  const options = [];
  for (let i = 0; i < productVariant.length; i++) {
    const variant = productVariant[i];
    let old_option = '';
    let status = false;
    for (let j = 0; j < variant.options.length; j++) {
      if (option === variant.options[j]) {
        status = true;
        if (old_option != '') {
          options.push(old_option);
        }
      } else if (status) {
        options.push(variant.options[j]);
      } else {
        old_option = variant.options[j];
      }
    }
  }
  return options;
}

function findVariantFromUrl(variantid) {
  for (let i = 0; i < productVariant.length; i++) {
    if (productVariant[i].id == variantid) {
      return productVariant[i];
    }
  }
  return 0;
}

function findVariant() {
  let productVariantOption = '';
  $('.product-pannel .swatch-form .option-pannel .option').each(function() {
    if ($(this).hasClass('active')) {
      productVariantOption += $(this).attr('variant-target');
    }
  });
  let val = [];
  for (let i = 0; i < productVariant.length; i++) {
    const variant = productVariant[i];
    let option = '';
    for (let j = 0; j < variant.options.length; j++) {
      option += variant.options[j];
    }

    const optionStr = option.replace(' ', '').toLowerCase();

    if (productVariantOption === optionStr) {
      val = variant;
    }
  }

  if (val.length === 0) {
    return false;
  } else {
    return val;
  }
}

function productFeature(variant) {

  const featureBlockId = `.block--${variant.id}`;
  if (!$('.product-section').hasClass('gift')) {
    var url = `/products/${$('.product-title').data('handle')}.js`
    jQuery.getJSON(url, function(product) {
      for (let j = 0; j < product.variants.length; j++) {
        const variant_val = product.variants[j];
        if (variant_val.id == variant.id) {
          var variant_title = variant_val.title;
        }
      }
      
      var img_html = '';
      var num = 0;
      var count = 0;
      for (let i = 0; i < product.media.length; i++) {
        const media = product.media[i];
        if (media.alt == variant_title) {
          count += 1;
        }
      }
      if (count == 1) {
        var cls = 'large-up--one-whole';
      } else {
        var cls = 'large-up--one-half';
      }
      for (let i = 0; i < product.media.length; i++) {
        const media = product.media[i];
        if (media.alt == variant_title) {
          img_html += `<div class="grid__item fancybox ${cls}">`;
          img_html += `<style>#ImageWrapper-${product.id}-${num} { max-width: 767.616191904048px; max-height: 768px; background: url(${media.src}) no-repeat 50% 50% / cover;} #ImageWrapper-${product.id}-${num}::before {padding-top:100%;}</style>`;
          img_html += `<div id="ImageWrapper-${product.id}-${num}" data-image-id="${product.id}" class="responsive-image__wrapper feature-image"></div>`;
          img_html += `<a class="wish-icon"><svg width="19px" height="16px" viewBox="0 0 19 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="style-guide" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="icons" transform="translate(-146.000000, -8.000000)" stroke="#030303"><path d="M159.088889,9 C161.801221,9 164,11.2569596 164,14.0410603 C164,16.6519701 161.166667,19.6382833 155.5,23 C149.833333,19.7665314 147,16.7802182 147,14.0410603 C147,11.2569596 149.198779,9 151.911111,9 C153.327413,9 154.603689,9.61538934 155.5,10.599882 C156.396311,9.61538934 157.672587,9 159.088889,9 Z" id="love_ico"></path></g></g></svg></a>`;
          img_html += `<a class="zoom-icon" data-target=".image-block" data-num="${num}"><svg width="23px" height="25px" viewBox="0 0 23 25" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="style-guide" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="icons" transform="translate(-311.000000, -65.000000)"><g id="search_ico" transform="translate(324.000000, 79.000000) rotate(-44.000000) translate(-324.000000, -79.000000) translate(315.000000, 65.000000)"><circle id="Oval-2" stroke="#030303" cx="9" cy="9" r="9"></circle><rect id="Rectangle" fill="#030303" x="8" y="18" width="1" height="10" rx="0.5"></rect></g></g></g></svg></a></div>`;
          num += 1;
        }
      }
      $('.image-block').flickity('destroy');
      $('.image-block').hide();
      $('.image-block').html(img_html);
      $('.image-block').fadeIn();
      if ($('body').innerWidth() > 1023) {
        if (stickystatus) {
          stickySidebar.destroy();
          stickystatus = false;
        }
        const infoHeight = $('.product-info').innerHeight();
        const imageHeight = $('.product-image_gallery').innerHeight() - 100;
        if (imageHeight > infoHeight) {
          stickySidebar = new StickySidebar('.product-info', {
            topSpacing: 150,
            containerSelector: '.product-content',
            innerWrapperSelector: '.info',
          });
          stickystatus = true;
        }
      } else {
        
        $('.image-block').flickity({
          lazyLoad: 1,
          cellAlign: 'left',
          wrapAround: true,
          contain: true,
          prevNextButtons: false,
          pageDots: false,
        });
      }
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
    });
  }
  


  $('.product-title h1').text(variant.title);
  let price = '';
  $('.add_cart').removeClass('disable');
  if (variant.available === 'true') {
    if (variant.price < variant.compare_at_price) {
      price = `${variant.price_money}<del>${variant.compare_at_price_money}</del>`;
    } else {
      price = variant.price_money;
    }
  } else {
    price = 'SOLD OUT';
    $('.add_cart').addClass('disable');
  }

  $('.product-title .price').html(price);
  $('.variant').val(variant.id);
}
