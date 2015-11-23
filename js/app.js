var DTO = DTO || {};

DTO.Forms = (function(window, undefined) {
  var init = function() {
    initTextBoxLists();
  };

  var initTextBoxLists = function() {
    $('button.add-more').on('click', function (e) {
      e.preventDefault();
      var $group = $(this).parent().prev('.input-group');
      var clone = $group.find('input').first().clone();
      clone.val('');
      $group.append(clone);

      if(clone.hasClass('auto-complete')) {
        DTO.GoogleMaps.init();
      }
    });
  };

  return {
    init : init
  }
})(window);

DTO.Forms.MockPersistence = (function(window, undefined) {
  var init = function() {
    persistHttpGetParams();
    setTextContentOfSpanElements();
  };

  var extractHttpGetParams = function() {
    var match,
      search = /([^&=]+)=?([^&]*)/g,
      decode = function (s) {
        return decodeURIComponent(s.replace( /\+/g, " "));
      },
      query = window.location.search.substring(1);
    var urlParams = {};
    while (match = search.exec(query)) {
      var key = decode(match[1]);
      if(key in urlParams) {
        var val = '' + urlParams[key] + ', ' + decode(match[2]);
        urlParams[key] = val;
      }
      else {
        urlParams[key] = decode(match[2]);
      }
    }
    return urlParams;
  };

  var persistHttpGetParams = function() {
    var params = extractHttpGetParams();
    for(var key in params) {
      $('form').append('<input type="hidden" id="' + key + '" name="' + key + '" value="' + params[key] + '" />')
    }
  };

  var getParameterByName = function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  };

  var valueIsEmpty = function(value) {
    return ((value === null) || (value === '') || (value === 'undefined'))
  };

  var setTextContentOfSpanElements = function() {
    var params = extractHttpGetParams();
    for(var key in params) {

      if(valueIsEmpty(params[key]))
        continue;

      $('div#' + key).removeClass('hide');
      $('div#' + key + ' span').text(params[key]);
    }
  };

  return {
    init : init,
    getParameterByName : getParameterByName,
    setTextContentOfSpanElements : setTextContentOfSpanElements
  }
})(window);

DTO.GoogleMaps = (function(window, undefined) {
  var API_KEY = 'AIzaSyB92uNcFUglUi2raycalrPhJxF4-pnHuIo';
  var ENTER_KEY = 13;

  var autoComplete,
    components = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
  };

  var init = function() {
    $('input.auto-complete').each(function() {
      var $input = $(this);
      window.googleMapsCallback = function() {
        autoComplete = new google.maps.places.Autocomplete(
          $input[0], { types: ['geocode'] });
          $input.bind('keypress', function(e) {
          if(e.which === ENTER_KEY) {
            e.preventDefault();
          }
        });
        autoComplete.addListener('place_changed', fillInAddress);
      };
      if($input.hasClass('geo-locate')) {
        $input.on('focus', function() {
          geolocate();
        });
      }
      addScriptTagOnLoad();
    });
  };

  var fillInAddress = function() {
    var place = autoComplete.getPlace();
    for(var component in components) {
      var element = document.getElementById(component);
      if(element !== null) {
        element.value = '';
      }
    }

    var address = '';
    for (var i = 0; i < place.address_components.length; i++) {
      var addressType = place.address_components[i].types[0];
      if (components[addressType]) {
        var val = place.address_components[i][components[addressType]];
        var element = document.getElementById(addressType);
        if(element !== null) {
          element.value = val;
        }
        if (address.length === 0) {
          address = val;
        } else {
          address = address + ' ' + val;
        }
      }
    }
    if (address.length > 0) {
      geocodeAddress(address);
    }
  };

  var geocodeAddress = function(address) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var latitude = results[0].geometry.location.lat();
        var longitude = results[0].geometry.location.lng();
        $('#lat').val(latitude);
        $('#lng').val(longitude);
      }
    });
  };

  var geolocate = function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        var circle = new google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy
        });
        autoComplete.setBounds(circle.getBounds());
      });
    }
  };

  var addScriptTagOnLoad = function() {
    window.addEventListener('load', function() {
      loadScript('https://maps.googleapis.com/maps/api/js?key=' + API_KEY +
        '&signed_in=true&libraries=places&callback=googleMapsCallback')
    }, false);
  };

  var loadScript = function(url, callback){
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    if(typeof callback === 'function') {
      script.addEventListener('load', callback, false);
    }
    script.setAttribute('src', url);
    document.body.appendChild(script);
  };

  return {
    init : init
  }
})(window);

DTO.Dropdowns = (function(window, undefined) {
  var init = function() {
    $('a.dropdown').each(function() {
      var icon = $(this).find('i');
      var target = $(this).data('target');
      
      $(target).find('.fa-times').on('click', function() {
        fadeOut(icon, target);
      });

      $(this).on('click', function(e) {
        e.preventDefault();
        if($(target).hasClass('out')) {
          fadeIn(icon, target);
        }
        else {
          fadeOut(icon, target);
        }
      });
    });
  };

  var fadeIn = function(icon, target) {
    $(icon).addClass('fa-caret-up');
    $(icon).removeClass('fa-caret-down');
    $(target).removeClass('out');
  };

  var fadeOut = function(icon, target) {
    $(icon).addClass('fa-caret-down');
    $(icon).removeClass('fa-caret-up');
    $(target).addClass('out');
  };

  return {
    init : init
  }
})(window);

DTO.LocalStorage = (function(window, undefined) {
  var fieldElements = null;
  var init = function() {    
    fieldElements = document.getElementsByTagName('input');
  }

  var storeValue = function(showBadge) {

    var category = document.getElementById('sectionName').value;
    var buildObject = {};
    var key = null;
    var value = null;
    var categoryObject = JSON.parse(localStorage.getItem(category));
    var objectForStorage = null;
    var i = 0;

    preFillFields(category);

    if (fieldElements) {
      for (i=0;i<fieldElements.length;i++)
      {
        if (fieldElements[i].type === 'hidden' && fieldElements[i].name !== 'sectionName')
        {
          key = fieldElements[i].id.toString();
          value = fieldElements[i].value;

          if (value !== '')
          {
            if (!categoryObject)
            {
              buildObject[key] = value;            
            }
            else
            {
              categoryObject[key] = value;
            }
          }
          else
          {
            console.log('delete empty key')
            delete categoryObject[key];
          }
        }
      }
      if (!categoryObject)
      {
        localStorage.setItem(category, JSON.stringify(buildObject));
      }
      else
      {
        localStorage.setItem(category, JSON.stringify(categoryObject));
      }
      if (showBadge)
      {
        addBadge(category);
      }
    }    
  }

  var objectLengthByCategory = function(category) {
    var obj = null;

    if (localStorage.getItem(category) !== null)
    {
      obj = JSON.parse(localStorage.getItem(category));
      return Object.keys(obj).length;
    }
    else
    {
      return 0;
    }    
  }

  var categoryExists = function(category) {
    if (objectLengthByCategory(category) > 0)
    {
      return true;
    }
    else 
    {
      return false;
    }
  }

  var recordExists = function(category,key) {
    var obj = JSON.parse(localStorage.getItem(category));
    for (item in obj) {
      console.log(item)
    }
  }

  var preFillFields = function(category) {    
    var categoryObject = JSON.parse(localStorage.getItem(category));
    var fieldElements = null;
    var splitValues = null;
    var i = 0, j = 0;
    if (categoryObject)
    {
      for (item in categoryObject)
      {
        fieldElements = document.getElementsByName(item);
        if (fieldElements.length > 0)
        {
          for (i=0;i<fieldElements.length; i++)
          {
            console.log('input type: ' + fieldElements[i].getAttribute('type'));
            splitValues = null;
            if (fieldElements[i].name === item) {
              if (fieldElements[i].getAttribute('type') === 'text')
              {
                fieldElements[i].value = categoryObject[item];
              }
              else if (fieldElements[i].getAttribute('type') === 'checkbox')
              {
                splitValues = categoryObject[item].split(',');
                // console.dir(splitValues);
                for (j=0;j<splitValues.length;j++)
                {
                  if (fieldElements[i].value === splitValues[j].trim())
                  {
                    fieldElements[i].checked = true;
                  }
                }
              }
              else if (fieldElements[i].getAttribute('type') === 'radio')
              {
                console.log('type is radio');
                if (fieldElements[i].value === categoryObject[item])
                {
                  fieldElements[i].checked = true;
                }
              }
            }               
          }
        }
      }
    }
  }

  var addBadge = function (category) {
    var objLength = objectLengthByCategory(category);
    var badgeEl = null;
    var countTextEl = null;
    var summaryEL = null;

    console.log('objLength: ' + objLength);
    if (objLength > 0) {
      badgeEl = document.createElement('span');
      countTextEl = document.createTextNode(objLength);
      summaryEL = document.getElementById('summary');
      badgeEl.appendChild(countTextEl);
      badgeEl.classList.add('badge');
      summaryEL.appendChild(badgeEl);
      badgeEl.classList.add('animated', 'bounce-in')
    }
  }

  return {
    init : init,
    storeValue: storeValue
  }
})(window);

$(function() {
  DTO.Forms.init();
  DTO.Forms.MockPersistence.init();
  DTO.GoogleMaps.init();
  DTO.Dropdowns.init();
  DTO.LocalStorage.init();

  $('div.task-title').click(function() {
    var chevronEl = $(this).find('i');
    chevronEl.toggleClass('fa-angle-down');
    chevronEl.toggleClass('fa-angle-up');
  });

  $('a[href="#"]').click(function(e) {
    e.preventDefault();
  });

  $('.btn-login').on('click',function(e) {
    e.preventDefault();
    var html = document.documentElement;
    var el = document.getElementById('loginContainer');

    if (el.classList.contains('hide')) {
      el.classList.remove('hide');
      setTimeout(function(){
        el.classList.add('slide-up');
        html.classList.add('no-scroll');
      },200);
    }
  });
});
