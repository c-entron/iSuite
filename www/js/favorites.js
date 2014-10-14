//tested on javascriptlint.com on 12 Aug 2014

$.mobile.document.on( "pagecreate", "#favorites_page", function() {
                     
    $( "#favorites_page .centron-alert" ).popup({
        transition: "fade",
        afteropen: function( event, ui ) {
            setTimeout(function() {
                $( "#favorites_page .centron-alert" ).popup( 'close' );
            }, 2000);
        }
    });

    $('#favorites_to_home').click(function(){
        $.mobile.changePage('#home_page', {
            transition: "flip",
            changeHash: false
        });
    });

    $("#favorites_list").on('click','li.customerName',function(){
        $('.ui-li-heading').removeClass('selected selected_fav');
        $(this).find('.ui-li-heading').addClass('selected_fav');
        var CustomerI3D = $(this).data('customer_i3d');
        if(CustomerI3D) {
            console.log('Selected Customer: '+CustomerI3D);
            window.sessionStorage.setItem('CustomerI3D', CustomerI3D);
        }
        else {
            console.log('CustomerI3D not found');
        }
        window.setTimeout(function(){
            console.log('sending page to fav_details_page');
            $.mobile.changePage('#fav_details_page',{transition: 'flip', changeHash: false});
        }, 1000);
    });
});

$.mobile.document.on( "pagebeforeshow", "#favorites_page", function() {
    textAreaAttributes();
    if(!window.sessionStorage.getItem('session_active')) {
        load_static_parameters();
    }

    db.transaction(get_fav_customers, errorCB);

    $('#favorites_list').html('');

});
$.mobile.document.on( "pageshow", "#favorites_page", function() {

    $('#favorites_list').listview();
    $('#favorites_list').listview('refresh');

});
