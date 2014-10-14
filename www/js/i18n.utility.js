//tested on javascriptlint.com on 09 Jul 2014

function translate() {
    localizeHTMLTag('i18n');
}

function localizeHTMLTag(class_name) {
    var elements = document.getElementsByClassName(class_name);

    for (var i = 0; i < elements.length; i++){
        var translable;
        translable = $(elements[i]).data('i18n');

        if(translable) {
            var translated = _(translable);
            elements[i].innerHTML = translated;
        }
        
    }
}

var _ = function (string) {
    return string.toLocaleString();
};
