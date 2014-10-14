//tested on javascriptlint.com on 12 Aug 2014

function clear_article_results() {
    $('#article_accordion').html('');
    $('#pull_up_article').hide();
}

var create_article_page = function(response) {

    if(0 === response.Status) {
        
        $('#article_page .no-result').remove();
        if(response.Result && response.Result.length){
            console.log('No of Articles: ' + response.Result.length);
            var i, article, accordion_content='';
            var article_code, article_description, heading, distributor;
            var picture_web_link, handler, url;
            var manufacturer_code;
            $.each(response.Result, function(i, article){
                if(article) {
                    article_code = article.ArticleCode;
                    if(!article_code) {
                        article_code = '';
                    }
                    heading = article_code + ' | ';
                       
                    article_description = article.Description;
                    if(!article_description) {
                        article_description = '';
                    }
                    heading += article_description;

                    accordion_content += '<div data-role="collapsible" class="centron_icon" data-collapsed-icon="plus" data-expanded-icon="minus"><h3>' + heading + '</h3>';

                    accordion_content += '<ul>';
                       
                    accordion_content += '<li class="large-description"><p>'+article_description+'</p></li>';
                   
                    distributor = article.DistributorName;
                    if(!distributor) {
                        distributor = '';
                    }
                    accordion_content += '<li><div><label class="article_label">'+_('DistributorName')+'</label><label>'+distributor+'</label></div><div><label class="article_label">'+_('Quantity')+'</label><label>'+article.Quantity+'</label></div><div class="cb"></div></li>';
                    accordion_content += '<li><div><label class="article_label">'+_('EANCode')+'</label><label>'+article.EANCode+'</label></div>';
                       
                    accordion_content += '<div class="gross_purchase_price">';
                    accordion_content += '<label class="gross_price article_label">'+_('GrossPrice (incl. VAT)')+'</label><label class="gross_price">'+article.GrossPrice+'</label>';
                    accordion_content += '<label class="purchase_price article_label">'+_('PurchasePrice')+'</label><label class="purchase_price">'+article.PurchasePrice+'</label>';
                    accordion_content += '</div><div class="cb"></div></li>';

                    manufacturer_code = article.ManufacturerCode ? article.ManufacturerCode : '&nbsp;';
                    if(manufacturer_code || article.ManufacturerName) {
                        accordion_content += '<li><div><label>'+manufacturer_code+'</label></div><div><label>'+article.ManufacturerName+'</label></div><div class="cb"></div></li>';
                    }
                    if(article.MainMaterialGroup || article.ManufacturerName) {
                        accordion_content += '<li><div><label>'+article.MainMaterialGroup+'</label></div><div><label>'+article.ManufacturerName+'</label></div><div class="cb"></div></li>';
                    }
                    if(article.SubMaterialGroup1 || article.SubMaterialGroup2) {
                        accordion_content += '<li><div><label>'+article.SubMaterialGroup1+'</label></div><div><label>'+article.SubMaterialGroup2+'</label></div><div class="cb"></div></li>';
                    }

                    picture_web_link = article.PictureWebLink ? article.PictureWebLink : '';
                    if(picture_web_link) {
                        url = addhttp(picture_web_link);
                        console.log('picture_web_link: '+url);
                        handler = 'window.open("'+url+'","_blank","location=yes")';
                        picture_web_link = '<a href="#" onclick='+handler+'>'+picture_web_link+'</a>';
                        accordion_content += '<li><div class="picture_web_link"><label class="article_label">' + _('PictureWebLink') + '</label></div><div><label>'+picture_web_link+'</label></div></li>';
                    }
                    accordion_content += '</ul>';

                    accordion_content += '</div>';
                }
            });
            $('#article_accordion').append(accordion_content);
            $('#article_accordion').collapsibleset();
            
            article_scroll.refresh();

            $('#pull_up_article').show();
        }
        else {
            $('#article_wrapper').before('<div class="no-result">'+_('No Article found.')+'</div>');
            $('#pull_up_article').hide();
        }
    }
};

$.mobile.document.on("pagecreate", "#article_page", function () {
    $('#article_to_home').click(function(){
        $.mobile.changePage('#home_page', {
            transition: 'flip',
            changeHash: false
        });
    });

    $( "#article_page .centron-alert" ).popup({
        transition: "fade",
        afteropen: function( event, ui ) {
            setTimeout(function() {
                $( "#article_page .centron-alert" ).popup( 'close' );
            }, 2000);
        }
    });

    var lang = window.localStorage.getItem('user_lang');
    if(!lang) {
        lang = 'en';
    }
    $('#distributor_dropdown').mobiscroll().select({
        theme: 'mobiscroll',
        lang: lang,
        display: 'bubble',
        animate: 'none',
        mode: 'scroller',
        minWidth: 200
    });/*
    $('#distributor_dropdown_dummy').click(function () {
        $('#distributor_dropdown').mobiscroll('show');
        return false;
    });*/
/*
$('#distributor_label').removeClass('icon-down-open').addClass('icon-left-open');
*/
    $('#article_accordion').on('taphold', '.gross_purchase_price', function() {
        console.log('taphold');
        $('.gross_price').hide();
        $('.purchase_price').show();
    });

    $('#article_accordion').on('touchend', '.gross_purchase_price', function() {
        console.log('released');
        $('.purchase_price').hide();
        $('.gross_price').show();
    });

    $("#bc_article_search").click(function () {
        console.log('Click on camera icon');
        try {
                console.log('cordova.plugins: '+cordova.plugins);
                cordova.plugins.barcodeScanner.scan(
                    function (result) {
                        console.log("We got a barcode\n" +
                        "Result: " + result.text + "\n" +
                        "Format: " + result.format + "\n");
                                                    
                        $('#distributor_search_text').val(result.text);
                        $("#article_search").click();
                    }, 
                    function (error) {
                        console.log("Scanning failed: " + error);
                    }
                );
        }
        catch (ex) {
            alert(ex.message);
        }
    });

    $('#article_search').click(function(){
        $('#article_accordion').html('');

        var distributor_i3d = $('#distributor_dropdown').val();
        var search_text = $('#distributor_search_text').val().trim();
        if(search_text) {
            search_text = strip_tags( search_text );
        }
        console.log('DistributorI3D: ' + distributor_i3d + ' SearchText: '+ search_text);
        if('' === search_text){
            $( "#article_page .centron-alert" ).find('p').html(_('Enter Searchtext or scan Barcode, please.')).end().popup('open');
        }
        else if(null === distributor_i3d){
            $( "#article_page .centron-alert" ).find('p').html(_('Select Distributor, please!')).end().popup('open');
        }
        else {
            var login_ticket = window.localStorage.getItem('Ticket');
            var current_page = 1;
            var article_param = {
                Ticket: login_ticket,
				Data:{
					EntriesPerPage: 10,
					Filter: {
						DistributorI3D: distributor_i3d,
						SearchText: search_text
					},
					Page: current_page
				}
            };
            service_request('SearchArticleWithPaging', article_param).done(function(response){
                create_article_page(response);
                window.sessionStorage.setItem("article_current_page", current_page);
            });
        }
    });

    //use soft keyboard enter/return/go
    $("#article_page").on("keypress", "#distributor_search_text", function(e) {
        if(e.which === 13) {
            $(this).blur();
            $('#article_search').click();
        }
    });

    $('#distributor_search_text').on('change keydown paste input', clear_article_results);
    $('#distributor_dropdown').on('change', clear_article_results);
});

$.mobile.document.on("pagebeforeshow", "#article_page", function () {
    textAreaAttributes();
    if(!window.sessionStorage.getItem('session_active')) {
        load_static_parameters();
    }

    var login_ticket = window.localStorage.getItem('Ticket');
    var dist_param = { Ticket: login_ticket };
    service_request ('GetAllDistributors', dist_param).done(function(response){
        if(0 === response.Status) {
            var i, distributor;
            //var distributors = '<li class="selected_menu_item" data-distributor_i3d="-1" ><a href="#">' + _('All Distributors') + '</a></li>';
            var distributors = '<option class="selected_menu_item" value="-1" >' + _('All Distributors') + '</option>';
            $.each(response.Result, function(i, distributor){
                if(distributor && distributor.I3D && distributor.Name) {
                    //distributors += '<li data-distributor_i3d="' + distributor.I3D + '" ><a href="#">' + distributor.Name + '</a></li>';
                    distributors += '<option value="' + distributor.I3D + '" >' + distributor.Name + '</option>';
                }
            });

            $('#distributor_dropdown').html(distributors);
            $('#distributor_dropdown').mobiscroll('init');
            var lang = window.localStorage.getItem('user_lang');
            if(!lang) {
                lang = 'en';
            }
            $('#distributor_dropdown').mobiscroll('option', { lang: lang });
        }
    });

    $('#article_accordion').html('');
    $('#article_page .no-result').remove();
    $('.pullUpLabel').html(_('Pull up to load more...'));

    $('#pull_up_article').hide();
});

$.mobile.document.on("pageshow", "#article_page", function () {
    $('#distributor_search_text').val('');
});
