// go to product-main.ejs under main n add the ids to text n div row 

// logic is that everytime the user type in something the  ajax will immediately notify the server whc pointing at the api url itself whc is router.post /search
// to search  a value that u type in ,if found it wil immediately delete the the html products in page n then append all the found objects 

// this iis a jquery code 
$(function(){

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
});
