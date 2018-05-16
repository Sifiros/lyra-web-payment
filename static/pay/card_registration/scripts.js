// takes the form field value and returns true on valid number
function valid_credit_card(value) {
  // accept only digits, dashes or spaces
	if (/[^0-9-\s]+/.test(value)) return false;

	// The Luhn Algorithm. It's so pretty.
	var nCheck = 0, nDigit = 0, bEven = false;
	value = value.replace(/\D/g, "");

	for (var n = value.length - 1; n >= 0; n--) {
		var cDigit = value.charAt(n),
			  nDigit = parseInt(cDigit, 10);

		if (bEven) {
			if ((nDigit *= 2) > 9) nDigit -= 9;
		}

		nCheck += nDigit;
		bEven = !bEven;
	}

	return (nCheck % 10) == 0;
}

/*
* Validates the expiration date
*/
function validExpirationDate( date ) {
	var currentDate = new Date(),
		currentMonth = currentDate.getMonth() + 1,//Zero based index
		currentYear = currentDate.getFullYear(),
		expirationMonth = Number(date.substr(0,2)), //01/
		expirationYear = Number(date.substr(3,date.length)); //starts at 3 after month's slash

	//The expiration date must be atleast one month ahead of current date
	if((expirationYear < currentYear) || (expirationYear == currentYear && expirationMonth <= currentMonth)){
		return false;
	}else{
		return true;
	}
}

/*
* Validates the security code(cvv)
*/
function validateCvv( cvv ) {
	//The cvv must be atleast 3 digits
	return cvv.length > 2;
}

/*
* Retrieve the card issuing bank.
*/
function getCardType( ccNumber ) {
	// Define regular expressions in an object
	var cardPatterns = {
            visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
            mastercard: /^5[1-5][0-9]{14}$/,
            amex: /^3[47][0-9]{13}$/
        };
    for (var cardPattern in cardPatterns){
    	if(cardPatterns[cardPattern].test(ccNumber)) {
    		return cardPattern;
    	}
    }
}

/*
* On Document Ready
*/
(function($) { 
	var number = $("#cc-number"),
		expDate = $("#cc-expiration-date"),
		cvv = $("#cc-cvv"),
		paymentButton = $("#submit-payment"),
		ccInputs = $(".cc-input"),
		timerInterval = 1000,
		timer,
		numberOk = false, expDateOk = false, cvvOk = false;

	//Set the masks
	//Visa - 13-16, Mastercard - 16-19, American Express - 15 So minimum 13 and maximum 19 with options
	number.inputmask("9999 9999 9999 9[999] [999]", { "placeholder": " " });
	expDate.inputmask("mm/yyyy");
	cvv.inputmask("999[9]",{"placeholder":" "});

	//Focus the first field
	number.focus();

	//On keyup we set a timer after which we trigger the finishTyping function
	ccInputs.keyup(function(e){
		if(e.keyCode != '9' && e.keyCode != '16' ){
			//Detect keyup only if it is not tab or shift key
			clearTimeout( timer );
			timer = setTimeout( finishTyping, timerInterval, $(this).attr('id'), $(this).val() );
		}
	});

	//On keydown we stop the current timer
	ccInputs.keydown(function(){
		clearTimeout(timer);
	});

	//On field focus, we add the active class on the corresponding span in the page subtitle
	ccInputs.focus(function(){
		$("#title-" + $(this).attr('id')).addClass('active');
	});

	//On field blur, we remove the active class from all items
	ccInputs.focus(function(){
		$("h2 span").removeClass('active');
	});

	//Maker sure the submit is not allowed to do anything if disabled

	$('#card-form').submit(function(event) {
		
		// var number = this.ccNumber.value;
		cvv_value = this.cvv.value;
		number_value = this.number.value;
		expDate_value = this.expDate.value;

		console.log(cvv_value);
		console.log(number_value);
		console.log(expDate_value);

		console.log(this);
		return false;
	})

	// paymentButton.click(function(event){
	// 	event.preventDefault();

	// 	if($(this).hasClass('disabled')){
	// 		console.log('noop');
			
	// 		return false;
	// 	}else{
	// 		console.log('yupp');
			
		
	// 	}
	// });

	function finishTyping(id, value) {
		var validationValue = value.replace( / /g,'' ), //replace any spaces or special characters
			cardType = getCardType(validationValue),
			cardClass = ( cardType != false )? "cc-"+ cardType: "cc-generic"; //If card found use cc-visa etc. else generic

		switch(id) {
			case "cc-number":
				
				//If the validation length is higher than 0 check with valid_credit_card
				if(validationValue.length > 0) {
					numberOk = valid_credit_card(validationValue) && getCardType( validationValue );
				}

				if(numberOk){
					number.removeClass('error');
					expDate.parent().fadeIn("fast", function(){ expDate.focus(); });
				}else{
					number.addClass('error');
				}

				//Switch the card icons depending on the type
				number.parent().attr("class", cardClass);

				break;
			case "cc-expiration-date":

				//If there are no 'm' or 'y' characters in the string proceed with validation
				if(validationValue.indexOf("m") == -1 && validationValue.indexOf("y") == -1) {
					expDateOk = validExpirationDate(validationValue);
					if(expDateOk){
						expDate.removeClass('error');
						cvv.parent().fadeIn("fast", function(){ cvv.focus(); });
					}else{
						expDate.addClass('error');
					}					
				}
				break;
			case "cc-cvv":
				//validation
				cvvOk = validateCvv(validationValue);
				if(cvvOk){
					cvv.removeClass('error');
					paymentButton.focus();
				}else{
					cvv.addClass('error');
				}	
				break;		
		}

		//Update the payment button status
		if(numberOk && expDateOk && cvvOk ){
			paymentButton.removeClass('disabled');
		}else{
			paymentButton.addClass('disabled');
		}
	}

})(jQuery);