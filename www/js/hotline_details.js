//tested on javascriptlint.com on 09 Jul 2014

function restore_hotline_snapshot(classID) {
    console.log('Recovering Hotline State...');
    var details = window.sessionStorage.getItem('AppSnapshot');
    window.sessionStorage.removeItem('AppSnapshot');
    if(details) {
        var param = JSON.parse(details);

        var state_data = param.Data;
        if(Object.keys(state_data).length) {
            var ShortDescription = state_data.HotLineDTO.ShortDescription;
            if(ShortDescription) {
                $( "#hotline_details_data ." + classID ).find('input[name="hotline_short_description"]').val(ShortDescription);
            }
            var UserName = state_data.HotLineDTO.UserName;
            if(UserName) {
                $( "#hotline_details_data ." + classID ).find('input[name="hotline_user"]').val(UserName);
            }
            var Password = state_data.HotLineDTO.Password;
            if(Password) {
                $( "#hotline_details_data ." + classID ).find('input[name="hotline_password"]').val(Password);
            }
            var IP = state_data.HotLineDTO.IP;
            if(IP) {
                $( "#hotline_details_data ." + classID ).find('input[name="hotline_ip"]').val(IP);
            }
            var Subnet = state_data.HotLineDTO.Subnet;
            if(Subnet) {
                $( "#hotline_details_data ." + classID ).find('input[name="hotline_subnet"]').val(Subnet);
            }
            var DialIn = state_data.HotLineDTO.DialIn;
            if(DialIn) {
                $( "#hotline_details_data ." + classID ).find('input[name="hotline_dialin"]').val(DialIn);
            }
            var Comment = state_data.HotLineDTO.Comment;
            if(Comment) {
                $( "#hotline_details_data ." + classID ).find('textarea[name="hotline_comment"]').val(Comment);
            }
        }
    }
}

$.mobile.document.on( "pagecreate", "#hotline_details_page", function() {
                     
    $( "#hotline_details_page .centron-alert" ).popup({
        transition: "fade",
        afteropen: function( event, ui ) {
            setTimeout(function() {
                $( "#hotline_details_page .centron-alert" ).popup( 'close' );
            }, 2000);
        }
    });
                     
    $('#details_to_hotline').click(function(){
        $('.ws_error_content').html('');
        $('.ws_error_message').hide();
                                   
        $.mobile.changePage('#hotline_page', {
            transition: "flip",
            changeHash: false
        });
    });
    $('#details_to_home').click(function(){
        $.mobile.changePage('#home_page', {
            transition: "flip",
            changeHash: false
        });
    });

    $('#hotline_details_data').on('click', 'button[name="hotline_submit"]', function(){

        var customer_i3d = window.sessionStorage.getItem('CustomerSelected');
        customer_i3d = parseInt(customer_i3d, 10);

        var form = $(this).parent().parent();

        var data = {};

        var hotline_short_description = form.find('input[name="hotline_short_description"]').val().trim();
        if(hotline_short_description) {
            hotline_short_description = strip_tags( hotline_short_description );
        }
        if ( !hotline_short_description ) {
            $( "#hotline_details_page .centron-alert" ).find('p').html(_('Invalid Short Description!')).end().popup('open');
            return false;
        }
        else {
            data = {
                HotLineDTO: {
                    CustomerI3D: customer_i3d,
                    ShortDescription: hotline_short_description,
                    Status: 1
                }
            };
        }

        var hotline_i3d = form.data('hotline_i3d');
        if(hotline_i3d){
            data.HotLineDTO.I3D = hotline_i3d;
        }
                                  
        var hotline_user = form.find('input[name="hotline_user"]').val().trim();
        if(hotline_user) {
            hotline_user = strip_tags( hotline_user );
        }
        if (hotline_user){
            if( !validateName(hotline_user)) {
                $( "#hotline_details_page .centron-alert" ).find('p').html(_('Invalid user name!')).end().popup('open');
                return false;
            }
            else {
                data.HotLineDTO.UserName = hotline_user;
            }
        }

        var hotline_password = form.find('input[name="hotline_password"]').val().trim();
        if(hotline_password) {
            hotline_password = strip_tags( hotline_password );
        }
        if ( hotline_password ) {
            data.HotLineDTO.Password = hotline_password;
        }

        var hotline_ip = form.find('input[name="hotline_ip"]').val().trim();
        if ( hotline_ip ){
            if(!validateIp(hotline_ip)) {
                $( "#hotline_details_page .centron-alert" ).find('p').html(_('Invalid IP!')).end().popup('open');
                return false;
            }
            else {
                data.HotLineDTO.IP = hotline_ip;
            }
        }

        var hotline_subnet = form.find('input[name="hotline_subnet"]').val().trim();
        if ( hotline_subnet ){
            if(!validateIp(hotline_subnet)) {
                $( "#hotline_details_page .centron-alert" ).find('p').html(_('Invalid Subnet!')).end().popup('open');
                return false;
            }
            else {
                data.HotLineDTO.Subnet = hotline_subnet;
            }
        }

        var hotline_dialin = form.find('input[name="hotline_dialin"]').val().trim();
        if(hotline_dialin) {
            hotline_dialin = strip_tags( hotline_dialin );
        }
        if(hotline_dialin ) {
            data.HotLineDTO.DialIn = hotline_dialin;
        }

        var hotline_comment = form.find('textarea[name="hotline_comment"]').val().trim();
        if(hotline_comment) {
            hotline_comment = strip_tags( hotline_comment );
            hotline_comment = hotline_comment.replace(/(\r\n|\n|\r)/gm, ' ');
        }
        if(hotline_comment ) {
            data.HotLineDTO.Comment = hotline_comment;
        }

        var login_ticket = window.localStorage.getItem('Ticket');
        var hotline_param = {
            Ticket: login_ticket,
            Data: data
        };
        service_request('SaveHotline', hotline_param).done(function(response){

            if(0 === response.Status) {
                console.log('Hotline updated!');
                load_hotline_details();
            }
        });
    });

    $('.new_hotline').click(function(){
        console.log('New Hotline request');
        //if new hotline form is already open
        if(!$('#hotline_details_data .new_hotline_form').length){

            var html = '<div data-role="collapsible" data-collapsed="false" class="new_hotline_form centron_icon" data-collapsed-icon="plus" data-expanded-icon="minus"><h3>New Hotline</h3>';

            html += '<p class="hotline" >';

            html += '<label for="hotline_short_description">Short Description</label>';
            html += '<input type="text" name="hotline_short_description" value="" maxlength="50" >';

            html += '<label for="hotline_user">UserName</label>';
            html += '<input type="text" name="hotline_user" value="" maxlength="60" >';

            html += '<label for="hotline_password">Password</label>';
            html += '<input type="text" name="hotline_password" value="" maxlength="60" >';

            html += '<label for="hotline_ip">IP</label>';
            html += '<input type="text" name="hotline_ip" value="" maxlength="15" >';

            html += '<label for="hotline_subnet">Subnet</label>';
            html += '<input type="text" name="hotline_subnet" value="" maxlength="15" >';

            html += '<label for="hotline_dialin">DialIn</label>';
            html += '<input type="text" name="hotline_dialin" value="" maxlength="50" >';

            html += '<label for="hotline_comment">Comment</label>';
            html += '<textarea name="hotline_comment" maxlength="1000" rows="6"></textarea>';

            html += '<button data-inline="true" data-mini="true" name="hotline_submit">Save</button>';

            html += '</p>';
            html += '</div>';

            $('#hotline_details_data').append(html);
            $('#hotline_details_data input, #hotline_details_data textarea').textinput();

            $('#hotline_details_data button').button();
            $('#hotline_details_data .new_hotline_form button').parent().show();

            $('#hotline_details_data').find('div[data-role=collapsible]').collapsible();
        } else {//show existing new hotline form
            console.log('Searching new Hotline: '+$('#hotline_details_data .new_hotline_form').length);
            $('#hotline_details_data .new_hotline_form').trigger('expand');
            $('.edit_hotline').trigger('click');
        }

        $('#hotline_details_data .new_hotline_form')[0].scrollIntoView(true);
    });

    $('.edit_hotline').click(function(){
        var hotline = $('#hotline_details_data .ui-collapsible:not(.ui-collapsible-collapsed)');

        if(hotline.length) {
            hotline.find('input, textarea').prop('readonly', false).textinput();
            hotline.find('input[name="hotline_short_description"]').focus();
            hotline.find('button').parent().show();
        } else {//show existing new hotline form
            console.log('Searching new Hotline: '+$('#hotline_details_data .new_hotline_form').length);

            var new_hotline_form = $('#hotline_details_data .new_hotline_form');
            if(new_hotline_form.length) {
                new_hotline_form.trigger('expand');
                $('.edit_hotline').trigger('click');
            }
            else {
                $( "#hotline_details_page .centron-alert" ).find('p').html(_('Select Hotline entry, please.'));
                $( "#hotline_details_page .centron-alert" ).popup('open');
            }
        }
        return false;
    });

    $('#hotline_details_data').on( "collapse", 'div[data-role=collapsible]', function( event, ui ) {

        var hotline = $(this);

        if(!hotline.hasClass('new_hotline_form')) {
            hotline.find('input, textarea').prop('readonly', true).textinput();
            hotline.find('button').parent().hide();
        }
    });

    $('#hotline_details_data').on('focus', 'input[type="text"]:not([readonly]), textarea:not([readonly])', function(){
        //Header: keyboard opening up

        window.setTimeout(function () {
            $('#hotline_details_page div.header[data-role="header"]').hide();
        }, 500);
    });

    $('#hotline_details_data').on('blur', 'input[type="text"]:not([readonly]), textarea:not([readonly])', function(){
        //Header: keyboard closing
        $('#hotline_details_page div.header[data-role="header"]').show();
    });

    $('#hotline_details_data').on('focus', 'input[readonly], textarea[readonly]', function(){
        //Showing footer again

        window.setTimeout(function () {
            $('div[data-role="footer"]').removeClass('ui-fixed-hidden').css({display: 'block'});
        }, 500);
    });
});

$.mobile.document.on( "pagebeforeshow", "#hotline_details_page", function() {

});
$.mobile.document.on("pageshow", "#hotline_details_page", function () {
    var LoadHotlineWithNew = window.sessionStorage.getItem('LoadHotlineWithNew');
    var LoadHotlineWithEdit = window.sessionStorage.getItem('LoadHotlineWithEdit');
    if (LoadHotlineWithNew) {
        console.log('Issuing New Hotline...');
        $('.new_hotline').click();
        setTimeout(function(){
            restore_hotline_snapshot('new_hotline_form');
        },100);
        window.sessionStorage.removeItem("LoadHotlineWithNew");
    } else if (LoadHotlineWithEdit) {
        var hotline_i3d = window.sessionStorage.getItem('hotline_i3d');
        if(hotline_i3d) {
            $( "#hotline_details_data ." + hotline_i3d ).trigger( "expand" );
            setTimeout(function(){
                restore_hotline_snapshot(hotline_i3d);
                $('.edit_hotline').click();
            },100);
            window.sessionStorage.removeItem("LoadHotlineWithEdit");
        }
    }else{
        $('#hotline_details_data').html('');
        load_hotline_details();
    }
});
