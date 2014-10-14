//tested on javascriptlint.com on 08 Jul 2014

//validations, tools like add http:// if not there in an url etc.

function validateEmail(email) {
    if (email.length) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    else {
        return true;
    }
}

function validateName(name) {
    //var re = /^[a-zA-Z]+(?:[ -][. a-zA-Z0-9]+)*$/;
    var re = /^[a-zA-Z_][0-9a-zA-Z. ]+$/;
    return re.test(name);
}
                      
function validateIp(ip) {
    var re = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return re.test(ip);
}
                      
function validateURI(uri) {
    return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(uri);
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
var all_hail_iScroll = function (e) {
    e.preventDefault;
};

function monthDiff(d2, d1) {
    console.log(d1 + ' ' + d2);
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth() +1;
    return months <= 0 ? 0 : months;
}
                      
function addhttp(url) {
   if (!/^(f|ht)tps?:\/\//i.test(url)) {
      url = "http://" + url;
   }
   return url;
}
       
var css_friendly_name = function(area){
    //css friendly name
    var area_slug = area.replace(/[()]/g,'').split(' ').join('_');
    return area_slug;
};
/*
var timestamp_to_hour_minute = function (timestamp){

    var date = new Date(timestamp);
    
    var time_hh = date.getHours();
    if( time_hh < 10) {
        time_hh = '0' + time_hh;
    }
    var time_mm = date.getMinutes();
    if( time_mm < 10) {
        time_mm = '0' + time_mm;
    }
    var hh_mm_string = time_hh + ':' + time_mm;
    return hh_mm_string;
};
*/
var onlyUnique = function (value, index, self) {
    return self.indexOf(value) === index;
};

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function leadByZero(number) {
	if(isNumber(number)) {
		number = parseInt(number, 10);
		if (number < 10) {
			number = '0' + number;
        }
	}
	return number;
}
                        
//phpjs.org/functions/strip_tags/
function strip_tags(input, allowed) {
  allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
    commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
  return input.replace(commentsAndPhpTags, '').replace(tags, function($0, $1) {
      return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
    });
}
//phpjs.org/functions/number_format/
function number_format(number, decimals, dec_point, thousands_sep) {
  number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return '' + (Math.round(n * k) / k).toFixed(prec);
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

function localise(number) {
    var lang = window.localStorage.getItem('user_lang');
    var formatted_string = '';
    if('de' == lang) {
       formatted_string = number_format(number, 2, ',', '.');
    } else {
       formatted_string = number_format(number, 2, '.', ',');
    }
    return formatted_string;
}
function hideTraverseNav(maxCount){
   var i = 0;
   $('.nav a').each(function(){
      i = i + 1;
      if(i > maxCount){
         $(this).hide();
      }
   });
}
function textAreaAttributes(){       
       $('input:text, textarea').attr( "maxlength", "100");
       $('input:text, textarea').on( "blur", function(){
           var valueC = $(this).val();
           var boolC = isHTML(valueC);
           if(boolC){
              var currentPage = $.mobile.activePage.attr('id');
              $("#" + currentPage + " .centron-alert-info" ).find('p').html(_('HTML tags are not allowed.')).end().popup();
              $("#" + currentPage + " .centron-alert-info" ).find('p').html(_('HTML tags are not allowed.')).end().popup('open');
              $(this).val('');
              $(this).focus();
           }
       });
}
function isHTML(valueC){
       var a = document.createElement('div');
       a.innerHTML = valueC;
       for (var c = a.childNodes, i = c.length; i--; ) {
            if (c[i].nodeType == 1) {
                return true;
            }
       }
       return false;
}