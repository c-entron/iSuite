//tested on javascriptlint.com on 15 Jul 2014

var close_stopwatch_popup = function(){

    var jqm_page_id = $('div[data-role="page"].ui-page-active').attr('id');

    $( '.stopwatch-popup' ).hide('slide', { direction: "left" }, 500);
    $( '.stopwatch-popup-overlay' ).hide();

    $('#helpdesk_timers_page.stopwatch-available .open-stopwatch-bar, #helpdesk_timers_page.stopwatch-available .open-stopwatch').show();

    $('.stopwatch-duration input').each(function(){
        var interval_id = $(this).attr('data-interval_id');
        if(interval_id) {
            console.log('Closing interval: '+interval_id);
            window.clearInterval( interval_id );
            $(this).attr('data-interval_id', false);
        }
    });
};

function transfer_stopwatch_to_time_entry(transfer_button) {
	console.log('Data transfer request');

	transfer_button.addClass('active-transfer-stopwatch');
	setTimeout(function(){
		transfer_button.removeClass('active-transfer-stopwatch');
	}, 1000);

	var stopwatch = transfer_button.closest( '.stopwatch' );

	var note = stopwatch.find('textarea[name="stopwatch-note"]').val();
	$('#HDTimer_description').val(note);

	var internal_note = stopwatch.find('textarea[name="stopwatch-internal-note"]').val();
	$('#internal_note').val(internal_note);

	var start_timestamp = stopwatch.find('label[for="stopwatch-start"]').attr('data-timestamp');
	start_timestamp = parseInt(start_timestamp, 10);
	var start_date_obj = new Date(start_timestamp);
	$('#date_start').mobiscroll('setDate', start_date_obj, true, 1000);

	var stop_timestamp = stopwatch.find('label[for="stopwatch-stop"]').attr('data-timestamp');
	console.log('stop_timestamp: '+stop_timestamp);
	stop_timestamp = parseInt(stop_timestamp, 10);
	console.log('stop_timestamp: '+stop_timestamp);
	var stop_date_obj;
	if(stop_timestamp){
		stop_date_obj = new Date(stop_timestamp);
	}
	else {
		stop_date_obj = new Date();
	}
	$('#date_end').mobiscroll('setDate', stop_date_obj, true, 1000);

	var id = stopwatch.data('id');
	$('.remove_stopwatch_yes').data('stopwatch-id', id);
								 
	$('#popupDeleteStopwatch h1').html(_('Transfer complete!'));
	$('#popupDeleteStopwatch h3.ui-title').html(_('Delete Stopwatch?'));
	$('.remove_stopwatch_no .ui-btn-text').html(_('Cancel'));
	$('.remove_stopwatch_yes .ui-btn-text').html(_('Delete'));

	$('#popupDeleteStopwatch, #popupDeleteStopwatchOverlay').show();
}

var init_stopwatch = function(){
    
    $(".stopwatch-popup").one({
        popupbeforeposition: function (e, ui) {
            console.log('popupbeforeposition');
            $('.ui-popup-screen').off();
        }
    });
    
    $('.stopwatch-container').on('click', 'textarea[name="stopwatch-note"], textarea[name="stopwatch-internal-note"]', function(e){
        console.log('click on textarea');
        $(this).focus();
        return false;
    });
    
    $('.stopwatch-container').on('click', 'a[name="stopwatch-start"]', function(){

        var hour, min, second;
        var the_stopwatch;

        var time_obj = new Date();

        hour = time_obj.getHours();
        if (hour<10) {
            hour = '0' + hour;
        }

        min = time_obj.getMinutes();
        if (min<10) {
            min = '0' + min;
        }
        $(this).focus();
        the_stopwatch = $(this).closest( '.stopwatch' );

        $(this).next('label').html( hour + ':' + min);
        $(this).next('label').attr('data-timestamp', time_obj.getTime());

        var stop_button = the_stopwatch.find('a[name="stopwatch-stop"]');
        stop_button.next('label').html( '00:00');
        stop_button.next('label').attr('data-timestamp', '0');

        var jqm_page_id = $('div[data-role="page"].ui-page-active').attr('id');
        var running_stopwatches = $('#'+jqm_page_id+' .stopwatch-duration input[data-interval_id!="false"]').length;
        console.log('No of running stopwatches: '+running_stopwatches);
        if(running_stopwatches <= 3){
            hour = 0;
            minute = 0;
            second = 0;
            var output_el = the_stopwatch.find('.stopwatch-duration input');

            var interval_id = output_el.attr('data-interval_id');

            if(interval_id){
                window.clearInterval(interval_id);
            }

            interval_id = window.setInterval(function(){

                second += 1;
                if(second>59){
                    second = 0;
                    minute += 1;
                    if(minute > 59) {
                        minute = 0;
                        hour += 1;
                    }
                }
                output_el.val(leadByZero(hour)+':'+leadByZero(minute)+':'+leadByZero(second));
            }, 1000);
                                     
            output_el.attr('data-interval_id', interval_id);
        }
    });

    $('.stopwatch-container').on('click', 'a[name="stopwatch-stop"]', function(){
        
        var start_time, stop_time, duration_obj, duration, duration_hour, duration_min;
        var hour, min;
        var time_obj = new Date();

        hour = time_obj.getHours();
        if (hour<10) {
            hour = '0' + hour;
        }

        min = time_obj.getMinutes();
        if (min<10) {
            min = '0' + min;
        }
        $(this).focus();
        $(this).next('label').html( hour + ':' + min);
                                 
        stop_time = time_obj.getTime();
        $(this).next('label').attr('data-timestamp', '');
        $(this).next('label').attr('data-timestamp', stop_time);
                                                   
        the_stopwatch = $(this).closest( '.stopwatch' );
        start_time = the_stopwatch.find('a[name="stopwatch-start"]').next('label').attr('data-timestamp');

		if(start_time && stop_time) {

            duration_obj = new Date(stop_time - start_time);
            duration = duration_obj.getTime()/1000;

            duration_hour = parseInt (duration/3600, 10);
                                                                                         
            duration_min = parseInt ((duration - duration_hour*3600)/60, 10);
                                                                                         
            if (duration_hour<10) {
                duration_hour = '0' + duration_hour;
            }
            if (duration_min<10) {
                duration_min = '0' + duration_min;
            }
            var interval_id = the_stopwatch.find('.stopwatch-duration input').attr('data-interval_id');
            if(interval_id) {
                window.clearInterval( interval_id );
                the_stopwatch.find('.stopwatch-duration input').attr('data-interval_id', false);
            }
            the_stopwatch.find('.stopwatch-duration input').val(duration_hour+':'+duration_min);
        }        
    });

    $('.stopwatch-container').on('click', 'a[name="stopwatch-delete"]', function(){

        var delete_button = $(this);
        delete_button.addClass('active-delete-stopwatch');
        setTimeout(function(){
            delete_button.removeClass('active-delete-stopwatch');
        }, 1000);

        var the_stopwatch = $(this).closest( '.stopwatch' );

        var output_el = the_stopwatch.find('.stopwatch-duration input');
        var interval_id = output_el.attr('data-interval_id');
        if(interval_id){
            window.clearInterval(interval_id);
        }

        var id = the_stopwatch.data('id');
        delete_stopwatch(id);
        the_stopwatch.remove();
        load_all_stopwatch();
    });

    $('.stopwatch-popup a[name="stopwatch-new"]').click(function(){
                                                  
        var stopwatch = '<div class="stopwatch" data-id="'+Date.now()+'">';
        stopwatch += '<h1 class="stopwatch-separator icon-stopwatch">&nbsp;</h1>';
        stopwatch += '<div class="stopwatch-duration"><input readonly value="00:00"></div>';
        stopwatch += '<div class="stopwatch-action">';

        stopwatch += '<a href="#" name="stopwatch-start" data-role="button" data-inline="true">Start</a><label for="stopwatch-start">00:00</label>';
        stopwatch += '<a href="#" name="stopwatch-stop" data-role="button" data-inline="true">Stop</a><label for="stopwatch-stop">00:00</label>';

        stopwatch += '</div><!--.stopwatch-button-container-->';

        stopwatch += '<label for="stopwatch-note" >'+_('Stopwatch Note')+'</label>';
        stopwatch += '<textarea cols="40" rows="4" name="stopwatch-note" maxlength="100"></textarea>';

        stopwatch += '<label for="stopwatch-internal-note" >'+_('Stopwatch Internal Note')+'</label>';
        stopwatch += '<textarea cols="40" rows="4" name="stopwatch-internal-note" maxlength="100"></textarea>';

        stopwatch += '<div class="stopwatch-data">';
        stopwatch += '<a class="icon-ok" name="stopwatch-transfer" href="#" data-role="none" >Transfer</a>';
        stopwatch += '<a class="icon-trash" name="stopwatch-delete" href="#" data-role="none" >Delete</a>';
        stopwatch += '</div></div><!--.stopwatch-->';

        var jqm_page_id = $('div[data-role="page"].ui-page-active').attr('id');
        $('#'+jqm_page_id+' .stopwatch-container').append(stopwatch);

        var textinputs = $( '.stopwatch-container input, .stopwatch-container textarea' );
        textinputs.textinput({preventFocusZoom: true, autogrow: false});

        var buttons = $( '.stopwatch-container a[data-role="button"]' );
        buttons.button();

        $('.stopwatch-container .stopwatch:last-child')[0].scrollIntoView();
        textAreaAttributes();
    });
    
    $('.stopwatch-container').on('focusout', '.stopwatch', function(){
        
        var id, start_timestamp, stop_timestamp, note, internal_note;

        var stopwatch = $(this);

        id = stopwatch.data('id');

        start_timestamp = stopwatch.find('label[for="stopwatch-start"]').attr('data-timestamp');
        start_timestamp = parseInt(start_timestamp, 10);

        stop_timestamp = stopwatch.find('label[for="stopwatch-stop"]').attr('data-timestamp');
        stop_timestamp = parseInt(stop_timestamp, 10);

        note = stopwatch.find('textarea[name="stopwatch-note"]').val();
        internal_note = stopwatch.find('textarea[name="stopwatch-internal-note"]').val();

        if(typeof id === 'undefined' || typeof start_timestamp === 'undefined' || 0 === start_timestamp) {
            console.log('Skip saving incomplete stopwatch entry.');
            return false;
        }
        else {
            save_stopwatch({id: id, start: start_timestamp, stop: stop_timestamp, note: note, internal_note: internal_note});
        }
    });

    $('#stopwatch_in_timer_page').on('click', 'a[name="stopwatch-transfer"]', function(e){
        e.preventDefault();
        var transfer_button = $(this);
                                     
        if($('#HDTimer_description').val() || $('#internal_note').val()) {

            $('#popupOverwriteTimerDescNote h1.ui-title').html(_('Timer not empty!'));
            $('#popupOverwriteTimerDescNote h3.ui-title').html(_('Overwrite Timer information?'));
            $('.overwrite_timer_no .ui-btn-text').html(_('No'));
            $('.overwrite_timer_yes .ui-btn-text').html(_('Yes'));

            var stopwatch = transfer_button.closest( '.stopwatch' );
            var id = stopwatch.data('id');
            $('.overwrite_timer_yes').data('stopwatch-id', id);

            $('#popupOverwriteTimerDescNote, #popupOverwriteTimerDescNoteOverlay').show();
        }
        else {
            transfer_stopwatch_to_time_entry(transfer_button);
        }
    });
    
    $('.remove_stopwatch_no, #popupDeleteStopwatchOverlay').click(function(){
        $('#popupDeleteStopwatch, #popupDeleteStopwatchOverlay').hide();
    });

    $('.remove_stopwatch_yes').click(function(){
        var id = $(this).data('stopwatch-id');
        delete_stopwatch(id);

        var stopwatch = $('.stopwatch[data-id="'+id+'"]' );
        stopwatch.remove();
        load_all_stopwatch();
        $('#popupDeleteStopwatch, #popupDeleteStopwatchOverlay').hide();
    });

    $('.overwrite_timer_yes').click(function(){

        $('#popupOverwriteTimerDescNote, #popupOverwriteTimerDescNoteOverlay').hide();

        var id = $(this).data('stopwatch-id');

        var transfer_button = $('.stopwatch[data-id="'+id+'"] a[name="stopwatch-transfer"]');

        transfer_stopwatch_to_time_entry(transfer_button);
    });

    $('.overwrite_timer_no').click(function(){
        $('#popupOverwriteTimerDescNote, #popupOverwriteTimerDescNoteOverlay').hide();
    });

    $('#stopwatch_in_home_page, #stopwatch_in_timer_page').on( "swipeleft", function(){
        console.log('Swipeleft');
        close_stopwatch_popup();
    });

    $('.popup_overlay.stopwatch-popup-overlay').on( 'click', function(){
        close_stopwatch_popup();
    });
};
