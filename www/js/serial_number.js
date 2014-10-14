//tested on javascriptlint.com on 10 Jul 2014

var create_serial_number_list = function(response) {
	var barcode_row = '';
    var barcode_sn, barcode_article_code, barcode_order, barcode_delivery_note, barcode_invoice;
    
	if( response.Result && response.Result[0] && response.Result[0].Result) {
        if(response.Result[0].Count) {
            $.each(response.Result[0].Result, function (i, barcode) {
                if(barcode && barcode.I3D) {
                    barcode_sn = barcode.Name;
                    barcode_article_code = barcode.ArticleCode;
                    barcode_order = barcode.OrderNumber;
                    barcode_delivery_note = barcode.DeliveryListNumber;
                    barcode_invoice = barcode.InvoiceNumber;

                    barcode_sn = barcode_sn ? barcode_sn : '';
                    barcode_article_code = barcode_article_code ? barcode_article_code : '';
                    barcode_order = barcode_order ? barcode_order : '';
                    barcode_delivery_note = barcode_delivery_note ? barcode_delivery_note : '';
                    barcode_invoice = barcode_invoice ? barcode_invoice : '';

                    barcode_row += '<tr data-i3d="'+barcode.I3D+'">';
                    barcode_row += '<td class="sn-number">'+barcode_sn+'</td>';
                    barcode_row += '<td class="sn-article-code">'+barcode_article_code+'</td>';
                    barcode_row += '<td class="sn-order">'+barcode_order+'</td>';
                    barcode_row += '<td class="sn-delivery-note">'+barcode_delivery_note+'</td>';
                    barcode_row += '<td class="sn-invoice">'+barcode_invoice+'</td>';
                    barcode_row += '</tr>';
                }
            });
            $('#barcode_table_data tbody').append(barcode_row);
            $('#pull_up_serial_number').show();
        } else {
            barcode_row += '<tr>';
            barcode_row += '<td colspan="5">'+_('No barcode found')+'</td>';
            barcode_row += '</tr>';
            $('#barcode_table_data tbody').html(barcode_row);

            $('#pull_up_serial_number').hide();
        }
	}
	else {
		barcode_row += '<tr>';
		barcode_row += '<td colspan="5">'+_('No barcode found')+'</td>';
		barcode_row += '</tr>';
        $('#barcode_table_data tbody').html(barcode_row);

        $('#pull_up_serial_number').hide();
	}
	serial_number_scroll.refresh();
	$('.barcode_main_container').show();
};

$.mobile.document.on("pagecreate", "#serial_number_page", function () {
    window.sessionStorage.setItem("serial_number_current_page", 1);

    $('#serial_number_back').click(function(){
        $("#serial_number_input").val('');
        $('#barcode_table_data tbody').html('');
        $('.barcode_main_container, .grey_pop_up_container').hide();

        $.mobile.changePage('#home_page', {
            transition: "flip",
            changeHash: false
        });
    });

    $( "#serial_number_page .centron-alert" ).popup({
        transition: "fade",
        afteropen: function( event, ui ) {
            setTimeout(function() {
                $( "#serial_number_page .centron-alert" ).popup( 'close' );
            }, 2000);
        }
    });

    $('#icon_trash').click(function(){
        $("#serial_number_input").val('');
        $('#barcode_table_data tbody').html('');
        $('.barcode_main_container, .grey_pop_up_container').hide();
    });

    //use soft keyboard enter/return/go
    $("#serial_number_page").on("keypress", "input[type=text]", function(e) {
        //check for enter key
        if(e.which === 13) {
            $(this).blur();
            $("#icon_search").click();
        }
    });

    $("#icon_search").click(function () {
        var barcode = $("#serial_number_input").val();
        if(barcode) {
            barcode = strip_tags( barcode );
        }
        if ( !barcode ) {
            $( "#serial_number_page .centron-alert" ).find('p').html(_('Enter or scan serial number, please.')).end().popup('open');
            return;
        }

        $('#barcode_table_data tbody').html('');
        GetBarcodesDetailThroughPaging(barcode, 1);
    });
                     
    $("#icon_camera").click(function () {

        try {
            cordova.plugins.barcodeScanner.scan(
                function (result) {
                    console.log("We got a barcode\n" +
                    "Result: " + result.text + "\n" +
                    "Format: " + result.format + "\n");
                                                
                    $('#serial_number_input').val(result.text);
                    $("#icon_search").click();
                }, 
                function (error) {
                    console.log("Scanning failed: " + error);
                }
            );
        }
        catch (ex) {
            navigator.notification.alert(ex.message);
        }
    });
                     
    $('#barcode_table_data tbody').on('click', 'tr', function(){
        var barcode = $(this);

        $('#barcode_table_data tbody tr').removeClass('selected_barcode');
        barcode.addClass('selected_barcode');

        var barcode_i3d = barcode.data('i3d');

        if(barcode_i3d){
            var login_ticket = window.localStorage.getItem('Ticket');
            var sn_param = {
                Ticket: login_ticket,
                Data: barcode_i3d
            };
            service_request('GetSerialNumberCompactByI3D', sn_param).done(function(response){
                if (0 === response.Status && response.Result && response.Result[0]) {
                    var serial_no = response.Result[0];

                    var article_code = serial_no.ArticleCode;
                    var description = serial_no.ArticleDescription;
                    var goods_receipt = serial_no.WareHeadNumber;
                    var receipt_date = serial_no.WareHeadDate;

                    var invoice = serial_no.InvoiceHeadNumber;
                    var invoice_date = serial_no.InvoiceHeadDate;

                    var information = serial_no.Description;
                          
                    console.log('Calculating age in months...');
                    var age_in_months = '';
                    if(receipt_date) {
                        console.log('receipt_date available.');
                        age_in_months = monthDiff(new Date(), moment(receipt_date).toDate());
                    }
                    else if(invoice_date) {
                        console.log('No receipt_date. Using invoice_date instead.');
                        age_in_months = monthDiff(new Date(), moment(invoice_date).toDate());
                    }
                    else {
                        console.log('Neither receipt_date nor invoice_date available.');
                    }

                    article_code = article_code ? article_code : '&nbsp;';
                    description = description ? description : '&nbsp;';
                    goods_receipt = goods_receipt ? goods_receipt : '&nbsp;';

                    if(receipt_date) {
                        var receipt_date_moment = moment( receipt_date );
                        receipt_date = receipt_date_moment.format("DD.MM.YYYY");
                    } else {
                        receipt_date = '&nbsp;';
                    }

                    invoice = invoice ? invoice : '&nbsp;';

                    if(invoice_date) {
                        var invoice_date_moment = moment( invoice_date );
                        invoice_date = invoice_date_moment.format("DD.MM.YYYY");
                    } else {
                        invoice_date = '&nbsp;';
                    }

                    information = information ? information : '&nbsp;';

                    $('.sn_article_code').next().html(article_code);
                    $('.sn_description').next().html(description);
                    $('.sn_goods_receipt').next().html(goods_receipt);
                    $('.sn_receipt_date').next().html(receipt_date);
                    $('.sn_invoice').next().html(invoice);
                    $('.sn_invoice_date').next().html(invoice_date);
                    $('.sn_information').next().html(information);

                    $('.sn_age_in_months').next().html(age_in_months);

                    $('.grey_pop_up_container').show();
                }
            });
        }
    });

    $('#serial_number_page .close_ticket_details').click(function(){
        $('.grey_pop_up_container').hide();
        return false;
    });
});

$.mobile.document.on("pagebeforeshow", "#serial_number_page", function () {
    $("#serial_number_input").val('');
    $('#barcode_table_data tbody').html('');
    $('.barcode_main_container, .grey_pop_up_container').hide();
});

function GetBarcodesDetailThroughPaging(barcode, current_page) {
    var login_ticket = window.localStorage.getItem('Ticket');
    var barcode_param = {
        Ticket: login_ticket,
        Data: {
            BarcodeFilter: {
                Barcode: barcode
            },
            EntriesPerPage: 10,
            Page: current_page
        }
    };
    service_request('GetBarcodesThroughPaging', barcode_param).done(function (response) {
        if (0 === response.Status) {
            create_serial_number_list(response);
        }
    });
}
