$(document).ready(function() {
    $('select').material_select();
  });
      
$(".button-collapse").sideNav();
$('.carousel.carousel-slider').carousel({fullWidth: true});



$("[data-show]").bind("click",function(e){
    var target = $(this).attr("data-show"),
        ele = $(target) ;
        if(!target.length || ele.hasClass("active"))
            return ;

           $(this).parents(".signup-switch")
           .find("a.active").removeClass("active");

           $(this).addClass("active");
           
            $(".login-tab").removeClass("active");
            ele.addClass("active")

})
$(document).ready(function(){
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
  });

  $('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 15, // Creates a dropdown of 15 years to control year,
    today: 'Today',
    clear: 'Clear',
    close: 'Ok',
    closeOnSelect: false // Close upon selecting a date,
  });
  $('.timepicker').pickatime({
    default: 'now', // Set default time: 'now', '1:30AM', '16:30'
    fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
    twelvehour: false, // Use AM/PM or 24-hour format
    donetext: 'OK', // text for done-button
    cleartext: 'Clear', // text for clear-button
    canceltext: 'Cancel', // Text for cancel-button
    autoclose: false, // automatic close timepicker
    ampmclickable: true, // make AM PM clickable
    aftershow: function(){} //Function for after opening timepicker
  });
        