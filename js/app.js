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
    });
  };

  return {
    init : init
  }
})(window);

DTO.Forms.MockPersistence = (function(window, undefined) {
  var init = function() {
    persistHttpGetParams();
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

  return {
    init : init,
    getParameterByName : getParameterByName
  }
})(window);

DTO.GoogleMaps = (function(window, undefined) {
  var API_KEY = 'AIzaSyB92uNcFUglUi2raycalrPhJxF4-pnHuIo';

  var loadScript = function(url, callback){
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    if(typeof callback === 'function') {
      script.addEventListener('load', callback, false);
    }
    script.setAttribute('src', url);
    document.body.appendChild(script);
  };

  var init = function() {
    if(typeof window.googleMapsCallback === 'function') {
      window.addEventListener('load', function() {
        loadScript('https://maps.googleapis.com/maps/api/js?key=' + API_KEY +
          '&signed_in=true&libraries=places&callback=googleMapsCallback')
      }, false);
    }
  };

  return {
    init : init
  }
})(window);

$(function() {
  DTO.Forms.init();
  DTO.Forms.MockPersistence.init();
  DTO.GoogleMaps.init();
});
