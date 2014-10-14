//tested on javascriptlint.com on 15 Jul 2014

var load_hotline_details = function () {
    var customer_i3d = window.sessionStorage.getItem('CustomerSelected');
    customer_i3d = parseInt(customer_i3d, 10);
    if(customer_i3d > 0) {

        var login_ticket = window.localStorage.getItem('Ticket');
        var hotline_param = {
            Ticket: login_ticket,
            Data: customer_i3d
        };
        service_request('GetHotlinesFromCustomerByI3D', hotline_param).done(function(response){

            if(0 === response.Status) {
                var html = '';
                var dial_in, ip, subnet, user_name, password;
                var short_description, comment;

                $.each(response.Result, function(i, result){
                    if(result && result.I3D && result.ShortDescription) {
                        short_description = result.ShortDescription;
                        short_description = short_description ? short_description : 'No Short Description';

                        comment = result.Comment;
                        comment = comment ? comment : '';

                        user_name = result.UserName;
                        user_name = user_name ? user_name : '';
                        password = result.Password;
                        password = password ? password : '';

                        ip = result.IP;
                        ip = ip ? ip : '';
                        subnet = result.Subnet;
                        subnet = subnet ? subnet : '';
                        dial_in = result.DialIn;
                        dial_in = dial_in ? dial_in : '';

                        html += '<div data-role="collapsible" class="centron_icon '+ result.I3D +'" data-collapsed-icon="plus" data-expanded-icon="minus"><h3>' + short_description + '</h3>';

                        html += '<p class="hotline" data-hotline_i3d="'+result.I3D+'">';

                        html += '<label for="hotline_short_description">Short Description</label>';
                        html += '<input readonly type="text" name="hotline_short_description" value="'+short_description+'" maxlength="50" >';

                        html += '<label for="hotline_user">UserName</label>';
                        html += '<input readonly type="text" name="hotline_user" value="'+user_name+'" maxlength="60" >';

                        html += '<label for="hotline_password">Password</label>';
                        html += '<input readonly type="text" name="hotline_password" value="'+password+'" maxlength="60" >';

                        html += '<label for="hotline_ip">IP</label>';
                        html += '<input readonly type="text" name="hotline_ip" value="'+ip+'" maxlength="15" >';

                        html += '<label for="hotline_subnet">Subnet</label>';
                        html += '<input readonly type="text" name="hotline_subnet" value="'+subnet+'" maxlength="15" >';

                        html += '<label for="hotline_dialin">DialIn</label>';
                        html += '<input readonly type="text" name="hotline_dialin" value="'+dial_in+'" maxlength="50" >';

                        html += '<label for="hotline_comment">Comment</label>';
                        html += '<textarea readonly name="hotline_comment" maxlength="1000" rows="6">'+comment+'</textarea>';

                        html += '<button data-inline="true" data-mini="true" name="hotline_submit">'+_('Save')+'</button>';

                        html += '</p>';
                        html += '</div>';
                    }
                });

                $('#hotline_details_data').html(html);
                $('#hotline_details_data input, #hotline_details_data textarea').textinput();
                $('#hotline_details_data button').button();
                $('#hotline_details_data').find('div[data-role=collapsible]').collapsible();

                $('#hotline_details_data')[0].scrollIntoView();
            }
        });
    }
    else {
        $( "#hotline_page .centron-alert" ).find('p').html(_('Customer not found.')).end().popup('open');
    }
};

$.mobile.document.on( "pagecreate", "#hotline_page", function() {

    $( "#hotline_page .centron-alert" ).popup({
        transition: "fade",
        afteropen: function( event, ui ) {
            setTimeout(function() {
                $( "#hotline_page .centron-alert" ).popup( 'close' );
            }, 2000);
        }
    });

    $('#hotline_to_home').click(function(){
        $.mobile.changePage('#home_page', {
            transition: "flip",
            changeHash: false
        });
    });

    //use soft keyboard enter/return/go
    $("#hotline_page").on("keypress", "input[type=password]", function(e) {
        //check for enter key
        if(e.which === 13) {
            $(this).blur();
            $("#validate_hotline_password").click();
        }
    });

    $('#validate_hotline_password').click(function(){
        var password = $('#password_hotline').val().trim();
        if(password) {
            password = strip_tags( password );
        }
        password = password.trim();
        if(!password) {
            $( "#hotline_page .centron-alert" ).find('p').html(_('Enter password, please.')).end().popup('open');
            return;
        }
        else {
            var login_ticket = window.localStorage.getItem('Ticket');
            var password_param = {
                Ticket: login_ticket,
                Data: password
            };
            service_request('IsUserPasswordValid', password_param).done(function(response){

                if(0 === response.Status) {
                    console.log('Password validated!');
                    $.mobile.changePage('#hotline_details_page', {
                        transition: "flip",
                        changeHash: false
                    });
                }
                else {
                    $.mobile.changePage('#home_page', {
                        transition: "flip",
                        changeHash: false
                    });
                }
            });
        }
    });
});

$.mobile.document.on( "pagebeforeshow", "#hotline_page", function() {
    textAreaAttributes();
    $('#password_hotline').val('');

    $('#validate_hotline_password').html(_('Validate'));
    $('#validate_hotline_password').button( "refresh" );
});
