var loadPopcorn = function () {
    var pop = Popcorn("#media", {pauseOnLinkClicked: true});
var pop = Popcorn( "#media" );
 pop.image({
 // seconds
start: 1,
// seconds
end: 4,
href: "https://www.shopify.com",
src: "https://wp.zillowstatic.com/streeteasy/2/GettyImages-626346156-resized-f3c71f.jpg",
target: "popcorn-container"
});
var pop = Popcorn( "#media" );
pop.image({
    // seconds 
    start: 18,
    // seconds
    end: 33,
    src: "https://images-na.ssl-images-amazon.com/images/I/51rQ%2BeXOq0L._SX466_.jpg",
    target: "popcorn-container"
});
var pop = Popcorn( "#media" );
pop.openmap( {
  start: 5,
  end: 20,
  type: "ROADMAP",
  target: "map",
  lat: 40.847055,
  lng: -73.924486,
  zoom: "10"
});


};