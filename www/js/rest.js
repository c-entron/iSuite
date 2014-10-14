//tested on javascriptlint.com on 24 Jul 2014

/*
GetSettings
Request: { Ticket: login_ticket }
Response.Result[0]: {
    HelpdeskMainCategoryIsRequired: false,
    HelpdeskPriorityIsRequired: true,
    HelpdeskTimerCalculable: true,
    HelpdeskTypeIsRequired: false,
    MobileOfflineDataExpirationDuration: 14
}
*/

//css-tricks.com/snippets/css/remove-gray-highlight-when-tapping-links-in-mobile-safari/
//allow :active styles to work in your CSS on a page in Mobile Safari:
document.addEventListener("touchstart", function(){}, true);

var SERVICE_NAME;
var SERVICE_URL;

function loadServerData() {
    db.transaction(getallServiceData, errorCB);
}


function load_static_parameters() {
    var static_parameters = $.Deferred();

    console.log('load_static_parameters...');

    var ticket = window.localStorage.getItem('Ticket');
    if(ticket) {
        var categories_promise = service_request('GetActiveHelpdeskCategories', { Ticket: ticket}).done(function(response){
        //var categories_promise = GetActiveHelpdeskCategories().done(function(response){

            if(0 === response.Status) {
                var category_count = 0;

                //var helpdesk_categories = '<option value="0">Select all</option>';
                var helpdesk_categories = '';

                var unsorted_categories = [];
                var unique_I3ds = [];
                $.each(response.Result, function (i, result) {
                    if (-1 == $.inArray(result.I3D, unique_I3ds)) {
                        unique_I3ds.push(result.I3D);
                        var category = {
                            I3D: result.I3D,
                            Name: result.Name,
                            ParentI3D: result.ParentI3D
                        };
                        unsorted_categories.push(category);

                        var childs = result.SubCategories;
                        if (childs) {
                            $.each(childs, function (j, child) {
                                if (-1 == $.inArray(child.I3D, unique_I3ds)) {
                                    unique_I3ds.push(child.I3D);
                                    var category = {
                                        I3D: child.I3D,
                                        Name: child.Name,
                                        ParentI3D: child.ParentI3D
                                    };
                                    unsorted_categories.push(category);
                                }
                            });
                        }
                    }
                });
                //console.log(JSON.stringify(unsorted_categories));

                //stackoverflow.com/questions/12831746/javascript-building-a-hierarchical-tree
                function buildHierarchy(arry) {
                    var roots = [],
                    children = {}, i;
                    // find the top level nodes and hash the children based on parent
                    for (i = 0, len = arry.length; i < len; ++i) {
                        var item = arry[i],
                        p = item.ParentI3D,
                        target = !p ? roots : (children[p] || (children[p] = []));

                        target.push({
                            value: item
                        });
                    }
               
                    // function to recursively build the tree
                    var findChildren = function (parent) {
                       if (children[parent.value.I3D]) {
                           parent.children = children[parent.value.I3D];
                           for (var i = 0, len = parent.children.length; i < len; ++i) {
                               findChildren(parent.children[i]);
                           }
                       }
                    };

                    // enumerate through to handle the case where there are multiple roots
                    for (i = 0, len = roots.length; i < len; ++i) {
                       findChildren(roots[i]);
                    }
               
                    return roots;
                }
                var sorted_categories = buildHierarchy(unsorted_categories);
                //console.log(JSON.stringify(sorted_categories));
               
                $.each(sorted_categories, function (i, category) {
                    var gramma = category.value;
                    helpdesk_categories += '<li data-id="'+gramma.I3D+'" data-val="' + gramma.Name + '">' + gramma.Name;

                    var parents = category.children;
                    if (parents) {
                        helpdesk_categories += '<ul>';
                        if(parents.length) {
                            helpdesk_categories += '<li data-id="0" data-val="---" >---</li>';
                            $.each(parents, function (j, parent) {
                                var mom = parent.value;
                                helpdesk_categories += '<li data-id="'+mom.I3D+'" data-val="' + mom.Name + '">' + mom.Name;

                                var babies = parent.children;
                                if (babies) {
                                    helpdesk_categories += '<ul>';
                                    if(babies.length) {
                                        helpdesk_categories += '<li data-id="0" data-val="---" >---</li>';
                                        $.each(babies, function (j, baby) {
                                            var me = baby.value;
                                            helpdesk_categories += '<li data-id="'+me.I3D+'" data-val="' + me.Name + '">' + me.Name + '</li>';
                                        });
                                    }
                                    helpdesk_categories += '</ul>';
                                }
                                helpdesk_categories += '</li>';
                            });
                        }
                        helpdesk_categories += '</ul>';
                    }
                    helpdesk_categories += '</li>';
                });

                var categories_for_new_edit_helpdesk = '<li data-id="0" data-val="---" >---</li>'+helpdesk_categories;
                $('#hd_category').html(categories_for_new_edit_helpdesk);
                $('#hd_category, #hd_category_dummy').val('---').change();
                

                var categories_for_filter = '<li data-id="0" data-val="Select all" >'+_('Select all')+'</li>'+helpdesk_categories;
                $('#helpdesk_categories').html(categories_for_filter);
            }
        });

        var states_promise = service_request('GetHelpdeskStates', { Ticket: ticket}).done(function(response){

            if(0 === response.Status) {

                var helpdesk_states = '';
                $.each(response.Result, function (i, result) {
                    if(result && result.I3D && result.Name) {
                        helpdesk_states += '<option value="'+result.I3D+'">' + result.Name + '</option>';
                    }
                });

                if(helpdesk_states) {
                    $('#hd_status').html(helpdesk_states);

                    $('#status_after_forwarding').html(helpdesk_states);

                    helpdesk_states = '<option value="0" >'+_('Select all')+'</option>'+helpdesk_states;
                    $('#helpdesk_states').html(helpdesk_states);
                }
           }
        });

        var employees_promise = service_request('GetEmployees', { Ticket: ticket}).done(function(response){

            if(0 === response.Status) {

                var helpdesk_editors = '';
                $.each(response.Result, function (index, result) {
                    if(result && result.I3D && result.ShortSign && result.LastName && result.FirstName) {
                        helpdesk_editors += '<option value="'+result.I3D+'">' + result.ShortSign + ' &brvbar; ' + result.LastName + '&#44; ' + result.FirstName + '</option>';
                    }
                });
                if(helpdesk_editors) {
                    $('#hd_responsibility').html('<option>---</option>' + helpdesk_editors);
               
                    helpdesk_editors = '<option value="0">'+_('Select all')+'</option>'+helpdesk_editors;
                    $('#helpdesk_editors').html(helpdesk_editors);
                }
            }
        });

        var employee_departments_promise = service_request('GetEmployeeDepartments', { Ticket: ticket}).done(function(response){

            if (0 === response.Status) {
           
                var departments = '';
                $.each(response.Result, function (i, result) {
                    if(result && result.Name && result.Employees) {
                        departments += '<a href="#1" class="forwardHD_mainLink_active forwardHD_to icon-left-open">'+result.Name+' (<span class="employee_count">'+result.Employees.length+'</span>)</a>';
                        if(result.Employees.length){
                            departments += '<ul class="forwardHD_subLinks">';

                            $.each(result.Employees, function (i, employee) {
                                if(employee && employee.I3D && employee.DisplayText) {
                                    departments += '<li>';
                                    departments += '<input type="checkbox" name="mail_to" id="to_'+result.Name+'_'+employee.I3D+'" value="'+employee.I3D+'" />';
                                    departments += '<label for="to_'+result.Name+'_'+employee.I3D+'">'+employee.DisplayText+'</label>';
                                    departments += '</li>';
                                }
                            });
                            departments += '</ul>';
                        }
                    }
                });
                if(departments) {
                    $('.hd_forward_to .forwardHD_headerLink').html(departments);
                }

                departments = '';
                $.each(response.Result, function (i, result) {
                    if(result && result.Name && result.Employees) {
                        departments += '<a href="#1" class="forwardHD_mainLink_active forwardHD_to icon-left-open">'+result.Name+' (<span class="employee_count">'+result.Employees.length+'</span>)</a>';
                        if(result.Employees.length){
                            departments += '<ul class="forwardHD_subLinks">';

                            $.each(result.Employees, function (i, employee) {
                                if(employee && employee.I3D && employee.DisplayText) {
                                    departments += '<li>';
                                    departments += '<input type="checkbox" name="mail_cc" id="cc_'+result.Name+'_'+employee.I3D+'" value="'+employee.I3D+'" />';
                                    departments += '<label for="cc_'+result.Name+'_'+employee.I3D+'">'+employee.DisplayText+'</label>';
                                    departments += '</li>';
                                }
                            });
                            departments += '</ul>';
                        }
                    }
                });
                if(departments) {
                    $('.hd_forward_cc .forwardHD_headerLink').html(departments);
                }

                departments = '';
                $.each(response.Result, function (i, result) {
                    if(result && result.Name && result.Employees) {
                        departments += '<a href="#1" class="forwardHD_mainLink_active forwardHD_to icon-left-open">'+result.Name+' (<span class="employee_count">'+result.Employees.length+'</span>)</a>';
                        if(result.Employees.length){
                            departments += '<ul class="forwardHD_subLinks">';

                            $.each(result.Employees, function (i, employee) {
                                if(employee && employee.I3D && employee.DisplayText) {
                                    departments += '<li>';
                                    departments += '<input type="checkbox" name="mail_bcc" id="bcc_'+result.Name+'_'+employee.I3D+'" value="'+employee.I3D+'" />';
                                    departments += '<label for="bcc_'+result.Name+'_'+employee.I3D+'">'+employee.DisplayText+'</label>';
                                    departments += '</li>';
                                }
                            });
                            departments += '</ul>';
                        }
                    }
                });
                if(departments) {
                    $('.hd_forward_bcc .forwardHD_headerLink').html(departments);
                }
            }
        });

        var helpdesk_priorities_promise = service_request('GetActiveHelpdeskPriorities', { Ticket: ticket}).done(function(response){

            if (0 === response.Status) {

                var result, hd_priority = '';
                $.each(response.Result, function (i, result) {
                    if(result && result.I3D && result.Name) {
                        hd_priority += '<option value="' + result.I3D + '">' + result.Name + '</option>';
                    }
                });
                if(hd_priority) {
                    $('#hd_priority').html(hd_priority);
                }
            }
        });

        var helpdesk_types_promise = service_request('GetHelpdeskTypes', { Ticket: ticket}).done(function(response){

            if (0 === response.Status) {
                var result, hd_type = '';
                $.each(response.Result, function (i, result) {
                    if(result && result.I3D && result.Name) {
                        hd_type += '<option value="' + result.I3D + '">' + result.Name + '</option>';
                    }
                });
                if(hd_type) {
                    $('#hd_type').html('<option>---</option>' + hd_type);
                }
            }
        });

        //series of ajax requests
        //load label and value of adviser checkboxes: adviser1', 'adviser2', 'adviser3', 'adviser4 and
        //load default value of other params
        var app_settings_dfd = $.Deferred();
        $(function () {
            var adviser = [959, 960, 961, 962, 687, 1512, 173, 690, 696], current = 0;
            var checkbox_id = ['adviser1', 'adviser2', 'adviser3', 'adviser4', 'DefaultStatus', 'DefaultResponsibility', 'DefaultPriority', 'DefaultHelpdeskStateForwarding', 'InactiveHelpdeskStatusI3D'];
            var advisers_html = '';
          
            var login_ticket = window.localStorage.getItem('Ticket');
            var app_settings_param = {
                Ticket: login_ticket
            };

            function do_ajax() {

                if (current < adviser.length) {

                    app_settings_param.Data = adviser[current];
                    service_request('GetAppSettingByI3D', app_settings_param).done(function (response) {

                        var value, label_for = checkbox_id[current];
                        current++;
                        if (0 === response.Status) {
                                                                                   
                            if(adviser.length === current) {
                                //End of loop
                                app_settings_dfd.resolve();
                            }
                                                                                   
                            $.each(response.Result, function (i, result) {
                                if(result) {
                                    value = null;
                                    //for advisers it is ValueText, otherwise it is Value
                                    if( label_for.indexOf('adviser') === 0 ) {
                                        value = result.ValueText;
                                        if(value) {
                                            advisers_html += '<input type="checkbox" id="'+label_for+'">';
                                            advisers_html += '<label for="'+label_for+'" >'+value+'</label>';
                                        }
                                        if(adviser.length === current) {
                                            $('#ForwardHelpdeskPopup .helpdesk_advisers').html(advisers_html);
                                        }
                                    } else {
                                        value = result.Value;
                                    }

                                    if(value) {
                                        window.sessionStorage.setItem(label_for, value);
                                    }
                                }
                            });
                        } else {
                            if(adviser.length === current) {
                                //End of loop
                                app_settings_dfd.reject();
                            }
                        }
                        do_ajax();
                    });
                }
            }
            do_ajax();
        });
        
        $.when( categories_promise, states_promise, employees_promise, employee_departments_promise, helpdesk_priorities_promise, helpdesk_types_promise, app_settings_dfd ).then( function(){
            console.log('Categories, States, Employees, Employee Departments, Helpdesk Priorities, Helpdesk Types, App Settings loaded');
            static_parameters.resolve();
            window.sessionStorage.setItem('session_active', true);
        });
    }
    return static_parameters;
}

var CheckConnection = function(url){
    url = url + '/CheckConnection';
    return $.ajax({
        beforeSend: function () {
            console.log('Request: ' + url);
        },
        crossDomain: true,
        url: url,
        cache: false,
        type: 'POST',
        dataType: 'json',
        crossDomain: true,
        contentType: 'application/json'
    });
};

var online_service_request = function(service, param){
	var SERVICE_URL = window.localStorage.getItem("SERVICE_URL");
    var url = SERVICE_URL + '/' + service;
    return $.ajax({
        beforeSend: function () {
            console.log('Request: ' + url);
            console.log('Param:' + $(this).attr('data'));
        },
        crossDomain: true,
        url: url,
        type: 'POST',
        cache: false,
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(param),
        error: function (jqXHR, textStatus, errorThrown ) {

            var response = '<ul>';
            response += '<li>Status: '+jqXHR.status+'</li>';
            response += '<li>statusText: '+jqXHR.statusText+'</li>';
            response += '<li>responseText: '+jqXHR.responseText+'</li>';
            response += '</ul>';

            var error_msg = '';
            error_msg += '<li><strong>Web Service:</strong> ' + service + '</li>';
            if('Login' !== service) {
                error_msg += '<li><strong>Parameters:</strong> '+$(this).attr('data')+'</li>';
            }
            error_msg += '<li><strong>Response:</strong> '+response+'</li>';

            var current_page_id = $.mobile.activePage.attr("id");
            var error_popup = $('#' + current_page_id + ' .ws_error_message');
            error_popup.find('.ws_error_content').append(error_msg);
            error_popup.show();
        },
        complete: function (jqXHR) {
            console.log('Complete: ' + service);
            var response = jQuery.parseJSON(jqXHR.responseText);
            var param = $(this).attr('data');
            var services_to_be_saved = ['SaveHelpdesk','SaveCRMActivity','SaveHelpdeskTimerWithSignatureAndSpecialArticles','SaveHotline'];

            if(2 === response.Status) {
                if (service && services_to_be_saved.indexOf(service) !== -1 && param) {
                    //console.log('***Webservice: '+ service);
                    //console.log('***Param: '+ param);
                    if(service === 'SaveHelpdesk') {
                        var deviceHeadI3D = $('#master_data_list').val();
                        deviceHeadI3D = parseInt(deviceHeadI3D, 10);
                        if(deviceHeadI3D) {
                            var json_param = JSON.parse(param);
                            json_param.Data.DeviceHeadI3D = deviceHeadI3D;
                            param = JSON.stringify(json_param);
                        }
                    }
                  
                    save_webservice_request(service, param);
                }
                time_out();
                $.mobile.changePage('#login_page',{transition: 'flip', changeHash: false});
            }
            /*
            else if(0 === response.Status) {

                if (service && services_to_be_saved.indexOf(service) !== -1 && param) {
                    console.log('***Webservice: '+ service);
                    console.log('***Param: '+ param);
                    save_webservice_request(service, param);
                }
            }
            */
            else if (1 === response.Status && 'GetSignatureFromHelpdeskTimer' !== service) {
                var error_msg = '';
                error_msg += '<li><strong>Web Service:</strong> ' + service + '</li>';
                if('Login' !== service) {
                error_msg += '<li><strong>Parameters:</strong> '+$(this).attr('data')+'</li>';
                }
                error_msg += '<li><strong>Response:</strong> '+JSON.stringify(response)+'</li>';
                  
                var current_page_id = $.mobile.activePage.attr("id");
                var error_popup = $('#' + current_page_id + ' .ws_error_message');
                error_popup.find('.ws_error_content').append(error_msg);
                error_popup.show();
            }
        }
    });
};

//not all services have offline mode
var offline_service_request = function(service, param){
    if ( 'GetCustomerByI3D' == service ){
        return loadCustomerDetails (param);
    }
    else if ( 'GetAddressesFromCustomer' == service ) {
        return loadCustomerAddressDetails (param);
    }
    else if ( 'GetContactsFromAddress' == service ) {
        return loadCustomerContactsFromAddress (param);
    }
    else if ( 'GetCRMDetailsFromCustomerI3D' == service ) {
        return loadCRMDetails (param);
    }
    else if ( 'GetContactPersonImage' == service ) {
        return loadContactPersonImage (param);
    }
    else if ( 'GetActiveHelpdeskCategories' == service ) {
        return loadHelpdeskCategories (param);
    }
    else if ( 'GetHelpdeskStates' == service ) {
        return loadHelpdeskStates (param);
    }
    else if ( 'GetEmployees' == service ) {
        return loadEmployees (param);
    }
    else if ( 'GetEmployeeDepartments' == service ) {
        return loadEmployeeDepartments (param);
    }
    else if ( 'GetContractsByCustomerI3D' == service ) {
        return loadContracts (param);
    }
    else if ( 'GetMasterDataListFromContract' == service ) {
        return loadMasterDataLists (param);
    }
    else if ( 'GetActiveHelpdeskPriorities' == service ) {
        return loadHelpdeskPriorities (param);
    }
    else if ( 'GetHelpdeskTypes' == service ) {
        return loadHelpdeskTypes (param);
    }
    else if ( 'GetAddressByI3D' == service ) {
        return loadAddressByI3D (param);
    }
    else if ( 'GetHelpdeskByI3D' == service ) {
        return loadHelpdeskByI3D (param);
    }
    else if ( 'GetHelpdesksThroughPaging' == service ) {
        return loadHelpdesksThroughPaging (param);
    }
    else if ( 'SearchCRMActivitiesThroughPaging' == service ) {
        return loadCRMActivitiesThroughPaging (param);
    }
    else if ( 'GetActiveHelpdeskTimersFromHelpdesk' == service ) {
        return loadHelpdeskTimers (param);
    }
    else if ( 'GetSignatureFromHelpdeskTimer' == service ) {
        return loadHelpdeskTimerSignature (param);
    }
    else if ( 'SaveHelpdesk' == service ) {
        return saveSingleHelpdeskToDevice (param);
    }
    else if ( 'GetEmployeeArticlesFromTicket' == service ) {
        return loadEmployeeArticles (param);
    }
    else if ( 'GetHelpdeskTimerTypes' == service ) {
        return loadHelpdeskTimerTypes (param);
    }
    else if ( 'GetAppSettingByI3D' == service ) {
        return loadAppSetting (param);
    }
    else if ( 'SaveHelpdeskTimerWithSignatureAndSpecialArticles' == service ) {
        return saveHelpdeskTimer (param);
    }
    else if ( 'GetAddressContactsFromCustomer' == service ) {
        return loadCustomerContactsFromCustomer (param);
    }
    else if ( 'SaveCRMActivity' == service ) {
        return saveCRMActivity (param);
    }
    else if ( 'GetCRMActivityByI3D' == service ) {
        return loadCRMActivityByI3D (param);
    }
    else if ( 'GetEmployeeByI3D' == service ) {
        return loadEmployeeByI3D (param);
    }
    else if ( 'GetHotlinesFromCustomerByI3D' == service ) {
        return loadHotlinesFromCustomer (param);
    }
    else if ( 'SaveHotline' == service ) {
        return saveHotlineToDb (param);
    }
    else if ( 'SearchCustomerBySearchTextWithPaging' == service ) {
        return loadCustomersWithPaging (param);
    }
    else if ( 'GetCurrentAppUser' == service ) {
        return loadCurrentAppUser (param);
    }
    else if ( 'Login' == service ) {
        return loadLogin (param);
    }
    else if ( 'IsUserPasswordValid' == service ) {
        return loadUserPasswordValid (param);
    }
    else if ( 'SaveDeviceLink' == service ) {
        return SaveDeviceLinkToDb (param);
    }
    else if ( 'SearchMasterDataListsThroughPaging' == service ) {
        return loadMasterDataListsThroughPaging (param);
    }
    else if ( 'GetDeviceLinks' == service ) {
        return loadDeviceLinks (param);
    }
    else if ( 'Logout' == service ) {
        return localLogout (param);
    }
};

var service_request = function(service, param){
    var deferred = $.Deferred();
    
    var offline_mode = window.localStorage.getItem('offline_mode');
    
    //online mode
    if( 'off' == offline_mode ) {
        deferred = online_service_request(service, param);
    } else if( 'on' == offline_mode ) {//offline mode
        console.log('Service: '+ service);
        deferred = offline_service_request(service, param);
    }
    return deferred.promise();
};
