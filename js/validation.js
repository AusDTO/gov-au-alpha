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
						numberFieldCheck(requiredInputArr[i]);
					}
				}
				else if (requiredInputArr[i].type === 'radio')
				{					
					if (requiredInputArr[i].getAttribute('error-message-holder') && requiredInputArr[i].getAttribute('error-message')) {						
						radioButtonCheckboxCheck(requiredInputArr[i]);
					}					
				}
				else if (requiredInputArr[i].type === 'checkbox')
				{
					if (requiredInputArr[i].getAttribute('error-message-holder') && requiredInputArr[i].getAttribute('error-message')) {
						radioButtonCheckboxCheck(requiredInputArr[i]);
					}
				}
				else if (requiredInputArr[i].nodeName === 'SELECT')
				{
					if (requiredInputArr[i].getAttribute('error-message-holder') && requiredInputArr[i].getAttribute('error-message')) {
						textAndSelectBoxCheck(requiredInputArr[i]);
					}
				}
				else if (requiredInputArr[i].type === 'text')
				{
					if (requiredInputArr[i].getAttribute('error-message-holder') && requiredInputArr[i].getAttribute('error-message')) {
						textAndSelectBoxCheck(requiredInputArr[i]);
					}
				}
				else if (requiredInputArr[i].type === 'textarea')
				{
					if (requiredInputArr[i].getAttribute('error-message-holder') && requiredInputArr[i].getAttribute('error-message')) {						
						textAndSelectBoxCheck(requiredInputArr[i]);
					}
				}
			}


      

			function groupNumberFieldCheck(arr) {
				if (arr.length > 0)
				{
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
	            errorMessageArr.push(arr[i].getAttribute('error-message'));
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
	          else {
	            $(arr[i]).removeClass('error');
	            if (errorCount > 0)
	            {
	          		errorCount--;
	          	}
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

	        if (groupErrorCount > 0) {
	        	$('input[group-name="'+arr[0].getAttribute("group-name")+'"].error').on('blur',function(){
	        		groupNumberFieldCheck($('input[group-name="'+arr[0].getAttribute("group-name")+'"].error'));
	        		submitForm();
	        	});
	        }
	        else {
	        	$('input[group-name="'+arr[0].getAttribute("group-name")+'"]').off('blur');
	        }
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
            submitForm();
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
            submitForm();
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
            submitForm();
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
            submitForm();
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
          $(textBox).off('blur');
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
	          submitForm();
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

	    function submitForm() {
	    	console.log('Input error count: ' + $('input.error, textarea.error, select.error').length)
	    	if ($('input.error, textarea.error, select.error').length === 0)
	      {
	      	console.log('no inputs with errors - submit the form');
	      	console.dir($form);
	      	$form.off('submit');
	      	$form.submit();
	      }
	    }

	    




		});

	}
})(jQuery);