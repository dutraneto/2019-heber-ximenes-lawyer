// // Smooth Scroll: https: //www.w3schools.com/jquery/tryit.asp?filename=tryjquery_eff_animate_smoothscroll
$(document).ready(function () {
    // Add smooth scrolling to all links
    $("a").on('click', function (event) {

        // Make sure this.hash has a value before overriding default behavior
        if (this.hash !== "") {
            // Prevent default anchor click behavior
            event.preventDefault();

            // Store hash
            var hash = this.hash;

            // Using jQuery's animate() method to add smooth page scroll
            // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 600, function () {

                // Add hash (#) to URL when done scrolling (default click behavior)
                window.location.hash = hash;
            });
        } // End if
    });
});

// Animations
new WOW().init();

// embeded map
function initMap() {
    var ceara = { lat: -3.756000, lng: -38.510240 };
    var map = new google.maps.Map(
        document.getElementById('map'), { zoom: 4, center: ceara }
    );
    var marker = new google.maps.Marker({ position: ceara, map: map });

}