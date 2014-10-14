//tested on javascriptlint.com on 14 Jul 2014

//photo_load_delay is stored in milli seconds in localStorage
/*
function onRemoveOfflineData() {
    console.log('Delete all Customer data...');
    delete_offline_customer_data ();
}
*/
$.mobile.document.on("pagecreate", "#settings_page", function () {

    $( "#settings_page .centron-alert" ).popup({
        transition: "fade",
        afteropen: function( event, ui ) {
            setTimeout(function() {
                $( "#settings_page .centron-alert" ).popup( 'close' );
            }, 2000);
        }
    });

    $('#settings_page .backBtn').click(function () {
        console.log('Saving user preferences to local db');

        var load_photo_contact = $("#load_photo_switch option:selected").val();
        load_photo_contact = ('on' == load_photo_contact) ? 1 : 0;
        console.log('load_photo_contact: ' + load_photo_contact);

        var photo_load_delay = parseFloat($('#photo_load_delay').html());

        photo_load_delay = 1000 * photo_load_delay;
        console.log('photo_load_delay: ' + photo_load_delay);

        window.localStorage.setItem("load_photo_contact", load_photo_contact);
        window.localStorage.setItem("photo_load_delay", photo_load_delay);
    });

    $('#photo_load_delay_plus').on("touchstart", function (ev) {
        var photo_load_delay = parseFloat($('#photo_load_delay').html());
        photo_load_delay += 0.5;

        photo_load_delay = photo_load_delay.toFixed(1);
        $('#photo_load_delay').html(photo_load_delay);
    });

    $('#photo_load_delay_minus').on("touchstart", function (ev) {
        var photo_load_delay = parseFloat($('#photo_load_delay').html());
        photo_load_delay -= 0.5;
        if (photo_load_delay - 0.5 < 0.000001) {
            photo_load_delay = 0.5;
        }
        photo_load_delay = photo_load_delay.toFixed(1);
        $('#photo_load_delay').html(photo_load_delay);
    });

    $('#delete_offline_data').on("touchstart", function (ev) {
        if(!$('.delete_container').hasClass('disabled')) {
            console.log('Delete all Customer data...');
            $('#popupDeleteOfflineData').popup( "open" );
        }
    });
                     
    $('#settings_page .remove_offline_no').click(function(){
        console.log('No! Do not remove offline data!');
    });

    $('#settings_page .remove_offline_yes').click(function(){
        console.log('Yes! Remove offline data!');
        //onRemoveOfflineData();
        delete_offline_customer_data();
    });

});



$(document).on('pageshow', '#settings_page', function (event) {
    console.log('get_user_preference...');
    var load_photo_contact = window.localStorage.getItem('load_photo_contact');
    if(load_photo_contact && parseInt(load_photo_contact, 10)) {
        $( "#load_photo_switch" ).val('on').change();
    }
    else {
        $( "#load_photo_switch" ).val('off').change();
    }

    var photo_load_delay = window.localStorage.getItem('photo_load_delay');

    photo_load_delay = ((photo_load_delay)/1000).toFixed(1);
    $('#photo_load_delay').html(photo_load_delay);
               
    $('#delete_offline_data').html(_('Delete'));
    $('#delete_offline_data').button( "refresh" );
               
    var offline_mode = window.localStorage.getItem('offline_mode');
    if('off' === offline_mode) {
        $('.delete_container').removeClass('disabled');
    } else {
        $('.delete_container').addClass('disabled');
    }
               
    $('.load_photo_switch_container .ui-slider-label-a').text(_('Off'));
    $('.load_photo_switch_container .ui-slider-label-b').text(_('On'));
    $('#load_photo_switch').slider("refresh");

    $('#popupDeleteOfflineData').on('popupbeforeposition', function( event, ui ) {
        console.log('beforeposition on popup');
        $('#popupDeleteOfflineData h1').html(_('Confirm Delete'));
        $('#popupDeleteOfflineData h3').html(_('Offline data’s really delete?'));
        $('#popupDeleteOfflineData .remove_offline_no .ui-btn-text').html(_('No'));
        $('#popupDeleteOfflineData .remove_offline_yes .ui-btn-text').html(_('Yes'));
    });
});

function populate_default_preference() {
    console.log('populate preference...');
    var devicePlatform = device.platform;
    console.log('Platform: ' + devicePlatform);

    if('iOS' === devicePlatform) {
        //Volker, 15 May 2014 05:26 pm
        if(window.localStorage.getItem('application_id') === null){
            window.localStorage.setItem('application_id', '78C00FD9-AE90-483F-A4C4-CD75E21B1598');
        }
    } else if('Android' === devicePlatform) {
        //Volker, 15 May 2014 05:36 pm
        if(window.localStorage.getItem('application_id') === null){
            window.localStorage.setItem('application_id', '68C63D58-F8B5-49F6-8355-6E86EEF797F2');
        }
    }

    if(window.localStorage.getItem('crm_record_limit') === null){
        window.localStorage.setItem('crm_record_limit', 10);
    }
    if(window.localStorage.getItem('customer_record_limit') === null){
        window.localStorage.setItem('customer_record_limit', 10);
    }
    if(window.localStorage.getItem('helpdesk_record_limit') === null){
        window.localStorage.setItem('helpdesk_record_limit', 10);
    }
    if(window.localStorage.getItem('load_photo_contact') === null){
        window.localStorage.setItem('load_photo_contact', 1);
    }
    if(window.localStorage.getItem('photo_load_delay') === null){
        window.localStorage.setItem('photo_load_delay', 1000);
    }
}
