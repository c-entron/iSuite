//tested on javascriptlint.com on 14 Jul 2014

function createTables(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS "stopwatch" ("id" INTEGER PRIMARY KEY NOT NULL UNIQUE, "start" INTEGER NOT NULL, "stop" INTEGER NOT NULL, "note" TEXT, "internal_note" TEXT)');
    
    tx.executeSql('CREATE TABLE IF NOT EXISTS web_service (id INTEGER PRIMARY KEY AUTOINCREMENT, NameService TEXT unique NOT NULL, AddressServices TEXT NOT NULL)');
    
    tx.executeSql('CREATE TABLE IF NOT EXISTS fav_customer (I3D INTEGER NOT NULL, service_url TEXT NOT NULL, AppUserI3D INTEGER NOT NULL, Name TEXT, Street TEXT, Zip TEXT, City TEXT, Country TEXT, PRIMARY KEY ( I3D, service_url, AppUserI3D))');
    
    tx.executeSql('CREATE TABLE IF NOT EXISTS user_credentials (Uid INTEGER PRIMARY KEY AUTOINCREMENT, user_name TEXT, password TEXT, service_url TEXT NOT NULL, IsSavePassword INTEGER NOT NULL DEFAULT 0, EmployeeI3D INTEGER NOT NULL DEFAULT 0)');
    
    tx.executeSql('CREATE TABLE IF NOT EXISTS customer_helpdesk (I3D INTEGER NOT NULL, Number INTEGER NOT NULL DEFAULT 0, CustomerI3D INTEGER NOT NULL, service_url TEXT NOT NULL, MainCategory INTEGER, Category1 INTEGER, Category2 INTEGER, Status INTEGER, Editor INTEGER, details TEXT, pending INTEGER DEFAULT 0, new_entry INTEGER DEFAULT 0, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY ( I3D, service_url ))');

    tx.executeSql('CREATE TABLE IF NOT EXISTS customer_helpdesk_timer (I3D INTEGER NOT NULL, HelpdeskI3D INTEGER NOT NULL, service_url TEXT NOT NULL, details TEXT, sign TEXT, pending INTEGER DEFAULT 0, new_entry INTEGER DEFAULT 0, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY ( I3D, HelpdeskI3D, service_url ))');

    tx.executeSql('CREATE TABLE IF NOT EXISTS customer_hotline (I3D INTEGER NOT NULL, CustomerI3D INTEGER NOT NULL, service_url TEXT NOT NULL, details TEXT, pending INTEGER DEFAULT 0, new_entry INTEGER DEFAULT 0, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY ( I3D, CustomerI3D, service_url ))');

    tx.executeSql('CREATE TABLE IF NOT EXISTS customer_crm_activity (I3D INTEGER NOT NULL, CustomerI3D INTEGER NOT NULL, service_url TEXT NOT NULL, ReceiverEmployee INTEGER NOT NULL, State INTEGER NOT NULL, details TEXT, pending INTEGER DEFAULT 0, new_entry INTEGER DEFAULT 0, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY ( I3D, service_url ))');
    
    tx.executeSql('CREATE TABLE IF NOT EXISTS customer_contact_image (ContactI3D INTEGER, CustomerI3D INTEGER, service_url TEXT NOT NULL, details TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY ( ContactI3D, service_url ))');
    
    tx.executeSql('CREATE TABLE IF NOT EXISTS customer_contact (I3D INTEGER, CustomerI3D INTEGER, AddressI3D INTEGER, service_url TEXT NOT NULL, details TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY ( I3D, service_url ))');

    tx.executeSql('CREATE TABLE IF NOT EXISTS customer_crm_detail (CustomerI3D INTEGER NOT NULL, YearsCount INTEGER, service_url TEXT NOT NULL, details TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY ( CustomerI3D, service_url, YearsCount ))');

    tx.executeSql('CREATE TABLE IF NOT EXISTS customer_contract (I3D INTEGER NOT NULL, CustomerI3D INTEGER NOT NULL, service_url TEXT NOT NULL, details TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY ( I3D, CustomerI3D, service_url ))');
        
    tx.executeSql('CREATE TABLE IF NOT EXISTS helpdesk_master_data_list (I3D INTEGER NOT NULL, CustomerI3D INTEGER NOT NULL, service_url TEXT NOT NULL, details TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY ( I3D, CustomerI3D, service_url ))');
        
    tx.executeSql('CREATE TABLE IF NOT EXISTS customer_device_link (DeviceHeadI3D INTEGER NOT NULL, CustomerI3D INTEGER NOT NULL, HelpdeskI3D INTEGER NOT NULL, Code TEXT, Caption TEXT, service_url TEXT NOT NULL, details TEXT, pending INTEGER DEFAULT 0, new_entry INTEGER DEFAULT 0, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY ( DeviceHeadI3D, CustomerI3D, HelpdeskI3D, service_url ))');

    tx.executeSql('CREATE TABLE IF NOT EXISTS customer_device_link (DeviceHeadI3D INTEGER NOT NULL, CustomerI3D INTEGER NOT NULL, HelpdeskI3D INTEGER NOT NULL, Code TEXT, Caption TEXT, service_url TEXT NOT NULL, details TEXT, pending INTEGER DEFAULT 0, new_entry INTEGER DEFAULT 0, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY ( DeviceHeadI3D, CustomerI3D, HelpdeskI3D, service_url ))');

    tx.executeSql('CREATE TABLE IF NOT EXISTS helpdesk_category (I3D INTEGER NOT NULL, service_url TEXT NOT NULL, details TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY ( I3D, service_url ))');
        
    tx.executeSql('CREATE TABLE IF NOT EXISTS employee_article (I3D INTEGER NOT NULL, ArticleI3D INTEGER NOT NULL, service_url TEXT NOT NULL, details TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY ( I3D, service_url ))');

    tx.executeSql('CREATE TABLE IF NOT EXISTS employee (I3D INTEGER NOT NULL, service_url TEXT NOT NULL, details TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY ( I3D, service_url ))');

    tx.executeSql('CREATE TABLE IF NOT EXISTS employee_department (I3D INTEGER NOT NULL, service_url TEXT NOT NULL, details TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY ( I3D, service_url ))');

    tx.executeSql('CREATE TABLE IF NOT EXISTS helpdesk_state (I3D INTEGER NOT NULL, service_url TEXT NOT NULL, details TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY ( I3D, service_url ))');

    tx.executeSql('CREATE TABLE IF NOT EXISTS helpdesk_priority (I3D INTEGER NOT NULL, service_url TEXT NOT NULL, details TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY ( I3D, service_url ))');

    tx.executeSql('CREATE TABLE IF NOT EXISTS helpdesk_type (I3D INTEGER NOT NULL, service_url TEXT NOT NULL, details TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY ( I3D, service_url ))');

    tx.executeSql('CREATE TABLE IF NOT EXISTS helpdesk_timer_type (I3D INTEGER NOT NULL, service_url TEXT NOT NULL, details TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY ( I3D, service_url ))');

    tx.executeSql('CREATE TABLE IF NOT EXISTS customer (I3D INTEGER NOT NULL, Name TEXT NOT NULL, service_url TEXT NOT NULL, details TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY ( I3D, service_url ))');

    tx.executeSql('CREATE TABLE IF NOT EXISTS customer_address ( I3D INTEGER, CustomerI3D INTEGER, service_url TEXT NOT NULL, details TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY ( I3D, service_url ))');

    tx.executeSql('CREATE TABLE IF NOT EXISTS app_setting (I3D INTEGER NOT NULL, label TEXT NOT NULL, details TEXT, service_url TEXT NOT NULL, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY ( I3D, service_url ))');
    
    tx.executeSql('CREATE TABLE IF NOT EXISTS app_snapshot (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, service TEXT NOT NULL, service_url TEXT NOT NULL, ticket TEXT NOT NULL, UserI3D INTEGER NOT NULL, CustomerI3D INTEGER, CustomerName TEXT, details TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,  UNIQUE ( service_url, UserI3D ) ON CONFLICT REPLACE)');
}

function delete_offline_customer_data (url) {
    var service_url;
    
    if (delete_offline_customer_data.arguments.length === 0) {
        service_url = window.localStorage.getItem('SERVICE_URL');
    } else {
        service_url = url;
    }

    db.transaction(function(tx){

        tx.executeSql('DELETE FROM customer_contact_image WHERE service_url=?', [service_url]);
        tx.executeSql('DELETE FROM customer_contact WHERE service_url=?', [service_url]);
        tx.executeSql('DELETE FROM customer_address WHERE service_url=?', [service_url]);
        tx.executeSql('DELETE FROM customer_contract WHERE service_url=?', [service_url]);
        tx.executeSql('DELETE FROM customer_crm_detail WHERE service_url=?', [service_url]);
        tx.executeSql('DELETE FROM customer_crm_activity WHERE service_url=?', [service_url]);
        tx.executeSql('DELETE FROM customer_hotline WHERE service_url=?', [service_url]);
        tx.executeSql('DELETE FROM customer_helpdesk_timer WHERE service_url=?', [service_url]);
        tx.executeSql('DELETE FROM customer_device_link WHERE service_url=?', [service_url]);
        tx.executeSql('DELETE FROM customer_helpdesk WHERE service_url=?', [service_url]);
        tx.executeSql('DELETE FROM customer WHERE service_url=?', [service_url]);

        tx.executeSql('DELETE FROM employee_department WHERE service_url=?', [service_url]);
        tx.executeSql('DELETE FROM employee_article WHERE service_url=?', [service_url]);
        tx.executeSql('DELETE FROM employee WHERE service_url=?', [service_url]);

        tx.executeSql('DELETE FROM helpdesk_timer_type WHERE service_url=?', [service_url]);
        tx.executeSql('DELETE FROM helpdesk_category WHERE service_url=?', [service_url]);
        tx.executeSql('DELETE FROM helpdesk_state WHERE service_url=?', [service_url]);
        tx.executeSql('DELETE FROM helpdesk_priority WHERE service_url=?', [service_url]);
        tx.executeSql('DELETE FROM helpdesk_type WHERE service_url=?', [service_url]);
        tx.executeSql('DELETE FROM helpdesk_master_data_list WHERE service_url=?', [service_url]);

        //tx.executeSql('DELETE FROM user_credentials WHERE service_url=?', [service_url]);
        tx.executeSql('DELETE FROM app_setting WHERE service_url=?', [service_url]);

    }, errorCB, function(){
        console.log('Deleted offline data.');
        var current_page_id = $.mobile.activePage.attr("id");
        $( '#' + current_page_id + ' .centron-alert' ).find('p').html(_('Deleted offline data.')).end().popup('open');
    });
}

function save_stopwatch(stopwatch) {
    db.transaction(function(tx){
        save_stopwatchCB(tx, stopwatch);
    }, errorCB);
}
function save_stopwatchCB(tx, stopwatch) {
	var id, start, stop, note, internal_note;
	var i;
	
    id = stopwatch.id;
    start = stopwatch.start;
    stop = stopwatch.stop;
    note = stopwatch.note;
    internal_note = stopwatch.internal_note;

    tx.executeSql('INSERT OR REPLACE INTO stopwatch ("id", "start", "stop", "note", "internal_note") VALUES(?,?,?,?,?)', [id, start, stop, note, internal_note], on_save_stopwatch);
}
function on_save_stopwatch(tx, results){
    if (!results.rowsAffected) {
        console.log('No rows affected!');
        return false;
    }
}
function delete_stopwatch(id){
    db.transaction(function(tx){
        tx.executeSql('DELETE FROM stopwatch WHERE id='+id);
    }, errorCB);
}
function delete_stopwatchCB(tx, id) {
    tx.executeSql('DELETE FROM stopwatch WHERE id='+id);
}
function check_stopwatch_availability() {
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM "stopwatch"', [], check_stopwatch_availabilityCB, errorCB);
    }, errorCB);
}
function check_stopwatch_availabilityCB(tx, results) {
    $('.open-stopwatch-bar, .open-stopwatch').hide();
    var len = results.rows.length;
    console.log('load_all_stopwatchCB: stopwatches found: '+len);
    if(len) {
        $('#helpdesk_timers_page').addClass('stopwatch-available');
    }
    else {
        $('#helpdesk_timers_page').removeClass('stopwatch-available');
    }
    
}
function load_all_stopwatch() {
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM "stopwatch"', [], load_all_stopwatchCB, errorCB);
    }, errorCB);
}
function load_all_stopwatchCB(tx, results) {
    
    var stopwatch, stopwatch_html;
    var len = results.rows.length;
    console.log('load_all_stopwatchCB: stopwatches found: '+len);
    if(len) {
        $('#helpdesk_timers_page').addClass('stopwatch-available');
    }
    else {
        $('#helpdesk_timers_page').removeClass('stopwatch-available');
    }

    var jqm_page_id = $('div[data-role="page"].ui-page-active').attr('id');
    if(len){

        $('#'+jqm_page_id+' .stopwatch').remove();

        for (var i=0; i<len; i++){

            stopwatch_html = '';
            stopwatch = results.rows.item(i);
            
            console.log('start_timestamp: '+stopwatch.start);
            var start_hhmm = moment(stopwatch.start).format('HH:mm');
            
            var stop_timestamp = stopwatch.stop;
            stop_timestamp = parseInt(stop_timestamp, 10);
            console.log('stop_timestamp: '+stop_timestamp);
            var stop_hhmm = '00:00', duration_hhmm, duration_ms;
            var duration_hour, duration_min, duration_sec;
            
            if(stop_timestamp){
                stop_hhmm = moment(stop_timestamp).format('HH:mm');

                duration_ms = stop_timestamp-stopwatch.start;

                duration_hour = moment.duration(duration_ms).hours();
                if (duration_hour<10) {
                    duration_hour = '0' + duration_hour;
                }
                
                duration_min = moment.duration(duration_ms).minutes();
                if (duration_min<10) {
                    duration_min = '0' + duration_min;
                }
                duration_hhmm = duration_hour+':'+duration_min;
            }
            else {
                var current_timestamp = Date.now();
                duration_ms = current_timestamp - stopwatch.start;

                duration_hour = moment.duration(duration_ms).hours();
                if (duration_hour<10) {
                    duration_hour = '0' + duration_hour;
                }

                duration_min = moment.duration(duration_ms).minutes();
                if (duration_min<10) {
                    duration_min = '0' + duration_min;
                }
                
                duration_sec = moment.duration(duration_ms).seconds();
                if (duration_sec<10) {
                    duration_sec = '0' + duration_sec;
                }
                duration_hhmm = duration_hour+':'+duration_min+':'+duration_sec;
                console.log('duration_hhmm: '+duration_hhmm);
            }

            stopwatch_html = '<div class="stopwatch" data-id="'+stopwatch.id+'">';
            stopwatch_html += '<h1 class="stopwatch-separator icon-stopwatch">&nbsp;</h1>';
            stopwatch_html += '<div class="stopwatch-duration"><input readonly value="'+duration_hhmm+'" data-interval_id="false"></div>';
            stopwatch_html += '<div class="stopwatch-action">';

            stopwatch_html += '<a href="#" name="stopwatch-start" data-role="button" data-inline="true">Start</a><label for="stopwatch-start" data-timestamp="'+stopwatch.start+'">'+start_hhmm+'</label>';
            stopwatch_html += '<a href="#" name="stopwatch-stop" data-role="button" data-inline="true">Stop</a><label for="stopwatch-stop" data-timestamp="'+stop_timestamp+'">'+stop_hhmm+'</label>';
                
            stopwatch_html += '</div><!--.stopwatch-button-container-->';
            
            stopwatch_html += '<label for="stopwatch-note" >'+_('Stopwatch Note')+'</label>';
            stopwatch_html += '<textarea autofocus cols="40" rows="4" name="stopwatch-note" maxlength="100">'+stopwatch.note+'</textarea>';
            
            stopwatch_html += '<label for="stopwatch-internal-note" >'+_('Stopwatch Internal Note')+'</label>';
            stopwatch_html += '<textarea cols="40" rows="4" name="stopwatch-internal-note" maxlength="100">'+stopwatch.internal_note+'</textarea>';
                
            stopwatch_html += '<div class="stopwatch-data">';
            stopwatch_html += '<a class="icon-ok" name="stopwatch-transfer" href="#" data-role="none" >Transfer</a>';
            stopwatch_html += '<a class="icon-trash" name="stopwatch-delete" href="#" data-role="none" >Delete</a>';
            stopwatch_html += '</div></div><!--.stopwatch-->';
            
            console.log('Selector: '+'#'+jqm_page_id+' .stopwatch-container');
            console.log('Searching stopwatch container: '+$('#'+jqm_page_id+' .stopwatch-container').length);
            $('#'+jqm_page_id+' .stopwatch-container').append(stopwatch_html);
            textAreaAttributes();
            if(!stop_timestamp){
                
                var running_stopwatches = $('#'+jqm_page_id+' .stopwatch-duration input[data-interval_id!="false"]').length;
                console.log('No of running stopwatches: '+running_stopwatches);
                
                var output_el = $('#'+jqm_page_id+' .stopwatch[data-id="'+stopwatch.id+'"] .stopwatch-duration input');
                console.log('output_el: '+output_el.length+' val: '+output_el.val());
                
                if(running_stopwatches < 3){

                    (function(x, hour, minute, second){
                        hour = parseInt(hour, 10);
                        minute = parseInt(minute, 10);
                        second = parseInt(second, 10);

                        var interval_id = window.setInterval(function(){

                            second += 1;
                            if(second>59){
                                second = 0;
                                minute += 1;
                                if(minute > 59) {
                                    minute = 0;
                                    hour += 1;
                                }
                            }
                            x.val(leadByZero(hour)+':'+leadByZero(minute)+':'+leadByZero(second));
                        }, 1000);
                        x.attr('data-interval_id', interval_id);
                    })(output_el, duration_hour, duration_min, duration_sec);
                }
                else {
                    output_el.val('00:00');
                }
            }
        }
    }
    else {
        console.log('No existing Stopwatch found');
        stopwatch_html = '<div class="stopwatch" data-id="'+Date.now()+'">';
        stopwatch_html += '<h1 class="stopwatch-separator icon-stopwatch">&nbsp;</h1>';
        stopwatch_html += '<div class="stopwatch-duration"><input readonly value="00:00"></div>';
        stopwatch_html += '<div class="stopwatch-action">';

        stopwatch_html += '<a href="#" name="stopwatch-start" data-role="button" data-inline="true">Start</a><label for="stopwatch-start" data-timestamp="0">00:00</label>';
        stopwatch_html += '<a href="#" name="stopwatch-stop" data-role="button" data-inline="true">Stop</a><label for="stopwatch-stop" data-timestamp="0">00:00</label>';
            
        stopwatch_html += '</div><!--.stopwatch-button-container-->';
        
        stopwatch_html += '<label for="stopwatch-note" >'+_('Stopwatch Note')+'</label>';
        stopwatch_html += '<textarea autofocus cols="40" rows="4" name="stopwatch-note" maxlength="100"></textarea>';
        
        stopwatch_html += '<label for="stopwatch-internal-note" >'+_('Stopwatch Internal Note')+'</label>';
        stopwatch_html += '<textarea cols="40" rows="4" name="stopwatch-internal-note" maxlength="100"></textarea>';
            
        stopwatch_html += '<div class="stopwatch-data">';
        stopwatch_html += '<a class="icon-ok" name="stopwatch-transfer" href="#" data-role="none" >Transfer</a>';
        stopwatch_html += '<a class="icon-trash" name="stopwatch-delete" href="#" data-role="none" >Delete</a>';
        stopwatch_html += '</div></div><!--.stopwatch-->';
        
        $('#'+jqm_page_id+' .stopwatch-container').html(stopwatch_html);
        textAreaAttributes();
    }

    var textinputs = $( '.stopwatch-container input, .stopwatch-container textarea' );
    
    textinputs.textinput({preventFocusZoom: true, autogrow: false});

    var buttons = $( '.stopwatch-container a[data-role="button"]' );
    buttons.button();

    if(jqm_page_id == 'home_page') {
        $( '.popup_overlay.stopwatch-popup-overlay' ).show();
        $( '#stopwatch_in_home_page').show( 'slide', 500 );
    }
    else {
        $( '.popup_overlay.stopwatch-popup-overlay' ).show();
        $( '#stopwatch_in_timer_page' ).show( 'slide', 500 );
    }
}

function addWebServer() {
    db.transaction(addWebServerCB, errorCB, addWebServerCBSuccess);
}

function addWebServerCB(tx) {
    tx.executeSql('INSERT OR IGNORE INTO web_service (NameService, AddressServices) VALUES(?,?)', [ $('.webserviceName_h').val().trim(), $('.addressWebservices_h').val().trim() ], function(){
        console.log('New Server added successfully.');
    }, errorCB);
}

function errorCB(err) {
    console.log("Error processing SQL: " + err.message);
}

function addWebServerCBSuccess() {
    db.transaction(get_web_service_entries, errorCB);
}

function get_web_service_entries(tx) {
    tx.executeSql('SELECT * FROM web_service', [], get_web_service_entries_success, errorCB);
}

function getallServiceData(tx) {
    tx.executeSql('SELECT * FROM web_service', [], countServerIdWithName, errorCB);
}

function getServiceURl (tx){
    SERVICE_NAME = $("#result").html();
    tx.executeSql('SELECT * FROM web_service Where NameService="'+SERVICE_NAME+'"', [], gettingURLValue, errorCB);
}

function gettingURLValue(tx, result){
    SERVICE_URL = result.rows.item(0).AddressServices;
    window.localStorage.setItem("SERVICE_URL", SERVICE_URL);
}

function countServerIdWithName(tx, result){
    var len = result.rows.length;

    var dropdown_content = '', item;
    for(var i = 0; i<len ; i++){
        item = result.rows.item(i);
        dropdown_content += '<li><a href="#">'+item.NameService+'<span class="value">'+item.NameService+'</span></a></li>';
    }
    $('#ul_ws_dropdown').html(dropdown_content);
}

function get_web_service_entries_success(tx, result) {

    var len = result.rows.length;
    var service_entries = '<ul>';
    $('.contentBox_h').empty();
    for (var i = 0; i < len; i++) {
        service_entries += '<li class="listRow" id="' + result.rows.item(i).id + '"><div class="service-name">'+result.rows.item(i).NameService+'</div><div class="service-address">'+result.rows.item(i).AddressServices+'</div></li>';
    }
    service_entries += '</ul>';
    $('.contentBox_h').html(service_entries);
}

function checkElementhasClass() {
     db.transaction(countElement, errorCB);
}

function checkElementhasServicesClass() {
    db.transaction(countServerId, errorCB);
}

function countElement(tx) {
    tx.executeSql('SELECT * FROM web_service', [], countquerySuccess, errorCB);
}
function countServerId (tx){
    tx.executeSql ('SELECT * FROM web_service',[],countServerIdWithName,errorCB );
}

function countquerySuccess(tx, result) {
    var len = result.rows.length;
    $('.contentBox_h').empty();
}

function getSelectedDataValue(){
    db.transaction(selectQueryDB, errorCB);
}

function selectQueryDB(tx) {
    tx.executeSql('SELECT * FROM web_service WHERE id=' + selected_id, [], selectQuerySuccess, editerrorDB);
}

function selectQuerySuccess(tx, result) {
    selectedValueOfURLAddress = result.rows.item(0).AddressServices;
}

function editqueryDB(tx) {
    tx.executeSql('SELECT * FROM web_service WHERE id=' + selected_id, [], editquerySuccess, editerrorDB);
}

function editquerySuccess(tx, result) {
 
    $('.webserviceName_h').val(result.rows.item(0).NameService);
    $('.addressWebservices_h').val(result.rows.item(0).AddressServices);
      
    $('.optionBox').show();
    $('#shadow').show();
}

function editerrorDB(err) {
    console.log("Error processing SQL: " + err.code);
}

function deletequeryDB(tx) {

    tx.executeSql('SELECT AddressServices AS service_url FROM web_service WHERE id=?', [selected_id], function(tx, results){
        if(results.rows.length) {
            var service_url = results.rows.item(0).service_url;
            console.log('to delete service_url: '+service_url);
            delete_offline_customer_data (service_url);
        }

        tx.executeSql('Delete FROM web_service WHERE id='+ selected_id);
        selected_id = null;
        addWebServerCBSuccess();
    });
}

function deleteerrorDB(err) {
    console.log("Error processing SQL: " + err.code);
}

function updateWebServer() {
     db.transaction(updatequeryDB, updateerrorDB);
}

function updatequeryDB(tx) {
    var webServiceName = $('.webserviceName_h').val();
    var addressWebservice = $('.addressWebservices_h').val();
 
    tx.executeSql('UPDATE web_service SET NameService = "' + webServiceName + '", AddressServices = "' + addressWebservice + '" WHERE id = ' + selected_id);

    addWebServerCBSuccess();
}

function updateerrorDB(err) {

    if(6 == err.code) {
        $( "#webservice_page .centron-alert-error" ).find('p').html(_('Duplicate name of web service')).end().popup('open');
    }
    else {
        $( "#webservice_page .centron-alert-error" ).find('p').html(err.message).end().popup('open');
    }
}

function errorCBWithMessage(err) {
    console.log("Error processing SQL: " + db_error[err.code]);
}
var db_error = new Array('UNKNOWN_ERR', 'DATABASE_ERR', 'VERSION_ERR', 'TOO_LARGE_ERR', 'QUOTA_ERR', 'SYNTAX_ERR', 'CONSTRAINT_ERR', 'TIMEOUT_ERR');

function insertFavouriteCustomer (customer) {
    db.transaction( function(tx){ insertFavouriteCustomerCB(tx, customer); }, errorCB );
}
function insertFavouriteCustomerCB(tx, customer) {
    
    var I3D = customer.I3D;
    var service_url = window.localStorage.getItem('SERVICE_URL');
    var app_user_i3d = window.localStorage.getItem('CurrentAppUserI3D');
    var Name = customer.Name;

    var Street = customer.Street;
    var Zip = customer.Zip;
    var City = customer.City;
    var Country = customer.Country;

    tx.executeSql('INSERT OR IGNORE INTO fav_customer (I3D, service_url, AppUserI3D, Name, Street, Zip, City, Country) VALUES (?,?,?,?,?,?,?,?)',[I3D, service_url, app_user_i3d, Name, Street, Zip, City, Country]);
}
function get_fav_customers(tx) {

    var service_url = window.localStorage.getItem('SERVICE_URL');
    var app_user_i3d = window.localStorage.getItem('CurrentAppUserI3D');
    
    var customer_query;
    if(window.localStorage.getItem('offline_mode') == 'off') {
        customer_query = 'SELECT * FROM fav_customer WHERE service_url="'+service_url+'" AND AppUserI3D='+app_user_i3d+' ORDER BY Name COLLATE NOCASE';
    } else {
        customer_query = 'SELECT * FROM fav_customer, customer WHERE fav_customer.I3D = customer.I3D AND fav_customer.service_url="'+service_url+'" AND AppUserI3D='+app_user_i3d+' ORDER BY Name COLLATE NOCASE';
    }
    tx.executeSql(customer_query, [], get_fav_customersCB);
}

function get_fav_customersCB(tx, results) {
    
    var len = results.rows.length;
    
    $('#customer_page .customerName .fav_customer_symbol').removeClass('icon-star');
    var favourites = '';
    var name, i3d;
    var customer_i3d = window.sessionStorage.getItem('CustomerSelected');
    console.log('CustomerI3D: ' + customer_i3d);
    var classes;

	for (var i=0; i<len; i++){
        i3d = results.rows.item(i).I3D;
        name = results.rows.item(i).Name;
        if(!name){
            name = '';
        }
        
        street = results.rows.item(i).Street;
        if(!street){
            street = '';
        }
        zip = results.rows.item(i).Zip;
        if(!zip){
            zip = '';
        }
        city = results.rows.item(i).City;
        if(!city){
            city = '';
        }
        country = results.rows.item(i).Country;
        if(!country){
            country = '';
        }
        $('#customer_page .customerName[data-customer_i3d='+i3d+']').find('.fav_customer_symbol').addClass('icon-star');

        if (customer_i3d && customer_i3d == i3d) {
            classes = 'selected selected_fav';
        }
        else {
            classes = '';
        }
        favourites += '<li class="customerName" data-customer_i3d="'+i3d+'">';
        favourites += '<h3 class="'+classes+'">'+name+' '+i3d+'<span class="fav_customer_symbol icon-star"></span></h3>';
        favourites += '<p>'+street+' '+zip+' '+city+' '+country+'</p>';
        favourites += '</li>';
	}
    
    $('#favorites_list').html(favourites);
}

function is_customer_fav(tx, CustomerI3D) {
    console.log('Invoking is_customer_fav');

    var service_url = window.localStorage.getItem('SERVICE_URL');
    var app_user_i3d = window.localStorage.getItem('CurrentAppUserI3D');
    tx.executeSql('SELECT * FROM fav_customer WHERE I3D='+CustomerI3D+' AND service_url="'+service_url+'" AND AppUserI3D='+app_user_i3d, [], is_customer_favCB);
}
function is_customer_favCB(tx, results) {
    
    var len = results.rows.length;
    if(len) {
        console.log('Customer is favorite');
        $('#selected_customer_headline .fav_customer_symbol').addClass('icon-star');
    }
    else {
        console.log('Customer is not favorite');
        $('#selected_customer_headline .fav_customer_symbol').removeClass('icon-star');
    }
}
function removeFavCustomer(tx, CustomerI3D) {
    console.log('Invoking removeFavouriteCustomer');

    var service_url = window.localStorage.getItem('SERVICE_URL');
    var app_user_i3d = window.localStorage.getItem('CurrentAppUserI3D');
    var query = 'DELETE FROM fav_customer WHERE I3D='+CustomerI3D+' AND service_url="'+service_url+'" AND AppUserI3D='+app_user_i3d;

    tx.executeSql(query, [], removeFavCustomerCB);
}

function removeFavCustomerCB(tx, results) {
    if(results.rowsAffected) {
        $('#selected_customer_headline .fav_customer_symbol').removeClass('icon-star');
    }
}

function saveCRMDetails (crm_details) {
    console.log('Invoking saveCRMDetails...');
    db.transaction( function(tx){ saveCRMDetailsCB(tx, crm_details); }, errorCB );
}
function saveCRMDetailsCB(tx, crm_details) {

    var service_url = window.localStorage.getItem('SERVICE_URL');
    $.each(crm_details, function(i, crm){
        var YearsCount = i;
        var CustomerI3D = crm.CustomerI3D;

        tx.executeSql('INSERT OR REPLACE INTO customer_crm_detail ( CustomerI3D, YearsCount, service_url, details) VALUES (?,?,?,?)',[CustomerI3D, YearsCount, service_url, JSON.stringify(crm)]);
    });
}

function saveCRMActivities (CRM_activities) {
    console.log('Invoking saveCRMActivities...');
    db.transaction( function(tx){ saveCRMActivitiesCB(tx, CRM_activities); }, errorCB );
}

function saveCRMActivitiesCB(tx, CRM_activities) {

    var service_url = window.localStorage.getItem('SERVICE_URL');
    var CustomerI3D = window.sessionStorage.getItem('CustomerI3D');
    CustomerI3D = parseInt(CustomerI3D, 10);
    $.each(CRM_activities, function(i, CRM_activity){
        var I3D = CRM_activity.I3D;
        var ReceiverEmployee = CRM_activity.ReceiverEmployee;
        var State = CRM_activity.State;

        tx.executeSql('INSERT OR REPLACE INTO customer_crm_activity ( I3D, CustomerI3D, service_url, ReceiverEmployee, State, details) VALUES (?,?,?,?,?,?)',[I3D, CustomerI3D, service_url, ReceiverEmployee, State, JSON.stringify(CRM_activity)]);
    });
}

function saveHotlines (hotlines) {
    console.log('Invoking saveHotlines...');
    db.transaction( function(tx){ saveHotlinesCB(tx, hotlines); }, errorCB );
}

function saveHotlinesCB(tx, hotlines) {

    var service_url = window.localStorage.getItem('SERVICE_URL');
    $.each(hotlines, function(i, hotline){
        var I3D = hotline.I3D;
        var CustomerI3D = hotline.CustomerI3D;

        tx.executeSql('INSERT OR REPLACE INTO customer_hotline ( I3D, CustomerI3D, service_url, details) VALUES (?,?,?,?)',[I3D, CustomerI3D, service_url, JSON.stringify(hotline)]);
    });
}

function saveContracts (contracts) {
    console.log('Invoking saveContracts...');
    db.transaction( function(tx){ saveContractsCB(tx, contracts); }, errorCB );
}

function saveContractsCB(tx, contracts) {
    console.log('Invoking saveContractsCB...');

    var service_url = window.localStorage.getItem('SERVICE_URL');

    $.each(contracts, function(i, contract){
        var I3D = contract.I3D;
        var CustomerI3D = contract.CustomerI3D;

        tx.executeSql('INSERT OR REPLACE INTO customer_contract ( I3D, CustomerI3D, service_url, details) VALUES (?,?,?,?)',[I3D, CustomerI3D, service_url, JSON.stringify(contract)]);
    });
}

function saveMasterDataLists (lists) {
    console.log('Invoking saveMasterDataLists...');
    db.transaction( function(tx){ saveMasterDataListsCB(tx, lists); }, errorCB );
}

function saveMasterDataListsCB(tx, lists) {

    var service_url = window.localStorage.getItem('SERVICE_URL');

    $.each(lists, function(i, list){
        var I3D = list.I3D;
		var CustomerI3D = list.CustomerI3D;

        tx.executeSql('INSERT OR REPLACE INTO helpdesk_master_data_list ( I3D, CustomerI3D, service_url, details) VALUES (?,?,?,?)',[I3D, CustomerI3D, service_url, JSON.stringify(list)]);
    });
}

//Multiple Device Link
function saveDeviceLinks (lists) {
    console.log('Invoking saveDeviceLinks...');
    db.transaction( function(tx){ saveDeviceLinksCB(tx, lists); }, errorCB );
}

function saveDeviceLinksCB(tx, lists) {

    var service_url = window.localStorage.getItem('SERVICE_URL');

    $.each(lists, function(i, list){
        var HelpdeskI3D = list.HelpDeskI3D;
        var DeviceHead = list.DeviceHead;

		var DeviceHeadI3D = DeviceHead.I3D;
		var Caption = DeviceHead.Caption;
		var Code = DeviceHead.Code;
		var CustomerI3D = DeviceHead.CustomerI3D;

        tx.executeSql('INSERT OR REPLACE INTO customer_device_link ( DeviceHeadI3D, CustomerI3D, HelpdeskI3D, Code, Caption, service_url, details) VALUES (?,?,?,?,?,?,?)',[DeviceHeadI3D, CustomerI3D, HelpdeskI3D, Code, Caption, service_url, JSON.stringify(DeviceHead)]);
    });
}

//Single Device Link
function SaveDeviceLinkToDb (link) {
    var links_saved = $.Deferred();
    console.log('SaveDeviceLinkToDb param: ' + JSON.stringify(link));

    console.log('Invoking SaveDeviceLinkToDb...');
    db.transaction( function (tx) {
		var service_url = window.localStorage.getItem('SERVICE_URL');

		var link_data = link.Data;
		var HelpdeskI3D = link_data.HelpdeskI3D;

		var DeviceHeadI3D = link_data.DeviceHeadI3D;
		var Caption = link_data.DeviceHeadCaption;
		var Code = link_data.DeviceHeadCode;
		var CustomerI3D = link_data.CustomerI3D;

		var details = {
			I3D: DeviceHeadI3D,
			Caption: Caption,
			Code: Code,
			CustomerI3D: CustomerI3D
		};
        console.log('HelpdeskI3D: ' + HelpdeskI3D);
        var pending, new_entry;
        pending = new_entry = 1;
		tx.executeSql('INSERT OR REPLACE INTO customer_device_link ( DeviceHeadI3D, CustomerI3D, HelpdeskI3D, Code, Caption, service_url, details, pending, new_entry) VALUES (?,?,?,?,?,?,?,?,?)',[DeviceHeadI3D, CustomerI3D, HelpdeskI3D, Code, Caption, service_url, JSON.stringify(details), pending, new_entry], function(){
            links_saved.resolve();
        });
	}, errorCB );

    return links_saved.promise();
}

function saveHelpdeskCategories (categories) {
    console.log('Invoking saveHelpdeskCategories...');
    db.transaction( function(tx){ saveHelpdeskCategoriesCB(tx, categories); }, errorCB );
}

function saveHelpdeskCategoriesCB(tx, categories) {

    var service_url = window.localStorage.getItem('SERVICE_URL');

    $.each(categories, function(i, category){
        var I3D = category.I3D;
        tx.executeSql('INSERT OR REPLACE INTO helpdesk_category ( I3D, service_url, details) VALUES (?,?,?)',[I3D, service_url, JSON.stringify(category)]);
    });
}

function saveEmployeeArticles (articles) {
    console.log('Invoking saveEmployeeArticles...');
    db.transaction( function(tx){ saveEmployeeArticlesCB(tx, articles); }, errorCB );
}

function saveEmployeeArticlesCB(tx, articles) {

    var service_url = window.localStorage.getItem('SERVICE_URL');

    $.each(articles, function(i, article){
        var I3D = article.I3D;
        var ArticleI3D = article.ArticleI3D;
        tx.executeSql('INSERT OR REPLACE INTO employee_article ( I3D, ArticleI3D, service_url, details) VALUES (?,?,?,?)',[I3D, ArticleI3D, service_url, JSON.stringify(article)]);
    });
}

function saveEmployees (employees) {
    console.log('Invoking saveEmployees...');
    db.transaction( function(tx){ saveEmployeesCB(tx, employees); }, errorCB );
}

function saveEmployeesCB(tx, employees) {

    var service_url = window.localStorage.getItem('SERVICE_URL');

    $.each(employees, function(i, employee){
        var I3D = employee.I3D;
        tx.executeSql('INSERT OR REPLACE INTO employee ( I3D, service_url, details) VALUES (?,?,?)',[I3D, service_url, JSON.stringify(employee)]);
    });
}

function saveEmployeeDepartments (departments) {
    console.log('Invoking saveEmployeeDepartments...');
    db.transaction( function(tx){ saveEmployeeDepartmentsCB(tx, departments); }, errorCB );
}

function saveEmployeeDepartmentsCB(tx, departments) {

    var service_url = window.localStorage.getItem('SERVICE_URL');

    $.each(departments, function(i, department){
        var I3D = department.I3D;
        tx.executeSql('INSERT OR REPLACE INTO employee_department ( I3D, service_url, details) VALUES (?,?,?)',[I3D, service_url, JSON.stringify(department)]);
    });
}

function saveHelpdeskStates (states) {
    console.log('Invoking saveHelpdeskStates...');
    db.transaction( function(tx){ saveHelpdeskStatesCB(tx, states); }, errorCB );
}

function saveHelpdeskStatesCB(tx, states) {

    var service_url = window.localStorage.getItem('SERVICE_URL');

    $.each(states, function(i, state){
        var I3D = state.I3D;
        tx.executeSql('INSERT OR REPLACE INTO helpdesk_state ( I3D, service_url, details) VALUES (?,?,?)',[I3D, service_url, JSON.stringify(state)]);
    });
}

function saveHelpdeskPriorities (priorities) {
    console.log('Invoking saveHelpdeskPriorities...');
    db.transaction( function(tx){ saveHelpdeskPrioritiesCB(tx, priorities); }, errorCB );
}

function saveHelpdeskPrioritiesCB(tx, priorities) {

    var service_url = window.localStorage.getItem('SERVICE_URL');

    $.each(priorities, function(i, priority){
        var I3D = priority.I3D;
        tx.executeSql('INSERT OR REPLACE INTO helpdesk_priority ( I3D, service_url, details) VALUES (?,?,?)',[I3D, service_url, JSON.stringify(priority)]);
    });
}

function saveHelpdeskTypes (types) {
    console.log('Invoking saveHelpdeskTypes...');
    db.transaction( function(tx){ saveHelpdeskTypesCB(tx, types); }, errorCB );
}

function saveHelpdeskTypesCB(tx, types) {

    var service_url = window.localStorage.getItem('SERVICE_URL');

    $.each(types, function(i, type){
        var I3D = type.I3D;
        tx.executeSql('INSERT OR REPLACE INTO helpdesk_type ( I3D, service_url, details) VALUES (?,?,?)',[I3D, service_url, JSON.stringify(type)]);
    });
}

function saveHelpdeskTimerTypes (types) {
    console.log('Invoking saveHelpdeskTimerTypes...');
    db.transaction( function(tx){ saveHelpdeskTimerTypesCB(tx, types); }, errorCB );
}

function saveHelpdeskTimerTypesCB(tx, types) {

    var service_url = window.localStorage.getItem('SERVICE_URL');

    $.each(types, function(i, type){
        var I3D = type.I3D;

        tx.executeSql('INSERT OR REPLACE INTO helpdesk_timer_type ( I3D, service_url, details) VALUES (?,?,?)',[I3D, service_url, JSON.stringify(type)]);
    });
}

function saveCustomerDetails (customer) {
    console.log('Invoking saveCustomerDetails...');
    db.transaction( function(tx){ saveCustomerDetailsCB(tx, customer); }, errorCB );
}
function saveCustomerDetailsCB(tx, customer) {
    var Customer = JSON.parse(customer);

    var I3D = Customer.I3D;
    var Name = Customer.Name;
    var service_url = window.localStorage.getItem('SERVICE_URL');
    
    console.log('Service URL: ' + service_url + ' Customer I3D: ' + I3D);

    tx.executeSql('INSERT OR REPLACE INTO customer (I3D, Name, service_url, details) VALUES (?,?,?,?)',[I3D, Name, service_url, customer]);
}

function saveCustomerAddressDetails (addresses) {
    console.log('Invoking saveCustomerAddressDetails...');
    db.transaction( function(tx){ saveCustomerAddressDetailsCB(tx, addresses); }, errorCB );
}
function saveCustomerAddressDetailsCB(tx, addresses) {

    var service_url = window.localStorage.getItem('SERVICE_URL');
    $.each(addresses, function(i, address){
        if(address) {
            var I3D = address.I3D;
            var CustomerI3D = address.CustomerI3D;

            tx.executeSql('INSERT OR REPLACE INTO customer_address ( I3D, CustomerI3D, service_url, details) VALUES (?,?,?,?)',[ I3D, CustomerI3D, service_url, JSON.stringify(address)]);
        }
    });
}

function saveContactDetails (contacts) {
    console.log('Invoking saveContactDetails...');
    db.transaction( function(tx){ saveContactDetailsCB(tx, contacts); }, errorCB );
}
function saveContactDetailsCB(tx, contacts) {

    var login_ticket = window.localStorage.getItem('Ticket');
    var service_url = window.localStorage.getItem('SERVICE_URL');
    var CustomerI3D = window.sessionStorage.getItem('CustomerI3D');
    CustomerI3D = parseInt(CustomerI3D, 10);
    $.each(contacts, function(i, contact){

        var I3D = contact.I3D;
        var AddressI3D = contact.AddressI3D;
        var Status = contact.Status;

        if(Status) {
            tx.executeSql('INSERT OR REPLACE INTO customer_contact (I3D, CustomerI3D, AddressI3D, service_url, details) VALUES (?,?,?,?,?)',[I3D, CustomerI3D, AddressI3D, service_url, JSON.stringify(contact)]);

            var param = {
                Ticket: login_ticket,
                Data: I3D
            };
            service_request('GetContactPersonImage', param).done(function(response){
                if (0 === response.Status) {
                    if(response.Result && response.Result[0]) {
                        var img_data = response.Result[0];
                        if(img_data) {
                            saveContactImage(I3D, CustomerI3D, service_url, img_data);
                        }
                    }
                }
            });
        }
    });
}

function saveContactImage(ContactI3D, CustomerI3D, service_url, img_data) {
    db.transaction( function(tx){

        tx.executeSql('INSERT OR REPLACE INTO customer_contact_image (ContactI3D, CustomerI3D, service_url, details) VALUES (?,?,?,?)',[ContactI3D, CustomerI3D, service_url, img_data]);
    }, errorCB );
}

function saveHelpdesksToDevice (helpdesks) {
    var timers_dfd = $.Deferred();

    console.log('Invoking saveHelpdesksToDevice...');
    db.transaction( function(tx){
    
        var service_url = window.localStorage.getItem('SERVICE_URL');
        var counter = 0;
        var helpdesk_count = helpdesks.length;
        $.each(helpdesks, function(i, helpdesk){

            var I3D = helpdesk.I3D;
            var Number = helpdesk.Number;
            var CustomerI3D = helpdesk.CustomerI3D;
            
            var MainCategory = helpdesk.MainCategoryI3D;
            var Category1 = helpdesk.SubCategory1I3D;
            var Category2 = helpdesk.SubCategory2I3D;

            var Status = helpdesk.HelpdeskStatusI3D;
            var Editor = '';
            if(helpdesk.Editors) {
                if( Object.prototype.toString.call( helpdesk.Editors ) === '[object Array]' ) {
                    Editor = helpdesk.Editors[0].I3D;
                }
            }

            tx.executeSql('INSERT OR REPLACE INTO customer_helpdesk (I3D, Number, CustomerI3D, service_url, MainCategory, Category1, Category2, Status, Editor, details) VALUES (?,?,?,?,?,?,?,?,?,?)',[I3D, Number, CustomerI3D, service_url, MainCategory, Category1, Category2, Status, Editor, JSON.stringify(helpdesk)]);
            console.log('Helpdesk count: '+ counter);
            counter++;

            var login_ticket = window.localStorage.getItem('Ticket');
            var timer_param = {
                Ticket: login_ticket
            };
            (function(helpdesk_count, counter){
                timer_param.Data = I3D;
                service_request('GetActiveHelpdeskTimersFromHelpdesk', timer_param).done(function (response) {
                    
                        if(0 === response.Status) {
                            console.log('length: ' + helpdesk_count + ' Count: ' + counter);
                            if(helpdesk_count === counter) {
                                console.log('Last Helpdesk length: ' + helpdesk_count + ' Count: ' + counter);
                                timers_dfd.resolve();
                            }
                            saveHelpdeskTimers (response.Result);
                        } else {
                            if(helpdesk_count === counter) {
                                console.log('Last Helpdesk length: ' + helpdesk_count + ' Count: ' + counter);
                                timers_dfd.reject();
                            }
                        }
                });
            })(helpdesk_count, counter);
        });
    }, errorCB );
    
    return timers_dfd.promise();
}

//save all timers of a Helpdesk ticket
function saveHelpdeskTimers (timers) {
    console.log('Invoking saveHelpdeskTimers...');
    db.transaction( function(tx){ saveHelpdeskTimersCB(tx, timers); }, errorCB );
}
function saveHelpdeskTimersCB(tx, timers) {
    console.log('Invoking saveHelpdeskTimersCB...');

    var service_url = window.localStorage.getItem('SERVICE_URL');
    $.each(timers, function(i, timer){
        var I3D = timer.I3D;
		var HelpdeskI3D = timer.HelpdeskI3D;
        window.localStorage.setItem('CurrentTimer_' + I3D,JSON.stringify(timer));
        
        var login_ticket = window.localStorage.getItem('Ticket');
        var sig_param = {
           Ticket: login_ticket,
           Data: I3D
        };
        service_request('GetSignatureFromHelpdeskTimer', sig_param).done(function (response) {
           var CurrentTimer = JSON.parse(window.localStorage.getItem('CurrentTimer_'+ sig_param.Data));
           window.localStorage.removeItem('CurrentTimer_'+ sig_param.Data)
           var I3D = CurrentTimer.I3D;
           var HelpdeskI3D = CurrentTimer.HelpdeskI3D;
           var Service_url = window.localStorage.getItem('SERVICE_URL');
           if(response.Status == 0){
               var sign = true;
               db.transaction( function(CurrentTx){
                  CurrentTx.executeSql('INSERT OR REPLACE INTO customer_helpdesk_timer ( I3D, HelpdeskI3D, service_url, details, sign) VALUES (?,?,?,?,?)',[I3D, HelpdeskI3D, Service_url, JSON.stringify(CurrentTimer),sign]);
               },errorCB);
           } else {
               db.transaction( function(CurrentTx){
                  CurrentTx.executeSql('INSERT OR REPLACE INTO customer_helpdesk_timer ( I3D, HelpdeskI3D, service_url, details, sign) VALUES (?,?,?,?,?)',[I3D, HelpdeskI3D, Service_url, JSON.stringify(CurrentTimer),null]);
               },errorCB);
           }
        });
    });
}

function saveAppSetting(I3D, label, value){
    db.transaction(function (tx) {

        var service_url = window.localStorage.getItem('SERVICE_URL');
        tx.executeSql('INSERT OR REPLACE INTO app_setting ( I3D, label, details, service_url) VALUES (?,?,?,?)', [I3D, label, value, service_url]);
    }, errorCB);
}

function saveUserCredentials(credentials) {
  console.log('Invoking saveUserCredentials...');
  
  db.transaction(function (tx) {
    //saveServerDetails(tx, credentials);
    
    var service_url;
    if(!credentials.service_url) {
        service_url = window.localStorage.getItem('SERVICE_URL');
        credentials.service_url = service_url;
    } else {
        service_url = credentials.service_url;
    }
    
    var password = credentials.password;
    var secret_passphrase = window.localStorage.getItem('application_id');
    var encrypted_password;

    if(password && secret_passphrase) {
        //encrypted_password = CryptoJS.AES.encrypt(password, secret_passphrase);
        encrypted_password = password;
        window.localStorage.setItem('CurrentCredentials',JSON.stringify(credentials));
        tx.executeSql('SELECT Uid FROM user_credentials WHERE user_name=? AND service_url=?', [credentials.userName,service_url], function(tx, result){
           var CurrentCredentials = JSON.parse(window.localStorage.getItem('CurrentCredentials'));
           window.localStorage.removeItem('CurrentCredentials');
           if(result.rows.length == 0) {
              tx.executeSql('INSERT OR REPLACE INTO user_credentials (user_name, password, service_url, IsSavePassword) VALUES (?,?,?,?)', [CurrentCredentials.userName, CurrentCredentials.password, CurrentCredentials.service_url,1]);
            }else{
              tx.executeSql('UPDATE user_credentials set IsSavePassword=? WHERE user_name=? AND service_url=?', [1,credentials.userName,service_url]);
            }
        });
    }
  }, errorCB);
}

function removeUserCredentials(credentials) {
    console.log('Invoking removeUserCredentials...');
    db.transaction(function (tx) {
        //tx.executeSql('DELETE FROM user_credentials WHERE user_name=?', [credentials.userName]);
        tx.executeSql('UPDATE user_credentials set IsSavePassword=? WHERE user_name=?', [0,credentials.userName]);
                   
  }, errorCB);
}

function get_stored_user_credentials(serverName) {

    db.transaction(function (tx) {
        fetchServerDetail(tx, serverName);
    }, errorCB);

}

function fetchServerDetail(tx, serverName) {
    console.log('fetchServerDetail');

    tx.executeSql('SELECT * FROM user_credentials, web_service WHERE user_credentials.IsSavePassword=? AND web_service.AddressServices = user_credentials.service_url AND web_service.NameService=?', [1,serverName], get_stored_user_credentialsSuccess);
}

function get_stored_user_credentialsSuccess(tx, result) {

    var username = '', password = '';

    if(result.rows.length) {
        if('https://iSuite.c-entron.de/CentronServiceAppleDemo/REST/' == result.rows.item(0).service_url || 'https://iSuite.c-entron.de/CentronServiceAppleDemo/REST' == result.rows.item(0).service_url){
          username = result.rows.item(0).user_name;
          password = result.rows.item(0).password;
          var secret_passphrase = window.localStorage.getItem('application_id');
          //var decrypted_password = CryptoJS.AES.decrypt(password, secret_passphrase).toString(CryptoJS.enc.Utf8);
          var decrypted_password = password;
        }
    }
    $("#username").val(username);
    $("#password").val(decrypted_password);
}

function get_stored_user_credentialsError(err) {
    alert("Error processing SQL: "+err.code);
}

//Get Customer from local db
function loadCustomerDetails (param) {
    console.log('Invoking loadCustomerDetails...' + JSON.stringify(param));
    var dfr = $.Deferred();
    
    var service_url = window.localStorage.getItem('SERVICE_URL');

    db.transaction( function(tx){
        tx.executeSql('SELECT * FROM customer WHERE I3D=? AND service_url=?', [param.Data, service_url], function (tx, results) {
            if(results.rows.length) {
                var response = {
                    Message: "Local db",
                    Status: 0,
                    Result: [JSON.parse(results.rows.item(0).details)]
                };
                dfr.resolve( response );
            }
        }, dfr.reject);
    }, dfr.reject);
    
    return dfr.promise();
}

//Get Customer Addresss from local db
function loadCustomerAddressDetails (param) {
    console.log('Invoking loadCustomerAddressDetails...');
    var dfr = $.Deferred();

    var service_url = window.localStorage.getItem('SERVICE_URL');
    db.transaction( function(tx){
        tx.executeSql('SELECT details FROM customer_address WHERE CustomerI3D=? AND service_url=?', [param.Data.CustomerI3D, service_url], function (tx, results) {

            var addresses = [];
            for (var i=0; i<results.rows.length; i++) {
                addresses.push(JSON.parse(results.rows.item(i).details));
            }

            var response = {
                Message: "Local db",
                Status: 0,
                Result: addresses
            };

            dfr.resolve( response );
        }, dfr.reject);
    }, dfr.reject);
    
    return dfr.promise();
}

//Get AddressByI3D from local db
function loadAddressByI3D (param) {
    console.log('Invoking loadAddressByI3D...');
    var dfr = $.Deferred();

    var service_url = window.localStorage.getItem('SERVICE_URL');
    db.transaction( function(tx){
        tx.executeSql('SELECT details FROM customer_address WHERE I3D=? AND service_url=?', [param.Data, service_url], function (tx, results) {

            var addresses = [];
            for (var i=0; i<results.rows.length; i++) {
            	addresses.push(JSON.parse(results.rows.item(i).details));
            }

            var response = {
            	Message: "Local db",
            	Status: 0,
            	Result: addresses
            };

            dfr.resolve( response );
        }, dfr.reject);
    }, dfr.reject);
    
    return dfr.promise();
}

//Get Signature from local db
function loadHelpdeskTimerSignature (param) {
    console.log('Invoking loadHelpdeskTimerSignature...' + JSON.stringify(param));
    var dfr = $.Deferred();
    
    var service_url = window.localStorage.getItem('SERVICE_URL');

    db.transaction( function(tx){
        tx.executeSql('SELECT * FROM customer_helpdesk_timer WHERE I3D=? AND service_url=?', [param.Data, service_url], function (tx, results) {
            if(results.rows.length) {
                var response = {
                    Message: "Local db",
                    Result: [JSON.parse(results.rows.item(0).sign)]
                };
                console.log(' ***************************** Sign : ' + results.rows.item(0).sign);
                if(results.rows.item(0).sign){
                  $.extend(response, {
                    Status: 0
                  });
                }else{
                  $.extend(response, {
                    Status: 1
                  });
                }
                
                dfr.resolve( response );
            }
        }, dfr.reject);
    }, dfr.reject);
    
    return dfr.promise();
}

//Get Customer Contacts from local db
function loadCustomerContactsFromAddress (param) {
    console.log('Invoking loadCustomerContactsFromAddress...');
    var dfr = $.Deferred();

    var service_url = window.localStorage.getItem('SERVICE_URL');
    db.transaction( function(tx){
        tx.executeSql('SELECT details FROM customer_contact WHERE AddressI3D=? AND service_url=? ORDER BY I3D ASC', [param.Data.AddressI3D, service_url], function (tx, results) {

            var contacts = [];
            for (var i=0; i<results.rows.length; i++) {
            	contacts.push(JSON.parse(results.rows.item(i).details));
            }

            var response = {
            	Message: "Local db",
            	Status: 0,
            	Result: contacts
            };

            dfr.resolve( response );
        }, dfr.reject);
    }, dfr.reject);
    
    return dfr.promise();
}

//Get CustomerContactsFromCustomer from local db
function loadCustomerContactsFromCustomer (param) {
    console.log('Invoking loadCustomerContactsFromCustomer...');
    var dfr = $.Deferred();

    var service_url = window.localStorage.getItem('SERVICE_URL');
    db.transaction( function(tx){
        tx.executeSql('SELECT details FROM customer_contact WHERE CustomerI3D=? AND service_url=?', [param.Data, service_url], function (tx, results) {

            var contacts = [];
            for (var i=0; i<results.rows.length; i++) {
            	contacts.push(JSON.parse(results.rows.item(i).details));
            }

            var response = {
            	Message: "Local db",
            	Status: 0,
            	Result: contacts
            };

            dfr.resolve( response );
        }, dfr.reject);
    }, dfr.reject);
    
    return dfr.promise();
}

//Get Customer CRM Details from local db
function loadCRMDetails (param) {
    console.log('Invoking loadCRMDetails...');
    var dfr = $.Deferred();

    var service_url = window.localStorage.getItem('SERVICE_URL');
    db.transaction( function(tx){

        tx.executeSql('SELECT details FROM customer_crm_detail WHERE CustomerI3D=? AND service_url=?', [param.Data, service_url], function (tx, results) {

            var crm_details = [];
            for (var i=0; i<results.rows.length; i++) {
            	crm_details.push(JSON.parse(results.rows.item(i).details));
            }

            var response = {
            	Message: "Local db",
            	Status: 0,
            	Result: crm_details
            };

            dfr.resolve( response );
        }, dfr.reject);
    }, dfr.reject);
    
    return dfr.promise();
}

//Get Customer Contact Person Image from local db
function loadContactPersonImage (param) {
    console.log('Invoking loadContactPersonImage...');
    var dfr = $.Deferred();

    var service_url = window.localStorage.getItem('SERVICE_URL');
    db.transaction( function(tx){
        tx.executeSql('SELECT details FROM customer_contact_image WHERE ContactI3D=? AND service_url=?', [param.Data, service_url], function (tx, results) {

            var images = [];
                      
            if(results.rows.length) {
                images.push( results.rows.item(0).details );
            }
                      
            var response = {
            	Message: "Local db",
            	Status: 0,
            	Result: images
            };

            dfr.resolve( response );
        }, dfr.reject);
    }, dfr.reject);
    
    return dfr.promise();
}

//Get Helpdesk Categories from local db
function loadHelpdeskCategories (param) {
    console.log('Invoking loadHelpdeskCategories...');
    var dfr = $.Deferred();

    var service_url = window.localStorage.getItem('SERVICE_URL');
    db.transaction( function(tx){
        tx.executeSql('SELECT details FROM helpdesk_category WHERE service_url=?', [service_url], function (tx, results) {

            var categories = [];
            for (var i=0; i<results.rows.length; i++) {
            	categories.push(JSON.parse(results.rows.item(i).details));
            }

            var response = {
            	Message: "Local db",
            	Status: 0,
            	Result: categories
            };

            dfr.resolve( response );
        }, dfr.reject);
    }, dfr.reject);
    
    return dfr.promise();
}

//Get Helpdesk States from local db
function loadHelpdeskStates (param) {
    console.log('Invoking loadHelpdeskStates...');
    var dfr = $.Deferred();

    var service_url = window.localStorage.getItem('SERVICE_URL');
    db.transaction( function(tx){
        tx.executeSql('SELECT details FROM helpdesk_state WHERE service_url=?', [service_url], function (tx, results) {

            var states = [];
            for (var i=0; i<results.rows.length; i++) {
            	states.push(JSON.parse(results.rows.item(i).details));
            }

            var response = {
            	Message: "Local db",
            	Status: 0,
            	Result: states
            };

            dfr.resolve( response );
        }, dfr.reject);
    }, dfr.reject);
    
    return dfr.promise();
}

//Get HelpdeskPriorities from local db
function loadHelpdeskPriorities (param) {
    console.log('Invoking loadHelpdeskPriorities...');
    var dfr = $.Deferred();

    var service_url = window.localStorage.getItem('SERVICE_URL');
    db.transaction( function(tx){
        tx.executeSql('SELECT details FROM helpdesk_priority WHERE service_url=?', [service_url], function (tx, results) {

            var priorities = [];
            for (var i=0; i<results.rows.length; i++) {
            	priorities.push(JSON.parse(results.rows.item(i).details));
            }

            var response = {
            	Message: "Local db",
            	Status: 0,
            	Result: priorities

            };

            dfr.resolve( response );
        }, dfr.reject);
    }, dfr.reject);
    
    return dfr.promise();
}

//Get HelpdeskTypes from local db
function loadHelpdeskTypes (param) {
    console.log('Invoking loadHelpdeskTypes...');
    var dfr = $.Deferred();

    var service_url = window.localStorage.getItem('SERVICE_URL');
    db.transaction( function(tx){
        tx.executeSql('SELECT details FROM helpdesk_type WHERE service_url=?', [service_url], function (tx, results) {

            var types = [];
            for (var i=0; i<results.rows.length; i++) {
            	types.push(JSON.parse(results.rows.item(i).details));
            }

            var response = {
            	Message: "Local db",
            	Status: 0,
            	Result: types

            };

            dfr.resolve( response );
        }, dfr.reject);
    }, dfr.reject);
    
    return dfr.promise();
}

//Get Employees from local db
function loadEmployees (param) {
    console.log('Invoking loadEmployees...');
    var dfr = $.Deferred();

    var service_url = window.localStorage.getItem('SERVICE_URL');
    db.transaction( function(tx){
        tx.executeSql('SELECT details FROM employee WHERE service_url=?', [service_url], function (tx, results) {

            var employees = [];
            for (var i=0; i<results.rows.length; i++) {
            	employees.push(JSON.parse(results.rows.item(i).details));
            }

            var response = {
            	Message: "Local db",
            	Status: 0,
            	Result: employees
            };

            dfr.resolve( response );
        }, dfr.reject);
    }, dfr.reject);
    
    return dfr.promise();
}

//Get Employee Departments from local db
function loadEmployeeDepartments (param) {
    console.log('Invoking loadEmployeeDepartments...');
    var dfr = $.Deferred();

    var service_url = window.localStorage.getItem('SERVICE_URL');
    db.transaction( function(tx){
        tx.executeSql('SELECT details FROM employee_department WHERE service_url=?', [service_url], function (tx, results) {

            var departments = [];
            for (var i=0; i<results.rows.length; i++) {
            	departments.push(JSON.parse(results.rows.item(i).details));
            }

            var response = {
            	Message: "Local db",
            	Status: 0,
            	Result: departments
            };

            dfr.resolve( response );
        }, dfr.reject);
    }, dfr.reject);
    
    return dfr.promise();
}

//Get Customer Contracts from local db
function loadContracts (param) {
    console.log('Invoking loadContracts...');
    var dfr = $.Deferred();

    var service_url = window.localStorage.getItem('SERVICE_URL');
    db.transaction( function(tx){
        tx.executeSql('SELECT details FROM customer_contract WHERE CustomerI3D=? AND service_url=?', [param.Data, service_url], function (tx, results) {

            var contracts = [];
            for (var i=0; i<results.rows.length; i++) {
            	contracts.push(JSON.parse(results.rows.item(i).details));
            }

            var response = {
            	Message: "Local db",
            	Status: 0,
            	Result: contracts
            };

            dfr.resolve( response );
        }, dfr.reject);
    }, dfr.reject);
    
    return dfr.promise();
}

//Get Customer MasterDataLists from local db
function loadMasterDataLists (param) {
    console.log('Invoking loadMasterDataLists...');
    var dfr = $.Deferred();

    var service_url = window.localStorage.getItem('SERVICE_URL');
    db.transaction( function(tx){
        var mdl_query = 'SELECT details FROM helpdesk_master_data_list WHERE CustomerI3D=? AND service_url=?';
        console.log('ContractI3D: ' + param.Data.ContractI3D);
        console.log('MDL query: ' + mdl_query);
        tx.executeSql(mdl_query, [param.Data.CustomerI3D, service_url], function (tx, results) {

            var mdls = [];
            for (var i=0; i<results.rows.length; i++) {
            	mdls.push(JSON.parse(results.rows.item(i).details));
            }

            var response = {
            	Message: "Local db",
            	Status: 0,
            	Result: mdls

            };

            dfr.resolve( response );
        }, dfr.reject);
    }, dfr.reject);
    
    return dfr.promise();
}

//Get DeviceLinks from local db
function loadDeviceLinks (param) {
    console.log('Invoking loadDeviceLinks...');
    var dfr = $.Deferred();

    var service_url = window.localStorage.getItem('SERVICE_URL');
    var link_data = param.Data;
    var CustomerI3D = link_data.CustomerI3D;
    var HelpdeskI3D = link_data.TicketI3D;

    db.transaction( function(tx){
        tx.executeSql('SELECT details FROM customer_device_link WHERE CustomerI3D=? AND HelpdeskI3D=? AND service_url=?', [CustomerI3D, HelpdeskI3D, service_url], function (tx, results) {

            var link, links = [];
            for (var i=0; i<results.rows.length; i++) {
				link = {
					DeviceHead: JSON.parse(results.rows.item(i).details),
					HelpDeskI3D: HelpdeskI3D
				};
            	links.push(link);
            }

            var response = {
            	Message: "Local db",
            	Status: 0,
            	Result: links
            };

            dfr.resolve( response );
        }, dfr.reject);
    }, dfr.reject);
    
    return dfr.promise();
}

//Get HelpdeskByI3D from local db
function loadHelpdeskByI3D (param) {
    console.log('Invoking loadHelpdeskByI3D...');
    var dfr = $.Deferred();

    var service_url = window.localStorage.getItem('SERVICE_URL');
    db.transaction( function(tx){
        tx.executeSql('SELECT details FROM customer_helpdesk WHERE I3D=? AND service_url=?', [param.Data, service_url], function (tx, results) {

            var helpdesks = [];
            for (var i=0; i<results.rows.length; i++) {
            	helpdesks.push(JSON.parse(results.rows.item(i).details));
            }

            var response = {
            	Message: "Local db",
            	Status: 0,
            	Result: helpdesks

            };

            dfr.resolve( response );
        }, dfr.reject);
    }, dfr.reject);
    
    return dfr.promise();
}

//Get HelpdesksThroughPaging from local db
function loadHelpdesksThroughPaging (param) {

    console.log('Invoking loadHelpdesksThroughPaging...');
    var dfr = $.Deferred();

    var service_url = window.localStorage.getItem('SERVICE_URL');
    var CustomerI3D = window.sessionStorage.getItem('CustomerSelected');
    CustomerI3D = parseInt(CustomerI3D, 10);
    
    var helpdesk_filter = param.Data.HelpdeskFilter;
    console.log('Helpdesk Filter: ' + JSON.stringify(helpdesk_filter));
    
    var category = helpdesk_filter.Category;

    var state = helpdesk_filter.HelpdeskState;

    var editor = null, editors = helpdesk_filter.EditorI3Ds;
    if(editors) {
        editor = editors[0];
    }

    var helpdesk_query = 'SELECT details FROM customer_helpdesk WHERE service_url=?';
    if(CustomerI3D) {
        helpdesk_query += ' AND CustomerI3D='+CustomerI3D;
    }
    if(category) {
        helpdesk_query += ' AND MainCategory=' + category + ' OR Category1=' + category + ' OR Category2=' + category;
    }

    if(state) {
        helpdesk_query += ' AND Status='+state;
    }

    if(editor) {
        helpdesk_query += ' AND Editor='+editor;
    }
    helpdesk_query += ' ORDER BY I3D DESC';
    
    var EntriesPerPage = param.Data.EntriesPerPage;
    var CurrentPage = param.Data.Page;
    
    var helpdesk_query_with_paging = helpdesk_query;
    helpdesk_query_with_paging += ' LIMIT ' + EntriesPerPage;
    helpdesk_query_with_paging += ' OFFSET ' + (CurrentPage-1) * EntriesPerPage;
    
    console.log(helpdesk_query);
    
    var paging_response = {
        Message: "Local db",
        Status: 0,
        Result: [{
            Count: 1,
            CurrentPage: CurrentPage,
            PageCount: 1,
            Result: []
        }]
    };
    
    db.transaction( function(tx){
                   
        tx.executeSql(helpdesk_query, [service_url], function (tx, results) {

            var total_tickets = results.rows.length;
            var total_pages = Math.ceil(total_tickets/EntriesPerPage);

            paging_response.Result[0].Count = total_tickets;
            paging_response.Result[0].PageCount = total_pages;

        }, dfr.reject);
                   
        tx.executeSql(helpdesk_query_with_paging, [service_url], function (tx, results) {

            var helpdesks = [];
            for (var i=0; i<results.rows.length; i++) {
            	helpdesks.push(JSON.parse(results.rows.item(i).details));
            }

            paging_response.Result[0].Result = helpdesks;

            dfr.resolve( paging_response );
        }, dfr.reject);
    }, dfr.reject);

    return dfr.promise();
}

//Get CRMActivitiesThroughPaging from local db
function loadCRMActivitiesThroughPaging (param) {

    console.log('Invoking loadCRMActivitiesThroughPaging...' + JSON.stringify(param));
    var dfr = $.Deferred();

    var service_url = window.localStorage.getItem('SERVICE_URL');
    var CustomerI3D = window.sessionStorage.getItem('CustomerSelected');
    CustomerI3D = parseInt(CustomerI3D, 10);
    
    var crm_query = 'SELECT details FROM customer_crm_activity WHERE service_url=?';
    if(CustomerI3D) {
        crm_query += ' AND CustomerI3D='+CustomerI3D;
    }
    if(param.Data.CRMActivityFilter.OnlyActiv) {
        crm_query += ' AND State=0';
    }
    if(param.Data.CRMActivityFilter.OnlyOwn) {
        var CurrentAppUserI3D = window.localStorage.getItem('CurrentAppUserI3D');
        crm_query += ' AND ReceiverEmployee=' + CurrentAppUserI3D;
    }
    crm_query += ' ORDER BY I3D DESC';
    
    var EntriesPerPage = param.Data.entriesPerPage;
    
    var CurrentPage = param.Data.page;
    var crm_query_with_paging = crm_query;
    crm_query_with_paging += ' LIMIT ' + EntriesPerPage;
    crm_query_with_paging += ' OFFSET ' + (CurrentPage-1) * EntriesPerPage;
    
    console.log(crm_query_with_paging);
    var paging_response = {
        Message: "Local db",
        Status: 0,
        Result: [{
        	Count: 1,
        	CurrentPage: CurrentPage,
        	PageCount: 1,
        	Result: []
        }]
    };
    
    db.transaction( function(tx){
    	tx.executeSql(crm_query, [service_url], function (tx, results) {

    		var total_tickets = results.rows.length;
    		var total_pages = Math.ceil(total_tickets/EntriesPerPage);
    		paging_response.Result[0].Count = total_tickets;
    		paging_response.Result[0].PageCount = total_pages;
    	}, dfr.reject);

        tx.executeSql(crm_query_with_paging, [service_url], function (tx, results) {

            var helpdesks = [];
            for (var i=0; i<results.rows.length; i++) {
            	helpdesks.push(JSON.parse(results.rows.item(i).details));
            }

            paging_response.Result[0].Result = helpdesks;
            dfr.resolve( paging_response );
        }, dfr.reject);
    }, dfr.reject);

    return dfr.promise();
}

//Get CRMActivityByI3D from local db
function loadCRMActivityByI3D (param) {
    console.log('Invoking loadCRMActivityByI3D...');
    var dfr = $.Deferred();

    var service_url = window.localStorage.getItem('SERVICE_URL');
    db.transaction( function(tx){
        tx.executeSql('SELECT details FROM customer_crm_activity WHERE I3D=? AND service_url=?', [param.Data, service_url], function (tx, results) {

            var crm = [];
            crm.push(JSON.parse(results.rows.item(0).details));

            var response = {
            	Message: "Local db",
            	Status: 0,
            	Result: crm
            };

            dfr.resolve( response );
        }, dfr.reject);
    }, dfr.reject);
    
    return dfr.promise();
}

//Get MasterDataListsThroughPaging from local db
function loadMasterDataListsThroughPaging (param) {

    console.log('Invoking loadMasterDataListsThroughPaging...');
    var dfr = $.Deferred();

    var service_url = window.localStorage.getItem('SERVICE_URL');
    var CustomerI3D = param.Data.Filter.CustomerI3D;
    CustomerI3D = parseInt(CustomerI3D, 10);
    
    var mdl_query = 'SELECT details FROM helpdesk_master_data_list WHERE service_url=?';
    if(CustomerI3D) {
        mdl_query += ' AND CustomerI3D='+CustomerI3D;
    }
    mdl_query += ' ORDER BY I3D DESC';
    
    var EntriesPerPage = param.Data.EntriesPerPage;
    
    var CurrentPage = param.Data.Page;
    mdl_query += ' LIMIT ' + EntriesPerPage;
    mdl_query += ' OFFSET ' + (CurrentPage-1) * EntriesPerPage;
    
    console.log(mdl_query);
    var paging_response = {
        Message: "Local db",
        Status: 0,
        Result: [{
        	Count: 1,
        	CurrentPage: CurrentPage,
        	PageCount: 1,
        	Result: []
        }]
    };
    
    db.transaction( function(tx){
    	tx.executeSql('SELECT details FROM helpdesk_master_data_list WHERE service_url=?', [service_url], function (tx, results) {

    		var total_tickets = results.rows.length;
    		var total_pages = Math.ceil(total_tickets/EntriesPerPage);
    		paging_response.Result[0].Count = total_tickets;
    		paging_response.Result[0].PageCount = total_pages;
    	}, dfr.reject);

        tx.executeSql(mdl_query, [service_url], function (tx, results) {

            var mdls = [];
            for (var i=0; i<results.rows.length; i++) {
            	mdls.push(JSON.parse(results.rows.item(i).details));
            }

            paging_response.Result[0].Result = mdls;
            dfr.resolve( paging_response );
        }, dfr.reject);
    }, dfr.reject);

    return dfr.promise();
}

//Get EmployeeByI3D from local db
function loadEmployeeByI3D (param) {
    console.log('Invoking loadEmployeeByI3D...');
    var dfr = $.Deferred();

    var service_url = window.localStorage.getItem('SERVICE_URL');
    db.transaction( function(tx){
        tx.executeSql('SELECT details FROM employee WHERE I3D=? AND service_url=?', [param.Data, service_url], function (tx, results) {

            var employee = [];
            employee.push(JSON.parse(results.rows.item(0).details));

            var response = {
            	Message: "Local db",
            	Status: 0,
            	Result: employee
            };

            dfr.resolve( response );
        }, dfr.reject);
    }, dfr.reject);
    
    return dfr.promise();
}

//Get HelpdeskTimers from local db
function loadHelpdeskTimers (param) {
    console.log('Invoking loadHelpdeskTimers...');
    var dfr = $.Deferred();

    var service_url = window.localStorage.getItem('SERVICE_URL');
    db.transaction( function(tx){
        tx.executeSql('SELECT details FROM customer_helpdesk_timer WHERE HelpdeskI3D=? AND service_url=?', [param.Data, service_url], function (tx, results) {

            var timers = [];
            for (var i=0; i<results.rows.length; i++) {
            	timers.push(JSON.parse(results.rows.item(i).details));
            }

            var response = {
            	Message: "Local db",
            	Status: 0,
            	Result: timers

            };

            dfr.resolve( response );
        }, dfr.reject);
    }, dfr.reject);
    
    return dfr.promise();
}

//Get EmployeeArticles from local db
function loadEmployeeArticles (param) {
    console.log('Invoking loadEmployeeArticles...');
    var dfr = $.Deferred();

    var service_url = window.localStorage.getItem('SERVICE_URL');
    db.transaction( function(tx){
        tx.executeSql('SELECT details FROM employee_article WHERE service_url=?', [service_url], function (tx, results) {

            var articles = [];
            for (var i=0; i<results.rows.length; i++) {
            	articles.push(JSON.parse(results.rows.item(i).details));
            }

            var response = {
            	Message: "Local db",
            	Status: 0,
            	Result: articles
            };

            dfr.resolve( response );
        }, dfr.reject);
    }, dfr.reject);
    
    return dfr.promise();
}

//Get HelpdeskTimerTypes from local db
function loadHelpdeskTimerTypes (param) {
    console.log('Invoking loadHelpdeskTimerTypes...');
    var dfr = $.Deferred();

    var service_url = window.localStorage.getItem('SERVICE_URL');
    db.transaction( function(tx){
        var timer_type_query = 'SELECT details FROM helpdesk_timer_type WHERE service_url=?';
        console.log('Timer Type: ' + timer_type_query);
        tx.executeSql(timer_type_query, [service_url], function (tx, results) {

            var types = [];
            for (var i=0; i<results.rows.length; i++) {
            	types.push(JSON.parse(results.rows.item(i).details));
            }

            var response = {
            	Message: "Local db",
            	Status: 0,
            	Result: types
            };

            dfr.resolve( response );
        }, dfr.reject);
    }, dfr.reject);
    
    return dfr.promise();
}

//Get CurrentAppUser from local db
function loadCurrentAppUser (param) {
    console.log('Invoking loadCurrentAppUser...');
    var dfr = $.Deferred();

    var service_url = window.localStorage.getItem('SERVICE_URL');
    var Username = window.localStorage.getItem('Username');
    
    db.transaction( function(tx){
        tx.executeSql('SELECT details FROM employee, user_credentials WHERE employee.service_url=user_credentials.service_url AND user_credentials.service_url=? AND user_credentials.EmployeeI3D=employee.I3D AND user_credentials.user_name=?', [service_url, Username], function (tx, results) {
            if(results.rows.length) {
                var value = results.rows.item(0).details;
                value = JSON.parse(value);
                
                var user = [];
                user.push(value);
                
                var response = {
                    Message: "Local db",
                    Status: 0,
                    Result: user
                };

                dfr.resolve( response );
            } else {
                dfr.reject('No matching user data');
            }
        }, function(){
            dfr.reject('No matching user data');
        });
    }, dfr.reject);
    
    return dfr.promise();
}

//Get local logout
function localLogout (param) {
    var dfr = $.Deferred();
    
    var response = {
        Message: "Local db",
        Status: 0
    };
    
    dfr.resolve( response );
    
    return dfr.promise();
}

//Get AppSetting from local db
function loadAppSetting (param) {
    console.log('Invoking loadAppSetting...I3D: ' + param.Data);
    var dfr = $.Deferred();

    var service_url = window.localStorage.getItem('SERVICE_URL');
    db.transaction( function(tx){
        tx.executeSql('SELECT label, details FROM app_setting WHERE I3D=? AND service_url=?', [param.Data, service_url], function (tx, results) {
            //if(results.rows.length) {

                var value = results.rows.item(0).details;
                var label = results.rows.item(0).label;
                          
                var response = {
                    Message: "Local db",
                    Status: 0,
                    Result: [{
                        I3D: param.Data
                    }]
                };
                          
                if( label.indexOf('adviser') === 0 ) {
                    response.Result[0].ValueText = value;
                } else {
                    response.Result[0].Value = value;
                    
                }

                dfr.resolve( response );
            //}
        }, dfr.reject);
    }, dfr.reject);
    
    return dfr.promise();
}

//Get Login from local db
function loadLogin (param) {
    console.log('Invoking loadLogin...');
    var dfr = $.Deferred();

    db.transaction( function(tx){
        var password = param.Data.Password;
        var service_url = window.localStorage.getItem('SERVICE_URL');

        tx.executeSql('SELECT * FROM user_credentials WHERE user_name=? AND service_url=?', [param.Data.Username, service_url], function (tx, results) {
            var response = {
                Message: "Local db",
                Status: 0
            };
            var result = [];
            var encrypted_password, secret_passphrase, decrypted_password;

			var len = results.rows.length;
            if(len) {
                encrypted_password = results.rows.item(0).password;
                secret_passphrase = window.localStorage.getItem('application_id');
                //decrypted_password = CryptoJS.AES.decrypt(encrypted_password, secret_passphrase).toString(CryptoJS.enc.Utf8);
                decrypted_password = encrypted_password;

                if(password === decrypted_password) {
                    result.push('dummy_ticket');
                } else {
                    response.Status = 2;
                }
            } else {
                response.Status = 2;
            }

            response.Result = result;

            dfr.resolve( response );

        }, dfr.reject);
    }, dfr.reject);
    
    return dfr.promise();
}

//Get IsUserPasswordValid from local db
function loadUserPasswordValid (param) {
    console.log('Invoking loadUserPasswordValid...');
    var dfr = $.Deferred();

    var service_url = window.localStorage.getItem('SERVICE_URL');
    var CurrentAppUserI3D = window.localStorage.getItem('CurrentAppUserI3D');

    db.transaction( function(tx){

        tx.executeSql('SELECT * FROM user_credentials WHERE EmployeeI3D=? AND service_url=?', [CurrentAppUserI3D, service_url], function (tx, results) {

            var response = {
                Message: "Local db",
                Status: 0
            };
            var result = [];
            var encrypted_password, secret_passphrase, decrypted_password, password = param.Data;
            var len = results.rows.length;

			if(len) {
				encrypted_password = results.rows.item(0).password;
				secret_passphrase = window.localStorage.getItem('application_id');
				//decrypted_password = CryptoJS.AES.decrypt(encrypted_password, secret_passphrase).toString(CryptoJS.enc.Utf8);
                decrypted_password = encrypted_password;
                if(password === decrypted_password) {
                    result.push(true);
                } else {
                    response.Status = 2;
                }
			} else {
				response.Status = 2;
			}
            response.Result = result;

            dfr.resolve( response );
        }, dfr.reject);
    }, dfr.reject);
    
    return dfr.promise();
}

//loadHotlinesFromCustomer
//Get HotlinesFromCustomer from local db
function loadHotlinesFromCustomer (param) {
    console.log('Invoking loadHotlinesFromCustomer...');
    var dfr = $.Deferred();

    var service_url = window.localStorage.getItem('SERVICE_URL');
    db.transaction( function(tx){
        tx.executeSql('SELECT details FROM customer_hotline WHERE CustomerI3D=? AND service_url=?', [param.Data, service_url], function (tx, results) {

            var hotlines = [];
            for (var i=0; i<results.rows.length; i++) {
            	hotlines.push(JSON.parse(results.rows.item(i).details));
            }

            var response = {
            	Message: "Local db",
            	Status: 0,
            	Result: hotlines
            };

            dfr.resolve( response );
        }, dfr.reject);
    }, dfr.reject);
    
    return dfr.promise();
}

//Get loadCustomersWithPaging from local db
function loadCustomersWithPaging (param) {

    console.log('Invoking loadCustomersWithPaging...');
    var dfr = $.Deferred();

    var service_url = window.localStorage.getItem('SERVICE_URL');
    var pattern = '%' + param.Data.SearchText + '%';
    var customer_query = 'SELECT details FROM customer WHERE Name LIKE "' + pattern + '" AND service_url="' + service_url + '" ORDER BY I3D DESC';
    
    var EntriesPerPage = param.Data.EntriesPerPage;
    var CurrentPage = param.Data.Page;
    
    customer_query += ' LIMIT ' + EntriesPerPage;
    customer_query += ' OFFSET ' + (CurrentPage-1) * EntriesPerPage;
    
    console.log(customer_query);
    
    db.transaction( function(tx){

        tx.executeSql(customer_query, [], function (tx, results) {

            var customers = [];
            for (var i=0; i<results.rows.length; i++) {
            	customers.push(JSON.parse(results.rows.item(i).details));
            }

			var paging_response = {
				Message: "Local db",
				Status: 0,
				Result: customers
			};
            dfr.resolve( paging_response );
        }, dfr.reject);
    }, dfr.reject);

    return dfr.promise();
}

function saveSingleHelpdeskToDevice (helpdesk) {
    console.log('Invoking saveSingleHelpdeskToDevice...');
    var dfr = $.Deferred();
    
    db.transaction( function(tx){
        
        var service_url = window.localStorage.getItem('SERVICE_URL');
        var CustomerI3D = helpdesk.Data.CustomerI3D;
        var I3D = helpdesk.Data.I3D;
        var Number = helpdesk.Data.Number;
        
        var MainCategory = helpdesk.Data.MainCategoryI3D;
        var Category1 = helpdesk.Data.SubCategory1I3D;
        var Category2 = helpdesk.Data.SubCategory2I3D;

        var Status = helpdesk.Data.HelpdeskStatusI3D;
        var Editor = helpdesk.Data.Editors[0].I3D;
       
        var pending = 1;

        if(I3D) {
            tx.executeSql('SELECT new_entry FROM customer_helpdesk WHERE service_url=? AND I3D=?', [service_url, I3D], function(tx, results){
                var len = results.rows.length;
                var new_entry = 0;
                if(len) {
                    new_entry = results.rows.item(0).new_entry;
                }
                console.log('I3D: ' + I3D + ' new_entry: ' + new_entry);
                tx.executeSql('INSERT OR REPLACE INTO customer_helpdesk (I3D, Number, CustomerI3D, service_url, MainCategory, Category1, Category2, Status, Editor, details, pending, new_entry) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',[I3D, Number, CustomerI3D, service_url, MainCategory, Category1, Category2, Status, Editor, JSON.stringify(helpdesk.Data), pending, new_entry], function(){

                    var response = {
                        Message: "Local db",
                        Status: 0,
                        Result: [I3D]
                    };
                    dfr.resolve( response );
                }, errorCB);
            });
        } else {
            tx.executeSql('SELECT MAX(I3D) AS I3D, Number FROM customer_helpdesk', [], function(tx, results){
                var len = results.rows.length;

                I3D = results.rows.item(0).I3D;
                Number = 0;

                I3D = I3D + 1;
                console.log('I3D: ' + I3D);

                helpdesk.Data.I3D = I3D;
                helpdesk.Data.Number = Number;
                var new_entry = 1;
                          
                tx.executeSql('INSERT OR REPLACE INTO customer_helpdesk (I3D, Number, CustomerI3D, service_url, MainCategory, Category1, Category2, Status, Editor, details, pending, new_entry) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',[I3D, Number, CustomerI3D, service_url, MainCategory, Category1, Category2, Status, Editor, JSON.stringify(helpdesk.Data), pending, new_entry], function(){

                    var response = {
                        Message: "Local db",
                        Status: 0,
                        Result: [I3D]
                    };
                    dfr.resolve( response );
                }, errorCB);
            }, errorCB);
        }
    }, errorCB);

    return dfr.promise();
}

//save a Helpdesk Timer
function saveHelpdeskTimer (param) {
    console.log('Invoking saveHelpdeskTimer...');
    var dfr = $.Deferred();
    
    db.transaction( function(tx){

        var service_url = window.localStorage.getItem('SERVICE_URL');
        
        var timer = param.Data.Timer;
        var I3D = timer.I3D;
        var HelpdeskI3D = timer.HelpdeskI3D;
        var sign;

        var pending = 1;

        if(I3D) {

            tx.executeSql('SELECT new_entry FROM customer_helpdesk_timer WHERE service_url=? AND I3D=?', [service_url, I3D], function(tx, results){
                var len = results.rows.length;
                sign = param.Data.Signature;
                if(param.Data.HasSigned){
                  sign = param.Data.HasSigned;
                }
                var new_entry = 0;
                if(len) {
                    new_entry = results.rows.item(0).new_entry;
                }
                console.log('Helpdesk Timer I3D: ' + I3D + ' new_entry: ' + new_entry);
                if(!sign){
                   tx.executeSql('INSERT OR REPLACE INTO customer_helpdesk_timer ( I3D, HelpdeskI3D, service_url, details, pending, new_entry ) VALUES (?,?,?,?,?,?)',[I3D, HelpdeskI3D, service_url, JSON.stringify(timer), pending, new_entry], function(){
                                        
                                        var response = {
                                        Message: "Local db",
                                        Status: 0,
                                        Result: [I3D]
                                        };
                                        dfr.resolve( response );
                   }, errorCB);
                }else{
                   tx.executeSql('INSERT OR REPLACE INTO customer_helpdesk_timer ( I3D, HelpdeskI3D, service_url, details, sign, pending, new_entry ) VALUES (?,?,?,?,?,?,?)',[I3D, HelpdeskI3D, service_url, JSON.stringify(timer), JSON.stringify(sign), pending, new_entry], function(){
                                        
                                        var response = {
                                        Message: "Local db",
                                        Status: 0,
                                        Result: [I3D]
                                        };
                                        dfr.resolve( response );
                   }, errorCB);
                }
            });
        }
        else {
            console.log('Helpdesk Timer I3D: ' + I3D);
            tx.executeSql('SELECT MAX(I3D) AS I3D FROM customer_helpdesk_timer', [], function(tx, results){

                I3D = results.rows.item(0).I3D;
                I3D = I3D + 1;
                timer.I3D = I3D;
                sign = param.Data.Signature;
                var new_entry = 1;

                tx.executeSql('INSERT OR REPLACE INTO customer_helpdesk_timer ( I3D, HelpdeskI3D, service_url, details, sign, pending, new_entry) VALUES (?,?,?,?,?,?,?)',[I3D, HelpdeskI3D, service_url, JSON.stringify(timer), JSON.stringify(sign), pending, new_entry], function(){

                    var response = {
                        Message: "Local db",
                        Status: 0,
                        Result: [I3D]
                    };
                    dfr.resolve( response );
                }, errorCB);
            }, errorCB);
        }
    }, errorCB );

    return dfr.promise();
}

//save a CRMActivity
function saveCRMActivity (param) {
    console.log('Invoking saveCRMActivity...');
    var dfr = $.Deferred();
    
    db.transaction( function(tx){

        var service_url = window.localStorage.getItem('SERVICE_URL');
        var crm = param.Data;
        var I3D = crm.I3D;
        var ReceiverEmployee = crm.ReceiverEmployee;
        var State = crm.State;

		var CustomerI3D = window.sessionStorage.getItem('CustomerI3D');
		CustomerI3D = parseInt(CustomerI3D, 10);
                   
        var pending = 1;
    
        if(I3D) {
            //We have I3D. It may be a temporary one
            //Keep the value of new_entry flag intact in case I3D is temporary
            console.log('CRM I3D: ' + I3D);
            tx.executeSql('SELECT new_entry FROM customer_crm_activity WHERE service_url=? AND I3D=?', [service_url, I3D], function(tx, results){
                var len = results.rows.length;
                var new_entry = 0;
                if(len) {
                    new_entry = results.rows.item(0).new_entry;
                }
                console.log('CRM I3D: ' + I3D + 'new_entry: ' + new_entry);

                tx.executeSql('INSERT OR REPLACE INTO customer_crm_activity ( I3D, CustomerI3D, service_url, ReceiverEmployee, State, details, pending, new_entry) VALUES (?,?,?,?,?,?,?,?)',[I3D, CustomerI3D, service_url, ReceiverEmployee, State, JSON.stringify(crm), pending, new_entry], function(){
                    var response = {
                        Message: "Local db",
                        Status: 0,
                        Result: [I3D]
                    };
                    dfr.resolve( response );
                }, errorCB);
            });
        }
        else {
            console.log('CRM I3D: ' + I3D);
            tx.executeSql('SELECT MAX(I3D) AS I3D FROM customer_crm_activity', [], function(tx, results){
                I3D = results.rows.item(0).I3D;
                I3D = I3D + 1;
                crm.I3D = I3D;
                var new_entry = 1;

                tx.executeSql('INSERT OR REPLACE INTO customer_crm_activity ( I3D, CustomerI3D, service_url, ReceiverEmployee, State, details, pending, new_entry) VALUES (?,?,?,?,?,?,?,?)',[I3D, CustomerI3D, service_url, ReceiverEmployee, State, JSON.stringify(crm), pending, new_entry], function(){

                    var response = {
                        Message: "Local db",
                        Status: 0,
                        Result: [I3D]
                    };
                    dfr.resolve( response );
                }, errorCB);
            }, errorCB);
        }
    }, errorCB );
    return dfr.promise();
}

function saveHotlineToDb (param) {
    console.log('Invoking saveHotlineToDb...');
    var dfr = $.Deferred();
    
    db.transaction( function(tx){
        
        var service_url = window.localStorage.getItem('SERVICE_URL');
        var hotline = param.Data.HotLineDTO;
        var CustomerI3D = hotline.CustomerI3D;
        var I3D = hotline.I3D;
                   
        var pending = 1;

		if(I3D) {
            tx.executeSql('SELECT new_entry FROM customer_hotline WHERE service_url=? AND I3D=?', [service_url, I3D], function(tx, results){
                var len = results.rows.length;
                var new_entry = 0;
                if(len) {
                    new_entry = results.rows.item(0).new_entry;
                }
                console.log('I3D: ' + I3D + ' new_entry: ' + new_entry);

                tx.executeSql('INSERT OR REPLACE INTO customer_hotline (I3D, CustomerI3D, service_url, details, pending, new_entry) VALUES (?,?,?,?,?,?)',[I3D, CustomerI3D, service_url, JSON.stringify(hotline), pending, new_entry], function(){

                    var response = {
                        Message: "Local db",
                        Status: 0
                    };
                    dfr.resolve( response );
                }, errorCB);
            });
		} else {
			tx.executeSql('SELECT MAX(I3D) AS I3D FROM customer_hotline', [], function(tx, results){
				var len = results.rows.length;

				I3D = results.rows.item(0).I3D;
				I3D = I3D + 1;
				hotline.I3D = I3D;
                var new_entry = 1;

				tx.executeSql('INSERT OR REPLACE INTO customer_hotline (I3D, CustomerI3D, service_url, details, pending, new_entry) VALUES (?,?,?,?,?,?)',[I3D, CustomerI3D, service_url, JSON.stringify(hotline), pending, new_entry], function(){

					var response = {
						Message: "Local db",
						Status: 0
					};
					dfr.resolve( response );
				}, errorCB);
			}, errorCB);
        }
    }, errorCB);
    return dfr.promise();
}

function check_pending_upload() {
    var service_url = window.localStorage.getItem('SERVICE_URL');
    
    var helpdesk_tickets, helpdesk_timers, hotlines, crm_activities;

    db.transaction(function(tx){

        tx.executeSql('SELECT * FROM customer_helpdesk WHERE service_url=? AND pending=?', [service_url, 1], function(tx, results){
            helpdesk_tickets = results.rows.length;
        }, errorCB);
                   
        tx.executeSql('SELECT * FROM customer_helpdesk_timer WHERE service_url=? AND pending=?', [service_url, 1], function(tx, results){
            helpdesk_timers = results.rows.length;
        }, errorCB);
                   
        tx.executeSql('SELECT * FROM customer_hotline WHERE service_url=? AND pending=?', [service_url, 1], function(tx, results){
            hotlines = results.rows.length;
        }, errorCB);
                   
        tx.executeSql('SELECT * FROM customer_crm_activity WHERE service_url=? AND pending=?', [service_url, 1], function(tx, results){
            crm_activities = results.rows.length;
        }, errorCB);
                   
    }, errorCB, function(){
        $('#popupConfirmUploadDialog h1').html(_('Upload changes to server?'));
                   
        var message = '';
        if(helpdesk_tickets) {
            message += '<li>' + helpdesk_tickets + ' ' + _('new or changes of tickets') + '</li>';
        }
        if(helpdesk_timers) {
            message += '<li>' + helpdesk_timers + ' ' + _('new or changes of time entries') + '</li>';
        }
        if(hotlines) {
            message += '<li>' + hotlines + ' ' + _('new or changes of Hotlines') + '</li>';
        }
        if(crm_activities) {
            message += '<li>' + crm_activities + ' ' + _('new or changes of CRM entries') + '</li>';
        }

        if(message) {
            $('#popupConfirmUploadDialog ul').html( message );
            $('#popupConfirmUploadDialog').popup( "open" );
        } else {
            resume_last_activity();
        }
    });
}

function upload_pending_changes() {
    
    $('.overlay_when_uploading').show();
    
    var service_url = window.localStorage.getItem('SERVICE_URL');
    var login_ticket = window.localStorage.getItem('Ticket');
    
    var tickets_uploaded = $.Deferred();
    var device_links_uploaded = $.Deferred();
    var timers_uploaded = $.Deferred();
    var hotlinks_uploaded = $.Deferred();
    var crm_activities_uploaded = $.Deferred();

    db.transaction(function(tx){
        //upload pending Helpdesk tickets
        tx.executeSql('SELECT * FROM customer_helpdesk WHERE service_url=? AND pending=?', [service_url, 1], function(tx, results){
            var helpdesk_tickets = results.rows.length;
            console.log('Uploading tickets: ' + helpdesk_tickets);
            var data, new_entry;

            var i = 0;
            if(helpdesk_tickets) {

                (function fire_ticket(i){
                    new_entry = results.rows.item(i).new_entry;
                    data = JSON.parse(results.rows.item(i).details);

                    var provisional_i3d = data.I3D;
                    if(new_entry) {
                        delete(data.I3D);
                    }
                    delete(data.Number);

                    var helpdesk_param = {
                        Ticket: login_ticket,
                        Data: data
                    };

                    (function(provisional_i3d, new_entry, data){
                        service_request('SaveHelpdesk', helpdesk_param).done(function(response){
                            if(0 === response.Status) {
                                //update the local db with server response
                                if(new_entry) {
                                    var I3D = response.Result[0];
                                    var Number = 0;
                                    data.I3D = I3D;
                                    data.Number = Number;
                                    console.log('Updating Ticket with provisional I3D: ' + provisional_i3d + ' with I3D ' + I3D);
                                    db.transaction(function(tx){
                                        tx.executeSql('UPDATE customer_helpdesk SET I3D=?, Number=?, details=?, pending=?, new_entry=? WHERE service_url=? AND I3D=?', [I3D, Number, JSON.stringify(data), 0, 0, service_url, provisional_i3d]);
                                                   
                                        tx.executeSql('UPDATE customer_helpdesk_timer SET HelpdeskI3D=? WHERE service_url=? AND HelpdeskI3D=?', [I3D, service_url, provisional_i3d]);
                                                   
                                        tx.executeSql('UPDATE customer_device_link SET HelpdeskI3D=? WHERE service_url=? AND HelpdeskI3D=?', [I3D, service_url, provisional_i3d]);
                                    });
                                } else {
                                    db.transaction(function(tx){
                                        tx.executeSql('UPDATE customer_helpdesk SET pending=?, new_entry=? WHERE service_url=? AND I3D=?', [0, 0, service_url, provisional_i3d]);
                                    });
                                }
                                                                                               
                                i++;
                                if (helpdesk_tickets > i) {
                                    setTimeout(fire_ticket, 500, i);
                                } else {
                                    tickets_uploaded.resolve();
                                }
                            } else {
                                tickets_uploaded.reject();
                            }
                        });
                    })(provisional_i3d, new_entry, data);
                })(i);
            } else {
                tickets_uploaded.resolve();
            }
        }, errorCB);
    }, errorCB);
    
    $.when(tickets_uploaded).then(function(){
        console.log('Congratulations! Entries uploaded: tickets.');
        //upload pending Helpdesk Device Links
        db.transaction(function(tx){

            tx.executeSql('SELECT * FROM customer_device_link WHERE service_url=? AND pending=?', [service_url, 1], function(tx, results){

                var DeviceHeadI3D, HelpdeskI3D;
                var links = results.rows.length;

                console.log('Uploading Device Links: ' + links);

                var i = 0;

                if(links) {

                    (function fire_link(i){
                        
                        DeviceHeadI3D = results.rows.item(i).HelpdeskI3D;
                        HelpdeskI3D = results.rows.item(i).HelpdeskI3D;

                        var link_param = {
                            Ticket: login_ticket,
                            Data: {
                                DeviceHeadI3D: DeviceHeadI3D,
                                HelpdeskI3D: HelpdeskI3D
                            }
                        };

                        (function(HelpdeskI3D){
                            service_request('SaveDeviceLink', link_param).done(function(){
                                db.transaction(function(tx){
                                    tx.executeSql('UPDATE customer_device_link SET pending=?, new_entry=? WHERE service_url=? AND HelpdeskI3D=?', [0, 0, service_url, HelpdeskI3D]);
                                });
                                i++;
                                if (links > i) {
                                    setTimeout(fire_link, 500, i);
                                }
                                else {
                                    device_links_uploaded.resolve();
                                }
                            });
                        })(HelpdeskI3D);
                    })(i);
                } else {
                    device_links_uploaded.resolve();
                }
            }, errorCB);
        }, errorCB);
    });
    
    $.when(tickets_uploaded, device_links_uploaded).then(function(){
        console.log('Congratulations! Entries uploaded: tickets, device_links.');
        db.transaction(function(tx){

            tx.executeSql('SELECT * FROM customer_helpdesk_timer WHERE service_url=? AND pending=?', [service_url, 1], function(tx, results){

                var timers = results.rows.length;
                console.log('Uploading timers: ' + timers);
                var data, sign, new_entry, HelpdeskI3D;

                var i = 0;
                var login_ticket = window.localStorage.getItem('Ticket');
                if(timers) {
                    (function fire_timer(i){
                        new_entry = results.rows.item(i).new_entry;
                        data = JSON.parse(results.rows.item(i).details);
                        HelpdeskI3D = JSON.parse(results.rows.item(i).HelpdeskI3D);

                        //It's possible HelpdeskI3D may have changed
                        data.HelpdeskI3D = HelpdeskI3D;

                        var timer_param = {
                            Ticket: login_ticket,
                            Data: {
                                Timer: data
                            }
                        };

                        var provisional_i3d = data.I3D;
                        if(new_entry) {
                            delete(timer_param.Data.Timer.I3D);
                        }
                        sign = JSON.parse(results.rows.item(i).sign);
                        if(sign) {
                            if(!(sign == true)){
                                timer_param.Data.Signature = sign;
                            }
                        }

                        (function(provisional_i3d, new_entry, data){
                            service_request('SaveHelpdeskTimerWithSignatureAndSpecialArticles', timer_param).done(function(response){
                                //update the local db with server response
                                if(new_entry) {

                                    var I3D = response.Result[0];
                                    data.I3D = I3D;
                                    console.log('Updating Timer with provisional I3D: ' + provisional_i3d + ' with I3D ' + I3D);
                                    db.transaction(function(tx){
                                        tx.executeSql('UPDATE customer_helpdesk_timer SET I3D=?, details=?, pending=?, new_entry=? WHERE service_url=? AND I3D=?', [I3D, JSON.stringify(data), 0, 0, service_url, provisional_i3d]);
                                    });
                                } else {
                                    db.transaction(function(tx){
                                        tx.executeSql('UPDATE customer_helpdesk_timer SET pending=?, new_entry=? WHERE service_url=? AND I3D=?', [0, 0, service_url, provisional_i3d]);
                                    });
                                }
                                                                                                
                                i++;
                                if (timers > i) {
                                    setTimeout(fire_timer, 500, i);
                                } else {
                                    timers_uploaded.resolve();
                                }
                            });
                        })(provisional_i3d, new_entry, data);


                    })(i);
                } else {
                    timers_uploaded.resolve();
                }
            }, errorCB);
        }, errorCB);
    });
    
    $.when(tickets_uploaded, device_links_uploaded, timers_uploaded).then(function(){
        console.log('Congratulations! Entries uploaded: tickets, device_links, timers.');

        //upload pending Hotlines
        db.transaction(function(tx){
            tx.executeSql('SELECT * FROM customer_hotline WHERE service_url=? AND pending=?', [service_url, 1], function(tx, results){
                var hotlines = results.rows.length;
                console.log('Uploading ' + hotlines + ' Hotlines');
                var data, new_entry;
                var login_ticket = window.localStorage.getItem('Ticket');

                var i = 0;
                if(hotlines) {
                    (function fire_hotline (i){
                        new_entry = results.rows.item(i).new_entry;
                        data = JSON.parse(results.rows.item(i).details);
                              
                        var provisional_i3d = data.I3D;
                        if(new_entry){
                            delete(data.I3D);
                        }

                        var hotline_param = {
                            Ticket: login_ticket,
                            Data: {
                                HotLineDTO: data
                            }
                        };
                        (function(provisional_i3d){
                            //server does not respond with the I3D of the Hotline
                            service_request('SaveHotline', hotline_param).done(function(response){
                                //update local db to reflect sync with server
                                console.log('Updating Hotline with provisional I3D: ' + provisional_i3d );
                                db.transaction(function(tx){
                                    tx.executeSql('UPDATE customer_hotline SET pending=?, new_entry=? WHERE service_url=? AND I3D=?', [0, 0, service_url, provisional_i3d]);
                                });
                                                                               
                                i++;
                                if (hotlines > i) {
                                    setTimeout(fire_hotline, 500, i);
                                } else {
                                    hotlinks_uploaded.resolve();
                                }
                            });
                        })(provisional_i3d);
                     

                    })(i);
                } else {
                    hotlinks_uploaded.resolve();
                }
            }, errorCB);
        }, errorCB);
    });
    
    $.when(tickets_uploaded, device_links_uploaded, timers_uploaded, hotlinks_uploaded).then(function(){
        console.log('Congratulations! Entries uploaded: tickets, device_links, timers, hotlinks uploaded.');
        //upload pending CRM Activities
        db.transaction(function(tx){
            tx.executeSql('SELECT * FROM customer_crm_activity WHERE service_url=? AND pending=?', [service_url, 1], function(tx, results){
                var crms = results.rows.length;
                console.log('Uploading CRM Activities: ' + crms);
                var data, new_entry;

                var i = 0;
                if (crms) {
                    (function fire_crm (i){
                        new_entry = results.rows.item(i).new_entry;
                        data = JSON.parse(results.rows.item(i).details);
                              
                        var provisional_i3d = data.I3D;
                        if(new_entry) {
                            delete(data.I3D);
                        }

                        var crm_param = {
                            Ticket: login_ticket,
                            Data: data
                        };

                        (function(provisional_i3d, new_entry, data){
                            service_request('SaveCRMActivity', crm_param).done(function(response){
                                //update the local db with server response
                                if(new_entry) {
                                    console.log('after SaveHelpdesk request, New Entry: ' + new_entry);
                                    var I3D = response.Result[0];

                                    data.I3D = I3D;

                                    console.log('Updating CRM Activity with provisional I3D: ' + provisional_i3d + ' with I3D ' + I3D);
                                    db.transaction(function(tx){
                                        tx.executeSql('UPDATE customer_crm_activity SET I3D=?, details=?, pending=?, new_entry=? WHERE service_url=? AND I3D=?', [I3D, JSON.stringify(data), 0, 0, service_url, provisional_i3d]);
                                    });
                                } else {
                                    db.transaction(function(tx){
                                        tx.executeSql('UPDATE customer_crm_activity SET pending=?, new_entry=? WHERE service_url=? AND I3D=?', [0, 0, service_url, provisional_i3d]);
                                    });
                                }
                                                                               
                                i++;
                                if (crms > i) {
                                    setTimeout(fire_crm, 500, i);
                                } else {
                                    crm_activities_uploaded.resolve();
                                }
                            });
                        })(provisional_i3d, new_entry, data);
                    })(i);
                } else {
                    crm_activities_uploaded.resolve();
                }
            }, errorCB);
        }, errorCB);
    });
    
    $.when(tickets_uploaded, device_links_uploaded, timers_uploaded, hotlinks_uploaded, crm_activities_uploaded).then(function(){
        console.log('Congratulations! All entries uploaded.');
        $('.overlay_when_uploading').hide();
                                                                                                                      
        resume_last_activity();
    });
}

function notify_no_connection () {
    //console.log('Aborting in progress ajax requests');
    $.xhrPool.abortAll();
    time_out();

    var current_page_id = $.mobile.activePage.attr("id");
    $( '#' + current_page_id + ' .centron-alert' ).find('p').html(_('No connection available!')).end().popup('open');

    window.setTimeout(function(){
        $.mobile.changePage('#home_page', {
            transition: "flip",
            changeHash: false
        });
    }, 2000);
}

function save_webservice_request(service, param) {
    //save service, service_url, data, ticket
    //service_url and ticket as a whole is unique
    //store only the first request after the server timeout
    var service_url = window.localStorage.getItem('SERVICE_URL');
    var ticket = window.localStorage.getItem('Ticket');
    var UserI3D = window.localStorage.getItem('CurrentAppUserI3D');
    
    var current_page_id = $.mobile.activePage.attr("id");
    var CustomerName = window.sessionStorage.getItem('CustomerName');
    var CustomerI3D = window.sessionStorage.getItem('CustomerSelected');
    
    if(!CustomerI3D) {
        CustomerI3D = '';
    } else {
        if(!CustomerName){
            CustomerName = '';
        }
    }

    if(service_url && ticket && UserI3D) {
        db.transaction(function(tx){

            tx.executeSql('INSERT OR IGNORE INTO app_snapshot (service, service_url, ticket, UserI3D, CustomerI3D, CustomerName, details) VALUES (?,?,?,?,?,?,?)',[service, service_url, ticket, UserI3D, CustomerI3D, CustomerName, param]);
        });
    }
}
function resume_last_activity(){

    if('off' === window.localStorage.getItem('offline_mode')) {
        console.log('Resuming last activity...');
        var service_url = window.localStorage.getItem('SERVICE_URL');
        var UserI3D = window.localStorage.getItem('CurrentAppUserI3D');
        
        if(service_url && UserI3D) {

            db.transaction(function(tx){
                tx.executeSql('SELECT * FROM app_snapshot WHERE service_url=? AND UserI3D=? ORDER BY id DESC LIMIT 1', [service_url, UserI3D], function (tx, results) {
                    if(results.rows.length) {
                        var app_snapshot = results.rows.item(0);
                              
                        var details = app_snapshot.details;
                        window.sessionStorage.setItem('AppSnapshot', details);
                        var param = JSON.parse(details);
                        var I3D = param.Data.I3D;

                        var CustomerI3D = app_snapshot.CustomerI3D;
                        if(CustomerI3D) {
                            window.sessionStorage.setItem('CustomerSelected', CustomerI3D);
                        }
                        var CustomerName = app_snapshot.CustomerName;
                        if(CustomerName) {
                            window.sessionStorage.setItem('CustomerName', CustomerName);
                        }

                        var service = app_snapshot.service;
                        console.log('Resume Activity: ' + service);

                        switch (service) {
                            case 'SaveHelpdesk':

                                if (!I3D) {
                                    //New Helpdesk
                                    window.sessionStorage.setItem('LoadHelpdeskWithNewHelpdesk', 1);
                                } else {
                                    //Edit Helpdesk
                                    window.sessionStorage.setItem('helpdeskI3D', I3D);
                                    window.sessionStorage.setItem('LoadHelpdeskWithEditHelpdesk', 1);
                              
                                }

                                $.mobile.changePage('#helpdesk_page',{transition: 'flip', changeHash: false,reloadPage : false});
                                break;

                            case 'SaveCRMActivity':

                                if (!I3D) {
                                    //New CRM
                                    window.sessionStorage.setItem('LoadCRMWithNewCRM', 1);
                                } else {
                                    //Edit CRM
                                    window.sessionStorage.setItem('crmI3D', I3D);
                                    window.sessionStorage.setItem('LoadCRMWithEditCRM', 1);
                                }

                                $.mobile.changePage('#crm_page',{transition: 'flip', changeHash: false,reloadPage : false});
                                break;

                            case 'SaveHelpdeskTimerWithSignatureAndSpecialArticles':

                                if (!I3D) {
                                    //New CRM
                                    window.sessionStorage.setItem('LoadHelpdeskTimerWithNew', 1);
                                } else {
                                    //Edit CRM
                                    window.sessionStorage.setItem('HelpdeskTimerI3D', I3D);
                                    window.sessionStorage.setItem('LoadHelpdeskTimerWithEdit', 1);
                                }

                                $.mobile.changePage('#helpdesk_timers_page',{transition: 'flip', changeHash: false,reloadPage : false});
                                break;

                            case 'SaveHotline':
                                if(param.Data.HotLineDTO){
                                  I3D = param.Data.HotLineDTO.I3D;
                                }
                                if (!I3D) {
                                    //New CRM
                                    window.sessionStorage.setItem('LoadHotlineWithNew', 1);
                                } else {
                                    //Edit CRM
                                    window.sessionStorage.setItem('hotline_i3d', I3D);
                                    window.sessionStorage.setItem('LoadHotlineWithEdit', 1);
                                }

                                $.mobile.changePage('#hotline_details_page',{transition: 'flip', changeHash: false,reloadPage : false});
                                break;
                            default:
                                break;
                        }
                        
                    }
                });
                //once used we don't need to any snapshot for the user of the particular web service
                tx.executeSql('DELETE FROM app_snapshot WHERE service_url=? AND UserI3D=?', [service_url, UserI3D]);
            });
        }
    }
/**/
}

function find_password_from_username(username) {
    var service_url = window.localStorage.getItem('SERVICE_URL');
    
    db.transaction(function(tx){
        tx.executeSql('SELECT * FROM user_credentials WHERE user_name=? AND service_url=? AND IsSavePassword=?', [username, service_url,1], function(tx, results) {

            if(results.rows.length) {
                $('#password').val(results.rows.item(0).password);
            }
        });
    });
}

function onDeviceReady() {
    console.log('Device Ready');

    document.addEventListener("offline", notify_no_connection, false);
    document.addEventListener("online", function(){
        console.log('Connection available');
        var current_page_id = $.mobile.activePage.attr("id");
        $( '#' + current_page_id + ' .centron-alert' ).find('p').html(_('Connection available!')).end().popup('open');

    }, false);

    db = window.openDatabase("quickSuite", "1.0", "quickSuite", 5*1024*1024);
    db.transaction(createTables, errorCB, addWebServerCBSuccess);
    
    populate_default_preference();
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
    
    console.log('wizUtils...');
    cordova.plugins.wizUtils.getBundleVersion(bundleVersionSuccess);
    cordova.plugins.wizUtils.getBundleIdentifier(bundleIdentifierSuccess);
    cordova.plugins.wizUtils.getBundleDisplayName(bundleDisplayNameSuccess);
}
function bundleVersionSuccess(bundle_version) {
    $('#build_version').html(bundle_version);
}
function bundleIdentifierSuccess(bundle_identifier) {
    $('#bundle_identifier').html(bundle_identifier);
}
function bundleDisplayNameSuccess(display_name) {
    $('#display_name').html(display_name);
}
