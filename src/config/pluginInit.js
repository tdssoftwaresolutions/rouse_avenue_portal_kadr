import Scrollbar from 'smooth-scrollbar'
// eslint-disable-next-line no-unused-vars
import counterUp from 'counterup2'
const $ = require('jquery')
// eslint-disable-next-line no-unused-vars
let WOW

if (typeof window !== 'undefined') {
  window.$ = $
  window.jQuery = $
  WOW = require('wowjs')
  require('owl.carousel/dist/owl.carousel')
  require('bootstrap/js/src/tab')
  require('bootstrap/js/src/tooltip')
  require('datatables.net')
  require('datatables.net-bs4')
  require('datatables.net-buttons')
  require('datatables.net-buttons-bs4')
  require('datatables.net-buttons/js/buttons.html5.js')
  require('datatables.net-buttons/js/buttons.print.min.js')
}

export const sofbox = {
  index () {
    this.loaderInit()
    this.wowInit()
    // this.tooltip()
    this.countDownInit()
    this.counterUp()
    this.owlCarousel()
    this.SmoothScrollbar()
    this.Accordian()
    this.SimpleWizard()
    this.VerticalWizard()
    this.ValidateWizard()
  },
  mainIndex () {
    this.wrapperMenuToggle()
    this.sideBarToggle()
    this.ripple()
    this.fullscreen()
    this.navBarAction()
    this.AccordianInit()
    this.checkOut()
  },
  loaderInit () {
    $('#load').fadeOut()
    $('#loading').delay(1000).fadeOut('slow')
  },
  /*  tooltip () {
    $('body').tooltip({
      selector: '[data-toggle="tooltip"]'
    })
  }, */
  ripple () {
    $(document).on('click', '.iq-waves-effect', function (e) {
      // Remove any old one
      $('.ripple').remove()
      // Setup
      let posX = $(this).offset().left
      let posY = $(this).offset().top
      let buttonWidth = $(this).width()
      let buttonHeight = $(this).height()

      // Add the element
      $(this).prepend("<span class='ripple'></span>")

      // Make it round!
      if (buttonWidth >= buttonHeight) {
        buttonHeight = buttonWidth
      } else {
        buttonWidth = buttonHeight
      }

      // Get the center of the element
      let x = e.pageX - posX - buttonWidth / 2
      let y = e.pageY - posY - buttonHeight / 2

      // Add the ripples CSS and start the animation
      $('.ripple').css({
        width: buttonWidth,
        height: buttonHeight,
        top: y + 'px',
        left: x + 'px'
      }).addClass('rippleEffect')
    })
  },

  fullscreen () {
    const elementExist = this.checkElement('class', 'iq-full-screen')
    if (elementExist) {
      $(document).on('click', '.iq-full-screen', function () {
        let elem = $(this)
        if (!document.fullscreenElement &&
          !document.mozFullScreenElement &&
          !document.webkitFullscreenElement &&
          !document.msFullscreenElement) {
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen()
          } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen()
          } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
          } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
          }
        } else {
          if (document.cancelFullScreen) {
            document.cancelFullScreen()
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen()
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen()
          }
        }
        elem.find('i').toggleClass('ri-fullscreen-line').toggleClass('ri-fullscreen-exit-line')
      })
    }
  },

  wrapperMenuToggle () {
    const elementExist = this.checkElement('class', 'wrapper-menu')
    if (elementExist) {
      let wrapperMenu = document.querySelectorAll('.wrapper-menu')
      let body = document.querySelector('body')
      for (let i = 0; i < wrapperMenu.length; i++) {
        wrapperMenu[i].addEventListener('click', function () {
          wrapperMenu[i].classList.toggle('open')
          body.classList.toggle('sidebar-main')
        })
      }
    }
  },

  sideBarToggle () {
    const elementExist = this.checkElement('class', 'iq-sidebar-menu')
    if (elementExist) {
      $(document).on('click', '.iq-sidebar-menu li', function () {

      })
    }
  },

  navBarAction () {
    $(document).on('click', function (e) {
      let myTargetElement = e.target
      let selector, mainElement
      if ($(myTargetElement).hasClass('search-toggle') || $(myTargetElement).parent().hasClass('search-toggle') || $(myTargetElement).parent().parent().hasClass('search-toggle')) {
        if ($(myTargetElement).hasClass('search-toggle')) {
          selector = $(myTargetElement).parent()
          mainElement = $(myTargetElement)
        } else if ($(myTargetElement).parent().hasClass('search-toggle')) {
          selector = $(myTargetElement).parent().parent()
          mainElement = $(myTargetElement).parent()
        } else if ($(myTargetElement).parent().parent().hasClass('search-toggle')) {
          selector = $(myTargetElement).parent().parent().parent()
          mainElement = $(myTargetElement).parent().parent()
        }
        if (!mainElement.hasClass('active') && $('.navbar-list li').find('.active')) {
          $('.navbar-list li').removeClass('iq-show')
          $('.navbar-list li .search-toggle').removeClass('active')
        }

        selector.toggleClass('iq-show')
        mainElement.toggleClass('active')

        e.preventDefault()
      } else if ($(myTargetElement).is('.search-input')) {} else {
        $('.navbar-list li').removeClass('iq-show')
        $('.navbar-list li .search-toggle').removeClass('active')
      }
    })
  },

  wowInit () {
    const elementExist = this.checkElement('class', 'wow')

    if (elementExist) {
      new WOW.WOW({
        boxClass: 'wow',
        animateClass: 'animated',
        offset: 0,
        live: false
      }).init()
    }
  },

  countDownInit () {
    const elementExist = this.checkElement('class', 'countdown')

    if (elementExist) {
      $('.countdown').countdown()
    }
  },
  counterUp () {
    const elementExist = this.checkElement('class', 'counter')
    if (elementExist) {
      // eslint-disable-next-line no-unused-vars
      const el = document.querySelector('.counter')
      /* counterUp(el, {
        duration: 4000,
        delay: 20
      }) */
    }
  },

  checkElement (type, element) {
    let found = false
    let elements
    switch (type) {
      case 'class':
        elements = document.getElementsByClassName(element)
        if (elements !== undefined && elements !== null && elements.length > 0) {
          found = true
        }
        break

      case 'id':
        elements = document.getElementById(element)

        if (elements !== undefined && elements !== null) {
          found = true
        }
        break
    }
    return found
  },

  owlCarousel () {
    const elementExist = this.checkElement('class', 'owl-carousel')
    if (elementExist) {
      // eslint-disable-next-line no-undef
      $('.owl-carousel').each(function () {
        // eslint-disable-next-line no-undef
        const $carousel = $(this)
        $carousel.owlCarousel({
          items: $carousel.data('items'),
          loop: $carousel.data('loop'),
          margin: $carousel.data('margin'),
          nav: $carousel.data('nav'),
          dots: $carousel.data('dots'),
          autoplay: $carousel.data('autoplay'),
          autoplayTimeout: $carousel.data('autoplay-timeout'),
          navText: ['<i class="fas fa-angle-left fa-2x"></i>', '<i class="fas fa-angle-right fa-2x"></i>'],
          responsiveClass: true,
          responsive: {
            // breakpoint from 0 up
            0: {
              items: $carousel.data('items-mobile-sm')
            },
            // breakpoint from 480 up
            480: {
              items: $carousel.data('items-mobile')
            },
            // breakpoint from 786 up
            786: {
              items: $carousel.data('items-tab')
            },
            // breakpoint from 1023 up
            1023: {
              items: $carousel.data('items-laptop')
            },
            1199: {
              items: $carousel.data('items')
            }
          }
        })
      })
    }
  },

  SmoothScrollbar () {
    const elementExistMain = this.checkElement('id', 'sidebar-scrollbar')
    if (elementExistMain) {
      Scrollbar.init(document.querySelector('#sidebar-scrollbar'))
    }
    const elementExistRight = this.checkElement('id', 'right-sidebar-scrollbar')
    if (elementExistRight) {
      Scrollbar.init(document.querySelector('#right-sidebar-scrollbar'))
    }
  },

  Accordian () {
    $('.iq-accordion .iq-accordion-block .accordion-details').hide()
    $('.iq-accordion .iq-accordion-block:first').addClass('accordion-active').children().slideDown('slow')
  },

  AccordianInit () {
    $(document).on('click', '.iq-accordion .iq-accordion-block', function () {
      if ($(this).children('div.accordion-details ').is(':hidden')) {
        $('.iq-accordion .iq-accordion-block').removeClass('accordion-active').children('div.accordion-details ').slideUp('slow')
        $(this).toggleClass('accordion-active').children('div.accordion-details ').slideDown('slow')
      }
    })
  },

  getActiveLink (item, activeRoute) {
    let active = false
    if (item.children !== undefined) {
      item.children.filter(function (child) {
        if (child.link.name === activeRoute) {
          active = true
        }
      })
    } else {
      if (item.link.name === activeRoute) {
        active = true
      }
    }
    return active
  },
  SimpleWizard () {
    var currentFs, nextFs, previousFs // fieldsets
    var opacity
    var current = 1
    var steps = $('fieldset').length
    setProgressBar(current)
    $('.next').click(function () {
      currentFs = $(this).parent()
      nextFs = $(this).parent().next()
      // Add Class Active
      $('#top-tab-list li').eq($('fieldset').index(nextFs)).addClass('active')
      $('#top-tab-list li').eq($('fieldset').index(currentFs)).addClass('done')
      // show the next fieldset
      nextFs.show()
      // hide the current fieldset with style
      currentFs.animate({
        opacity: 0
      }, {
        step: function (now) {
          // for making fielset appear animation
          opacity = 1 - now
          currentFs.css({ 'display': 'none', 'position': 'relative' })
          nextFs.css({ 'opacity': opacity })
        },
        duration: 500
      })
      setProgressBar(++current)
    })
    $('.previous').click(function () {
      currentFs = $(this).parent()
      previousFs = $(this).parent().prev()
      // Remove class active
      $('#top-tab-list li').eq($('fieldset').index(currentFs)).removeClass('active')
      $('#top-tab-list li').eq($('fieldset').index(previousFs)).removeClass('done')
      // show the previous fieldset
      previousFs.show()
      // hide the current fieldset with style
      currentFs.animate({
        opacity: 0
      }, {
        step: function (now) {
          // for making fielset appear animation
          opacity = 1 - now
          currentFs.css({
            'display': 'none',
            'position': 'relative'
          })
          previousFs.css({
            'opacity': opacity
          })
        },
        duration: 500
      })
      setProgressBar(--current)
    })
    function setProgressBar (curStep) {
      var percent = parseFloat(100 / steps) * curStep
      percent = percent.toFixed()
      $('.progress-bar').css('width', percent + '%')
    }
    $('.submit').click(function () {
      return false
    })
  },
  VerticalWizard () {
    var currentFs, nextFs, previousFs // fieldsets
    var opacity
    var current = 1
    var steps = $('fieldset').length
    setProgressBar(current)
    $('.next').click(function () {
      currentFs = $(this).parent()
      nextFs = $(this).parent().next()
      // Add Class Active
      $('#top-tabbar-vertical li').eq($('fieldset').index(nextFs)).addClass('active')
      // show the next fieldset
      nextFs.show()
      // hide the current fieldset with style
      currentFs.animate({
        opacity: 0
      }, {
        step: function (now) {
          // for making fielset appear animation
          opacity = 1 - now
          currentFs.css({ 'display': 'none', 'position': 'relative' })
          nextFs.css({ 'opacity': opacity })
        },
        duration: 500
      })
      setProgressBar(++current)
    })
    $('.previous').click(function () {
      currentFs = $(this).parent()
      previousFs = $(this).parent().prev()
      // Remove class active
      $('#top-tabbar-vertical li').eq($('fieldset').index(currentFs)).removeClass('active')
      // show the previous fieldset
      previousFs.show()
      // hide the current fieldset with style
      currentFs.animate({
        opacity: 0
      }, {
        step: function (now) {
          // for making fielset appear animation
          opacity = 1 - now
          currentFs.css({
            'display': 'none',
            'position': 'relative'
          })
          previousFs.css({
            'opacity': opacity
          })
        },
        duration: 500
      })
      setProgressBar(--current)
    })
    function setProgressBar (curStep) {
      var percent = parseFloat(100 / steps) * curStep
      percent = percent.toFixed()
      $('.progress-bar').css('width', percent + '%')
    }
    $('.submit').click(function () {
      return false
    })
  },
  ValidateWizard () {
    var navListItems = $('div.setup-panel div a')
    var allWells = $('.setup-content')
    var allNextBtn = $('.nextBtn')
    allWells.hide()
    navListItems.click(function (e) {
      e.preventDefault()
      var $target = $($(this).attr('href'))
      var $item = $(this)
      if (!$item.hasClass('disabled')) {
        navListItems.addClass('active')
        $item.parent().addClass('active')
        allWells.hide()
        $target.show()
        $target.find('input:eq(0)').focus()
      }
    })
    allNextBtn.click(function () {
      var curStep = $(this).closest('.setup-content')
      var curStepBtn = curStep.attr('id')
      var nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children('a')
      var curInputs = curStep.find('input[type="text"],input[type="email"],input[type="password"],input[type="url"],textarea')
      var isValid = true
      $('.form-group').removeClass('has-error')
      for (var i = 0; i < curInputs.length; i++) {
        if (!curInputs[i].validity.valid) {
          isValid = false
          $(curInputs[i]).closest('.form-group').addClass('has-error')
        }
      }
      if (isValid) {
        nextStepWizard.removeAttr('disabled').trigger('click')
      }
    })
    $('div.setup-panel div a.active').trigger('click')
  },
  checkOut () {
    $('#place-order').click(function () {
      $('#cart').removeClass('show')
      $('#address').addClass('show')
      $('#step1').removeClass('active')
      $('#step1').addClass('done')
      $('#step2').addClass('active')
    })
    $('#deliver-address').click(function () {
      $('#address').removeClass('show')
      $('#payment').addClass('show')
      $('#step2').removeClass('active')
      $('#step2').addClass('done')
      $('#step3').addClass('active')
    })
  }
}
