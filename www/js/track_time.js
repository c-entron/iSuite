//tested on javascriptlint.com on 15 Jul 2014

//Flow based on mail by Volker on 22 Dec 2013

function get_time_offset (){
    var tzOffset = moment().tz('Europe/Vienna').zone();

    var tzDirection = tzOffset > 0 ? '-': '+';
    tzOffset = Math.abs(tzOffset);

    var tzOffset_h = parseInt(tzOffset / 60, 10);
    var tzOffset_m = tzOffset - tzOffset_h * 60;

    if (tzOffset_h < 10) {
        tzOffset_h = '0' + tzOffset_h;
    }
    if (tzOffset_m < 10) {
        tzOffset_m = '0' + tzOffset_m;
    }
    var tzOffset_string = tzDirection + tzOffset_h + tzOffset_m;
    return tzOffset_string;
}

function get_duration(){
	var duration_hour = parseInt($('#duration_hour').val(), 10);
	duration_hour = isNaN(duration_hour)? 0 : duration_hour;

	var duration_minute = parseInt($('#duration_minute').val(), 10);
	duration_minute = isNaN(duration_minute)? 0 : duration_minute;

	var duration = (duration_hour*60+duration_minute)*60;
    return duration;
}

function update_duration(value, increment){
    var duration = get_duration();

    if(increment) {
        duration = (duration+value*60);
    }
    else {
        duration = (duration-value*60);
    }
    if(duration>=0){
        duration_hour = parseInt(duration/3600, 10);

        duration_minute = (duration-duration_hour*3600)/60;

        duration_hour = leadByZero(duration_hour);
        $('#duration_hour').val(duration_hour);

        duration_minute = leadByZero(duration_minute);
        $('#duration_minute').val(duration_minute).change();
    }
}

function get_lunch_break(){
    var break_hour = parseInt($('#break_hour').val(), 10);
    break_hour = isNaN(break_hour)? '00' : break_hour;

    var break_minute = parseInt($('#break_minute').val(), 10);
    break_minute = isNaN(break_minute)? '00' : break_minute;

    var lunch_break = (break_hour*60+break_minute)*60;
    return lunch_break;
}

function update_break(value, increment){
    var duration = get_duration();

    if(!duration && increment) {
        return;
    }
    var lunch_break = get_lunch_break();

    if(increment) {
        lunch_break = (lunch_break+value*60);
    }
    else {
        lunch_break = (lunch_break-value*60);
    }
    if(lunch_break>=0){
        break_hour = parseInt(lunch_break/3600, 10);

        break_minute = (lunch_break-break_hour*3600)/60;

        break_hour = leadByZero(break_hour);
        $('#break_hour').val(break_hour);

        break_minute = leadByZero(break_minute);
        $('#break_minute').val(break_minute).change();
    }
}

function get_start_time(){

    var date = $("#date_start").mobiscroll('getDate');
    var start_obj = new Date(date);

    start = start_obj.getTime();

	return start;
}

function get_stop_time(){

    var date = $("#date_end").mobiscroll('getDate');
    var stop_obj = new Date(date);

	stop = stop_obj.getTime();
    return stop;
}

function init_start_stop_time() {

	var now_obj = new Date();

    $('#date_start').mobiscroll('setDate', now_obj, true, 1000);
    $('#date_end').mobiscroll('setDate', now_obj, true, 1000);

    $('#duration_hour, #duration_minute, #break_hour, #break_minute').val('00');
}

$(document).on('blur', 'input, textarea', function() {
    $('[data-role="footer"]').show();
}).on('focus', 'input, textarea', function() {
    $('[data-role="footer"]').hide();
});
