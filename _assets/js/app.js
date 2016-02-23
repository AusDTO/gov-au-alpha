if(typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    }
}
var tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';

var tagOrComment = new RegExp(
    '<(?:'
        // Comment body.
    + '!--(?:(?:-*[^->])*--+|-?)'
        // Special "raw text" elements whose content should be elided.
    + '|script\\b' + tagBody + '>[\\s\\S]*?</script\\s*'
    + '|style\\b' + tagBody + '>[\\s\\S]*?</style\\s*'
        // Regular name
    + '|/?[a-z]'
    + tagBody
    + ')>',
    'gi');
function removeTags(html) {
    var oldHtml;
    do {
        oldHtml = html;
        html = html.replace(tagOrComment, '');
    } while (html !== oldHtml);
    return html.replace(/</g, '&lt;');
}

var DTO = DTO || {};

DTO.Forms = {};

DTO.Forms.TextInputLists = (function (window, undefined) {
    var init = function (content) {
        bindAutoComplete($('.ui.search'), content);
        checkExisting($('.ui.search'));
        bindDisableEnter($('.ui.search'));
        bindAddMoreClickEvent(content);
        bindBlurCheck($('.ui.search'));
    };

    var checkExisting = function ($element) {
        if ($element.find('input').val() !== '') {
            $element.addClass('valid');
            $('.add-more').find('a.add-more').removeAttr('disabled', true)
                .removeClass('hide');
        }
    };

    var bindBlurCheck = function ($element) {
        $element.find('input').on('blur', function (e) {

            if ($(e.target).val() === '') {
                $element.removeClass('valid');
                $('.add-more').find('a.add-more').attr('disabled', true)
                    .addClass('hide');
            }
        })
    };

    var bindAddMoreClickEvent = function (content) {
        var $group;

        $('.add-more').find('a').on('click', function (e) {
            e.preventDefault();
            $group = $(this).parent().prev('.input-group');
            var clone = $group.clone();
            var increment = clone.find('input').data('count');
            var idPrefix = clone.find('input').attr('name');
            increment++;
            clone.removeClass('valid');
            $('.add-more').find('a.add-more').removeAttr('disabled', true);
            clone.find('input').removeAttr('data-error-message');
            clone.find('input').removeAttr('data-error-message-holder');
            clone.find('input').removeAttr('required');

            clone.find('input').attr('data-count', increment);
            clone.find('input').attr('id', idPrefix + '-' + increment);

            clone.find('input').first().val('');
            clone.find('.results').html('');
            $group.after(clone);

            if (clone.hasClass('ui') && clone.hasClass('search')) {
                bindAutoComplete(clone, content);
                bindDisableEnter(clone);
                bindBlurCheck(clone);
            }

            clone.find('input').focus();
        });
    };

    var bindAutoComplete = function ($element, content) {

        $($element).removeClass('valid');
        $('.add-more').find('a.add-more').attr('disabled', true)
            .addClass("hide");
        $($element).search({
            source: content,
            searchFields: ['title', 'description'],
            searchFullText: true,
            onSelect: function (event) {
                $($element).addClass('valid');
                $('.add-more').find('a.add-more').removeAttr('disabled', true)
                    .removeClass('hide');
            },
            onResultsOpen: function (event) {
                if ($element.hasClass('valid')) {
                    $element.removeClass('valid');
                    $('.add-more').find('a.add-more').attr('disabled', true)
                        .addClass('hide');
                }
            },
            onResultsClose: function (event) {
                var titles = [];
                for(x = 0; x < content.length; x++){
                    titles.push(content[x]['title']);
                }
                if(titles.indexOf($element.find("input").val()) >= 0){
                    $($element).addClass('valid');
                    $('.add-more').find('a.add-more').removeAttr('disabled', true)
                        .removeClass('hide');
                }

            }

        });
    };

    var bindDisableEnter = function ($element) {
        $element.keypress(function (e) {
            var code = e.which; // recommended to use e.which, it's normalized across browsers
            if (code == 13)e.preventDefault();
        });
    };

    return {
        init: init
    }
})(window);

DTO.GoogleMaps = (function (window, undefined) {
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

    var init = function () {
        $('input.auto-complete').each(function () {
            var $input = $(this);
            window.googleMapsCallback = function () {
                autoComplete = new google.maps.places.Autocomplete(
                    $input[0], {
                        types: ['address'],
                        componentRestrictions: {country: 'au'}
                    }); // restrict to country au ie. australia
                $input.bind('keypress', function (e) {
                    if (e.which === ENTER_KEY) {
                        e.preventDefault();
                    }
                });
                autoComplete.addListener('place_changed', fillInAddress);
            };
            if ($input.hasClass('geo-locate')) {
                $input.on('focus', function () {
                    geolocate();
                });
            }
            addScriptTagOnLoad();
        });
    };

    var fillInAddress = function () {
        var place = autoComplete.getPlace();
        for (var component in components) {
            var element = document.getElementById(component);
            if (element !== null) {
                element.value = '';
            }
        }

        var address = '';
        for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            if (components[addressType]) {
                var val = place.address_components[i][components[addressType]];
                var element = document.getElementById(addressType);
                if (element !== null) {
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

    var geocodeAddress = function (address) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': address}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var latitude = results[0].geometry.location.lat();
                var longitude = results[0].geometry.location.lng();
                $('#lat').val(latitude);
                $('#lng').val(longitude);
            }
        });
    };

    var geolocate = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
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

    var addScriptTagOnLoad = function () {
        window.addEventListener('load', function () {
            loadScript('https://maps.googleapis.com/maps/api/js?key=' + API_KEY +
                '&signed_in=true&libraries=places&callback=googleMapsCallback')
        }, false);
    };

    var loadScript = function (url, callback) {
        var script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        if (typeof callback === 'function') {
            script.addEventListener('load', callback, false);
        }
        script.setAttribute('src', url);
        document.body.appendChild(script);
    };

    return {
        init: init
    }
})(window);

DTO.Dropdowns = (function (window, undefined) {
    var init = function () {
        $('a.dropdown').each(function () {
            var icon = $(this).find('i');
            var target = $(this).data('target');

            $(target).find('.fa-times').on('click', function () {
                fadeOut(icon, target);
            });

            $(this).on('click', function (e) {
                e.preventDefault();
                if ($(target).hasClass('out')) {
                    fadeIn(icon, target);
                }
                else {
                    fadeOut(icon, target);
                }
            });
        });
    };

    var fadeIn = function (icon, target) {
        $(icon).addClass('fa-caret-up');
        $(icon).removeClass('fa-caret-down');
        $(target).removeClass('out');
    };

    var fadeOut = function (icon, target) {
        $(icon).addClass('fa-caret-down');
        $(icon).removeClass('fa-caret-up');
        $(target).addClass('out');
    };

    return {
        init: init
    }
})(window);

DTO.Notifications = (function (window, undefined) {
    var init = function () {
        $('.notification').each(function () {
            var $notification = $(this);
            $notification.find('i').on('click', function () {
                $notification.addClass('out');
            });
        });
    };

    var fadeIn = function () {
        $('.notification').each(function () {
            $(this).removeClass('out');
        });
    };

    return {
        init: init,
        fadeIn: fadeIn
    }
})(window);

DTO.LocalStorage = (function (window, undefined) {
    var fieldElements = null;
    var init = function () {
        fieldElements = document.getElementsByTagName('input');
    };

    var storeValue = function () {
        var categoryEl = document.getElementById('sectionName');
        if (categoryEl !== null) {
            var category = categoryEl.value;
            var buildObject = {};
            var key = null;
            var value = null;
            var categoryObject = JSON.parse(localStorage.getItem(category));
            var i = 0;

            preFillFields(category);

            if (fieldElements) {
                for (i = 0; i < fieldElements.length; i++) {
                    if (fieldElements[i].type === 'hidden' && fieldElements[i].name !== 'sectionName') {
                        key = fieldElements[i].id.toString();
                        value = fieldElements[i].value;

                        if (value !== '') {
                            if (!categoryObject) {
                                buildObject[key] = removeTags(value);
                            }
                            else {
                                categoryObject[key] = removeTags(value);
                            }
                        }
                        else {
                            if (categoryObject) {
                                // delete categoryObject[key];
                            }
                        }
                    }
                }
                if (!categoryObject) {
                    localStorage.setItem(category, JSON.stringify(buildObject));
                }
                else {
                    localStorage.setItem(category, JSON.stringify(categoryObject));
                }
            }
        }
    }

    var objectLengthByCategory = function (category) {
        var obj = null;

        if (localStorage.getItem(category) !== null) {
            obj = JSON.parse(localStorage.getItem(category));
            return Object.keys(obj).length;
        }
        else {
            return 0;
        }
    }

    var preFillFields = function (category) {
        window.onpageshow = function (event) {
            // Because Safari's back button persists it's state it fails to load local storage data - so force a reload
            if (event.persisted) {
                window.location.reload();
            }
        };
        var categoryObject = JSON.parse(localStorage.getItem(category));
        var fieldElements = null;
        var splitValues = null;
        var activities = [];
        var i = 0, j = 0, x = 0;
        if (categoryObject) {
            for (item in categoryObject) {
                fieldElements = document.getElementsByName(item);
                if (fieldElements.length > 0) {
                    for (i = 0; i < fieldElements.length; i++) {
                        splitValues = null;
                        if (fieldElements[i].name === item) {
                            if (fieldElements[i].getAttribute('type') === 'text' || fieldElements[i].getAttribute('type') === 'number') {
                                if(item === 'activities'){
                                    // May have multiple activities, need to split
                                    splitValues = categoryObject[item].split(',');

                                    for(x = 0; x < splitValues.length; x++){
                                        if(splitValues[x].trim() != ""){
                                            activities.push(removeTags(splitValues[x]).trim());
                                        }
                                    }
                                } else {
                                    fieldElements[i].value = removeTags(categoryObject[item]);
                                }
                            }
                            else if (fieldElements[i].getAttribute('type') === 'checkbox') {
                                splitValues = categoryObject[item].split(',');
                                // console.dir(splitValues);
                                for (j = 0; j < splitValues.length; j++) {
                                    if (fieldElements[i].value === splitValues[j].trim()) {
                                        fieldElements[i].checked = true;
                                    }
                                }
                            }
                            else if (fieldElements[i].getAttribute('type') === 'radio') {
                                if (fieldElements[i].value === categoryObject[item]) {
                                    fieldElements[i].checked = true;
                                }
                            }
                        }
                    }
                }
            }
        }

        if(activities.length > 0){
            // Create input fields and insert activities
            console.log(activities);
            for(x = 0; x < activities.length; x++){
                if(x > 0) $(".add-more").click();
                var tempActivity = document.getElementById("activities-" + (x+1));
                tempActivity.value = removeTags(activities[x]);
                $(tempActivity).parent('.ui.search').addClass('valid');
            }
            $(".add-more").removeAttr('disabled', true).removeClass('hide');
        }
    };

    var addBadge = function (category) {
        var objLength = objectLengthByCategory(category);
        var badgeEl = null;
        var countTextEl = null;
        var summaryEL = null;

        // console.log('objLength: ' + objLength);
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
        init: init,
        storeValue: storeValue
    }
})(window);

DTO.MockFormSubmission = (function(window, undefined) {

    var init = function() {
        // Only add mock form submission on forms with get method

        $('form').each(function(){
           if($(this).attr('method') === "get") $(this).submit(formSubmit);
        });
        setTextContentOfSpanElements();
    };

    var formSubmit = function(event) {

        event.preventDefault();
        var form = $(event.target);
        var sectionName = form.find("#sectionName").val();
        var storedObject = JSON.parse(localStorage.getItem(sectionName)) || {};

        var inputs = form.find("input");
        var inputNames = [];

        $(inputs).each(function() {
            var nameAttr = $(this).attr('name');
            if(inputNames.indexOf(nameAttr) == -1 &&
                nameAttr != 'sectionName') inputNames.push($(this).attr('name'))
            if(nameAttr in storedObject) delete storedObject[nameAttr];
        });

        for(var i = 0; i < inputNames.length; i++){
           $(document.getElementsByName(inputNames[i])).each(function() {
               var elType = $(this).attr('type');
               var nameValue = storedObject[inputNames[i]] || '';
               if(elType === 'checkbox' || elType === 'radio'){
                   if(nameValue.length > 0 && this.checked) nameValue += ",";
                   if(this.checked) nameValue += this.value;
               } else if (this.value !== '') {
                   if(nameValue.length > 0) nameValue += ",";
                   nameValue += this.value;
               }

               storedObject[inputNames[i]] = nameValue;
           });
        }

        // Save form data
        localStorage.setItem(sectionName, JSON.stringify(storedObject));
        location.href = form.attr('action');
        return false;
    };

    var valueIsEmpty = function (value) {
        return ((value === null) || (value === '') || (value === 'undefined'))
    };

    var setTextContentOfSpanElements = function () {
        var sectionName = $('#sectionName').val();
        var storedObject = JSON.parse(localStorage.getItem(sectionName)) || {};

        for (var key in storedObject) {

            if (valueIsEmpty(storedObject[key]))
                continue;

            $('div#' + key).removeClass('hide');
            $('div#' + key + ' span').text(storedObject[key]);
        }
    };

    return {
        init: init
    }
})(window);

DTO.MyTaskList = (function (window, undefined) {
    var PAGE_BODY_SELECTOR = 'html, body';
    var TASK_TITLE_CLASS = '.task-title';
    var TASK_CONTENT_CLASS = '.task-body-content';
    var ICON_ELEMENT = 'i';
    var UP_CHEVRON_CLASS = 'fa-angle-up';
    var DOWN_CHEVRON_CLASS = 'fa-angle-down';
    var ANCHOR_DIV_CLASS = '.anchor';
    var HIDDEN_CLASS = 'hide';

    var accordianTasks = [];
    var slideToggleSpeed;
    var pageScrollSpeed;

    var init = function (tasks, config) {
        accordianTasks = tasks;
        slideToggleSpeed = config['slideToggleSpeed'];
        pageScrollSpeed = config['pageScrollSpeed'];
        registerAccordianTaskClicks();
    };

    var autoScrollToTask = function (taskName) {
        toggleTaskChefron(taskName);
        animateDisplayTaskList(taskName);
        scrollToAnchor(pageScrollSpeed);
    };

    var switchVisibleTasks = function (fromTaskId, toTaskId) {
        $(fromTaskId).addClass(HIDDEN_CLASS);
        $(toTaskId).removeClass(HIDDEN_CLASS);
    };

    var registerAccordianTaskClicks = function () {
        $.each(accordianTasks, function (index, task) {
            registerTaskClick(task);
        });
    };

    var openTask = function (taskName) {
        animateDisplayTaskList(taskName);

        // change classes on task list

        if (!$(taskName).hasClass('open')) {
            $(taskName).addClass('open');
            $(taskName).removeClass('closed');

        }
        else {
            $(taskName).removeClass('open');
            $(taskName).addClass('closed');
        }
    }

    var registerTaskClick = function (taskName) {
        // give div tabindex to allow it to be selected via keyboard
        $(taskName + TASK_TITLE_CLASS).attr("tabindex","0");

        $(taskName + TASK_TITLE_CLASS).click(function(e) { openTask(taskName) });

        $(taskName + TASK_TITLE_CLASS).keydown(function (event) {
            if ( event.which == 13 || event.which == 31 ) { // enter or space
                openTask(taskName);
                event.preventDefault();
            } else if ( event.which == 38 ) { // up
                $(taskName + TASK_TITLE_CLASS).parents('li').prev().find('.task-title').first().focus();
                event.preventDefault();
            } else if ( event.which == 40 ) { // down
                $(taskName + TASK_TITLE_CLASS).parents('li').next().find('.task-title').first().focus();
                event.preventDefault();
            }

        });
    };

    var animateDisplayTaskList = function (taskName) {
        $(TASK_CONTENT_CLASS + taskName).slideToggle(slideToggleSpeed);
    };

    var scrollToAnchor = function (speed) {
        $(PAGE_BODY_SELECTOR).animate({
            scrollTop: $(ANCHOR_DIV_CLASS).offset().top
        }, speed);
    };

    var toggleTaskChefron = function (taskName) {
        var taskChefronSelector = taskName + TASK_TITLE_CLASS + ' ' + ICON_ELEMENT;
        $(taskChefronSelector).removeClass(DOWN_CHEVRON_CLASS);
        $(taskChefronSelector).addClass(UP_CHEVRON_CLASS);
    };

    return {
        init: init,
        autoScroll: autoScrollToTask,
        switchVisibleTasks: switchVisibleTasks
    }
})(window);

DTO.HiddenContentBox = (function (window, undefined) {
    var HIDE_CLASS = 'hide';
    var CHEVRON_DOWN_CLASS = 'fa-chevron-down';
    var CHEVRON_UP_CLASS = 'fa-chevron-up';
    var ICON_ELEMENT = 'i';

    var init = function (hiddenElements) {
        $.each(hiddenElements, function (index, hiddenElement) {
            registerClick(hiddenElement.clickableElement, hiddenElement.contentElement);
        });
    };

    var toggleContent = function (clickableElement, contentElement) {
        $(contentElement).toggleClass(HIDE_CLASS);
        $(clickableElement + ' ' + ICON_ELEMENT).toggleClass(CHEVRON_DOWN_CLASS);
        $(clickableElement + ' ' + ICON_ELEMENT).toggleClass(CHEVRON_UP_CLASS);
    };

    var registerClick = function (clickableElement, contentElement) {
        $(clickableElement).click(function () {
            toggleContent(clickableElement, contentElement);
        });
    };

    return {
        init: init
    }
})(window);


$(function () {

    DTO.MockFormSubmission.init();
    DTO.GoogleMaps.init();
    DTO.Dropdowns.init();
    DTO.Notifications.init();
    DTO.LocalStorage.init();
    DTO.LocalStorage.storeValue();

    // fix footer when content small
    if ($('html').height() < $(window).height()) {
        $('footer').css({
            position: 'fixed',
        width: '100%',
        bottom: 0
        });
    }

    $("#skipper").click(function () {
        $('.mainContent').attr('tabIndex', -1).focus();
    });

    $(".screen-help-link, .screen-help-close").click(function () {
        $(".screen-help").slideToggle(500);
        $(".screen-help-link .fa-chevron-down").toggleClass("down");
    });

    $('div.task-title').click(function () {
        var chevronEl = $(this).find('> i');
        chevronEl.toggleClass('fa-angle-down');
        chevronEl.toggleClass('fa-angle-up');
    });


    $('a[href="#"]').click(function (e) {
        e.preventDefault();
    });

    $('.globalBackBtn, #globalBackBtn1').click(function (e) {
        history.go(-1);
        e.preventDefault();
    });

    $('abbr').click(function (e) {

        $(this).html($(this).attr('title'));
        $(this).css("white-space","normal");
        $(this).css("line-height","2");
    });

    $('.btn-login').on('click', function (e) {
        e.preventDefault();
        var html = document.documentElement;
        var el = document.getElementById('loginContainer');

        if (el.classList.contains('hide')) {
            el.classList.remove('hide');
            setTimeout(function () {
                el.classList.add('slide-up');
                html.classList.add('no-scroll');
            }, 200);
        }
    });
});
