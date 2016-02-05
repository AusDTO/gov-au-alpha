(function ($) {
    //"use strict";
    $.fn.alphaValidate = function (optionsList) {

        var $form = $(this);
        var i = 0, j = 0;
        var defaults, options;

        defaults = {
            groupNames: []
        }

        options = $.extend(defaults, optionsList);

        // Set HTML5 validation messages https://stackoverflow.com/questions/13798313/set-custom-html5-required-field-validation-message
        $('input[required], input[required="required"]').each(function (i, e) {
            e.oninvalid = function (el) {
                el.target.setCustomValidity(!el.target.validity.valid ? e.getAttribute('data-error-message') : "");
            };
        });

        $form.on('submit', function (e) {
            e.preventDefault();
            var errorCount = 0;

            var requiredInputArr = $form.find('input[required]:not([group-name]), select[required]:not([group-name]), textarea[required]:not([group-name])');

            // NB: for grouped text or number boxes. Radio button and checkboxes are caught in above selectors
            var requiredGroupInputsArr = [];

            if (options.groupNames.length > 0) {
                for (i = 0; i < options.groupNames.length; i++) {
                    requiredGroupInputsArr.push($form.find('input[required][group-name="' + options.groupNames[i] + '"]'));
                }
                if (requiredGroupInputsArr.length > 0) {
                    for (i = 0; i < requiredGroupInputsArr.length; i++) {
                        if (requiredGroupInputsArr[i][0].type === 'number') {
                            groupNumberFieldCheck(requiredGroupInputsArr[i]);
                        }
                    }
                }
            }

            for (i = 0; i < requiredInputArr.length; i++) {
                // console.log(requiredInputArr[i].id);
                if (requiredInputArr[i].type === 'number') {
                    if (requiredInputArr[i].getAttribute('data-error-message-holder') && requiredInputArr[i].getAttribute('data-error-message')) {
                        numberFieldCheck(requiredInputArr[i]);
                    }
                }
                else if (requiredInputArr[i].type === 'radio') {
                    if (requiredInputArr[i].getAttribute('data-error-message-holder') && requiredInputArr[i].getAttribute('data-error-message')) {
                        radioButtonCheckboxCheck(requiredInputArr[i]);
                    }
                }
                else if (requiredInputArr[i].type === 'checkbox') {
                    console.log('checkbox')
                    if (requiredInputArr[i].getAttribute('data-error-message-holder') && requiredInputArr[i].getAttribute('data-error-message')) {
                        radioButtonCheckboxCheck(requiredInputArr[i]);
                    }
                }
                else if (requiredInputArr[i].nodeName === 'SELECT') {
                    if (requiredInputArr[i].getAttribute('data-error-message-holder') && requiredInputArr[i].getAttribute('data-error-message')) {
                        textboxCheck(requiredInputArr[i]);
                    }
                }
                else if (requiredInputArr[i].type === 'text' || requiredInputArr[i].type === 'url') {
                    if (requiredInputArr[i].getAttribute('data-error-message-holder') && requiredInputArr[i].getAttribute('data-error-message')) {
                        textboxCheck(requiredInputArr[i]);
                    }
                }
                else if (requiredInputArr[i].type === 'textarea') {
                    if (requiredInputArr[i].getAttribute('data-error-message-holder') && requiredInputArr[i].getAttribute('data-error-message')) {
                        textboxCheck(requiredInputArr[i]);
                    }
                }
            }

            function patternPasses(pattern, value) {
                var patternGood = true;
                if (pattern !== null) {
                    console.log('The pattern looks like this: ' + pattern);
                    pattern = new RegExp(pattern);
                    console.log('testing pattern');
                    patternGood = pattern.test(value);
                    console.log(value + ' is valid: ' + pattern.test(value));
                }

                return patternGood;
            }

            function currencyCheck(value, min, max) {
                var currencyGood = true;

                console.log('testing currency');
                if (min !== null && value !== null) {

                    // remove non number characters other than period
                    var numb = parseFloat(value.match(/\d|\./g).join(""));
                    var min = parseFloat(min.match(/\d|\./g).join(""));
                    console.log (value + ' parses to number: ' + numb);
                    if (numb < min) {
                        console.log(value + ' below minimum of: ' + min);
                        currencyGood = false;
                    }
                    console.log(value + ' is valid: ' + currencyGood);
                }

                console.log('currencyGood: ' + currencyGood);

                return currencyGood;
            }

            function groupNumberFieldCheck(arr) {
                if (arr.length > 0) {
                    var i = 0;
                    var groupErrorCount = 0;
                    var errorMessageArr = [];
                    var fieldValue = null, errorMessageHolder = null, listElement = null, listItems = null, textNode = null, pattern = null, patternTest = null, min = null, max = null;
                    errorMessageHolder = document.getElementById(arr[0].getAttribute('data-error-message-holder'));
                    $(errorMessageHolder).children('ul').remove();
                    $(errorMessageHolder).removeClass('hide');

                    var outsideMinMaxMsg = null;

                    for (i = 0; i < arr.length; i++) {
                        //console.dir(arr[i]);
                        fieldValue = arr[i].value;
                        if (fieldValue !== '') {
                            fieldValue = Number(fieldValue);
                        }
                        min = arr[i].getAttribute('min');
                        max = arr[i].getAttribute('max');
                        pattern = arr[i].getAttribute('pattern');

                        outsideMinMaxMsg = arr[i].getAttribute('outside-scope-error-message');

                        if (fieldValue === '') {
                            errorMessageArr.push(arr[i].getAttribute('data-error-message'));
                            $(arr[i]).addClass('error');
                            errorCount++;
                            groupErrorCount++;
                        }
                        else if (!isNaN(fieldValue) && ( min !== null && max !== null) && (fieldValue !== '') && (fieldValue < min || fieldValue > max)) //is a number but falls outside min and max scope
                        {
                            if (!outsideMinMaxMsg) {
                                outsideMinMaxMsg = 'Enter a number between ' + min + ' and ' + max + '.';
                            }
                            errorMessageArr.push(outsideMinMaxMsg);
                            $(arr[i]).addClass('error');
                            errorCount++;
                            groupErrorCount++;
                        }
                        else if (!isNaN(fieldValue) && ( min === null && max === null) && (fieldValue !== '') && (pattern !== null) && !patternPasses(arr[i].getAttribute('pattern'), fieldValue)) //
                        {
                            errorMessageArr.push(arr[i].getAttribute('pattern-breach-message'));
                            $(arr[i]).addClass('error');
                            errorCount++;
                            groupErrorCount++;
                        }
                        else {
                            $(arr[i]).removeClass('error');
                            if (errorCount > 0) {
                                errorCount--;
                            }
                            if (groupErrorCount > 0) {
                                groupErrorCount--;
                            }

                        }
                    }

                    if (errorMessageArr.length > 0) {
                        listElement = document.createElement('ul');
                        for (i = 0; i < errorMessageArr.length; i++) {
                            listItem = document.createElement('li');
                            textNode = document.createTextNode(errorMessageArr[i]);
                            listElement.appendChild(listItem);
                            listItem.appendChild(textNode);
                        }
                        errorMessageHolder.appendChild(listElement);
                    }
                    else {
                        $(errorMessageHolder).children('ul').remove();
                        $(errorMessageHolder).addClass('hide');
                    }

                    if (groupErrorCount > 0) {
                        $('input[group-name="' + arr[0].getAttribute("group-name") + '"].error').on('blur', function () {
                            groupNumberFieldCheck($('input[group-name="' + arr[0].getAttribute("group-name") + '"].error'));
                        });
                    }
                    else {
                        $('input[group-name="' + arr[0].getAttribute("group-name") + '"]').off('blur');
                    }
                }
            };

            function numberFieldCheck(el) {
                var i = 0;
                var numberBox = el;
                var errorMessageHolder = document.getElementById(el.getAttribute('data-error-message-holder'));
                var errorMsg = '';
                var currency = el.getAttribute('data-currency');
                var min = el.getAttribute('min');
                var max = el.getAttribute('max');
                var fieldValue = numberBox.value;

                var outsideMinMaxMsg = document.getElementById(el.getAttribute('outside-scope-error-message'));
                var notNumericMsg = document.getElementById(el.getAttribute('not-numeric-error-message'));

                if (!notNumericMsg) {
                    notNumericMsg = 'Enter a number into field';
                }

                // clear message holder of last message;
                $(errorMessageHolder).children('p').not(':first').remove();

                if (fieldValue === '') {
                    errorMsg = numberBox.getAttribute('data-error-message');
                    handleErrorInsert(el, errorMessageHolder, errorMsg);
                    errorCount++;
                    // Add listener for blur to recheck
                    $(numberBox).one('blur', function () {
                        numberFieldCheck(el);
                        // console.log('Event lister added ONCE for id ' + el.id);
                    });
                }
                else if (fieldValue !== '' && isNaN(fieldValue)) {
                    errorMsg = notNumericMsg;
                    handleErrorInsert(el, errorMessageHolder, errorMsg);
                    errorCount++;
                    // Add listener for blur to recheck
                    $(numberBox).one('blur', function () {
                        numberFieldCheck(el);
                        // console.log('Event lister added ONCE for id ' + el.id);
                    });
                }
                else if (fieldValue !== '' && currency !== null && !currencyCheck(fieldValue, min, max)) {
                    console.log('fieldValue: ' + fieldValue);
                    console.log('currency: ' + currency);
                    console.log('currencyCheck: ' + currencyCheck(fieldValue, min, max));
                    var errorCurrencyMsg = numberBox.getAttribute('data-currency-breach-message');
                    if (!errorCurrencyMsg) {
                        errorCurrencyMsg = 'Enter a number between ' + min + ' and ' + max + '.';
                    }
                    handleErrorInsert(el, errorMessageHolder, errorCurrencyMsg);
                    errorCount++;
                    // Add listener for blur to recheck
                    $(numberBox).one('blur', function () {
                        numberFieldCheck(el);
                    });
                }
                else if ((!isNaN(fieldValue) && min !== null && max !== null) && (fieldValue !== '') && (fieldValue < min || fieldValue > max) && !currency) //is a number but falls outside min and max scope
                {
                    if (!outsideMinMaxMsg) {
                        outsideMinMaxMsg = 'Enter a number between ' + min + ' and ' + max + '.';
                    }
                    errorMsg = outsideMinMaxMsg;
                    handleErrorInsert(el, errorMessageHolder, errorMsg);
                    errorCount++;
                    // Add listener for blur to recheck
                    $(numberBox).one('blur', function () {
                        numberFieldCheck(el);
                        // console.log('Event lister added ONCE for id ' + el.id);
                    });
                }
                else {
                    $(errorMessageHolder).addClass('hide');
                    if ($(numberBox).hasClass('error')) {
                        $(numberBox).removeClass('error');
                        errorCount--;
                    }
                    // Remove listener for blur
                    $(numberBox).off('blur', function () {
                        textboxCheck(el);
                        // console.log('Event lister removed for id ' + el.id);
                    });
                }
                //console.log('errorCount: ' + errorCount);

            }

            function textboxCheck(el) {
                var i = 0;
                var textBox = el;
                var errorMessageHolder = document.getElementById(el.getAttribute('data-error-message-holder'));
                var errorMsg = '', paragraphElement = null, textNode = null;
                var pattern = el.getAttribute('pattern');
                var currency = el.getAttribute('data-currency');
                var min = el.getAttribute('min');
                var max = el.getAttribute('max');


                $(errorMessageHolder).children('p').not(':first').remove();

                if (textBox.value === '') {
                    errorMsg = textBox.getAttribute('data-error-message');

                    handleErrorInsert(el, errorMessageHolder, errorMsg);
                    errorCount++;
                    // Add listener for blur to recheck
                    $(textBox).one('blur', function () {
                        textboxCheck(el);
                    });
                }
                else if (textBox.value !== '' && pattern !== null && !patternPasses(pattern, textBox.value)) {

                    errorMsg = textBox.getAttribute('pattern-breach-message');
                    handleErrorInsert(el, errorMessageHolder, errorMsg);
                    errorCount++;
                    // Add listener for blur to recheck
                    $(textBox).one('blur', function () {
                        textboxCheck(el);
                    });
                }
                else if (textBox.value !== '' && currency !== null && !currencyCheck(textBox.value, min, max)) {

                    var errorCurrencyMsg = textBox.getAttribute('data-currency-breach-message');
                    if (!errorCurrencyMsg) {
                        errorCurrencyMsg = 'Enter a number between ' + min + ' and ' + max + '.';
                    }
                    handleErrorInsert(el, errorMessageHolder, errorCurrencyMsg);
                    errorCount++;
                    // Add listener for blur to recheck
                    $(textBox).one('blur', function () {
                        textboxCheck(el);
                    });
                }
                else {
                    $(errorMessageHolder).addClass('hide');
                    if ($(textBox).hasClass('error')) {
                        $(textBox).removeClass('error');
                        errorCount--;
                    }
                    // Remove listener for blur
                    $(textBox).off('blur');
                }
            }

            // radio button and checkbox validator function
            function radioButtonCheckboxCheck(el) {
                var i = 0;
                var groupName = el.getAttribute('name');
                if (!groupName) {
                    console.log('Warning: name attribute missing')
                }
                var checkedRadioBtns = $('input[name="' + groupName + '"]:checked');
                var radioBtns = $('input[name="' + groupName + '"]');
                var errorMessageHolder = document.getElementById(el.getAttribute('data-error-message-holder'));
                var errorMsg = '', paragraphElement = null, textNode = null;

                $(errorMessageHolder).children('p').not(':first').remove();

                if (checkedRadioBtns.length === 0) {
                    errorMsg = el.getAttribute('data-error-message');
                    paragraphElement = document.createElement('p');
                    textNode = document.createTextNode(errorMsg);
                    paragraphElement.appendChild(textNode);
                    errorMessageHolder.appendChild(paragraphElement);
                    $(errorMessageHolder).removeClass('hide');
                    errorCount++;
                    $('input[name="' + groupName + '"]').one('change', function () {
                        radioButtonCheckboxCheck(el);
                        // console.log('Event lister added ONCE for id ' + el.id);
                    });
                    for (i = 0; i < radioBtns.length; i++) {
                        $(radioBtns[i]).addClass('error');
                    }
                }
                else {
                    $('input[name="' + groupName + '"]').off('change', function () {
                        radioButtonCheckboxCheck(el);
                    });

                    $(errorMessageHolder).addClass('hide');
                    if ($(el).hasClass('error')) {
                        errorCount--;
                    }
                    for (i = 0; i < radioBtns.length; i++) {
                        $(radioBtns[i]).removeClass('error');
                    }
                }
            }

            function handleErrorInsert(el, errHolder, eMsg) {
                var paragraphElement = document.createElement('p'), textNode = document.createTextNode(eMsg);
                paragraphElement.appendChild(textNode);
                errHolder.appendChild(paragraphElement);
                $(errHolder).removeClass('hide');
                $(el).addClass('error');
            }


            if ($('input.error, textarea.error, select.error').length === 0) {
                $form.off('submit');
                $form.submit();
            }


        });

    }
})(jQuery);