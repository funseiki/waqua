$(document).ready(function() {
    // Image related things
    // Taken from http://stackoverflow.com/a/1892815/865883
    $('.right-image').each(function() {
        var imgClass = (this.width/this.height > 1) ? 'wide' : 'tall';
        $(this).addClass(imgClass);
    });
});
