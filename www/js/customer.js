//tested on javascriptlint.com on 12 Aug 2014

var create_customer_page = function(response){

    var customer_i3d = window.sessionStorage.getItem('CustomerSelected');
    console.log('CustomerI3D: ' + customer_i3d);
    var classes;

    var i, result, resultHtml='';
    var address, street = '', zip = '', city = '', country = '';
    console.log('No of customers: '+response.Result.length);

    if(response.Result.length) {
        $('#customer_page .no-result').remove();
        $.each(response.Result, function(i, result){
            if(result && result.I3D && result.Name) {
                if (customer_i3d && customer_i3d == result.I3D) {
                    classes = 'selected';
                }
                else {
                    classes = '';
                }
                resultHtml += '<li class="customerName" id="'+i+'" data-customer_i3d="'+result.I3D+'">';
                resultHtml += '<h3 class="'+classes+'">'+result.Name+' '+result.I3D+'<span class="fav_customer_symbol icon-star"></span></h3>';

                address = result.DefaultAddress;
                if((address !== null && typeof address === 'object') && !isEmpty(address)){
                    street = address.Street;
                    if(!street) {
                        street = '';
                    }
                    zip = address.Zip;
                    if(!zip) {
                        zip = '';
                    }
                    city = address.City;
                    if(!city) {
                        city = '';
                    }
                    country = address.Country ? address.Country.Name : '';
                    resultHtml += '<p>'+street+' '+zip+' '+city+' '+country+'</p>';
                }
                resultHtml += '</li>';
            }
        });

        var list = $('#customer_list'), lis;
        list.append(resultHtml);

        // read all list items (without list-dividers) into an array
        lis = $( '#customer_list li' ).not( '.ui-li-divider' ).get();

        // sort the list items in the array
        lis.sort( function( a, b ) { 
            var valA = $( a ).text().toUpperCase(),
            valB = $( b ).text().toUpperCase();

            if ( valA < valB ) { return -1; }
            if ( valA > valB ) { return 1; }
            return 0;
        });

        // clear the listview before rebuild
        list.empty();

        // adding the ordered items to the listview
        $.each( lis, function( i, li ) {
            list.append( li );
        });

        db.transaction(get_fav_customers, errorCB);
        list.listview('refresh');
        $('#pull_up_customer').show();
        customer_scroll.refresh();

    } else {
        $('.no-result').remove();
        $('#customer_wrapper').before('<div class="no-result">'+_('No Customer found.')+'</div>');
        $('#pull_up_customer').hide();
    }
};

$.mobile.document.on( "pagecreate", "#customer_page", function() {

    $('#toHome').click(function(){
        $('.inputSearch_h').val('');
        $('#customer_list').html('');
        $.mobile.changePage('#home_page', {
            transition: "flip",
            changeHash: false
        });
    });

    $( "#customer_page .centron-alert" ).popup({
        transition: "fade",
        afteropen: function( event, ui ) {
            setTimeout(function() {
                $( "#customer_page .centron-alert" ).popup( 'close' );
            }, 2000);
        }
    });

    $("#customer_list").on('click','li.customerName',function(){
        $('.ui-li-heading').removeClass('selected');
        $(this).find('.ui-li-heading').addClass('selected');
        var CustomerI3D = $(this).data('customer_i3d');
        console.log('Selected Customer: '+CustomerI3D);
        window.sessionStorage.setItem('CustomerI3D', CustomerI3D);

        window.setTimeout(function(){
            $.mobile.changePage('#customer_details_page',{transition: 'flip', changeHash: false});
        }, 1000);
    });

    //use soft keyboard enter/return/go
    $("#customer_page").on("keypress", "input[type=text]", function(e) {
        //check for enter key 
        if(e.which === 13) {
            $(this).blur();
            $(".icon-search_h").click();
        }
    });

    $(".icon-search_h").click(function(){
      
        var searchText = $(".inputSearch_h").val().trim();
        if(searchText) {
            searchText = strip_tags(searchText);
        }
        if(searchText.length>0){
            window.sessionStorage.setItem("customer_current_page", 1);

            var customer_record_limit = window.localStorage.getItem('customer_record_limit');
            var service_url = window.localStorage.getItem('SERVICE_URL');
            var login_ticket = window.localStorage.getItem('Ticket');
            var customer_param = {
                Ticket: login_ticket,
                Data: {
                    EntriesPerPage: customer_record_limit,
                    Page: 1,
                    SearchText: searchText
                }
            };
            service_request('SearchCustomerBySearchTextWithPaging', customer_param).done(function(response){

                if(0 === response.Status) {
                    $('#customer_list').html('');
                    create_customer_page(response);
                }
                else {
                    console.log('SearchCustomerBySearchTextWithPaging Status: '+response.Status);
                    $( "#customer_page .centron-alert" ).find('p').html(response.Message).end().popup('open');
                }
            });
        }
        else {
            $( "#customer_page .centron-alert" ).find('p').html(_('Enter searchtext, please.')).end().popup('open');
        }
    });
});

$.mobile.document.on( "pagebeforeshow", "#customer_page", function() {
    textAreaAttributes();
    if(!window.sessionStorage.getItem('session_active')) {
        load_static_parameters();
    }
    $('#pull_up_customer').hide();
    $('.no-result').remove();                 
    $('#customer_list').html('');
    $('.inputSearch_h').val('');
});
