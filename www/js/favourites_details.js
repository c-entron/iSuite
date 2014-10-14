//tested on javascriptlint.com on 12 Aug 2014

function onFavBefore(curr, next, opts) {
    var index = opts.nextSlide;
    console.log('Slider index: '+index);
    $('#fav_contact_dropdown').val(index);
    $('#fav_contact_dropdown_dummy').val($('#fav_contact_dropdown option[value="'+index+'"]').html());
}

$.mobile.document.on( "pagecreate", "#fav_details_page", function() {

    $( "#fav_details_page .centron-alert" ).popup({
        transition: "fade",
        afteropen: function( event, ui ) {
            setTimeout(function() {
                $( "#fav_details_page .centron-alert" ).popup( 'close' );
            }, 2000);
        }
    });

    $('#back_to_fav, #fav_details_close').click(function(){
        $.mobile.changePage('#home_page', {
            transition: "flip",
            changeHash: false
        });
    });

    var lang = window.localStorage.getItem('user_lang');
    if(!lang) {
        lang = 'en';
    }
    $('#fav_contact_dropdown').mobiscroll().select({
        theme: 'mobiscroll',
        lang: lang,
        display: 'bubble',
        animate: 'none',
        mode: 'scroller',
        minWidth: 200
    });
    $('#fav_contact_dropdown_dummy').click(function () {
        $('#fav_contact_dropdown').mobiscroll('show');
        return false;
    });

    $('#fav_details_page .customer_details_address').on('click', 'ul', function(){
        console.log('click on fav addesss');
        $('#fav_details_page .customer_details_address ul').removeClass('selected_address');
        $(this).addClass('selected_address');

        var AddressI3D = $(this).data('address_i3d');
        AddressI3D = parseInt(AddressI3D, 10);
        console.log('AddressI3D: '+AddressI3D);
        var ticket = window.localStorage.getItem('Ticket');
        var param = {
            Ticket: ticket,
            Data: {
                AddressI3D: AddressI3D,
                OnlyActive: true
            }
        };
        service_request('GetContactsFromAddress', param).done(function(response){

            if (0 === response.Status) {

                var contact;
                var response_html = '';
                var contact_dropdown_html = '';
                var salutation = '', contact_firstname, contact_lastname, contact_email1, contact_email2;
                $.each(response.Result, function (i, contact) {
                    if(contact && contact.I3D) {
                        salutation = (contact.Salutation) ? contact.Salutation.Salutation : '';
                        if(!salutation){
                            salutation = '';
                        }
                        contact_firstname = contact.Firstname;
                        contact_firstname = contact_firstname ? contact_firstname : '';

                        contact_lastname = contact.Lastname;
                        contact_lastname = contact_lastname ? contact_lastname : '';

                        var contact_name = salutation+' '+contact_firstname+' '+contact_lastname;
                        contact_dropdown_html += '<option value="'+i+'">'+contact_firstname+' '+contact_lastname+'</option>';

                        response_html += '<li>';
                        response_html += '<ul class="customer_contact" data-contact_i3d="'+contact.I3D+'">';
                        response_html += '<li class="contact_photo">';
                        response_html += '<div class="contact_photo_container">';
                        response_html += '<img src="img/contact_placeholder.png" width="130" height="168">';
                        response_html += '</div>';
                        response_html += '</li>';
                        response_html += '<li>'+contact_name+'</li>';

                        response_html += '<li>';
                        response_html += '<div class="field_label">E-Mail1</div>';
                        contact_email1 = contact.EMail1;
                        if(!contact_email1) {
                            response_html += '<div id="" class="field_value" >'+'<a href="#">&nbsp;</a>'+'</div>';
                        } else {
                            response_html += '<div id="" class="field_value" >'+'<a href="mailto:'+contact_email1+'">'+contact_email1+'</a>'+'</div>';
                        }
                        response_html += '</li>';

                        response_html += '<li>';
                        response_html += '<div class="field_label">E-Mail2</div>';
                        contact_email2 = contact.EMail2;
                        if(!contact_email2) {
                            response_html += '<div id="" class="field_value" >'+'<a href="#">&nbsp;</a>'+'</div>';
                        } else {
                            response_html += '<div id="" class="field_value" >'+'<a href="mailto:'+contact_email2+'">'+contact_email2+'</a>'+'</div>';
                        }
                        response_html += '</li>';

                        response_html += '<li></li>';

                        response_html += '<li>';
                        response_html += '<div class="field_label">'+_('Phone Number 1')+'</div>';
                        contact_PhoneBusiness1 = contact.PhoneBusiness1;
                        if(!contact_PhoneBusiness1) {
                            response_html += '<div id="" class="field_value" >'+'<a href="#">&nbsp;</a>'+'</div>';
                        } else {
                            response_html += '<div id="" class="field_value" >'+'<a href="tel:'+contact_PhoneBusiness1+'">'+contact_PhoneBusiness1+'</a>'+'</div>';
                        }
                        response_html += '</li>';

                        response_html += '<li>';
                        response_html += '<div class="field_label">'+_('Phone Number 2')+'</div>';
                        contact_PhoneBusiness2 = contact.PhoneBusiness2;
                        if(!contact_PhoneBusiness2) {
                            response_html += '<div id="" class="field_value" >'+'<a href="#">&nbsp;</a>'+'</div>';
                        } else {
                            response_html += '<div id="" class="field_value" >'+'<a href="tel:'+contact_PhoneBusiness2+'">'+contact_PhoneBusiness2+'</a>'+'</div>';
                        }
                        response_html += '</li>';

                        response_html += '<li>';
                        response_html += '<div class="field_label">'+_('Phone Mobile')+'</div>';
                        contact_PhoneMobile = contact.PhoneMobile;
                        if(!contact_PhoneMobile) {
                            response_html += '<div id="" class="field_value" >'+'<a href="#">&nbsp;</a>'+'</div>';
                        } else {
                            response_html += '<div id="" class="field_value" >'+'<a href="tel:'+contact_PhoneMobile+'">'+contact_PhoneMobile+'</a>'+'</div>';
                        }
                        response_html += '</li>';

                        response_html += '<li>';
                        response_html += '<div class="field_label">'+_('Phone Private')+'</div>';
                        contact_PhonePrivate = contact.PhonePrivate;
                        if(!contact_PhonePrivate) {
                            response_html += '<div id="" class="field_value" >'+'<a href="#">&nbsp;</a>'+'</div>';
                        } else {
                            response_html += '<div id="" class="field_value" >'+'<a href="tel:'+contact_PhonePrivate+'">'+contact_PhonePrivate+'</a>'+'</div>';
                        }
                        response_html += '</li>';
                        response_html += '</ul>';
                        response_html += '</li>';

                        var load_photo_contact = window.localStorage.getItem("load_photo_contact");
                        console.log('load_photo_contact: ' + load_photo_contact);
                        if ('1' === load_photo_contact) {
                            var photo_load_delay = parseInt(window.localStorage.getItem("photo_load_delay"), 10);
                            if(photo_load_delay) {
                                window.setTimeout(function(){
                                    var param = {
                                        Ticket: ticket,
                                        Data: contact.I3D
                                    };

                                    service_request('GetContactPersonImage', param).done(function(response){

                                        if (0 === response.Status) {
                                            if(response.Result && response.Result[0]) {
                                                var img_data = response.Result[0];
                                                if(img_data) {
                                                    $('ul.customer_contact[data-contact_i3d='+contact.I3D+'] .contact_photo img').attr('src', 'data:image/png;base64,' + img_data);
                                                }
                                            }
                                        }
                                    });
                                }, photo_load_delay);
                            }
                        }
                    }
                });
                $('#fav_details_page .contact_slider').html(response_html);

                $('.nav').remove();

                $('#fav_details_page .contact_slider').after('<div class="nav">').cycle({
                    pager: '#fav_details_page  .nav',
                    before: onFavBefore,
                    timeout: 0
                });
                                                              
                // **** Hide more than 18 .nav a
                hideTraverseNav(18); // pass max count

                $('#fav_contact_dropdown').html(contact_dropdown_html);

                $('#fav_contact_dropdown').mobiscroll('init');
                var lang = window.localStorage.getItem('user_lang');
                if(!lang) {
                    lang = 'en';
                }
                $('#fav_contact_dropdown').mobiscroll('option', { lang: lang });
            }
        });
    });
/*
    $('#fav_details_page .contact_dropdown').on('click', 'li', function(){
        console.log('Move to index: '+$(this).data('index'));

        $('#fav_details_page .contact_dropdown li').removeClass('selected_contact');
        $(this).addClass('selected_contact');

        $('.contact_slider').cycle($(this).data('index'));
    });
*/
    $('#fav_contact_dropdown').change(function(){
        var index = parseInt($(this).val(), 10);
        console.log('Change of contact: '+ index);
        if(!isNaN(index)) {
            $('#fav_contact_slider').cycle(index);
        }
    });
/*
    $('#fav_details_page .contact_dropdown_opener').click(function(){
        var the_opener = $(this);
        if(the_opener.hasClass('icon-left-open')) {
            the_opener.removeClass('icon-left-open').addClass('icon-down-open');
            $('#fav_details_page .contact_dropdown').show();
        }
        else {
            the_opener.addClass('icon-left-open').removeClass('icon-down-open');
            $('#fav_details_page .contact_dropdown').hide();
        }
    });
*/
    /*footer buttons*/

    /*List Helpdesks*/
    $('#fav_details_page .list_helpdesk').click(function(){
        //var CustomerI3D = window.sessionStorage.getItem('CustomerI3D');
        //window.sessionStorage.setItem('LoadHelpdeskWithCustomerI3D', CustomerI3D);

        $('#fav_details_page .select_customer').click();
        $.mobile.changePage('#helpdesk_page',{transition: 'flip', changeHash: false,reloadPage : false});
    });

    /*Show New Helpdesk form*/
    $('#fav_details_page .customer_new_helpdesk').click(function(){

        window.sessionStorage.setItem('LoadHelpdeskWithNewHelpdesk', 1);
        $('#fav_details_page .select_customer').click();
        $.mobile.changePage('#helpdesk_page',{transition: 'flip', changeHash: false,reloadPage : false});
    });

    /*List CRMs*/
    $('#fav_details_page .list-crm').click(function(){

        $('#fav_details_page .select_customer').click();
        $.mobile.changePage('#crm_page',{transition: 'flip', changeHash: false,reloadPage : false});
    });

    /*Show New CRM form*/
    $('#fav_details_page .new_crm').click(function(){

        $('#fav_details_page .select_customer').click();
        window.sessionStorage.setItem('LoadCRMWithNewCRM', 1);
        $.mobile.changePage('#crm_page',{transition: 'flip', changeHash: false,reloadPage : false});
    });

    /*Sales Information*/
    $('#fav_details_page .customer_sales_info').click(function(){
        console.log('Requesting Sales Information');
        var CustomerI3D = window.sessionStorage.getItem('CustomerI3D');
        var ticket = window.localStorage.getItem('Ticket');
        var param = {
            Ticket: ticket,
            Data: CustomerI3D
        };
        service_request('GetCRMDetailsFromCustomerI3D', param).done(function(response){

            if(0 === response.Status) {
                if(response.Result) {
                    console.log('GetCRMDetailsFromCustomerI3D  No of responses:'+response.Result.length);

                    var two_years_ago = response.Result[0];
                    var previous_year = response.Result[1];
                    var current_year = response.Result[2];

                    if(two_years_ago && previous_year && current_year){

                        var A1 = current_year.SumOfOffers - previous_year.SumOfOffers;

                        var A2 = 0;
                        if ( previous_year.SumOfOffers === 0 ) {
                            A2 = 0;
                        }
                        else {
                            A2 = ( current_year.SumOfOffers / previous_year.SumOfOffers) * 100;
                            A2 = parseInt(A2, 10);
                        }

                        var B1 = (current_year.Sales - previous_year.Sales).toFixed(2);

                        var B2 = 0;
                        if (previous_year.Sales === 0) {
                            B2 = 0;
                        }
                        else {
                            B2 = (current_year.Sales / previous_year.Sales) * 100;
                            B2 = parseInt(B2, 10);
                        }

                        var C1 = (current_year.Earnings - previous_year.Earnings).toFixed(2);

                        var C2 = 0;
                        if (previous_year.Earnings === 0) {
                            C2 = 0;
                        }
                        else { 
                            C2 = (current_year.Earnings / previous_year.Earnings) * 100;
                            C2 = parseInt(C2, 10);
                        }

                        var D1 = current_year.SumOfAttendance - previous_year.SumOfAttendance;

                        var D2 = 0;
                        if (previous_year.SumOfAttendance === 0) {
                            D2 = 0;
                        }
                        else {
                            D2 = (current_year.SumOfAttendance / previous_year.SumOfAttendance) * 100;
                            D2 = parseInt(D2, 10);
                        }

                        var data = '<div class="main_table_class"><table width="100%" class="border_table" >';

                        data += '<thead><tr>';
                        data += '<th></th><th>'+_('Sum of offers')+'</th><th>'+_('Ct.')+'</th><th>'+_('Open orders (incl. services)')+'</th>'+
                                    '<th>'+_('Ct.')+'</th>'+
                                    '<th>'+_('Turnover')+'</th>'+
                                    '<th>'+_('Earings')+'</th>'+
                                    '<th>'+_('Sum of attendance')+'</th>'+
                                    '<th>'+_('hour')+'</th>'+
                                '</tr></thead>';
                        data += '<tbody><tr>'+
                                '<td>'+_('2 years ago')+'</td>'+
                                '<td>'+localise(two_years_ago.SumOfOffers)+'</td>'+
                                '<td>'+localise(two_years_ago.OffersCount)+'</td>'+
                                '<td></td>'+
                                '<td></td>'+
                                '<td>'+localise(two_years_ago.Sales)+'</td>'+
                                '<td>'+localise(two_years_ago.Earnings)+'</td>'+
                                '<td>'+localise(two_years_ago.SumOfAttendance)+'</td>'+
                                '<td>'+localise(two_years_ago.Time)+'</td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td>'+_('Previous year')+'</td>'+
                                '<td>'+localise(previous_year.SumOfOffers)+'</td>'+
                                '<td>'+localise(previous_year.OffersCount)+'</td>'+
                                '<td></td>'+
                                '<td></td>'+
                                '<td>'+localise(previous_year.Sales.toFixed)+'</td>'+
                                '<td>'+localise(previous_year.Earnings)+'</td>'+
                                '<td>'+localise(previous_year.SumOfAttendance)+'</td>'+
                                '<td>'+localise(previous_year.Time)+'</td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td>'+_('Current year')+'</td>'+
                                '<td>'+localise(current_year.SumOfOffers)+'</td>'+
                                '<td>'+localise(current_year.OffersCount)+'</td>'+
                                '<td>'+localise(current_year.SumOfOpenErrands)+'</td>'+
                                '<td>'+localise(current_year.OpenErrandsCount)+'</td>'+
                                '<td>'+localise(current_year.Sales)+'</td>'+
                                '<td>'+localise(current_year.Earnings)+'</td>'+
                                '<td>'+localise(current_year.SumOfAttendance)+'</td>'+
                                '<td>'+localise(current_year.Time)+'</td>'+
                            '</tr>'+
                            '</tbody><tfoot>'+
                            '<tr>'+
                                '<td>'+_('Difference')+'</td>'+
                                '<td>'+localise(A1)+'</td>'+
                                '<td></td>'+
                                '<td></td>'+
                                '<td></td>'+
                                '<td>'+localise(B1)+'</td>'+
                                '<td>'+localise(C1)+'</td>'+
                                '<td>'+localise(D1)+'</td>'+
                                '<td></td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td>%</td>'+
                                '<td>'+A2+'%'+'</td>'+
                                '<td></td>'+
                                '<td></td>'+
                                '<td></td>'+
                                '<td>'+B2+'%'+'</td>'+
                                '<td>'+C2+'%'+'</td>'+
                                '<td>'+D2+'%'+'</td>'+
                                '<td></td>'+
                            '</tr>'+
                            '</tfoot>'+
                            '</table>'+
                        '</div>';

                        $('#fav_details_page .sales_information .main_table_class').html(data);
                        $('#fav_details_page .sales_information').popup( "open" );
                    }
                }
            }
        });
    });

    $('#popupDeleteFavDlg').on('popupbeforeposition', function( event, ui ) {
        console.log('beforeposition on popup');
        $('#popupDeleteFavDlg h1').html(_('Delete customer from your favourites?'));
        $('#popupDeleteFavDlg h3').html(_('Confirm, please!'));
        $('#popupDeleteFavDlg .remove_fav_no .ui-btn-text').html(_('Cancel'));
        $('#popupDeleteFavDlg .remove_fav_yes .ui-btn-text').html(_('Delete'));
    });

    //Make a Customer favourite
    $('#fav_details_page .fav_customer').click(function(){
        console.log('Favourite Customer request...');
                             
        $('#popupDeleteFavDlg').popup( "open" );
    });
                     
    $('#fav_details_page .remove_fav_yes').click(function(){
        console.log('Yes! Remove fav customer!');
        onRemoveFavCustomer();
        //$('#back_to_fav').click();
        $.mobile.changePage('#customer_details_page',{transition: 'flip', changeHash: false});
    });

    //Select a Customer
    $('#selected_fav_headline .customer_details_top, #fav_details_page .select_customer').click(function(){

        $('#selected_fav_headline').addClass('selected_customer');
        $('.select_customer').addClass('icon-ok');

        var CustomerI3D = window.sessionStorage.getItem('CustomerI3D');

        window.sessionStorage.setItem('CustomerSelected', CustomerI3D);

        var CustomerName = $('#selected_fav_name').html();
        window.sessionStorage.setItem('CustomerName', CustomerName);

        $('#wheel_selected_customer_name').html(CustomerName);
        $('#span_selected_customer').show();
        $('#span_no_selected_customer').hide();
        $('#remove_selected_customer').show();
    });

    $('#fav_details_page .download_customer').click(function(){
        download_customer_data();
    });

    $('.sales_info_close').click(function(){
        $('#fav_details_page .sales_information').popup( "close" );
    });
});
$.mobile.document.on( "pagebeforeshow", "#fav_details_page", function() {
    textAreaAttributes();
    $('#fav_details_adviser1, #fav_details_adviser2, #fav_details_pl1, #fav_details_pl2').html('');
    $('#fav_details_phone, #fav_details_fax, #fav_details_email, #fav_details_web').html('');

    $('#selected_customer_headline .fav_customer_symbol').removeClass('icon-star');
    console.log('Searching contact slider...'+$('#fav_details_page .contact_slider').length);
    $('#fav_details_page .contact_slider').html('<li>'+_('Please select an address.')+'</li>');
    $('#favHelpdeskCount').html('');

    $('#selected_fav_headline').removeClass('selected_customer');

    if(window.localStorage.getItem('offline_mode') == 'on'){
        $('#fav_details_page .download_customer').addClass('disabled');
    }else{
        $('#fav_details_page .download_customer').removeClass('disabled');
    }

    $('.nav').remove();
    $('#fav_details_page .contact_dropdown').html('');

    if(window.sessionStorage.getItem('CustomerSelected') === window.sessionStorage.getItem('CustomerI3D')) {
        $('#selected_fav_headline').addClass('selected_customer');
        $('.select_customer').addClass('icon-ok');
    }
    else {
        $('#selected_fav_headline').removeClass('selected_customer');
        $('.select_customer').removeClass('icon-ok');
    }

    window.sessionStorage.removeItem('CustomerDetails');
    window.sessionStorage.removeItem('AddressDetails');
                     
    $('#fav_contact_dropdown_dummy').val('');
});

$.mobile.document.on( "pageshow", "#fav_details_page", function() {

    var CustomerI3D = window.sessionStorage.getItem('CustomerI3D');
    $('#selected_fav_i3d').html(CustomerI3D);
    console.log('CustomerI3D: '+CustomerI3D);

    var ticket = window.localStorage.getItem('Ticket');
    var param = {
        Ticket: ticket,
        Data: CustomerI3D
    };
    service_request('GetCustomerByI3D', param).done(function(response){

        if (0 === response.Status) {
            window.sessionStorage.setItem('CustomerDetails', JSON.stringify(response.Result[0]));
            var result = '';

            $.each(response.Result, function (i, result) {
                if(result && result.I3D && result.Name && result.HelpdeskCount) {
                    var CustomerI3D = result.I3D;
                    $('#selected_fav_name').html(result.Name);
                    $('#favHelpdeskCount').html(result.HelpdeskCount);

                    var advisers = '';
                    var value_text = '';

                    var adviser1 = window.sessionStorage.getItem('adviser1');
                   
                    if(adviser1) {
                        advisers += '<li class="adviser"><div class="field_label">'+adviser1+'</div>';
                        if(result.Adviser1) {
                            value_text = result.Adviser1.DisplayText;
                            if(!value_text) {
                                value_text = '';
                            }
                        }
                        advisers += '<div id="fav_details_adviser1" class="field_value" >'+value_text+'</div></li>';
                    }

                    var adviser2 = window.sessionStorage.getItem('adviser2');
                    value_text = '';
                    if(adviser2) {
                        advisers += '<li class="adviser"><div class="field_label">'+adviser2+'</div>';
                        if(result.Adviser2) {
                            value_text = result.Adviser1.DisplayText;
                            if(!value_text) {
                                value_text = '';
                            }
                        }
                        advisers += '<div id="fav_details_adviser2" class="field_value" >'+value_text+'</div></li>';
                    }

                    var adviser3 = window.sessionStorage.getItem('adviser3');
                    value_text = '';
                    if(adviser3) {
                        advisers += '<li class="adviser"><div class="field_label">'+adviser3+'</div>';
                        if(result.Adviser3) {
                            value_text = result.Adviser3.DisplayText;
                            if(!value_text) {
                                value_text = '';
                            }
                        }
                        advisers += '<div id="fav_details_pl1" class="field_value" >'+value_text+'</div></li>';
                    }

                    var adviser4 = window.sessionStorage.getItem('adviser4');
                    value_text = '';
                    if(adviser4) {
                        advisers += '<li class="adviser"><div class="field_label">'+adviser4+'</div>';
                        if(result.Adviser4) {
                            value_text = result.Adviser4.DisplayText;
                            if(!value_text) {
                                value_text = '';
                            }
                        }
                        advisers += '<div id="fav_details_pl2" class="field_value" >'+value_text+'</div></li>';
                    }

                    $('.customer_details_info ul .adviser').remove();
                    $('.customer_details_info ul').prepend(advisers);

                    if(result.Phone) {
                        $('#fav_details_phone').html('<a href="tel:'+result.Phone+'">'+result.Phone+'</a>');
                    }
                    if(result.Fax) {
                        $('#fav_details_fax').html('<a href="tel:'+result.Fax+'">'+result.Fax+'</a>');
                    }
                    if(result.EMail) {
                        $('#fav_details_email').html('<a href="mailto:'+result.EMail+'">'+result.EMail+'</a>');
                    }
                    if(result.Website) {
                        var url = addhttp(result.Website);
                        var handler = 'window.open("'+url+'","_blank","location=yes")';
                        $('#fav_details_web').html('<a href="#" onclick='+handler+'>'+result.Website+'</a>');
                    }

                    var address_content = '';
                    console.log('AddressCount: ' +result.AddressCount);
                    if(1 === result.AddressCount) {
                        console.log('Using DefaultAddress');
                        var address = result.DefaultAddress;
                        if(address && address.I3D){
                            var street = address.Street;
                            street = street ? street : '';
                           
                            var zip = address.Zip;
                            zip = zip ? zip : '';
                           
                            var city = address.City;
                            city = city ? city : '';
                               
                            var country = '';
                            if(address.Country){
                               country = address.Country.Name;
                               country = country ? country : '';
                            }

                            window.sessionStorage.setItem('AddressDetails', JSON.stringify([address]));

                            address_content += '<ul data-address_i3d="'+address.I3D+'">';
                            address_content += '<li><div class="field_label">'+_('Street')+'</div><div class="customer_details_street field_value" >'+street+'</div></li>';
                            address_content += '<li><div class="field_label">'+_('Postcode City')+'</div><div class="customer_details_city field_value" >'+zip+' '+city+'</div></li>';
                            address_content += '<li><div class="field_label">'+_('Country')+'</div><div class="customer_details_country field_value" >'+country+'</div></li>';
                            address_content += '</ul>';

                            $('#fav_details_page .customer_details_address ul').remove();
                            $('#fav_details_page .customer_details_address').append(address_content);
                        }
                    }
                    else {
                        console.log('Not Using DefaultAddress');
                        var address_param = {
                            Ticket: ticket,
                            Data: {
                                CustomerI3D: CustomerI3D,
                                OnlyActive: true
                            }
                        };
                        service_request('GetAddressesFromCustomer', address_param).done(function(response){

                            if (0 === response.Status) {
                                window.sessionStorage.setItem('AddressDetails', JSON.stringify(response.Result));
                                console.log('No of addresses: ' + response.Result.length);
                                var addr_result;

                                $.each(response.Result, function (i, addr_result) {
                                    if(addr_result && addr_result.I3D) {
                                        address_content += '<ul data-address_i3d="'+addr_result.I3D+'">';
                                        var addr_result_street = addr_result.Street;
                                        if(!addr_result_street) {
                                            addr_result_street = '';
                                        }
                                        address_content += '<li><div class="field_label">'+_('Street')+'</div><div class="customer_details_street field_value" >'+addr_result_street+'</div></li>';
                                        var addr_result_zip = addr_result.Zip;
                                        if(!addr_result_zip) {
                                            addr_result_zip = '';
                                        }
                                        var addr_result_city = addr_result.City;
                                        if(!addr_result_city) {
                                            addr_result_city = '';
                                        }
                                        address_content += '<li><div class="field_label">'+_('Postcode City')+'</div><div class="customer_details_city field_value" >'+addr_result_zip+' '+addr_result_city+'</div></li>';
                                        var country = addr_result.Country ? addr_result.Country.Name : '';
                                        if(!country) {
                                            country = '';
                                        }
                                        address_content += '<li><div class="field_label">'+_('Country')+'</div><div class="customer_details_country field_value" >'+country+'</div></li>';
                                        address_content += '</ul>';
                                    }
                                });
                                $('#fav_details_page .customer_details_address ul').remove();
                                $('#fav_details_page .customer_details_address').append(address_content);
                            }
                        });
                    }
                }
            });
        }
    });
});
