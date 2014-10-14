//tested on javascriptlint.com on 08 Jul 2014

//disable iOS caching for POST requests
jQuery.ajaxSetup({
    type: 'POST',
    headers: { "cache-control": "no-cache" },
    cache: false
});

//tjrus.com/blog/stop-all-active-ajax-requests
//stackoverflow.com/questions/1802936/stop-all-active-ajax-requests-in-jquery #answer-8841412
jQuery(document).ready(function($){
	$.xhrPool = []; // array of uncompleted requests
	$.xhrPool.abortAll = function() { // our abort function
		$(this).each(function(idx, jqXHR) {
			jqXHR.abort();
		});
		$.xhrPool.length = 0;
	};

	$.ajaxSetup({
		beforeSend: function(jqXHR) { // before jQuery sends the request we push it to our array
			$.xhrPool.push(jqXHR);
		},
		complete: function(jqXHR) { // splice it from the array when a request completes 
			var index = $.xhrPool.indexOf(jqXHR);
			if (index > -1) {
				$.xhrPool.splice(index, 1);
			}
		}
	});

    $( document ).ajaxStart(function() {
        $.mobile.loading("show");
    });
    $( document ).ajaxStop(function() {
        $.mobile.loading("hide");
    });
});
