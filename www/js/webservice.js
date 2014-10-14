//tested on javascriptlint.com on 14 Jul 2014

var selected_id;
var selectedValueOfURLAddress;
var isEditRequired =false;
/*
function onDeleteWebService() {
    delete_web_service_data();
}
*/
function delete_web_service_data() {
    if(selected_id) {
        console.log('ID to be deleted: '+selected_id);
        db.transaction(deletequeryDB, deleteerrorDB);
    }
    else {
        $( "#webservice_page .centron-alert" ).find('p').html(_('Select entry, please.')).end().popup('open');
    }
}

function webserviceBackBtnClick(){
    selected_id = null;

    db.transaction(getallServiceData, errorCB);
    $.mobile.changePage( '#login_page', { transition: "flip", changeHash: false });
}

function webserviceCloseBtnClick(){
    selected_id = null;

    db.transaction(getallServiceData, errorCB);
    $.mobile.changePage( '#home_page', { transition: "flip", changeHash: false });
}

function editData() {
    if(selected_id) {
        db.transaction(editqueryDB, errorCB);
    }
    else {
        $( "#webservice_page .centron-alert" ).find('p').html(_('Select entry, please.')).end().popup('open');
    }
}

$.mobile.document.on("pagecreate", "#webservice_page", function () {
    $( "#webservice_page .centron-alert" ).popup({
        transition: "fade",
        afteropen: function( event, ui ) {
            setTimeout(function() {
                $( "#webservice_page .centron-alert" ).popup( 'close' );
            }, 2000);
        }
    });
                     
    $('#popupDeleteWSDialog').on('popupbeforeposition', function( event, ui ) {

        $('#popupDeleteWSDialog h1').html(_('Delete Web Service?'));
        $('#popupDeleteWSDialog h3').html(_('Please confirm!'));
        $('#popupDeleteWSDialog .remove_web_service_no .ui-btn-text').html(_('No'));
        $('#popupDeleteWSDialog .remove_web_service_yes .ui-btn-text').html(_('Yes'));
    });

    $(document).on('click', '.addButton_h', function(event) {

        $('.bottomArrow').css('margin', '0 0 0 16px');
        $('.webserviceName_h').val('');
        $('.addressWebservices_h').val('');
        $('.optionBox').show();

        $('#shadow').show();
        $('#nameWebservices').focus();
        isEditRequired=false;
    });

    $(document).on('click', '.editButton_h', function(event) {
        event.preventDefault();

        $('.bottomArrow').css('margin', '0 0 0 106px');
        isEditRequired=true;
        editData();
    });

    $(document).on('click', '.deleteButton_h', function(event) {
        event.preventDefault();

        if(selected_id) {
            $('#popupDeleteWSDialog').popup( "open" );
        }
        else {
            $( "#webservice_page .centron-alert" ).find('p').html(_('Select entry, please.')).end().popup('open');
        }
    });

    $(document).on('click', '.remove_web_service_no', function(){
        console.log('No! Do not remove web service!');
    });

    $(document).on('click', '.remove_web_service_yes', function(){
        //onDeleteWebService();
        delete_web_service_data();
    });

    $(document).on('click', '.web-service-demo', function(event) {
        $('.bottomArrow').css('margin', '0 0 0 300px');

        var demo_server_name = 'Apple Demo';
        $('.webserviceName_h').val(demo_server_name);
        
        var demo_server_url = 'https://iSuite.c-entron.de/CentronServiceAppleDemo/REST';
        $('.addressWebservices_h').val(demo_server_url);

        $('.optionBox').show();
        $('#shadow').show();
        isEditRequired=false;
    });

    $(document).on('touchstart', '.listRow', function(event) {
        var new_id=this.id;
        if(selected_id != new_id){
            $(".contentBoxBackground").removeClass('contentBoxBackground');

            $(this).addClass('contentBoxBackground');
            
            selected_id = new_id;
            getSelectedDataValue();
        }
        else {
            selected_id=null;
            $(".contentBoxBackground").removeClass('contentBoxBackground');
        }
    });

    $(document).on('touchstart', '.okButton_h', function(event) {
        event.preventDefault();

        if( !($('.webserviceName_h').val().trim()) ){
            $( "#webservice_page .centron-alert" ).find('p').html(_('Enter webservice name, please.')).end().popup('open');
            return;
        }
                   
        var uri = $('.addressWebservices_h').val();
        console.log('Proposed web service: ' + uri);
        var last_part = uri.substr(uri.lastIndexOf('/') + 1);
        console.log('Last part: ' + last_part);

        if( 'SOAP' === last_part ) {
            uri = uri.replace(last_part, 'REST');
            $('.addressWebservices_h').val(uri);
        }
        console.log('Proposed web service: ' + uri);

        if(!uri){
            $( "#webservice_page .centron-alert" ).find('p').html(_('Enter webservice address, please.')).end().popup('open');
            return;
        }
        else if(!validateURI(uri)){
            $( "#webservice_page .centron-alert" ).find('p').html(_('Invalid uri!')).end().popup('open');
            return;
        }
        $('.optionBox').hide();
        $('#shadow').hide();

        if(!isEditRequired){
            //New Data server
            addWebServer();
            window.localStorage.setItem("hasDataInTable","true");
        }
        else {
            //Update Data server
            updateWebServer();
            isEditRequired=false;
        }
        document.activeElement.blur();
        console.log('uri: ' + uri);
        if( uri === 'https://iSuite.c-entron.de/CentronServiceAppleDemo/REST') {

            var credentials = {
                service_url: uri,
                userName: 'Demo',
                password: 'Demo12345!'
            };
            saveUserCredentials(credentials);
        }

        CheckConnection(uri).done(function(response){
            if( response && response.Result && response.Result[0] ){
                $( "#webservice_page .centron-alert" ).find('p').html(_('Connection available.')).end().popup('open');
            }
        }).fail(function (jqXHR, textStatus, errorThrown ) {
            $.mobile.loading("hide");
            $( "#webservice_page .centron-alert-error" ).find('p').html(_('No connection possible. Check your connection data, please.')).end().popup('open');
        });
    });

    $(document).on('touchstart', '.cancelButton_h', function(event) {
        $('#shadow').hide();
        $('.optionBox').hide();
        document.activeElement.blur();
        $('.webserviceName_h').val('');
        $('.addressWebservices_h').val('');

        $('.connectUsernameWebserviceName_h').val('');
        $('.connectPasswordWebservices_h').val('');
    });

    $('.addService').on('click',function(e){

        $('.optionBox').show();
        $('#shadow').show();
    });

    $('#shadow').on('click',function(){

        $('.optionBox').hide();
        $('#shadow').hide();
    });

});

$.mobile.document.on("pagebeforeshow", "#webservice_page", function () {
    $('.optionBox').hide();
    $('#shadow').hide();
});
