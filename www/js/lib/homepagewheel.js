var orienationValue ;

var selectedImageArray = ['icon_selected_0.png','icon_selected_1.png','icon_selected_2.png','icon_selected_3.png','icon_selected_4.png','icon_selected_5.png','icon_selected_6.png','icon_selected_7.png','icon_selected_8.png'];

var nameArray  = ['Helpdesk','C R M',/*'Documents',*/'ToDo List', 'Hotline','Favourites','Article Search','Serial Number','Customer search'];
var selectedImageArrayForClick = ['icon_selected_0.png','icon_selected_1.png','icon_selected_2.png','icon_selected_3.png','icon_selected_4.png','icon_selected_5.png','icon_selected_6.png','icon_selected_7.png','icon_selected_8.png'];

var nameArrayForClick  = ['Helpdesk','C R M',/*'Documents',*/'ToDo List', 'Hotline','Favourites','Article Search','Serial Number','Customer search'];
var previousAngle = 0;
var wheelTouchMove = false;
var centronWheel = {
	el: null,
	controller: null,
	angle: 0,
	startAngle: 0,
	slices: Math.PI/4,
	originX: 160,
	originY: 160,/*
	values: { 7: 'Customer search', 6: 'Hotline', 5: 'Article search', 4:'Serial Number' , 3: 'C R M', 2: 'Favorites', 1: 'Documents' , 0: 'Helpdesk' },*/
	
	handleEvent: function (e) {

		if (e.type == 'touchstart') {
			this.rotateStart(e);
		} else if (e.type == 'touchmove') {
			this.rotateMove(e);
		} else if (e.type == 'touchend') {
			this.rotateStop(e);
		} 
	},
	
	init: function() {
        
        setInterval(function() {
            // Do something every 2 seconds
            connectionStatus = navigator.onLine ? 'online' : 'offline';
            if(connectionStatus=="offline"){
                $( "#home_page .centron-alert" ).find('p').html(_('No Network found!')).end().popup('open');
            }
        }, 120000);
        
		this.el = document.getElementById('centronWheel');
		this.controller = document.getElementById('wheelbox');
		this.el.style.webkitTransitionDuration = '0';
		
		this.controller.addEventListener('touchstart', this, false);
	  
		//$('.header-view').html('c-entron | iSuit 2.0');
		//$('.subheader-view').html('&nbsp;Customer&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c-entron software gmbh');
		//$('.bottom-infobox').html('&nbsp;User&nbsp;&nbsp;&nbsp;&nbsp;Test User')

    $('#wheelbox').on('click', function(event) {

      var p1 = {x:194, y:23};
      var c = {x:194, y:194};
      var p2 = GetCoordinates(event);


      var angle = find_angle(p1,p2,c);


      var realAngle;
      var selectedValue;
      if(p2.x < p1.x){
        if(angle>23 && angle<65){
          realAngle =45;
          selectedValue = 1;
        }else if(angle>65 && angle<110){
          realAngle  =90;
          selectedValue = 2;
        }else if(angle>111 && angle<150){
          realAngle = 135;
          selectedValue = 3;
        }else if(angle>151 && angle<200){
          realAngle =180;
          selectedValue = 4;
        }
      }else{
        if(angle>23 && angle<65){
          realAngle =315;
          selectedValue = 7;
        }else if(angle>65 && angle<110){
          realAngle = 270;
          selectedValue = 6;

        }else if(angle>111 && angle<150){
          realAngle = 225;
          selectedValue = 5;
        }else if(angle>151 && angle<200){
          realAngle = 180;
          selectedValue = 4;
        }
      }
      var el = document.getElementById('centronWheel');
if(wheelTouchMove){
  wheelTouchMove = false;

  previousAngle = 0;
  for(var i=0; i<8; i++){
    selectedImageArrayForClick[i] = selectedImageArray[i];
    nameArrayForClick[i] = nameArray[i];


  }
  var selectedText = $('#infobox').text().trim();
  var indexOfText = nameArrayForClick.indexOf(selectedText);
  var rotationAngle = indexOfText*45;
  el.style.webkitTransform = 'rotate(' + previousAngle + 'deg)';
  centronWheel.getSelectedValueOnClick(0);
  previousAngle = rotationAngle;
  el.style.webkitTransform = 'rotate(' + rotationAngle + 'deg)';
  centronWheel.getSelectedValueOnClick(indexOfText);
}
  if(previousAngle >= 360){
    previousAngle = previousAngle%360;
    el.style.webkitTransform = 'rotate(' + previousAngle + 'deg)';
  }
  realAngle = realAngle + previousAngle;
  previousAngle = realAngle;
  el.style.webkitTransitionDuration = '150ms';
  el.style.webkitTransform = 'rotateZ(' + realAngle + 'deg)';
  centronWheel.getSelectedValueOnClick(selectedValue);


//var slices = Math.PI/4;
//
//          var myangle = Math.round(realAngle/slices) * slices;

    });
    $('#infobox').html(nameArray[0]).addClass(nameArray[0].toLowerCase().split(' ').join('_'));

    $('#infobox').data("i18n", nameArray[0]);
	},
	
	rotateStart: function(e) {

		var startX;
        var startY;
		this.el.style.webkitTransitionDuration = '0';
          
        if(orienationValue=='portrait'){
            startX = e.touches[0].pageX - this.originX-180;//180//200
            startY = e.touches[0].pageY - this.originY-330;//280//320
        }else{
            //console.log('landscape rotateStart');
            startX = e.touches[0].pageX - this.originX-340;//180//200
            startY = e.touches[0].pageY - this.originY-240;//280//320
        }
		this.startAngle = Math.atan2(startY, startX) - this.angle;
		
		this.controller.addEventListener('touchmove', this, false);
		this.controller.addEventListener('touchend', this, false);
	},
	
	rotateMove: function(e) {
    wheelTouchMove = true;
		var dx;
        var dy;
        if(orienationValue=='portrait'){
            dx = e.touches[0].pageX - this.originX-180;
            dy = e.touches[0].pageY - this.originY-330;
		}
        else{
           //console.log('landscape rotateMove');
            dx = e.touches[0].pageX - this.originX-340;
            dy = e.touches[0].pageY - this.originY-240;
        }
        this.angle = Math.atan2(dy, dx) - this.startAngle;

		this.el.style.webkitTransform = 'rotateZ(' + this.angle + 'rad)';
		
		//document.getElementById('selection').innerHTML = centronWheel.getSelectedValue();
        centronWheel.getSelectedValue();

	},
	
	rotateStop: function(e) {
		this.controller.removeEventListener('touchmove', this, false);
		this.controller.removeEventListener('touchend', this, false);
		
		if( this.angle%this.slices ) {
			this.angle = Math.round(this.angle/this.slices) * this.slices;
			this.el.style.webkitTransitionDuration = '150ms';
			this.el.style.webkitTransform = 'rotateZ(' + this.angle + 'rad)';
		}
		
	},
	
	getSelectedValue: function() {
		var selected = Math.floor(Math.abs(this.angle)/this.slices/8);

		if (this.angle < 0) {
            selected = -selected;
        }

		selected = Math.round(this.angle/this.slices) - selected*8;
		if (selected < 0) {
            selected = 8 + selected;
        }
		if(selected == 8){
			selected = 0;
		}
		
		$('#infobox').html(_(nameArray[selected]));
        //console.log('getSelectedValue: '+nameArray[selected])
        //i18n purpose
        //also CSS color
        $('#infobox').data("i18n", nameArray[selected]).removeClass(function(i, classes){
            // variable class hold the current value of the class attribute
            var list = classes.split(' '); // we create an array with the classes
            return  list.filter(function(val){ // here we remove the classes we want to keep
                return ( val != 'i18n' );
            }).join(' '); // and return that list as a string which indicates the classes to be removed..
        }).addClass(nameArray[selected].toLowerCase().split(' ').join('_'));
        
		highlitedImage(selectedImageArray[selected]);
	   
		//return [this.values[selected]];
	},  getSelectedValueOnClick: function(selected) {

    var nameArrayValue = nameArrayForClick[selected];
    var selectedImageArrayValue  = selectedImageArrayForClick[selected];
    var nameArrayTemp =[];
    var selectedImageTemp = [];
    var count  = selected;
    for(var i=0; i<8;i++){

      nameArrayTemp[i] = nameArrayForClick[count];
      selectedImageTemp[i] = selectedImageArrayForClick[count];
      if(count == 7){
        count = 0;
      }else{
        count++;
      }
    }
    for(var i=0; i<8;i++){
      nameArrayForClick[i]= nameArrayTemp[i]
      selectedImageArrayForClick[i]=selectedImageTemp[i];
    }
    $('#infobox').html(_(nameArrayValue));
    //console.log('getSelectedValue: '+nameArray[selected])
    //i18n purpose
    //also CSS color
    $('#infobox').data("i18n", nameArrayValue).removeClass(function(i, classes){
      // variable class hold the current value of the class attribute
      var list = classes.split(' '); // we create an array with the classes
      return  list.filter(function(val){ // here we remove the classes we want to keep
        return ( val != 'i18n' );
      }).join(' '); // and return that list as a string which indicates the classes to be removed..
    }).addClass(nameArrayValue.toLowerCase().split(' ').join('_'));

    highlitedImage(selectedImageArrayValue);

    //return [this.values[selected]];
  }
};

/* Select the Highlited Image , Changes only the Div image source dynamically*/
function highlitedImage(imageName){
	document.getElementById('module_image').innerHTML =
	'<img src="img/images/'+imageName+'">';
}

/*
function doOnOrientationChange()
{
    switch(window.orientation)
    {
        case -90:
        case 90:
             orienationValue = 'landscape';
            break;
        default:
             orienationValue = 'portrait';
            break;
    }
}
*/

function loaded() {
   
	window.scrollTo(0,0);
	var i, lis, theTransform, matrix;
	
	lis = document.getElementsByTagName('li');
	for(i=0; i<lis.length; i+=1) {
		theTransform = window.getComputedStyle(lis[i]).webkitTransform;
		matrix = new WebKitCSSMatrix(theTransform).translate(0, 0);
		lis[i].style.webkitTransform = matrix;
	}
	centronWheel.init();
}
function GetCoordinates(e)
{
  var myImg = document.getElementById("wheelbox");
  var PosX = 0;
  var PosY = 0;
  var ImgPos;
  ImgPos = FindPosition(myImg);
  if (!e) var e = window.event;
  if (e.pageX || e.pageY)
  {
    PosX = e.pageX;
    PosY = e.pageY;
  }
  else if (e.clientX || e.clientY)
  {
    PosX = e.clientX + document.body.scrollLeft
      + document.documentElement.scrollLeft;
    PosY = e.clientY + document.body.scrollTop
      + document.documentElement.scrollTop;
  }
  PosX = PosX - ImgPos[0];
  PosY = PosY - ImgPos[1];

  return {x:PosX, y:PosY};

}
function FindPosition(oElement)
{
  if(typeof( oElement.offsetParent ) != "undefined")
  {
    for(var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent)
    {
      posX += oElement.offsetLeft;
      posY += oElement.offsetTop;
    }
    return [ posX, posY ];
  }
  else
  {
    return [ oElement.x, oElement.y ];
  }
}
function find_angle(p0,p1,c) {
  var p0c = Math.sqrt(Math.pow(c.x-p0.x,2)+
    Math.pow(c.y-p0.y,2)); // p0->c (b)
  var p1c = Math.sqrt(Math.pow(c.x-p1.x,2)+
    Math.pow(c.y-p1.y,2)); // p1->c (a)
  var p0p1 = Math.sqrt(Math.pow(p1.x-p0.x,2)+
    Math.pow(p1.y-p0.y,2)); // p0->p1 (c)
  return Math.acos((p1c*p1c+p0c*p0c-p0p1*p0p1)/(2*p1c*p0c))*180/Math.PI;
}
//window.addEventListener('orientationchange', doOnOrientationChange);
// Initial execution if needed
//doOnOrientationChange();

window.addEventListener("load", function() { setTimeout(loaded, 100); }, true);
