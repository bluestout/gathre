/* eslint-disable shopify/prefer-early-return */
/* eslint-disable no-undef */

$(document).ready(() => {
  $('.pagination').each(function() {
    const pagination = $(this);
    const item = $(this).find('.grid__item');
    const itemHidden = $(this).find('.hide');
    const val = item.length - itemHidden.length;
    const loadMoreBtn = $(this).parent().find('.load_more_btn');
    loadMoreBtn.parent().find('.page-num').text(`${val}/${item.length}`);

    item.slice(0, val - 1).show();

    if (itemHidden.length !== 0) {
      loadMoreBtn.show();
    } else {
      loadMoreBtn.hide();
    }

    let j = 1;
    loadMoreBtn.on('click', (param) => {
      param.preventDefault();
      j++;
      let num;
      const itemHiddenVal = pagination.find('.hide');
      if (itemHiddenVal.length > val) {
        num = j * val;
      } else {
        num = item.length;
      }
      item.slice(0, num).removeClass('hide');
      loadMoreBtn.parent().find('.page-num').text(`${num}/${item.length}`);
      if (num - item.length == 0) {
        loadMoreBtn.fadeOut('slow');
      }
    });
  });

  $('.tab-content').each(function() {
    const tab = $(this);
    const tabLinks = $(this).find('.tab').find('li');
    tabLinks.find('a').click(function(e) {
      e.preventDefault();
      tabLinks.removeClass('active');
      $(this).parent().addClass('active');
      const contentId = $(this).attr('href');
      const content = tab.find(contentId);
      if (!content.hasClass('active')) {
        tab.find('.pannel').removeClass('active');
        content.addClass('active');
      }
    });
  });

  $('.select-box-menu').click(function(e) {
    e.preventDefault();
    const pos = $(this).offset().top;
    $(this).find('li').toggleClass('show');
    if ($(window).innerWidth() < 768) {
      $(document).scrollTop(pos-300);
    }
  });
  $('.select-box-menu li').click(function(e) {
    e.preventDefault();
    if (!$(this).hasClass('active') | $(this).hasClass('tab')) {
      const href = $(this).find('a').attr('href');
      location = href;
    }
  });

  if ($('.video-wrapper').parent().hasClass('video-section')) {
    videoSection.init();
  }
});


const videoEl = {
  playButtonIcon: '<button type="button" class="plyr__control plyr__control--overlaid" aria-label="Play, {title}" data-plyr="play"><svg class="play-icon-button-control" width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="60" height="60" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M23 20V40L39 29.4248L23 20Z" fill="#323232"/></svg><span class="plyr__sr-only">Play</span></button>',
  playButton: '<button type="button" class="plyr__controls__item plyr__control" aria-label="Play, {title}" data-plyr="play"><svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-pause"></use></svg><svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-play"></use></svg><span class="label--pressed plyr__tooltip" role="tooltip">Pause</span><span class="label--not-pressed plyr__tooltip" role="tooltip">Play</span></button>',
  muteButton: '<button type="button" class="plyr__controls__item plyr__control" aria-label="Mute" data-plyr="mute"><svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-muted"></use></svg><svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-volume"></use></svg><span class="label--pressed plyr__tooltip" role="tooltip">Unmute</span><span class="label--not-pressed plyr__tooltip" role="tooltip">Mute</span></button>',
  progressInput: '<div class="plyr__controls__item plyr__progress__container"><div class="plyr__progress"><input data-plyr="seek" type="range" min="0" max="100" step="0.01" value="0" aria-label="Seek"><progress class="plyr__progress__buffer" min="0" max="100" value="0">% buffered</progress><span role="tooltip" class="plyr__tooltip">00:00</span></div></div>',
  volume: '<div class="plyr__controls__item plyr__volume"><input data-plyr="volume" type="range" min="0" max="1" step="0.05" value="1" autocomplete="off" aria-label="Volume"></div>',
  fullscreen: '<button type="button" class="plyr__controls__item plyr__control" data-plyr="fullscreen"><svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-exit-fullscreen"></use></svg><svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-enter-fullscreen"></use></svg><span class="label--pressed plyr__tooltip" role="tooltip">Exit fullscreen</span><span class="label--not-pressed plyr__tooltip" role="tooltip">Enter fullscreen</span></button>',
};

const videoControls = `${videoEl.playButtonIcon}<div class="plyr__controls">${videoEl.playButton}${videoEl.progressInput}${videoEl.muteButton}${videoEl.volume}${videoEl.fullscreen}</div>`;
const globalVideoPlayers = [];
let videoPlayers = [];
let videosInRecommendedProductsPlayer;

const videoFeature = {
  init() {

    this.setupVideoPlayer();
    this.setupRecommendedVideoPlayer();

  },
  setupVideoPlayer() {
    const productVideos = document.querySelectorAll('[data-html5-video] video, [data-youtube-video]');

    const setupVideoPlayers = Plyr.setup(productVideos, {
      controls: videoControls,
      ratio: this.aspect_ratio,
      fullscreen: {
        enabled: true,
        fallback: true,
        iosNative: true,
      },
      storage: {
        enabled: false,
      },
    });

    // Moves players into global array so that we can target them for play/pause on global level
    if (globalVideoPlayers) {
      $.each(setupVideoPlayers, (index, player) => {
        globalVideoPlayers.push(player);
      });
    }

    const videoLooping = $('[data-video-loop]').data('video-loop') || false;
    $.each(setupVideoPlayers, (index, player) => {
      player.loop = videoLooping;
      videoPlayers.push(player);
    });

    this.setupListeners();
  },
  setupPlayerForRecentlyViewedProducts(video) {

    if (video) {
      const recentlyViewedProductPlayer = new Plyr(video, {
        controls: videoControls,
        ratio: this.aspect_ratio,
        fullscreen: {
          enabled: true,
          fallback: true,
          iosNative: true,
        },
        storage: {
          enabled: false,
        },
      });

      if (videoPlayers !== null) {
        videoPlayers.push(recentlyViewedProductPlayer);
        this.setupListeners();
      }

    }
  },
  setupRecommendedVideoPlayer() {
    const videosInRecommendedProducts = document.querySelectorAll('[data-product-recommendations-container] [data-html5-video] video, [data-product-recommendations-container] [data-youtube-video]');

    // Only run Plyr.setup if videosInRecommendedProducts exists
    if (videosInRecommendedProducts.length > 0) {
      videosInRecommendedProductsPlayer = Plyr.setup(videosInRecommendedProducts, {
        controls: videoControls,
        fullscreen: {
          enabled: true,
          fallback: true,
          iosNative: true,
        },
        storage: {
          enabled: false,
        },
      });
      if (videoPlayers !== null) {
        const combinedArray = videoPlayers.concat(videosInRecommendedProductsPlayer);
        videoPlayers = combinedArray;
      } else {
        videoPlayers = videosInRecommendedProductsPlayer;
      }
    }

    this.setupListeners();
  },
  setupListeners() {
    // Adds plyr video id to video wrapper
    $.each(videoPlayers, (index, player) => {
      const id = player.id || player.media.dataset.plyrVideoId;
      let $video;

      if (player.isHTML5) {
        $video = $(player.elements.wrapper).find('video');
        $video.attr('data-plyr-video-id', id);
      }
    });

    // When a video is playing, pause any other instances
    $.each(globalVideoPlayers, (index, player) => {
      player.on('play', (event) => {
        const instance = event.detail.plyr;
        $.each(globalVideoPlayers, (index, player) => {
          if (instance.id != player.id) {
            player.pause();
          }
        });
      });
    });
  },
  enableVideoOnHover($thumbnail) {
    const $html5Video = $thumbnail.find('[data-html5-video]');
    const $youtubeVideo = $thumbnail.find('[data-youtube-video]');
    let videoID;

    if ($html5Video.length > 0) {
      videoID = $html5Video.find('[data-plyr-video-id]').data('plyr-video-id');
    } else if ($youtubeVideo.length > 0) {
      videoID = $youtubeVideo.find('iframe').attr('id');
    }

    if (videoID) {
      $.each(videoPlayers, (index, player) => {
        if (player.id == videoID || player.media.id == videoID) {
          player.toggleControls(false);
          player.muted = true;
          player.play();
        }
      });
    }
  },
  disableVideoOnHover($thumbnail) {
    const $html5Video = $thumbnail.find('[data-html5-video]');
    const $youtubeVideo = $thumbnail.find('[data-youtube-video]');
    let videoID;

    if ($html5Video.length > 0) {
      videoID = $html5Video.find('[data-plyr-video-id]').data('plyr-video-id');
    } else if ($youtubeVideo.length > 0) {
      videoID = $youtubeVideo.find('iframe').attr('id');
    }

    if (videoID) {
      $.each(videoPlayers, (index, player) => {
        if (player.id == videoID || player.media.id == videoID) {
          if (player.playing) {
            player.pause();
          }
        }
      });
    }
  },
};

const videoSection = {
  init() {

    // Set up plyr for newly embedded video
    const featuredVideos = $('[data-video-element]').get();

    const featuredVideoPlayers = Plyr.setup(featuredVideos, {
      controls: videoControls,
      fullscreen: {
        enabled: true,
        fallback: true,
        iosNative: true,
      },
      storage: {
        enabled: false,
      },
    });

    // Adds plyr video id to video wrapper
    $.each(featuredVideoPlayers, (index, player) => {
      const id = player.id;
      let $video;

      if (player.isHTML5) {
        $video = $(player.elements.wrapper).find('video');
        $video.attr('data-plyr-video-id', id);
      }

      // When a video is playing, pause any other instances
      player.on('play', (event) => {
        const instance = event.detail.plyr;
        $.each(featuredVideoPlayers, (index, player) => {
          if (instance.id != player.id) {
            player.pause();
          }
        });
      });

      // Moves players from video section into global array
      if (globalVideoPlayers) {
        globalVideoPlayers.push(player);
      }
    });

    $('[data-video-element]').each((index, video) => {

      // Variables
      const $video = $(video);
      const $section = $video.parents('.shopify-section').attr('id', id);
      let $videoElement = $section.find($video);
      const $videoWrapper = $videoElement.parents('.video-wrapper');
      const $playButton = $videoWrapper.find('[data-play-button]');
      const $secondaryButton = $videoWrapper.find('[data-secondary-button]');
      const $videoText = $videoWrapper.find('[data-video-text]');
      const $videoTextContainer = $videoWrapper.find('[data-video-text-container]');
      const $image = $videoWrapper.find('.video-wrapper__image');
      const $posterImage = $videoWrapper.data('poster-image-uploaded');
      const aspectRatio = $videoWrapper.data('aspect-ratio');
      var id = $videoWrapper.data('video-src');
      const isAutoplay = $videoWrapper.data('autoplay');
      const isLoopingEnabled = $videoWrapper.data('autoloop');
      const isMuted = $videoWrapper.data('mute-video');

      $.each(featuredVideoPlayers, (index, player) => {
        var videoID;
        var playerID;

        if (player.isYouTube || player.isVimeo) {
          var videoID = $videoWrapper.attr('id');
          var playerID = $(player.elements.original).attr('id');
        } else if (player.isHTML5) {
          var videoID = $videoWrapper.find('[data-plyr-video-id]').data('plyr-video-id');
          var playerID = player.id;
          $videoElement = $section.find('.plyr--video');
        }

        if (playerID == videoID) {

          // Reset play button icon
          $videoWrapper.removeClass('play-button-icon--visible');

          // Autoplay
          if (isAutoplay) {
            // If on desktop or player is YouTube/Vimeo
            if ($(window).width() > 768 || player.isYouTube || player.isVimeo) {

              player.autoplay = true;

              // Hide image
              $image.hide();

              // Show video
              $videoElement.show();

              // If display text over video unchecked
              if ($videoTextContainer.hasClass('display-text-over-video--false')) {
                $videoText.hide();
              } else {
                $videoText.show();
              }

              // Keep play button hidden
              $playButton.hide();

              // HTML5 Mobile Video
            } else if ($(window).width() < 768 && player.isHTML5) {

              // Hide image
              $image.hide();

              // Show video
              $videoElement.show();

              // Display button so that video can be played
              $playButton.show();

              player.on('play', () => {
                // Show video
                $videoElement.show();

                // Hide play button
                $playButton.hide();
              });
            }
          } else { // If Autoplay disabled
            // If poster image, show image wrapper otherwise hide it
            if ($posterImage) {
              $image.show();
              $videoElement.hide();
            } else {
              $image.hide();
              $videoElement.show();
            }
          }

          // Clicking image will play video
          $image.on('click', function() {
            // Hide image
            $(this).hide();

            // Show video
            $videoElement.show();

            player.play();
          });

          // Muted
          if (isMuted) {
            player.muted = true;
          }

          // Aspect Ratio
          if (aspectRatio) {
            player.ratio = aspectRatio;
          }

          // Looping
          if (isLoopingEnabled) {
            player.loop = true;
          }

          // Show Video Controls
          // - video controls get hidden using a css class: '.video-controls-enabled--false'

          // If button exists, hide text and poster
          if ($playButton) {
            $playButton.on('click', () => {

              // Play video
              player.play();
            });
          }

          player.on('play', () => {

            // Hide image
            $image.hide();

            // Reset play button icon
            $videoWrapper.removeClass('play-button-icon--visible');

            // Show video
            $videoElement.show();

            // If display text over video unchecked
            if ($videoTextContainer.hasClass('display-text-over-video--false')) {
              $videoTextContainer.hide();
            } else {
              $videoTextContainer.show();
            }

            // Hide play button
            if ($playButton) {
              $playButton.hide();
            }

            // Hide secondary button
            if ($secondaryButton) {
              $secondaryButton.hide();
            }
          });

          // If video is paused, show play button icon
          player.on('pause', () => {
            if ($playButton.is(':hidden') || $playButton.length == 0) {
              $videoWrapper.addClass('play-button-icon--visible');
            }
          });

          // If page loads with video paused and no button showing, show icon
          if (!player.playing && $playButton.is(':hidden') || $playButton.length == 0) {
            $videoWrapper.addClass('play-button-icon--visible');
          }

          return false;
        }
      });
    });
  },
};