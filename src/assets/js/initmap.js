// embeded map
function initMap() {
	var ceara = { lat: -3.756, lng: -38.51024 }
	var map = new google.maps.Map(document.getElementById('map'), { zoom: 4, center: ceara })
	var marker = new google.maps.Marker({ position: ceara, map: map })
}
