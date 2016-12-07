// go to product-main.ejs under main n add the ids to text n div row 

// logic is that everytime the user type in something the  ajax will immediately notify the server whc pointing at the api url itself whc is router.post /search
// to search  a value that u type in ,if found it wil immediately delete the the html products in page n then append all the found objects 

// this iis a jquery code 
$(function(){

	// this identifies website in the create token call below , we copied this key from https://stripe.com/docs/custom-form just above the step 2 then just replace the ket with publishable key 
	 Stripe.setPublishableKey('pk_test_5cSOI2dfLdW1Pp53zSi6hdBV'); // this is the publishable key we got from the stripe.com-dashboard-account setting-API - whc is for the client side // we need to paste the script from step 1 in javascriptonly.ejs so that we can use it 

	// copy this code from http://spin.js.org/ and copy the code in usage and paste it 

 var opts = {
lines: 13 // The number of lines to draw
, length: 28 // The length of each line
, width: 14 // The line thickness
, radius: 42 // The radius of the inner circle
, scale: 1 // Scales overall size of the spinner
, corners: 1 // Corner roundness (0..1)
, color: '#000' // #rgb or #rrggbb or array of colors
, opacity: 0.25 // Opacity of the lines
, rotate: 0 // The rotation offset
, direction: 1 // 1: clockwise, -1: counterclockwise
, speed: 1 // Rounds per second
, trail: 60 // Afterglow percentage
, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
, zIndex: 2e9 // The z-index (defaults to 2000000000)
, className: 'spinner' // The CSS class to assign to the spinner
, top: '50%' // Top position relative to parent
, left: '50%' // Left position relative to parent
, shadow: false // Whether to render a shadow
, hwaccel: false // Whether to use hardware acceleration
, position: 'absolute' // Element positioning
}




//need to taret the id whc is search 
	$('#search').keyup(function() { // keyup is a jquery function where it listens to what u r typing 
		// so whever u r typing on a targetid in the input text filed which is search then it would immediately run this function n do some ajax call 


		var search_term = $(this).val();

		$.ajax({  // whenever the user searches it runs ajax function whc has mehtod post n sends post request to the server to search route..
			// the data is search_term whc is variable whic is input text field 
			method: 'POST',
			url: '/api/search', // it will go to this url
			data: {
				search_term // what u r searching 
			},

			dataType: 'json', // json format data , in the reach route we are returning data whc is in json format so we took same here 
			success: function(json) { // validae if its success , return length 

				var data = json.hits.hits.map(function(hit){ //.map is a js builtin function to store the value we want to find in a new area 
				return hit;	
				
			});

				$('#searchResults').empty(); // clean up the current html elements coz we need to append new objects
				for (var i=0; i<data.length; i++) { // we loop on the lenthg of  data , sometimes elastic searhces more than 1 data 
					var html= ""; // create a new var called html that stores empty string n we copy html design from product-main .ejs under row n add all the elements to html var


					html+= '<div class="col-md-4">';
					html+= '<a href="/product/' + data[i]._source._id  + ' ">';
					html+= '<div class="thumbnail">';
					html+= '<img src=" ' +  data[i]._source.image  + ' " >';
					html+= '<div class="caption">';
					html+= '<h3>' +  data[i]._source.name  + '</h3>';
					html+= '<p>' +  data[i]._source.category.name  + '</p>';
					html+= '<p>'  +  data[i]._source.price + '</p>';
					html+= '</div></div></a></div>'

					$('#searchResults').append(html); // append the html var to the search resutls so that the data will show up 

				}
			},	
		

		error: function(error) {
			console.log(err);
		}


		});

	});		

	// new functionality to add plus n minus 
	$(document).on('click', '#plus', function(e) { // so when u click on plus button 
		
		e.preventDefault(); // is to actly prevent from the ppage to be refreshed
		console.log("reached here");
		var priceValue = parseFloat($('#priceValue').val()); //we parse value in float n quantity in int form 
		var quantity = parseInt($('#quantity').val());

		priceValue += parseFloat($('#priceHidden').val()); // increment the price value with the original price from the product 
		quantity +=1; // increment the quantity

		$('#quantity').val(quantity); // replace the quantity
		$('#priceValue').val(priceValue.toFixed(2)); // the toatal price value to 2 decimal
		$('#total').html(quantity); // total quantity 

	});

	$(document).on('click', '#minus', function(e) { // so when u click on plus button 
		
		e.preventDefault(); // is to actly prevent from the ppage to be refreshed
		console.log("reached here");
		var priceValue = parseFloat($('#priceValue').val()); //we parse value in float n quantity in int form 
		var quantity = parseInt($('#quantity').val());

		if(quantity==1){
			priceVaule= $('#priceHidden').val();
			quantity=1;
		} else{
			priceValue -= parseFloat($('#priceHidden').val()); // increment the price value with the original price from the product 
			quantity -=1; // increment the quantity
		}
		

		$('#quantity').val(quantity); // replace the quantity
		$('#priceValue').val(priceValue.toFixed(2)); // the toatal price value to 2 decimal
		$('#total').html(quantity); // total quantity 

	});


	// pasted from https://stripe.com/docs/custom-form step 2 code Create a single use token
  	


	// pasted from https://stripe.com/docs/custom-form step 3 code Sending the form to your server
	function stripeResponseHandler(status, response) {
  		// Grab the form:
  		//console.log(" entered in form to capture user card details " );
  		var $form = $('#payment-form'); // we want to set all the form input to the new
  		// variable name form , if u use the id of the form whc is payment form  it will
  		// take all the input values

  		if (response.error) { // Problem! 

    	// Show the errors on the form:
    	$form.find('.payment-errors').text(response.error.message); // if error in details entered it will show error
    	$form.find('.submit').prop('disabled', false); // Re-enable submission button if the details are wrong 

  		} else { // if no error stripe returns with an object which contains unique id last 4 digits of credit card or debit card n type of card like visa , mastercard
  		//response contains id and card , whc contains additional card details 
    	// Get the token ID:
    	//console.log(" Trying to call create token " );
   	 	var token = response.id; // then set that object to a new variable called token 
   	 	//console.log( " The token value " , token);
    	// Insert the token ID into the form so it gets submitted to the server:
    	$form.append($('<input type="hidden" name="stripeToken" />').val(token)); // we want to append the token whc is  hidden value , the name is same as req.body.stripeToken whc is line 222 in man.js, n it will set the value as response.id whc is idcard 

    	var spinner = new Spinner(opts).spin(); //add spinner 
    	//then pass in to a html tag n we gare going to give a name loading to that 
    	$('#loading').append(spinner.el);


    	// Submit the form:
    	$form.get(0).submit(); // lastly we wanna resubmit the form 
  		}
	};


	$('#payment-form').submit(function(event){
  	var $form = $(this);

  	// we run event function on form itself so user clicks on 
		// it do something  Disable the submit button to prevent repeated clicks:
    	$form.find('button').prop('disabled', true); // set this whc is the form itself to new 
    	//var called form n disable the button if user clicks on it so that we can send 1 request 
    	//at 1 time 

    	// Request a token from Stripe:
    	Stripe.card.createToken($form, stripeResponseHandler); // use stipe object to create a token 
    	//by giving it a parameter whc is the form as well as function whc is stripe response handler
    	// to invoke it 

    	// Prevent the form from being submitted:
    	return false; // we wanna return false to prevent the form from sublitting default action 
    	//like antistring anti cart no 
  	});

  	
  	

});





