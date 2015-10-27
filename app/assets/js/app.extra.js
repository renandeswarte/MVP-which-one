$(document).on('change', '.btn-file :file', function() {
  var input = $(this),
      numFiles = input.get(0).files ? input.get(0).files.length : 1,
      label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
  input.trigger('fileselect', [numFiles, label]);
});

$(document).ready( function() {
    $('body').on('fileselect', '.btn-file :file',  function(event, numFiles, label) {   
        var input = $(this).parents('.input-group').find(':text'),
            log = numFiles > 1 ? numFiles + ' files selected' : label;
  
        if( input.length ) {
            input.val(log);
        } else {
            if( log ) alert(log);
        }
        
    });
});

$(document).ready( function() {
    var height = $(window).height();
    console.log(height);
    var heightFix = height - 80;
    if (height > 500) {
      $('.main-container').css("min-height", heightFix + "px" );
    }
});

