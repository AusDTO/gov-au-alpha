(function ($) {
	//"use strict";
	$.fn.alphaValidate = function (optionsList) {
		var $form = $(this);
		var i = 0, j = 0;
		var defaults, options;

		defaults = {
			debug: false,
			groupNames: []
		}

		options = $.extend(defaults, optionsList);
		
		$form.on('submit', function(e) {
			e.preventDefault();
			var errorCount = 0;

			var requiredInputArr = $form.find('input[required]:not([group-name]), select[required]:not([group-name]), textarea[required]:not([group-name])');

			// NB: for grouped text or number boxes. Radio button and checkboxes are caught in above selectors
			var requiredGroupInputsArr = [];

			if (options.groupNames.length > 0)
			{
				for (i=0;i<options.groupNames.length;i++)
				{				
					requiredGroupInputsArr.push($form.find('input[required][group-name="'+options.groupNames[i]+'"]'));		
				}
				if (requiredGroupInputsArr.length > 0)
				{
					for (i=0;i<requiredGroupInputsArr.length;i++)
					{
						if (requiredGroupInputsArr[i][0].type === 'number')
						{
							//console.log('We have a number field');
							groupNumberFieldCheck(requiredGroupInputsArr[i]);							
						}
					}
				}				
			}

			for (i=0;i<requiredInputArr.length;i++) {
				// console.log(requiredInputArr[i].id);
				if (requiredInputArr[i].type === 'number')
				{
					if (requiredInputArr[i].getAttribute('error-message-holder') && requiredInputArr[i].getAttribute('error-message')) {
						console.log('%c Success: Call number field validator for id ' + requiredInputArr[i].id,'background: #0f0; color: #000');
						numberFieldCheck(requiredInputArr[i]);
					}
					else if (requiredInputArr[i].getAttribute('error-message-holder') && !requiredInputArr[i].getAttribute('error-message')) {
						console.log('%c Warning: error-message attribute missing on number field id:' + requiredInputArr[i].id ,'background: #ff0; color: 000');
					}
					else if (requiredInputArr[i].getAttribute('error-message') && !requiredInputArr[i].getAttribute('error-message-holder')) {
						console.log('%c Warning: error-message-holder attribute missing on number fieldid:' + requiredInputArr[i].id,'background: #ff0; color: 000');
					}
					else {
						console.log('%c Message: we have a number field - but we are skipping it - assuming the lead button was configured correctly and group was (in)validated','background: #222; color: #bada55');
					}
				}
				else if (requiredInputArr[i].type === 'radio')
				{
					
					if (requiredInputArr[i].getAttribute('error-message-holder') && requiredInputArr[i].getAttribute('error-message')) {
						if (options.debug)
						{
							console.log('%c Success: Call radio button validator','background: #0f0; color: #000');
						}
						radioButtonCheckboxCheck(requiredInputArr[i]);
					}
					else if (options.debug && requiredInputArr[i].getAttribute('error-message-holder') && !requiredInputArr[i].getAttribute('error-message')) {
						console.log('%c Warning: error-message attribute missing on radio button id:' + requiredInputArr[i].id ,'background: #ff0; color: 000');
					}
					else if (options.debug && requiredInputArr[i].getAttribute('error-message') && !requiredInputArr[i].getAttribute('error-message-holder')) {
						console.log('%c Warning: error-message-holder attribute missing on radio button id:' + requiredInputArr[i].id,'background: #ff0; color: 000');
					}
					else if (options.debug) {
						console.log('%c Message: we have a radio button - but we are skipping it - assuming the lead button was configured correctly and group was (in)validated','background: #222; color: #bada55');
					}
					
				}
				else if (requiredInputArr[i].type === 'checkbox')
				{
					if (requiredInputArr[i].getAttribute('error-message-holder') && requiredInputArr[i].getAttribute('error-message')) {
						if (options.debug)
						{
							console.log('%c Success: Call checkbox validator','background: #0f0; color: #000');
						}
						radioButtonCheckboxCheck(requiredInputArr[i]);
					}
					else if (options.debug && requiredInputArr[i].getAttribute('error-message-holder') && !requiredInputArr[i].getAttribute('error-message')) {
						console.log('%c Warning: error-message attribute missing on checkbox id:' + requiredInputArr[i].id ,'background: #ff0; color: 000');						
					}
					else if (options.debug && requiredInputArr[i].getAttribute('error-message') && !requiredInputArr[i].getAttribute('error-message-holder')) {
						console.log('%c Warning: error-message-holder attribute missing on checkbox id:' + requiredInputArr[i].id,'background: #ff0; color: 000');
					}
					else if (options.debug)
					{
						console.log('%c Message: we have a checkbox - but we are skipping it - assuming the checkbox was configured correctly and group was (in)validated','background: #222; color: #bada55');
					}
				}
				else if (requiredInputArr[i].nodeName === 'SELECT')
				{
					if (requiredInputArr[i].getAttribute('error-message-holder') && requiredInputArr[i].getAttribute('error-message')) {
						if (options.debug)
						{
							console.log('%c Success: Call selectbox validator','background: #0f0; color: #000');
						}
						textAndSelectBoxCheck(requiredInputArr[i]);
					}
					else if (options.debug && requiredInputArr[i].getAttribute('error-message-holder') && !requiredInputArr[i].getAttribute('error-message')) {
						console.log('%c Warning: error-message attribute missing on selectbox id:' + requiredInputArr[i].id ,'background: #ff0; color: 000');
					}
					else if (options.debug && requiredInputArr[i].getAttribute('error-message') && !requiredInputArr[i].getAttribute('error-message-holder')) {
						console.log('%c Warning: error-message-holder attribute missing on selectbox id:' + requiredInputArr[i].id,'background: #ff0; color: 000');
					}
					else if (options.debug) {
						console.log('%c Message: we have a selectbox - but we are skipping it - assuming the selectbox was configured correctly and (in)validated','background: #222; color: #bada55');
					}
				}
				else if (requiredInputArr[i].type === 'text')
				{
					if (requiredInputArr[i].getAttribute('error-message-holder') && requiredInputArr[i].getAttribute('error-message')) {
						if (options.debug)
						{
							console.log('%c Success: Call textbox validator','background: #0f0; color: #000');
						}
						textAndSelectBoxCheck(requiredInputArr[i]);
					}
					else if (options.debug && requiredInputArr[i].getAttribute('error-message-holder') && !requiredInputArr[i].getAttribute('error-message')) {
						console.log('%c Warning: error-message attribute missing on text id:' + requiredInputArr[i].id ,'background: #ff0; color: 000');
					}
					else if (options.debug && requiredInputArr[i].getAttribute('error-message') && !requiredInputArr[i].getAttribute('error-message-holder')) {
						console.log('%c Warning: error-message-holder attribute missing on textbox id:' + requiredInputArr[i].id,'background: #ff0; color: 000');
					}
					else if (options.debug) {
						console.log('%c Message: we have a textbox - but we are skipping it - assuming the textbox was configured correctly and (in)validated','background: #222; color: #bada55');
					}
				}
				else if (requiredInputArr[i].type === 'textarea')
				{
					if (requiredInputArr[i].getAttribute('error-message-holder') && requiredInputArr[i].getAttribute('error-message')) {
						if (options.debug)
						{
							console.log('%c Success: Call textarea validator','background: #0f0; color: #000');
						}
						textAndSelectBoxCheck(requiredInputArr[i]);
					}
					else if (options.debug && requiredInputArr[i].getAttribute('error-message-holder') && !requiredInputArr[i].getAttribute('error-message')) {
						console.log('%c Warning: error-message attribute missing on textarea id:' + requiredInputArr[i].id ,'background: #ff0; color: 000');
					}
					else if (options.debug && requiredInputArr[i].getAttribute('error-message') && !requiredInputArr[i].getAttribute('error-message-holder')) {
						console.log('%c Warning: error-message-holder attribute missing on textarea id:' + requiredInputArr[i].id,'background: #ff0; color: 000');
					}
					else if (options.debug) {
						console.log('%c Message: we have a textarea - but we are skipping it - assuming the textarea was configured correctly and (in)validated','background: #222; color: #bada55');
					}
				}
        console.log('Final errorCount: ' + errorCount);
        if (errorCount === 0) {
        	console.log('%c Success: Submit the form','background: #0f0; color: #000');
        }
			}

			function groupNumberFieldCheck(arr) {
				var i = 0;
				var groupErrorCount = 0;
    		var errorMessageArr = [];
				var fieldValue = null, errorMessageHolder = null, listElement = null, listItems = null, textNode = null, pattern = null, patternTest = null, min = null, max = null;
				errorMessageHolder = document.getElementById(arr[0].getAttribute('error-message-holder'));
				$(errorMessageHolder).children('ul').remove();
    		$(errorMessageHolder).removeClass('hide');

    		var outsideMinMaxMsg = null;

				for (i=0;i<arr.length;i++)
				{
					//console.dir(arr[i]);
					fieldValue = arr[i].value;
					if (fieldValue !== '') {
						fieldValue = Number(fieldValue);
					}
					min = arr[i].getAttribute('min');
					max = arr[i].getAttribute('max');
					
					outsideMinMaxMsg = arr[i].getAttribute('outside-scope-error-message');

          if (fieldValue === '') {
          	if (options.debug)
          	{
          		console.log('Field id ' + arr[i].id + ' is empty');
          	}
            errorMessageArr.push(arr[i].getAttribute('error-message'));
            $(arr[i]).addClass('error');
	        	errorCount++;  
	        	groupErrorCount++;          
          }          
          else if (!isNaN(fieldValue) && ( min !== null && max !== null) && (fieldValue !== '') && (fieldValue < min || fieldValue > max)) //is a number but falls outside min and max scope
         	{ 
         		if (options.debug)
          	{
          		console.log('Field id ' + arr[i].id + ' is outside of range');
          	}
		       	if (!outsideMinMaxMsg) {
		      		outsideMinMaxMsg = 'Enter a number between ' + min + ' and ' + max + '.';
		        }
		        errorMessageArr.push(outsideMinMaxMsg);
		        $(arr[i]).addClass('error');
		        errorCount++;
		        groupErrorCount++;
          }
          else {
          	if (options.debug)
          	{
          		console.log('Field id ' + arr[i].id + ' passes.');
          	}
            $(arr[i]).removeClass('error');
          	errorCount--;
          	if (groupErrorCount > 0)
          	{
          		groupErrorCount--;	
          	}
          	
          }
				}

				if (errorMessageArr.length > 0) {
          listElement = document.createElement('ul');
          for (i=0;i<errorMessageArr.length;i++)
          {
            listItem = document.createElement('li');
            textNode = document.createTextNode(errorMessageArr[i]);
            listElement.appendChild(listItem);
            listItem.appendChild(textNode);
          }
          errorMessageHolder.appendChild(listElement);
        }
        else 
        {
          $(errorMessageHolder).children('ul').remove();
          $(errorMessageHolder).addClass('hide');
        }

        console.log('groupErrorCount: ' + groupErrorCount);

        if (groupErrorCount > 0) {
        	$('input[group-name="'+arr[0].getAttribute("group-name")+'"].error').on('blur',function(){
        		groupNumberFieldCheck($('input[group-name="'+arr[0].getAttribute("group-name")+'"].error'));
        	});
        }
        else {
        	$('input[group-name="'+arr[0].getAttribute("group-name")+'"]').off('blur');
        }

			};



			function numberFieldCheck(el) {
        var i = 0;
        var numberBox = el;
        var errorMessageHolder = document.getElementById(el.getAttribute('error-message-holder'));
        var errorMsg = '';
        var min = el.getAttribute('min');
        var max = el.getAttribute('max');
        var fieldValue = numberBox.value;
        
        var outsideMinMaxMsg = document.getElementById(el.getAttribute('outside-scope-error-message'));
        var notNumericMsg = document.getElementById(el.getAttribute('not-numeric-error-message'));

        if (!notNumericMsg)
        {
        	notNumericMsg = 'Enter a number into field';
        }

        // clear message holder of last message;
        $(errorMessageHolder).children('p').not(':first').remove();

        if (fieldValue === '')
        {
          errorMsg = numberBox.getAttribute('error-message');
          handleErrorInsert(el,errorMessageHolder,errorMsg);
          errorCount++;
          // Add listener for blur to recheck
          $(numberBox).one('blur',function() {
            numberFieldCheck(el);
            console.log('Event lister added ONCE for id ' + el.id);
          });
        }
        else if (fieldValue !== '' && isNaN(fieldValue))
        {
        	errorMsg = notNumericMsg;
        	handleErrorInsert(el,errorMessageHolder,errorMsg); 
        	errorCount++;
          // Add listener for blur to recheck
          $(numberBox).one('blur',function() {
            numberFieldCheck(el);
            console.log('Event lister added ONCE for id ' + el.id);
          });
        }
        else if ((!isNaN(fieldValue) && min !== null && max !== null) && (fieldValue !== '') && (fieldValue < min || fieldValue > max)) //is a number but falls outside min and max scope
        {
        	if (!outsideMinMaxMsg) {
        		outsideMinMaxMsg = 'Enter a number between ' + min + ' and ' + max + '.';
        	}
        	errorMsg = outsideMinMaxMsg;
        	handleErrorInsert(el,errorMessageHolder,errorMsg); 
        	errorCount++;
          // Add listener for blur to recheck
          $(numberBox).one('blur',function() {
            numberFieldCheck(el);            
            console.log('Event lister added ONCE for id ' + el.id);
          });
        }
        else
        {
          $(errorMessageHolder).addClass('hide');
          if ($(numberBox).hasClass('error'))
          {
          	$(numberBox).removeClass('error');          
          	errorCount--;
          }
          // Remove listener for blur
          $(numberBox).off('blur',function() {
            textAndSelectBoxCheck(el);
            console.log('Event lister removed for id ' + el.id);
          });
        }
        console.log('errorCount: ' + errorCount);
      }

			function textAndSelectBoxCheck(el) {
        var i = 0;
        var textBox = el;
        var errorMessageHolder = document.getElementById(el.getAttribute('error-message-holder'));
        var errorMsg = '', paragraphElement = null, textNode = null;
        

        $(errorMessageHolder).children('p').not(':first').remove();

        if (textBox.value === '')
        {
          errorMsg = textBox.getAttribute('error-message');

        	handleErrorInsert(el,errorMessageHolder,errorMsg); 
          errorCount++;
          // Add listener for blur to recheck
          $(textBox).one('blur',function() {
            textAndSelectBoxCheck(el);
            console.log('Event lister added ONCE for id ' + el.id);
          });
        }
        else
        {
          $(errorMessageHolder).addClass('hide');
          if ($(textBox).hasClass('error'))
          {
          	$(textBox).removeClass('error');          
          	errorCount--;
          }
          // Remove listener for blur
          $(textBox).off('blur',function() {
            textAndSelectBoxCheck(el);
            console.log('Event lister removed for id ' + el.id);
          });
        }
        console.log('errorCount: ' + errorCount);
      }
			
			// radio button and checkbox validator function
			function radioButtonCheckboxCheck(el) {
				var i = 0;
				var groupName = el.getAttribute('name');
				if (!groupName)
				{
					console.log('Warning: name attribute missing')
				}
				var checkedRadioBtns = $('input[name="'+groupName+'"]:checked');
	      var radioBtns = $('input[name="'+groupName+'"]');
	      var errorMessageHolder = document.getElementById(el.getAttribute('error-message-holder'));
	      var errorMsg = '', paragraphElement = null, textNode = null;      

	      $(errorMessageHolder).children('p').not(':first').remove();

	      if (checkedRadioBtns.length === 0) {
	      	errorMsg = el.getAttribute('error-message');	
	      	paragraphElement = document.createElement('p');
	        textNode = document.createTextNode(errorMsg);
	        paragraphElement.appendChild(textNode);
	        errorMessageHolder.appendChild(paragraphElement);
	        $(errorMessageHolder).removeClass('hide');
	        errorCount++;
	        $('input[name="'+groupName+'"]').one('change',function(){
	          radioButtonCheckboxCheck(el);
            console.log('Event lister added ONCE for id ' + el.id);
	        });
	        for (i=0;i<radioBtns.length;i++)
	        {
	          $(radioBtns[i]).addClass('error');
	        }
	      }
	      else 
	      {
	        $('input[name="'+groupName+'"]').off('change',function(){
	          radioButtonCheckboxCheck(el);
            console.log('Event lister removed for id ' + el.id);
	        });
	        
	        $(errorMessageHolder).addClass('hide');
	        if ($(el).hasClass('error'))
          {
	        	errorCount--;
	        }
	        for (i=0;i<radioBtns.length;i++)
	        {
	          $(radioBtns[i]).removeClass('error');
	        }
	      }
        console.log('errorCount: ' + errorCount);
	    }

	    function handleErrorInsert(el,errHolder,eMsg) {
	    	var paragraphElement = document.createElement('p'), textNode = document.createTextNode(eMsg);
	    	paragraphElement.appendChild(textNode);
        errHolder.appendChild(paragraphElement);
        $(errHolder).removeClass('hide');          
        $(el).addClass('error');
	    }
		});

	}
})(jQuery);