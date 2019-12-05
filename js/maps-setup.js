/* global L:false document:false $:false */
// that first line stops your editor form complaining about these variables
// being undefined, but it will still get mad at you if you accidentlaly try to change
// their values (which you must not do!!)
// `L` is the global Leaflet API object, which must be defined before this
// script is loaded
// `document` is of course the HTML document
// $ is the jQuery object (actually we're not using it here at the moment)
// but just in case you would like to make use of it, it's available


///////////////////////////////////////////////
// VARS!! VARS!! VARS!! VARS!! VARS!! VARS!! //
///////////////////////////////////////////////

//////////////////////////
// Globally Scoped Vars //
//////////////////////////

// In order to access map data, we need some of these variables to
// be defined in global scope. In some cases we can assign values here;
// in others we'll wait till we run the initialization function
// we do this here to make sure we can access them
// whenever we need to -- they have 'global scope'

// map initialization variables
let projectMap, // this will hold the map once it's initialized
    myCenter = [ 41.878113, -87.629799], // *latitude*, then longitude
    myZoom = 9.5; // set your preferred zoom here. higher number is closer in.
                // I set the zoom wide to give access to context before zooming in


// I'm complicating things a bit with this next set of variables, which will help us
// to make multi-colored markers
// color options are red, blue, green, orange, yellow, violet, grey, black
// just substitute the color name in the URL value (just before `.png`)
const greenURL = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
      yellowURL = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
      greyURL = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
      redURL = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png';

// create new icon classes
// I've added this just in case you want very fine control over your marker placement
const myIconClass = L.Icon.extend({
    options: {
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    }});
// create the new icon types -- cf. https://leafletjs.com/examples/custom-icons/ and
// also https://leafletjs.com/reference-1.5.0.html#icon
const meetsIcon = new myIconClass({iconUrl: yellowURL}),
      exceedsIcon = new myIconClass({iconUrl: greenURL}),
      approachIcon = new myIconClass({iconUrl: redURL});


// storing colors in variables, to make it easier to change all the related features at once
let gryfCol = 'orange',
    slythCol = 'purple',
    cCol = 'yellow',
    dCol = 'red',
    bCol = 'blue',
    aCol = 'green',
    ddcol = 'rgba(0,0,0,0)',
    towerCol = 'grey';

///////////////////////////////////////////////////////////////////////
// CHANGE THESE VARIABLE NAMES AND THEIR VALUES TO SUIT YOUR PROJECT //
///////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////
// DATA DATA DATA DATA                                  //
// DATA DATA DATA DATA                                  //
//////////////////////////////////////////////////////////


//////////////////////////////////
// MAP DATA PART 1: MARKER INFO //
//////////////////////////////////

///////////////////////////////
// YOU NEED TO CHANGE THESE! //
///////////////////////////////

// These are placeholder arrays; we use them to generate other JS variables
// that will be more useful to us later on
// but writing them this way keeps the code as D.R.Y. as possible
let MeetsMarkerInfo =
    [

        {position: [ 41.872898, -87.627930],
         title: "Jones College Prep High School",
         description: "<p>SAT Composite Score: 1247.3</p>"},

    ],
    ExceedsMarkerInfo =
    [  {position: [41.901451,-87.634506],
        title: "Walter Payton College Preparatory High School",
        description: `<p>SAT Composite Score: 1375</p>`
       },
       {position: [41.981239, -87.707672],
        title: "Northside College Preparatory High School",
        description: `<p>SAT Composite Score: 1329.3</p>`},
    ];
    ApproachMarkerInfo =
    [  
        {position: [41.753920, -87.601970],
            title: "Hirsch Metropolitan High School",
            description: '<p>SAT Composite Score: 779.2.</p>' 
        },
        {position: [ 41.770161, -87.636208 ],
            title: "Paul Robeson High School",
            description: `<p>SAT Composite Score: 743.2</p>`},
            {position: [41.955257, -87.668594],
             title: "Lake View High School",
             description: "<p>SAT Composite Score: 945.5</p>"},
           {position: [41.849037, -87.708525],
           title: "Farragut Career Academy High School",
           description: "<p>SAT Composite Score: 845.3</p>"},
           {position: [41.790550, -87.689728],
           title: "Gage Park High School",
           description: "<p>SAT Composite Score: 814.4</p>"},
           {position: [41.806991, -87.715850],
            title: "Curie Metropolitan High School",
            description: "<p>SAT Composite Score: 913.7</p>"},
            {position: [41.880310, -87.742279],
            title: "YCCS-Scholastic Achievement",
            description: "<p>SAT Composite Score: 741.4</p>"},
            {position: [41.782070, -87.634277],
            title: "Englewood High School",
            description: "<p>SAT Composite Score: 778.3</p>"},
            {position: [41.864410, -87.701279],
            title: "Collins Academy High School",
            description: "<p>SAT Composite Score: 800.9</p>"},
            {position: [41.763645, -87.648939],
            title: "Chicago Excel Academy Hight School",
            description: "<p>SAT Composite Score: 785.3</p<"},
            {position: [41.744980, -87.549730],
            title: "Epic Academy High School",
            description: "<p>SAT Composite Score: 937.6</p>"},
            {position: [41.734558,-87.557510],
                title: "Bowen High School",
                description: '<p>SAT Composite Score: 803.8</p>'
               },
       
    ];


let ExceedsMarkers = processMarkerLayer(ExceedsMarkerInfo,
                                     {description: 'Chicago City District High Schools which exceed SAT Standards (i.e., have a SAT Composite score higher than 1310)', defaultIcon: exceedsIcon}),
    MeetsMarkers = processMarkerLayer(MeetsMarkerInfo,
                                      {description: 'Chicago City District High Schools which meet SAT Standards (i.e., have a SAT Composite score between 1080 and 1309)', defaultIcon: meetsIcon});
    ApproachingMarkers = processMarkerLayer(ApproachMarkerInfo,
    {description: 'Chicago City District High Schools which are approaching SAT Standards (i.e., have a SAT Composite score bellow 1080)',defaultIcon: approachIcon});



//////////////////////////////
// MAP DATA PART 2: GEOJSON //
//////////////////////////////

// With this powerful feature you can add arbitrary
// data layers to your map.  It's cool. Learn more at:
// https://leafletjs.com/examples/geojson/
// but essentially: we can add all kinds of features here, including polygons and other shapes
// you can create geoJSON layers here: http://geojson.io/
// and learn more about the format here: https://en.wikipedia.org/wiki/GeoJSON
// to set the line and fill color, you will need to set the `myColor` property as below. 

const townsData={

    
    "type": "FeatureCollection",
    "description": "HOLC Area",
  "features": [
  
     
    {
      "type": "Feature",
        "properties": {myColor: dCol, title: "D100", description: "This area is the worst in South Chicago. Eliminating Commercial Avenue, it is partly blighted. There is a mixture of all kinds of nationalities residing here. Mexican and Negro predominate in the area from 87th to 92nd, and between Avenue \"O\" and Buffalo Avenue. In the northeastern section the Polish element is in the majority. The area is composed of very modest residences for the most part, very spotted. It has all utilities, good transportation, paved streets, and has the advantage to the class of inhabitants residing here of being close to industry. A decidedly poor section of South Chicago. They have a good Public and Catholic School." },
      "geometry": {
        "type": "MultiPolygon",
        "coordinates":  [[[[-87.541312,41.744732],[-87.541241,41.738879],[-87.544984,41.738853],[-87.54502,41.737735],[-87.54281,41.737735],[-87.542596,41.733904],[-87.539744,41.733878],[-87.539779,41.729834],[-87.541491,41.728982],[-87.543095,41.728024],[-87.544271,41.72688],[-87.546375,41.724166],[-87.54748,41.723767],[-87.551331,41.726854],[-87.551437,41.73002],[-87.55101,41.730419],[-87.550938,41.733904],[-87.551509,41.733931],[-87.551939,41.744624],[-87.550012,41.744638],[-87.550154,41.743614],[-87.548193,41.74263],[-87.548157,41.744651],[-87.546168,41.744665],[-87.541312,41.744732]],[[-87.548186,41.741685],[-87.548966,41.741742],[-87.549631,41.742011],[-87.550221,41.742184],[-87.549517,41.741245],[-87.548604,41.739982],[-87.548167,41.738961],[-87.548091,41.733938],[-87.546304,41.733867],[-87.546247,41.737741],[-87.545866,41.737783],[-87.545771,41.738932],[-87.546075,41.739188],[-87.546056,41.739528],[-87.545885,41.739528],[-87.545866,41.740777],[-87.546475,41.740479],[-87.547102,41.741472],[-87.547882,41.741316],[-87.548186,41.741685]]]]
      },
    },
    {
        "type": "Feature",
            "properties": {myColor: dCol, title: "D99", description: "his is a somewhat better area than directly west. There area about 20 per cent foreign families, predominately Polish, who reside in that section of the area from 83rd to 90th Street, and Commercial Avenue to Yates. These people are substantial and there is evidence of pride of ownership. All utilities are in as well as paved streets, and transportation is good. On the east, however, the area adjoins the worst section of South Chicago. It is a typical industrial area and quite desirable for those who work in adjacent industries. It is quite spotted. There are few vacant lots. It is well built up, but the future development depends entirely upon the industrial barometer. At this time great optimism exists of increased industrial activity due to the war in Europe. The trend of development is to the west in the \"C\" area, both north and south of the tracks. Located 82-RR tracks between Yates & Commercial."},
            "geometry": {
                    "type": "MultiPolygon",
                     "coordinates": 
                     [[[[-87.566169,41.738094],[-87.56624,41.744452],[-87.563602,41.744585],[-87.561285,41.744559],[-87.551939,41.744624],[-87.551509,41.733931],[-87.550938,41.733904],[-87.55101,41.730419],[-87.551437,41.73002],[-87.551331,41.726854],[-87.555787,41.730286],[-87.555858,41.733585],[-87.556714,41.733585],[-87.556821,41.735634],[-87.558176,41.73558],[-87.558104,41.733612],[-87.559851,41.733612],[-87.566169,41.738094]]]]  }
                },
                {
                    "type": "Feature",
                        "properties": {myColor: dCol, title: "D90", description: "Located between 79th and 83rd, Colfax to the IC Suburban and Illinois steel mills; predominately multi-family; for the most part, occupied by foreigners of Bohemian, Polish and Mexican origina predominating, employed in the Illinois steel mills adjoining on the east. A good rentable area, enjoying good transportation and shopping facilities. It has changed little for years, as it is suitable for industrial workers who desire to reside near their place of occupation. Much rehabilitation necessary. Singles are scattered throughout. Entire area is spotted, and will change but little; and might be considered as semi-blighted. On Burnham are many frame bungalows and residences in a run-down condition. Future is definitely down grade. The IC Suburban RR runs through the area along Commerical Avenue. School facilities are fair."},
                        "geometry": {
                                "type": "MultiPolygon",
                                 "coordinates": 
                                 [[[[-87.546168,41.744665],[-87.548157,41.744651],[-87.550012,41.744638],[-87.551939,41.744624],[-87.561285,41.744559],[-87.5614,41.75182],[-87.561391,41.75182],[-87.552764,41.75182],[-87.546453,41.752113],[-87.546168,41.744665]]]] },
                                },
                                {
                                    "type": "Feature",
                                      "properties": {myColor: dCol, title: "D89", description: "Area is flat with few trees. About the only good influence in this section is Grand Crossing Park adjacent at the west. Transportation, churchs and schools are adequate. Very poor grade of population; gangsters, vandals, and in general, dangerous elements. Shopping facilities along 75th, 79th, and Cottage Grove Ave. Adverse influences along northeast and southeast boundaries of the area. Many houses are typically Italian in construction, with very small rooms and very large kitchens and are saleable onyl to Italians. This territory is 100 per cent built up. There is some small manufacturing in the vicinity of 75th and 86th on Greenwood; also coal yards in the area. It is almost impossible to secure a mortgage in this area on any terms. Undesirable population, poor appearance, adverse railroad influence, and poor demand indicate fourth grade." },
                                    "geometry": {
                                      "type": "MultiPolygon",
                                      "coordinates":  [[[[-87.595189,41.758653],[-87.594191,41.762376],[-87.592622,41.762403],[-87.592658,41.756499],[-87.595403,41.756472],[-87.596223,41.756419],[-87.59797,41.748573],[-87.598077,41.748865],[-87.598469,41.749424],[-87.598719,41.749424],[-87.599681,41.749424],[-87.599681,41.751179],[-87.599681,41.751419],[-87.599147,41.751419],[-87.599218,41.753201],[-87.599396,41.757031],[-87.601892,41.757084],[-87.601927,41.755116],[-87.602569,41.755036],[-87.602819,41.754797],[-87.60535,41.754903],[-87.605207,41.758414],[-87.607881,41.75844],[-87.607739,41.76586],[-87.597613,41.758546],[-87.595189,41.758653]]]]
                                    },
                                  },
    {
      "type": "Feature",
        "properties": {myColor: dCol, title: "D83", description: "A large semi-blighted area, with a mixed class of people and occupations. It has been on the down grade for some time. An effort, however, is being made by improvement clubs, bankers, and brokers to prevent further decline. Captains have been appointed to many blocks in an endeavor to instill a pride of ownership and see what can be done toward painting and rehabilitating some of these old homes which, in the case of frame, average 50 yrs., and brick 35. There are colored people two blocks to the north. Between Ashland and Racine, between 71st and 74th (which is the younger section) 95 per cent are single homes; 80 per cent frame, with many large apartments of 6-24 units scattered throughout on the corners. Many old frames in the area are being converted into 2-family homes. Between 63rd and 74th, Ashland to Racine, 98 per cent are owner-occupied. There are some brick 3's of somewhat newer constructinon in the price bracket of $7,000. Many homes are of brick construction, some built below the street. Between 63rd and 75th, Halsted to Racine, conditions are somewhat similar to the aforesaid, with the exception that there are about a dozen colored families on Carpenter and Aberdeen between 65th and 66th- very spotted. Between 64th and 67th, Stewart to Yale, is probably the best residential district in the area, with some frames as high as $8,000. Large apartment construction in the area was stopped during depression, but is expected to be resumed. Something drastic ultimately must be done. The area should be rebuilt with better homes; there are numbers of them of cheap construction which can easily be demolished. East of Wentworth to State is somewhat identical as to (over) type of building. The better part of the area east of Wallace is adjacent to Hamilton Park between 71st and 74th. The consistently best street in the whole area is Halsted Avenue. Eggleston, north from 65th, has many frame singles, 60-70 years old, very spotted. At 69th and Ashland are big streetcar barns and yards- detrimental. Section aaround 71st Pl., 72nd, and 72nd Pl., and 73rd, west of Racine to Ashland, presents a somewhat better appearance. Schewbridge Field, a large play field, lies south of 74th east of Racine. Stewart Street, south of 74th, as many old apartments. On the east side, between 74th and 73rd, are many party-wall buildings, with brick both in front and rear and frame in the middle. Many poor shacks on this street. South on Lowe from 63rd are coal yards. On 66th, west of Wallace, are many row houses, spotted with mixed constructino. Morgan Street, going north from 69th to 63rd, has recently been widened and an entire new street put down. Many poor frames. The street is now a high-speed highway- detrimental. 63rd and Halsted is said to be the busiest business district in Chicago outside of the Loop. On the west side of Loomis, facing Ogden Park, are some fair homes, with a few two's. This entire area is extremely spotted with old construction of all kinds, with a decidedly poor general, congested appearance. About 75 per cent of the district are two's, many of these 6-7 rooms. Around Normal Parkway are better grade homes and apartments with a better rent bracket. The section south of 75th, east of Harvard to State, is somewhat better than some parts of the area. Singles and 2's of brick construction are not so old, but a few old frames are spotted throughout."},
      "geometry": {
        "type": "MultiPolygon",
        "coordinates": [[[[-87.624708,41.754648],[-87.627549,41.754582],[-87.632962,41.754456],[-87.638004,41.754338],[-87.63735,41.756111],[-87.639222,41.756089],[-87.639251,41.756532],[-87.639608,41.757197],[-87.64038,41.75784],[-87.641123,41.758128],[-87.642014,41.758217],[-87.644078,41.758194],[-87.648553,41.758145],[-87.654077,41.758084],[-87.654077,41.759391],[-87.663569,41.759256],[-87.663591,41.764906],[-87.664173,41.779377],[-87.64449,41.779696],[-87.629937,41.779932],[-87.629759,41.776653],[-87.628095,41.77672],[-87.628155,41.778049],[-87.6256,41.778049],[-87.625495,41.775294],[-87.625396,41.772688],[-87.625049,41.763595],[-87.624708,41.754648]],[[-87.635897,41.760113],[-87.634792,41.763224],[-87.639532,41.763171],[-87.639355,41.760033],[-87.635897,41.760113]],[[-87.632368,41.769845],[-87.63194,41.771175],[-87.637002,41.771069],[-87.636967,41.769819],[-87.632368,41.769845]],[[-87.654401,41.777822],[-87.65932,41.777795],[-87.659214,41.772451],[-87.654187,41.772398],[-87.654401,41.777822]]]],
    },
    
    },
    {
        "type": "Feature",
            "properties": {myColor: dCol, title: "D74", description: "Located between 35th and 67th, west of Cottage Grove to State, a blighted area, 100 per cent negro, predominantly apartment buildings; 3's, 6's and up, few 2's. Single homes are of the 6-10 room type, average age 40 years. In this area under construction is the Ida B. Wells US Housing Project, extending from 37th to 39th between South Parkway and Cottage Grove. This proejct is expected to house 1,662 negro families and, of course, will be taken off the tax rolls with the exception of taxes for police, fire and school purposes. This venture has the realtors guessing as to what the ultimate result will be when so many of this race are drawn into this section from the already negro-blighted district; particularly its effect on the section east and south of Cottage Grove, and to park and water frontage on Lake Michigan. Already Washington Park at the south, a very fine park, has been almost completely monopolized by the colored race. Criticism is heard of the locatino of the proejct, some believing it should have been located north of Oakwood and west of Indiana in order to keep the colored influence as far as possible from further encroaching on park and lake water frontage. Others believe that a location south of 35th, extending (over) to Garfield Boulevard between State and the Rock Island RR, would have been preferably and a large fire hazard eliminated; property adjoining the railroad used as a playground, and landscaped with trees, shrubs, etc. NOTE: At the southeast corner of South Parkway and 60th, a brick apartment house of at least 24 flats in a restrited area is reported as owned by Joe Louis. * A small colored B&L organization, the Illinois Federal B&L, is located at 62 E. 47th St. *Three's on South Parkway and Michigan Avenue would run up to $10,000. A remodeling of buildings, stores, etc., by property owners on State Street would have resulted; and the cost of the project less. Rooms in a housing project should be in keeping with the average pockets of the neighborhood, which is said to be from $4.50 to $5.00 per room. With approximately 6,500 colored people moving into this district, it is evident they cannot be closed in; they must have an outlet; and the problem of keeping park and water frontage close by reasonably free of them will be difficult to surmount. The trend of the colored people will no be accelerated toward this park and water frontage, which many people consider could have been avoided had it been located west of Indiana. That section of the area between 35th and 39th, Cottage Grove to Lake Park Avenue, is restricted to whites; but, there are a number of colored families on Ellis Avenue between 37th and 35th, and it is believed (particularly since the advent of the housing project) that this entire section will ultimately go colored, which will increase the number of colored people using the lake front. Washington Park is already doomed. Throughout the entire area aer many vacant lots for which there is no market, due in part to the class of inhabitant and age of improvements. Rehabilitation also is a negligible factor. Instead of demolishing or rehabilitating some of these properties, it might be better to dispose of them than increase vacant property which has little value today. An organization known as the Hyde-Park-Kenwood Protective Organization is endeavoring to keep that section south of 35th to Pershing, east of Cottage Grove (which is restricted) white; but, with at least 25 colored families already in, white people hesitate to buy or rent- colored people will. South of 35th to Marquette, east of State, homes and flats are of a better type; also a better class of colored inhabitant. On Michigan, south of 55th are a number of large, 3-story, brick construction residences. On South Parkway, between 61st and 63rd east to Cottage Grove, are some large apartment buildings being taken over by colored people. Between 66th and Marquette, east of State, is a small section of comparatively good brick bungalows and 2's, some frames. Here a better class of colored people reside. There is nothing for sale or rent, and many applicants for both. This section is fairly old, however. Washington Park on the southeast of the area is almost 90 per cent used by negroes. It is one of the better city parks, with good swimming pools. The pools are so popular in summer time that the colored children are allowed in for one hour only at a time, when a new shift occurs. At South Parkway and 45th is a substantial new building being erected to hosue the Metropolitan Funeral Parlors and Insurance Organizations- all colored. The first settlement of the colored people was south of 22nd to 47th, west of State to Wentworth. The next movement was west of Michigan, where they joined forces at State. Michigan Avenue and South Parkway were the last to go colored about 15 years ago. The rapid development in South Chicago in the 20's of new subdivisions, homes, apartments, etc., caused a vacation of buildings on a large scale, and colored people moved in. The Stockyard Boom during the war is estimated to have brought in about 10,000 families from the South; and in the area at present under discussion, together with adjoining area, is a colored population estimated between 300,000 and 350,000. South of Washington Park sales of properties are said to be taking place to Jews and others, who hold title and rent to colored families. No mortgage money available north of 63rd, between Cottage Grove and Halsted. One of the problems is to find means of helping these people aid themselves. Already colored people are in various businesses, but the majority of the business is controlled by Jews. Our contract broker exhibited a list of approximately 500 applications at present on file from responsible colored people looking for homes to purchase; and no matter how small a flat is, it is usually rented to from eight people and up, who sleep in shifts.* If a responsible mortgage corporation, building and loan or otherwise, composed of colored people could be established it would aid rehabilitation and the turnover of all properties. Property values and rents have increased since 1935 an estimated 30 per cent, but only to colored people. Large apartment buildings are located on Michigan, Indiana, Prairie, Calume and South Parkway south of 47th; also north of Washington Park between Cottage Grove and South Parkway, between 43rd and 51st, with a sprinkiling of singles. 2's, 3's and 6's are located on Wabash, Indiana, Prairie and Calumet between 35th and 63rd. On the corners are the larger buildings; at Wabash and Garfield is the Schulte Bakery (Butternut Bread) industry. Transportation good. The center of this huge colored area is located att 47th and South Parkway. From this hub the colored business activity radiates. It is believed that, unless various rel estate protective associations are strong enough to restrict the colored people, ultimately they will spread over that territory east of Cottage Grove between 39th and 47th. Between 35th and 55th, along South Parkway (formerly Grand Boulevard) are many high-grade residences and apartments. At one time many of Chicago's elite presided here. At Bowen Avenue and Cottage Grove was located the first Walgreen Drug store organization. At 49th and South Parkway is the Corpus Christi Catholic Church, at one time a wealthy, high-grade parish, now ministering almost entirely to colored people. At 61st and Michigan is the St. Columbanus Catholic church, to which the same has happened; and again a similar experience has happened to the Holy Angels Catholic church on Oakwood and Vincennes. At 39th and Hampden is a large apartment building with over 100 apartments. A bad section of the area exists between 51st and 59th on Calumet and Prairie, where the moral influence is far from good. It is emphasized that one of the most important necessities is to provide a means of financing these colored homes so that they may be rehabilitated; provide a larger turnover of property; and hold these people within the area. East of State rooms are steam-heated; west of State, stove heated."},
            "geometry": {
                    "type": "MultiPolygon",
                     "coordinates": [[[[-87.620139,41.772744],[-87.625396,41.772688],[-87.625495,41.775294],[-87.620246,41.775349],[-87.620139,41.772744]]],[[[-87.615774,41.78018],[-87.625697,41.780091],[-87.625614,41.783097],[-87.626355,41.816479],[-87.626429,41.819118],[-87.626767,41.83116],[-87.607396,41.831293],[-87.602999,41.825183],[-87.60698,41.823544],[-87.606802,41.802508],[-87.616249,41.802287],[-87.615892,41.785693],[-87.615774,41.78018]]]]
            },
                    },
    {
        "type": "Feature",
            "properties": {myColor: dCol, title: "D72", description: "Located between 35th and 63rd, Wentworth to Halsted, a mixed area consisting of foreigners, mostly Lithuanian and Italian. Colored people are on Tremont, between Normal and the railroad. Many railroad yards, shops, etc., are in the area, with a poor class of property adjoining them. Stockyard odors are detrimental when the prevailing wind is from the west; stockyard location is at 43rd to 47th, Halsted to Western. This has a tendency to soften retns and depress sales. Area improved somewhat south of Garfield where there are more single homes. Transportation is not good, especially in the north section. It is better south of Garfield. On Union are many poor frame houses, with a few 2's; and south of Garfield the situtation improves somewhat both as to brick, frames and 2's. On Lowe are a number of frames, old, in fair condition. 63rd and Halsted is a good business location, ranking with Uptown as an excellent retail section, notwithstanding the class and occupation of the surrounding districts; Sears Roebuck have one of their largest, modern retail stores here. The Gar Wood Industries, Inc., are on 37th west of Wentworth. Another blighted area."},
            "geometry": {
                "type": "MultiPolygon",
                "coordinates": [[[[-87.638781,41.830974],[-87.638746,41.826936],[-87.63625,41.826962],[-87.63597,41.819098],[-87.631045,41.819018],[-87.630932,41.816435],[-87.630617,41.809267],[-87.630902,41.80916],[-87.630658,41.801761],[-87.629937,41.779932],[-87.64449,41.779696],[-87.645021,41.79433],[-87.645346,41.801477],[-87.645346,41.803364],[-87.646022,41.823498],[-87.646268,41.830841],[-87.638781,41.830974]],[[-87.635608,41.808948],[-87.640457,41.808921],[-87.64035,41.805387],[-87.640457,41.805094],[-87.641134,41.804988],[-87.642953,41.804988],[-87.64281,41.801693],[-87.640101,41.801693],[-87.640029,41.794357],[-87.634218,41.79449],[-87.634681,41.808974],[-87.635608,41.808948]]]]
            }

    },
    {
        "type": "Feature",
            "properties": {myColor: dCol, title: "D48", description: "Only for large corporation bldgs.","7":" ","8":"Located east of the railroads to Grant Park, between Madison and 12th, this area is part of the business heart of downtown Chicago where many of the larger retail stores are located, as well as the major part of the commercial hotel life of the Chicago South Loop district. Some of these hotels are the Stevens on Michigan at Balbo; the Blackstone and the Congress also on Michigan; the Morrison at Clark and Madison; and the Palmer House at Monroe and State. There are no residences as such in this area. There are many small retail shops and hotels, light manufacturing industries, rooming houses, parking stations, garages, etc. This section will remain as it is for a long time. There is no demand for residential vacant property. The main railroad station of the city, the Union Station, is located at Harrison and 12th; the La Salle Station at La Salle and Van Buren; the Michigan Central Station at 12th and Michigan; and the Dearborn Station at Polk and Dearborn. Land is level; transportation excellent."},
            "geometry": {
                "type": "MultiPolygon",
                "coordinates": [[[[-87.623567,41.867448],[-87.627718,41.867402],[-87.627988,41.872344],[-87.631981,41.87209],[-87.632267,41.876677],[-87.624052,41.876889],[-87.623567,41.867448]]]]
            }
            },
    {
        "type": "Feature",
            "properties": {myColor: dCol, title: "D36", description: "Balance of housing is 10% apartments and 10% 1-family units. Considerable dumping has been going on here for 95% of the properties are losing money. Many institutions will accept any reasonable offer. Future of the area appears very uncertain as less desirable populace from closer to town areas are spreading into this section. Vandalism is very prevalent, unoccupied houses actually disappearing completely. There are a few 3-flat units valued up to $8,500 renting $50.00 per unit in this section, but location precludes easy disposal. Cosmopolitan population is definitely adversely affecting prices and general desirability of neighborhood. Future trend is downward. Alleys and streets are strewn with dirt and houses are poorly kept. The section gives the appearance of becoming a slum area, although it has not reached that stage yet. Greatest vacancy is in the larger apartments, but vacancy in entire area has increased over year ago."},
            "geometry": {
                "type": "MultiPolygon",
                "coordinates": [[[[-87.705567,41.858344],[-87.70577,41.866441],[-87.705953,41.873721],[-87.691306,41.873898],[-87.691157,41.86673],[-87.690741,41.866354],[-87.690236,41.856862],[-87.695881,41.855888],[-87.696327,41.866553],[-87.702863,41.866509],[-87.702625,41.859296],[-87.705567,41.858344]]]]
            }

    },
    {
        "type": "Feature",
        "properties": {myColor: dCol, title: "D31", description: "This is a very convenient location, immediately adjacent to the Chicago loop on the near north side. The district is gradually being overtaken by encroaching business, and scattered throughout the district even now, are a number of small business enterprises. Rush St. and the adjoining footage along this thorofare has seen a very decided change into nightclub occupancy during the past ten years. From a residential point of view, the section has become quite undesirable; but, because of its possibilities for conversion to business and apt usage, values are well stabilized and there is some indicatino that they may improve. All north and south streets carry a very heavy traffic flow at all times; the area is very noisy and semi-congested. Bulk of the buildings are 3-story units, with a number of scattered hotels and apartment houses. There are also a number of units operated as rooming houses. This area is somewhat better than the adjoining area on the northwest and it is doubtful that it will soon deteriorate to the point that the other has. There is a very consmopolitan population living here, and many of the hotels and apartments have a fairly good (over) class tenant, who desire a convenient location to the loop. The neighborhood is graded fourth class because of its congested appearance, age and obsolescencce of structures, and the encroaching business."},
        "geometry": {
                "type": "MultiPolygon",
                 "coordinates": 
                 [[[[-87.633546,41.89652],[-87.633904,41.910964],[-87.631466,41.910982],[-87.631389,41.907731],[-87.629725,41.907687],[-87.629547,41.904127],[-87.628299,41.904105],[-87.626397,41.900545],[-87.625387,41.900567],[-87.624793,41.891721],[-87.631805,41.891743],[-87.631805,41.896587],[-87.633546,41.89652]]]]
                },
           },
           {
            "type": "Feature",
                "properties": {myColor: dCol, title: "D30", description: "This area extends from Chicago Ave. to North Ave., west of La Salle St. to the industrial section bordering on the north branch of the Chicago River. Although the district is predominantly residential , there is considerable small and large business scattered throughout. The section has no future and that portion south of Division St. is very definitely blighted. The blight is extending north to that point and may be expected to eventually envelop the entire territory. Housing accommodations are, in most cases, little more than minimum shelter and many units have no inside baths. In addition to the residential properties noted above, there are a number of old-fashioned 6 and 8-flat units, which gives the territory a most heterogeneous appearance. In some cases there are two buildings on the same lot, one of course being an alley property. Negro population is largely concentrated south of Division St., and west of Wells St., but a continued infiltration of this race has caused an overflow north of that point; and it is reasonable to assume that the section may eventually become more negro than Italian, which is the other predominating population class residing in this section today. (over) The area is highly congested; streets are dirty and alleys are strewn with refuse. There is a very heavy traffic flow both north and south, and east and west. Industrial encroachment from the south and west will probably gradually decrease the size of this section from a residential standpoint. A Government housing project is planned for the two blocks west of Sedgwick, running from Chicago to Division. A private housing projected erected by the Marshall Field Estate, which occupies the ground between Evergreen St. and Blackhawk St., one block west of Sedgwick, has been comparatively successful, although rents in these buildings are not competitive with surrounding properties. Trend of desirability, from a residential point of view, continues steadily downward; but, because of the favorable location of the district from the point of accessibility to employment centers, this should be a logical place for further slum clearance projects. The area is much more mixed than the classification above would indicate, for there is no indication of uniformity of structures or design, and most units are in a sad state of disrepair. In the southwest corner many houses have been converted to multi-family use, even utilizing attics and basements for living quarters."},
                "geometry": {
                        "type": "MultiPolygon",
                         "coordinates": [[[[-87.648192,41.910916],[-87.643677,41.910893],[-87.633904,41.910964],[-87.633546,41.89652],[-87.64338,41.896587],[-87.643498,41.89924],[-87.646053,41.903619],[-87.648074,41.903685],[-87.648163,41.905343],[-87.644093,41.905277],[-87.643825,41.906427],[-87.644211,41.906958],[-87.645994,41.906958],[-87.646499,41.90583],[-87.648103,41.905764],[-87.648192,41.910916]]]]  }
                    },
                    {
                        "type": "Feature",
                          "properties": {myColor: cCol, title: "C237", description: "This is an old district and may be said to be declining due in large measure to the threat of colored encroachment into the area from the north. Very difficult to sell property in this area to outsiders, and nearly all sales are made to present residents. The area is flat with few trees and is about 95 per cent built up. Some industrial territory just east of the railroad embankment, which forms the northeast boundary of the area. Transportation is adequate, though the western portions of the area are somewhat remote from the IC. Churches, schools and shops are convenient. Grand Crossing Park at the southwest extremity affords recreational facilities. Many Irish and Swedes reside in this neighborhood. Architecture is very mixed in type and there are many 4-6-8-12-24 family structures, also many old frame residences. This is not a good mortgage lending area, but it is possible to obtain in some instances as high as 60 per cent of the appraisal on existing brick residences. B&L's will lend at 6 per cent interest- 3 per cent commission on the older frame dwellings; 5 per cent interest- 2 per cent commission on better properties. Mixture of population, and type of property, declining trend, infiltration threat indicate poor third grade." },
                        "geometry": {
                          "type": "MultiPolygon",
                          "coordinates":  [[[[-87.607739,41.76586],[-87.607881,41.75844],[-87.605207,41.758414],[-87.60535,41.754903],[-87.602819,41.754797],[-87.602733,41.753094],[-87.599218,41.753201],[-87.599147,41.751419],[-87.599681,41.751419],[-87.599681,41.751179],[-87.60516,41.751131],[-87.614855,41.751046],[-87.615033,41.763732],[-87.615033,41.764929],[-87.616566,41.764982],[-87.61653,41.763626],[-87.625049,41.763595],[-87.625396,41.772688],[-87.620139,41.772744],[-87.617743,41.772773],[-87.607739,41.76586]]]]
                        },
                      },
                    {
                        "type": "Feature",
                            "properties": {myColor: cCol, title: "C209", description: "Flat and planted with many small trees. Subdivided about 1911 into 25-30 foot lots. Parochial school and shops convenient. Two parks at northeast and southeast corner of the area. Three civic associations. Many residents employed at stockyards, Clearing Industrial district, and airport. Probably 700 industries are within 30 minutes ride of this area. Between California and Western Aves., and south Marquette Road is a concentration of good class Lithuanian. Irish grouped 63rd and Fairfield, near St. Rita's Catholic church and school. Czechs along the north fringe of area. Heavy Jewish concentration in the vicinity of Mozart St. and Marquette Rd, where values are declining. Car lines along 59th, 63rd, and 71st Sts. Bus lines on 71st, 69th 63rd, and 59th, 55th, and Marquette Road. Eight to 15 dwelling units and 97 per cent rented. Institutions generally favored this area. Equitable foreclosed about 80 houses. Metropolitan Life took 180. Nearly all have been sold. During the foreclosure period bungalows could be rented at $25.00 to $30.00. However, as they sold off, rents advanced sharply. Very few are rented at present. Heavy traffic along 59th, 55th, 69th, 71st and Marquette Road; also on Western, Kedzie and California Aves. Land values are considerably higher than in neighboring area; about $45.00 a front foot. Graded \"C+\" on good demand, conveniences, and pride of ownership."},
                            "geometry": {
                                "type": "MultiPolygon",
                                "coordinates": [[[[-87.683262,41.783226],[-87.682852,41.764697],[-87.692953,41.764542],[-87.692953,41.771632],[-87.710155,41.771367],[-87.710591,41.785966],[-87.710704,41.789733],[-87.710707,41.789821],[-87.710708,41.789865],[-87.710809,41.793233],[-87.688883,41.793454],[-87.688764,41.792147],[-87.683921,41.79217],[-87.683951,41.792856],[-87.681574,41.792812],[-87.681515,41.790176],[-87.682168,41.790242],[-87.682079,41.788736],[-87.681782,41.788492],[-87.681723,41.786189],[-87.683327,41.786166],[-87.683262,41.783226]]]]
                     }
                    },
                {"type": "Feature",
                    "properties": {myColor: cCol, title: "C199", description: "words"},
                    "geometrty": {
                          "type": "MultiPolgyon",
                          "coordinates": [[[-87.800827,41.790133],[-87.800976,41.791736],[-87.801309,41.795192],[-87.801337,41.795812],[-87.780659,41.796095],[-87.780992,41.799675],[-87.778567,41.799781],[-87.77833,41.797938],[-87.767491,41.798151],[-87.767396,41.799852],[-87.763296,41.799967],[-87.752327,41.800277],[-87.751995,41.792622],[-87.756701,41.792658],[-87.756796,41.795351],[-87.763451,41.795245],[-87.764687,41.794926],[-87.765542,41.794111],[-87.76559,41.793012],[-87.765685,41.790921],[-87.800827,41.790133]]]
           }
            },
                    {
                        "type": "Feature",
                            "properties": {myColor: cCol, title: "C195", description: "Located south of 47th to Archer Ave., to 51st to Kilbourne; a 100% foreign area of Polish people, known as the Polish \"Gold Coast.\" Very few homes for rent; buildings have the appearance of being well-kept; pride of ownership apparent; good transportation, schools and churches; all improvements in. Archer Avenue, a main artery into the Chicago Loop, on the southeast, acts as a buffer from the railroad and industrial areas; and in this section of the area, there is considerable vacant property. The better and more wealthy class Polish people from the poorer foreign areas are gradually moving in. Some community spirit exists and new constructino is of substantial character. That portion east of Pulaski contains many old frames; while west of Pulaski, construction is of better grade. 51st St., a business street, runs along the southern boundary. This area should continue to improve slightly but, due to its location midst industry, railroads, and general unfavorable character of area in the entire district (known as the Stock Yards district) cannot be graded better than third grade. The area is about 60 per cent built up."},
                            "geometry": {
                                "type": "MultiPolygon",
                                "coordinates": [[[[-87.718159,41.807735],[-87.713911,41.807802],[-87.723091,41.80211],[-87.723002,41.800383],[-87.727845,41.800399],[-87.736193,41.800427],[-87.73652,41.807802],[-87.729033,41.807868],[-87.718159,41.807735]]]]}
                
                    },
                    {
                        "type": "Feature",
                            "properties": {myColor: cCol, title: "C162", description: "Although houses in this neighborhood are of substantial age and of somewhat obsolete architecture, demand for properties continues and prices remain relatively high for comparable units, in comparison to other parts of Lawndale. Pride of ownership is everywhere apparent for the section is very clean and houses very well kept. A downward trend may be anticipated but at a reasonably slow rate. Foreclosures have been very few and resales far better than average. The most popular type of housing in the neighborhood is a two-flat building with 4-room units; prices on these are higher than on other classes of housing. One-family bunaglows and cottages are also popular, but large one-family units have a rather limited market. Financing is available at local B&L A's, the majority of whom have no real estate on hand. Area is graded third primarily because of age of improvements, but rated well because of appearance and favorable reputation. No dumping has occurred in the section and properties fairly priced will move readily. Immediate future (3-5 years) appears secure. Area tapers off east of St. Louis."},
                            "geometry": {
                                "type": "MultiPolygon",
                                "coordinates": [[[[-87.724685,41.851684],[-87.705278,41.851803],[-87.704936,41.839862],[-87.708415,41.837397],[-87.710412,41.836972],[-87.711895,41.836972],[-87.713036,41.83727],[-87.713663,41.83727],[-87.714005,41.837142],[-87.714519,41.83659],[-87.714519,41.83608],[-87.714462,41.832892],[-87.734313,41.83285],[-87.734484,41.838587],[-87.736994,41.83863],[-87.737108,41.841095],[-87.73437,41.841095],[-87.734638,41.854007],[-87.724757,41.854343],[-87.724685,41.851684]]]]}
                    },

                    {
                        "type": "Feature",
                        "properties": {myColor: cCol, title: "C157", description: "This is a conveniently located area on the near north side, which is experiencing a shifting to rooming-house occupancy, but this trend has not hurt the district very markedly for, in most cases, the neighborhood has attracted better than average rooming house tenancy. There has also been considerable conversion of large homes and apartment house units into 2 and 3-room kitchenette apartments. Most properties are built immediately adjoining, with a maximum setback of about 15 feet. State and Dearborn both carry very heavy traffic and, because of the high use of the land, the appearance of the neighborhood is somewhat congested. Chicago's famous Ambassador Hotel is located on the northwest corner of State and Goethe. It is somewhat unfair to this district to say that it is declining in general desirability; but, because of its age and obsolescence (the latter being minimized by reconditioning and remodeling) the area is, nevertheless, graded third class because of its general appearance. Due consideratino must be given to the location, because of its convenience to Lake Michigan beaches and downtown Chicago. (over) Generally speaking, it is comparatively homogeneous and continues to attract fairly good class people and it is doubtful that any infiltration of noticeably less desirable tenants will soon occur. The ground is now 100 per cent built up, but restrictinos on State St. permit buildings of more than three stories and there is reason to believe that favorable locations may be replaced with large apartment house units, although activity iin this class of structure is arrested in Chicago at the present time. Construction costs indicate that rentals must average at least $17.00 per room to encourage any construction of apartments in an area of this kind. In the portion of the area south of Division St., buildings are quite uniformly 3 story, row type units, also favorably occupied and in good demand, but somewhat older than those properties north of Division St. These streets are probably even more congested than those north of Division St., but trend of desirability compares favorably throughout this entire section."},
                        "geometry": {
                                "type": "MultiPolygon",
                                 "coordinates": 
                                 [[[[-87.625387,41.900567],[-87.626397,41.900545],[-87.628299,41.904105],[-87.629547,41.904127],[-87.629725,41.907687],[-87.631389,41.907731],[-87.631466,41.910982],[-87.629695,41.91096],[-87.629606,41.908881],[-87.628744,41.908925],[-87.628447,41.907068],[-87.627318,41.904326],[-87.62616,41.904348],[-87.624496,41.900567],[-87.625387,41.900567]]]] 

                                },
                           },
                         
    {
        "type": "Feature",
            "properties": {myColor: cCol, title: "C147", description: "his area, like the rest of the Austin territory, is flat with some irregular planting of trees along sidewalks. Boundaries are Lake St. on the north, Laramie ave on the west, and Madison on the south; the area extends eastward to Kenton Ave. This area is characterized by a large number of brick three story apartment buildings, most particularly concentrated near the south of the area in the vicinity of Washington Blvd, where there is considerable Jewish population. The area declines in desirability eastward, Cicero and Lake St. being the \"low spot\". The newest and best construction is found along Washington Blvd toward the west and in the vicinity of LeClaire and Leamington Aves. There are a few scattered three flat structures on Maypole Ave. near Laramie. Cicero Ave. from Madison Ave. northward for 2 or 3 blocks is heavily built up with three story apartment buildings, having stores on the first floor. The area is within easy walking distance of the Austin high school, and furthermore has the advantage of excellent transportation facilities both at the north and south extremities, in addition to which there is the transportation available north and south along Laramie Ave. and Cicero Ave. Desirability decreases approaching the small (over) industrial establishments grouped along Lake St. at the north end. Neighborhood stores are plentiful along Cicero, Madison, and Lake Sts., but better shopping facilities are found in Oak Park three miles distance (west). There are some row houses along Fulton, LeClaire, Leamington, and LaCrosse, for which there are very ltitle demand. This area is about 100% built up and land values may be expressed in terms of $40-100 a front foot; with $40 values beginning in the north end and $100 neighborhood in the south. Age, mixture, industrial influence, and multi-family construction are all indicative of third grade area."},
            "geometry": {
                "type": "MultiPolygon",
                "coordinates": [[[[-87.740317,41.880279],[-87.754865,41.880056],[-87.755073,41.885564],[-87.740466,41.885628],[-87.740317,41.880279]]]]
            }

    },
   
    {
        "type": "Feature",
            "properties": {myColor: cCol, title: "C85", description: "Approximately 25 per cent of the structures in this area are one-family frames with an average of 35 years selling in the price bracket of $3,000 to $5,000 and renting for $25 to $35 per month. This slowly declining neighborhood is fairly clean with some indicatino of pride of ownership. Buildings of all types are spread throughout the section with some large apartments on the corners. The poorer part of this area is west of Lincoln Avenue between Irving Park Boulevard and Berteau. Demand for these inexpensive units has held up fairly well, but because of the age of the buildings and heterogeneous mixture the area can be rated no better than \"C\"."},
            "geometry": {
                "type": "MultiPolygon",
                "coordinates": [[[[-87.665933,41.961568],[-87.664186,41.957565],[-87.664078,41.954427],[-87.664102,41.95425],[-87.678719,41.95402],[-87.678387,41.94299],[-87.688417,41.94283],[-87.688481,41.946482],[-87.688742,41.961223],[-87.68875,41.961701],[-87.684329,41.961595],[-87.685292,41.962947],[-87.688857,41.96308],[-87.689035,41.968646],[-87.679374,41.968646],[-87.679124,41.961303],[-87.665933,41.961568]]]] },
            },
                                         {
                                         "type": "Feature",
                                         "properties": {myColor: bCol, title: "B96", description: "This section is known as Streeterville. Practically all buildings are either apartments or apartment hotels. Convenience to Chicago Loop and Lake Michigan beaches keeps the section in constant demand, and present rent scale is such that occupancy will continue to be of a similar character as those now residing in the district. Apartment units of five rooms and larger are in somewhat less demand than units of 2 or 5 rooms; rentals per room on the smaller units run from $5.00 to $10.00 a month more. Section is rated second class because of location, continued desirability and age of structure."},
                                         "geometry": {
                                                 "type": "MultiPolygon",
                                                  "coordinates": 
                                                  [[[[-87.623398,41.900598],[-87.619713,41.900701],[-87.617455,41.897228],[-87.623189,41.89725],[-87.623398,41.900598]]]] 
                                                },
                                            },
                                            {
                                                "type": "Feature",
                                                    "properties": {myColor: bCol, title: "B95", description: "This is a very unique section on the near north side of Chicago. In many respects it compares to the Back Bay section of Boston, for it is very conveniently located, has high-class occupancy, has seen considerable remodeling and reconditioning and reduction of size of units in some of the large apartment buildings. Altho properties are built comparatively close to the sidewalk and (illegible comment) adjoining walls, trend of desirability continues static and demand is good from persons who want an \"in town\" location. Astor St. has only local traffic and, as such, is a better residential street than State or Dearborn. It is also restricted against more than 3 story buildings at the north end, whereas, in the south no restriction is operative on Dearborn or State. They, therefore, have some speculative value for demolition and erection of apartment house units. Real estate taxes are exceptionally high. There are several cooperative apartment buildings at the south end of Astor. Rentals on apartment units of 6 rooms and more are slightly weak at the present time; but, on smaller units, they are very strong. The trend of reducing these bigger units to smaller kitchenette apartments (over) may be expected to continue. In spite of its age, the area continues to attract very high-class people and, in many respects, the district is equally desirable as Lake Shore Drive, because of its seclusion from the heavy traffic. Transportation is by bus along the Drive. Lake Michigan beaches are convenient and generally considered favorable, altho they do attract a much less desirable class of persons from sections to the west. A few of the houses are operated as rooming houses, but most properties are so strongly held that it is doubtful if the district will ever become a rooming house district in its entirety. Neighborhood is graded second class because of the good class occupancy and because it continues as a desirable residential sectino in spite of its advancing age."},
                                                    "geometry": {
                                                            "type": "MultiPolygon",
                                                             "coordinates": 
                                                             [[[[-87.62616,41.904348],[-87.627318,41.904326],[-87.628447,41.907068],[-87.628744,41.908925],[-87.629606,41.908881],[-87.629695,41.91096],[-87.627289,41.910937],[-87.62616,41.904348]]]]
                                                    }
                                                     },
                                                     {
                                                        "type": "Feature",
                                                            "properties": {myColor: bCol, title: "B64", description: "This neighborhoods is feeling the influence of the Jewish section adjoining on the south. Mortgage lenders are not too anxious to lend in the area because of heavy foreclosure in the neighboring area. Properties are fairly good, however, and many are in first-class condition, but the threatening infilitration is hurting this area. Transportation is inconvenient, for the elevated ends at Lawrence and Kimbell. Rentals in two-family units are not as high as in the area to the south because of location, but sales prices are somewhat better."},
                                                            "geometry": {
                                                                    "type": "MultiPolygon",
                                                                     "coordinates": 
                                                                     [[[[-87.708016,41.976027],[-87.708493,41.975584],[-87.708541,41.97554],[-87.708541,41.974863],[-87.708541,41.974793],[-87.709305,41.974777],[-87.710114,41.974549],[-87.710648,41.974152],[-87.710682,41.974127],[-87.710822,41.973666],[-87.710835,41.973623],[-87.711512,41.973071],[-87.713173,41.972031],[-87.728506,41.97195],[-87.728556,41.97195],[-87.7286,41.972533],[-87.728687,41.973704],[-87.726371,41.973737],[-87.726502,41.97593],[-87.72471,41.976027],[-87.724514,41.974565],[-87.723224,41.9745],[-87.723246,41.973916],[-87.721651,41.973932],[-87.721673,41.975962],[-87.716669,41.97593],[-87.716799,41.983061],[-87.708259,41.983012],[-87.708017,41.976053],[-87.708016,41.976027]]]]}
                                                                     },
                                                                     {
                                                                        "type": "Feature",
                                                                            "properties": {myColor: aCol, title: "A34", description: "This section is generally known as Chicago's Gold Coast. With the exception of a few old, one-faimly residences scattered along the Drive north of Oak St., the bulk of the structures are large apartments and apartment hotels. The exclusive Drake Hotel is located at the southeast corner of Michigan and Oak St. In a number of thesee buildings were units originally ran up to as many as 15 rooms, conversion to smaller-size units has been successful in reducing a heavy vacancy to less than 10 per cent in apartments of six rooms and less. Several of the one-family homes are old Chicago landmarks and include such well-known structures as the Potter Palmer Mansion; these will probably be eventually replaced by apartments similar to those now located along the Drive. there aer several vacant parcels of ground which are presently available for such construction, but development of this character is arrested and it is somewhat doubtful that any immediate high-class apartment construction will occur. The street overlooks Lake Michigan, which is a favorable influence; convenience to downtown Chicago is attractive to persons who want an \"in town\" location. Public (over) school attendance is necessarily of a very cosmopolitan character, due to the proximity of the very poor areas lying west of Clark St. An attempt is now being made, however, to secure a public school location east of Dearborn St. and north of Chicago Ave., with a district restriction to confine attendance to only those children living east of Clark. Should this prove successful, it is reasonable to assume that the entire area would be somewhat more appealing to families with youngsters of grade school age. The bulk of the children today go to private schools. Because of the lack of competition in this class of building, and the high-class occupancy, the section is rated first class, although it does not meet any of the requirements of a typical first class residential neighborhood."},
                                                                            "geometry": {
                                                                                    "type": "MultiPolygon",
                                                                                     "coordinates": 
                                                                                     [[[[-87.619713,41.900701],[-87.623398,41.900598],[-87.624496,41.900567],[-87.62616,41.904348],[-87.627289,41.910937],[-87.625952,41.910937],[-87.624466,41.903552],[-87.623902,41.902248],[-87.623367,41.901584],[-87.621495,41.901363],[-87.620129,41.901363],[-87.619594,41.901341],[-87.619148,41.900921],[-87.61897,41.900722],[-87.619713,41.900701]]]]}
                                                                                     },
                                                                                     
                                                                    
          ],

}

let towns = processJSONLayer(townsData)



const boundData=
{
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {myColor: towerCol, title: "Chicago Public Schools Boundary", description: "This is the boundary for the Chicago Public Schools."},
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                -87.52326965332031,
                41.78360106648078
              ],
              [
                -87.59193420410156,
                41.90355467806868
              ],
              [
                -87.63141632080078,
                41.968425003549285
              ],
              [
                -87.6485824584961,
                41.99547735640674
              ],
              [
                -87.66501903533937,
                42.02290078644039
              ],
              [
                -87.67733573913574,
                42.02299642887601
              ],
              [
                -87.67304420471191,
                42.0193937977854
              ],
              [
                -87.70896434783936,
                42.01917061923413
              ],
              [
                -87.70943641662598,
                41.99729532164924
              ],
              [
                -87.75286674499512,
                41.997311268483024
              ],
              [
                -87.76228666305542,
                42.001696496119784
              ],
              [
                -87.7619218826294,
                42.002780796715626
              ],
              [
                -87.76169657707214,
                42.0084252395699
              ],
              [
                -87.76747941970825,
                42.008178106368895
              ],
              [
                -87.76758670806885,
                42.004813810529456
              ],
              [
                -87.76560187339783,
                42.00393683214554
              ],
              [
                -87.76591300964355,
                42.00368968150856
              ],
              [
                -87.7696144580841,
                42.005379853794416
              ],
              [
                -87.77186751365662,
                42.00963697556413
              ],
              [
                -87.77209281921387,
                42.00953334115145
              ],
              [
                -87.77339100837708,
                42.01196471942283
              ],
              [
                -87.77683496475221,
                42.01196471942283
              ],
              [
                -87.77692079544067,
                42.01563154037739
              ],
              [
                -87.77951717376708,
                42.015599655888934
              ],
              [
                -87.77925968170166,
                42.01196471942283
              ],
              [
                -87.7888298034668,
                42.01206037830709
              ],
              [
                -87.78273582458498,
                42.004598553318246
              ],
              [
                -87.791748046875,
                42.001154338892725
              ],
              [
                -87.79711246490479,
                42.00118623062219
              ],
              [
                -87.79711246490479,
                42.0001656873512
              ],
              [
                -87.80131816864014,
                42.00022947178516
              ],
              [
                -87.8012752532959,
                42.001568930129
              ],
              [
                -87.80522346496582,
                42.00163271315636
              ],
              [
                -87.80539512634277,
                42.00086731260825
              ],
              [
                -87.8066611289978,
                42.00085136666561
              ],
              [
                -87.80653238296509,
                42.018979322709605
              ],
              [
                -87.8167462348938,
                42.018732230513734
              ],
              [
                -87.82146692276001,
                42.01868440610688
              ],
              [
                -87.82146692276001,
                42.01569530930638
              ],
              [
                -87.8197717666626,
                42.01571125152864
              ],
              [
                -87.81976103782654,
                42.01211617925647
              ],
              [
                -87.8192675113678,
                42.012124150816696
              ],
              [
                -87.8192675113678,
                42.01166179867357
              ],
              [
                -87.81995415687561,
                42.011613968949696
              ],
              [
                -87.81985759735107,
                41.996880702568845
              ],
              [
                -87.82329082489014,
                41.984600374446885
              ],
              [
                -87.85556316375732,
                41.989034324622736
              ],
              [
                -87.8553056716919,
                41.98788599305916
              ],
              [
                -87.8560781478882,
                41.986259154551725
              ],
              [
                -87.85633563995361,
                41.98546166951103
              ],
              [
                -87.85637855529785,
                41.98498317369166
              ],
              [
                -87.85629272460938,
                41.98338816165446
              ],
              [
                -87.85552024841309,
                41.98134648794061
              ],
              [
                -87.8562068939209,
                41.9800704086249
              ],
              [
                -87.85702228546143,
                41.97971948232986
              ],
              [
                -87.85805225372316,
                41.979145235130126
              ],
              [
                -87.85929679870605,
                41.97818814495624
              ],
              [
                -87.8610134124756,
                41.976146304509165
              ],
              [
                -87.86174297332762,
                41.97506155014454
              ],
              [
                -87.86187171936035,
                41.974072493297854
              ],
              [
                -87.86135673522949,
                41.97260483225259
              ],
              [
                -87.86032676696777,
                41.972285771028524
              ],
              [
                -87.85899639129639,
                41.97155192414788
              ],
              [
                -87.85723686218262,
                41.971966708206246
              ],
              [
                -87.85616397857665,
                41.97260483225259
              ],
              [
                -87.85513401031494,
                41.972541020135644
              ],
              [
                -87.85440444946289,
                41.97219005234966
              ],
              [
                -87.85406112670898,
                41.971392391098526
              ],
              [
                -87.85406112670898,
                41.97053090572767
              ],
              [
                -87.85513401031494,
                41.96864836011096
              ],
              [
                -87.85509109497072,
                41.9677549291655
              ],
              [
                -87.8547477722168,
                41.96619139486061
              ],
              [
                -87.8547477722168,
                41.96561702568286
              ],
              [
                -87.85556316375732,
                41.96434063119313
              ],
              [
                -87.85560607910156,
                41.96309612194548
              ],
              [
                -87.85560607910156,
                41.96239408036398
              ],
              [
                -87.85582065582274,
                41.961309091796046
              ],
              [
                -87.85629272460938,
                41.960830414495696
              ],
              [
                -87.85689353942871,
                41.96000069865686
              ],
              [
                -87.85753726959229,
                41.95945818630555
              ],
              [
                -87.857666015625,
                41.95859653954859
              ],
              [
                -87.8580093383789,
                41.95757531349073
              ],
              [
                -87.85865306854248,
                41.957320004419216
              ],
              [
                -87.85869598388672,
                41.95639450046089
              ],
              [
                -87.84247398376465,
                41.956617899198655
              ],
              [
                -87.8423023223877,
                41.95061777547761
              ],
              [
                -87.85423278808594,
                41.9510007789743
              ],
              [
                -87.8553056716919,
                41.94851121511038
              ],
              [
                -87.85483360290526,
                41.94771325739893
              ],
              [
                -87.85427570343018,
                41.94640458512989
              ],
              [
                -87.8536319732666,
                41.944936286703964
              ],
              [
                -87.8530740737915,
                41.94343603382104
              ],
              [
                -87.85221576690672,
                41.941297314425746
              ],
              [
                -87.85208702087402,
                41.93989274326094
              ],
              [
                -87.85118579864502,
                41.93890314045385
              ],
              [
                -87.85028457641602,
                41.93813698579806
              ],
              [
                -87.84946918487549,
                41.93749851655352
              ],
              [
                -87.81777620315552,
                41.937929483994715
              ],
              [
                -87.81651020050049,
                41.93804121581888
              ],
              [
                -87.81639218330383,
                41.934314055753546
              ],
              [
                -87.8066074848175,
                41.934529550597915
              ],
              [
                -87.80569553375244,
                41.90868093985819
              ],
              [
                -87.77556896209715,
                41.90933566639275
              ],
              [
                -87.77413934469222,
                41.865438162648545
              ],
              [
                -87.73990631103516,
                41.866013434098825
              ],
              [
                -87.73864030838013,
                41.82168639688706
              ],
              [
                -87.74419784545898,
                41.8214305441352
              ],
              [
                -87.74415493011475,
                41.81599343148372
              ],
              [
                -87.75404691696167,
                41.81297083688547
              ],
              [
                -87.75378942489624,
                41.80011122141625
              ],
              [
                -87.79711246490479,
                41.79948736845894
              ],
              [
                -87.80159711837769,
                41.79815966117963
              ],
              [
                -87.80069589614868,
                41.7736321219153
              ],
              [
                -87.7421486377716,
                41.774808313980415
              ],
              [
                -87.74094700813293,
                41.73449344083669
              ],
              [
                -87.68248558044434,
                41.73547820332488
              ],
              [
                -87.68209934234619,
                41.71364175508968
              ],
              [
                -87.69173383712767,
                41.71359370191703
              ],
              [
                -87.69156217575073,
                41.70809938565181
              ],
              [
                -87.70146489143372,
                41.708043318779744
              ],
              [
                -87.70140051841736,
                41.70613701603637
              ],
              [
                -87.71115303039551,
                41.70608094745296
              ],
              [
                -87.71130323410034,
                41.711479326754386
              ],
              [
                -87.71274089813232,
                41.711383217139925
              ],
              [
                -87.71284818649292,
                41.713353435514804
              ],
              [
                -87.72115230560303,
                41.7132092752424
              ],
              [
                -87.72033691406249,
                41.6912530961475
              ],
              [
                -87.7397882938385,
                41.690916606045825
              ],
              [
                -87.73947715759277,
                41.683585491965275
              ],
              [
                -87.71145343780516,
                41.68411031532311
              ],
              [
                -87.71138906478883,
                41.68272012501938
              ],
              [
                -87.71135687828064,
                41.6816784641859
              ],
              [
                -87.71183431148529,
                41.68165843208153
              ],
              [
                -87.71180212497711,
                41.68100137560167
              ],
              [
                -87.71136224269867,
                41.68100137560167
              ],
              [
                -87.71132469177246,
                41.68041242293307
              ],
              [
                -87.71016061306001,
                41.68046851389565
              ],
              [
                -87.7099460363388,
                41.680548643757376
              ],
              [
                -87.70527362823486,
                41.680612747574905
              ],
              [
                -87.70543187856673,
                41.684198453177146
              ],
              [
                -87.70054489374161,
                41.68426655961801
              ],
              [
                -87.70060926675797,
                41.685624667122056
              ],
              [
                -87.69937813282013,
                41.685660722682854
              ],
              [
                -87.69945859909058,
                41.687948206400776
              ],
              [
                -87.69644379615784,
                41.6879762486037
              ],
              [
                -87.69597172737122,
                41.68805236309292
              ],
              [
                -87.69595563411713,
                41.6881765496978
              ],
              [
                -87.69577324390411,
                41.688172543682036
              ],
              [
                -87.69561767578125,
                41.68434267849602
              ],
              [
                -87.68589735031128,
                41.68442680978276
              ],
              [
                -87.68617630004883,
                41.677952385483096
              ],
              [
                -87.68641233444214,
                41.67719913045582
              ],
              [
                -87.6725721359253,
                41.6772872777762
              ],
              [
                -87.67321586608887,
                41.6761173126002
              ],
              [
                -87.6725721359253,
                41.675876906162834
              ],
              [
                -87.67167091369627,
                41.67722317064609
              ],
              [
                -87.66130685806274,
                41.67751966558757
              ],
              [
                -87.66114592552185,
                41.67021908211513
              ],
              [
                -87.64137268066406,
                41.67037936726122
              ],
              [
                -87.64145851135254,
                41.663262322261076
              ],
              [
                -87.64742374420166,
                41.663262322261076
              ],
              [
                -87.64750957489014,
                41.657587357832
              ],
              [
                -87.64300346374512,
                41.65787592741333
              ],
              [
                -87.64132976531982,
                41.65781180095145
              ],
              [
                -87.63720989227295,
                41.65781180095145
              ],
              [
                -87.63562202453613,
                41.657587357832
              ],
              [
                -87.63454914093018,
                41.657587357832
              ],
              [
                -87.63317584991454,
                41.65774767442571
              ],
              [
                -87.63167381286621,
                41.65797211698645
              ],
              [
                -87.63090133666991,
                41.65810036952712
              ],
              [
                -87.62927055358887,
                41.65906225544114
              ],
              [
                -87.62772560119629,
                41.660024126988475
              ],
              [
                -87.62716770172119,
                41.66066536670522
              ],
              [
                -87.6263952255249,
                41.661050107470366
              ],
              [
                -87.6252794265747,
                41.662300499081816
              ],
              [
                -87.62339115142822,
                41.66297377681583
              ],
              [
                -87.62201786041258,
                41.66316614058965
              ],
              [
                -87.6209020614624,
                41.66306995877457
              ],
              [
                -87.61961460113525,
                41.66268523007754
              ],
              [
                -87.61927127838135,
                41.661563091581506
              ],
              [
                -87.6190996170044,
                41.660857737375125
              ],
              [
                -87.6190996170044,
                41.660120313353055
              ],
              [
                -87.6190996170044,
                41.659318755925156
              ],
              [
                -87.6194429397583,
                41.65867750279953
              ],
              [
                -87.62012958526611,
                41.65745910426971
              ],
              [
                -87.62107372283936,
                41.656401002635455
              ],
              [
                -87.62163162231445,
                41.65563146325568
              ],
              [
                -87.62223243713379,
                41.654060291806
              ],
              [
                -87.62137413024901,
                41.65168742962402
              ],
              [
                -87.61691093444824,
                41.65034063112266
              ],
              [
                -87.61725425720215,
                41.64437589929573
              ],
              [
                -87.52498626708983,
                41.64354207558648
              ],
              [
                -87.52326965332031,
                41.78360106648078
              ]
            ]
          ]
        },
        
      }
    ]
  }
        let bound = processJSONLayer([boundData],
          {description: 'Chicago District School Board'}
          )
////////////////////////////////////////////////////////
// MAP DATA PART 3: DIRECT CREATION OF SHAPE OVERLAYS //
////////////////////////////////////////////////////////


// Hogwarts Buildings Objects and LayerGroup
// API docs: https://leafletjs.com/reference-1.5.0.html#polygon
//  (keep scrolling for docs on rectangles and circles)
let UofChicago = L.rectangle([[41.7949, -87.6062],
                              [41.7895, -87.5964]], {
    color: gryfCol,
    opacity: 0.8,
    weight: 2,
    fillColor: gryfCol,
    fillOpacity: 0.35,
    title: 'University of Chicago',
    windowContent: `<h3>The University of Chicago</h3><p>The average Composite SAT score for a student accepted into the University of Chicago is 1530</p3>`
});

let BlackMetro = L.rectangle([[41.8023, -87.6038], [41.8382, -87.6300]], {
    color: gryfCol,
    opacity: 0.8,
    weight: 2,
    fillColor: slythCol,
    fillOpacity: 0.35,
    title: 'Black Metropolis–Bronzeville District',
    windowContent: `<h3>Black Metropolis-Bronzeville District</h3><p>A district of Chicago which is historically black.</p3>`
});

let SchBoard = L.rectangle([[41.8821, -87.6292], [41.8832, -87.6280]], {
    color: gryfCol,
    opacity: 0.8,
    weight: 2,
    fillColor: gryfCol,
    fillOpacity: 0.35,
    radius: 40,
    title: 'Chicago Board of Education',
    windowContent: `<h3>Chicago Board of Education</h3><p>The Head Office of the Chicago District School Board.</p>`
});

let houses = processManualLayers([UofChicago, BlackMetro, SchBoard],
                                 {description: 'Important Chicago Areas'});




// Polyline Objects and Layer Group ("paths")
// let vanishingPath = L.polyline([[51.37178037591737, -0.2197265625],
//                                 [55.36857598381045, -1.7512893676757812],
//                                 [55.48997247517858,-1.5944015979766843 ]], {
//                                     color: slythCol,
//                                     weight: 6,
//                                     title: 'DeathEaters Travel',
//                                     windowContent: `<h3>Line of Travel for Deatheaters</h3><p>From the twin Vanishing Cabinet, the Deatheraters can travel directly from Bourquin and Burkes</p>`})


// let tunnelPath = L.polyline([[55.49065933144361,-1.6042077541351318],
//                                 [55.49027247517858,-1.5943015979766843 ]], {
//                                     color: gryfCol,
//                                     weight: 6,
//                                     title: 'Tunnel to Hogsmeade',
//                                     windowContent: `<h3>Marauders' Map Tunnel</h3><p>Not really sure why this worked in the first ocuple of books.</p>`})

// let horcruxPath = L.polyline([[55.49058639152367,-1.5951092937469482],
//                               [55.61679475360749,-1.6392910480499268]], {
//                                   color: gryfCol,
//                                   weight: 4,
//                                   title: 'Return from Horcrux quest',
//                                   windowContent: `<h3>Return Disapparation from Failed Horcrux quest</h3><p>Exhaisted and grieviously injured, Dumbledore returns to find the trap he had so long expected has been sprung.</p>`})
// let paths = processManualLayers([vanishingPath, tunnelPath, horcruxPath], {description: 'Paths'})


////////////////////////////////////////////////
// array of all the layers!!!!!!!
// these layers will be added to the map
// you should change these variable names
// to align with the variables you've defiend above
let allLayers = [bound, ExceedsMarkers, ApproachingMarkers, MeetsMarkers, towns, houses];

// <script src="/js/leaflet-0.7.2/leaflet.ajax.min.js"></script>; 

// var geojsonLayer = new L.GeoJSON.AJAX("ILChicago1940.json");

///////////////////////////////////////
// END DATA!!  END DATA!! END DATA!! //
///////////////////////////////////////

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////
// FUNCTIONS FUNCTIONS FUNCTIONS FUNCTIONS //
/////////////////////////////////////////////


/**
 * create a Leaflet map inside an element, add base layer and return the map as a return value
 * @param {HTMLElement|string} element: can be either a full HTMLElement or the ID attribute
 * of a DOM node
 * @returns {Object} a Leaflet map object 
 */
function createMap (element) {
    const map = L.map(element, {renderer:L.canvas(), preferCanvas: true}).setView(myCenter, myZoom);
    // now we add the base layer
    // you can change this if you want!
    // if your tiles seem to load very slowly, you may want to generate your own accessToken
    // and insert the value in `accessToken`, below. 
    // see: https://docs.mapbox.com/help/how-mapbox-works/access-tokens/#creating-and-managing-access-tokens
    // to change the tile layer, change the `id` attribute below.
    // some valid options include: mapbox.streets, mapbox.light, mapbox.satellite, mapbox.dark, mapbox.outdoors 
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}@2x.png?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	id: 'mapbox.streets',
	accessToken: 'pk.eyJ1IjoidGl0YW5pdW1ib25lcyIsImEiOiJjazF0bTdlNXQwM3gxM2hwbXY0bWtiamM3In0.FFPm7UIuj_b15xnd7wOQig'
    })
        .addTo(map);
    return map
}


/**
 * Add Markers to a "layerGroup" and return the populated object
 * @param {Array.<Object>} markerInfo
 * @param {string} markerInfo[].title
 * @param {Array|Object} markerInfo[].position
 * @param {Object} layerGroup
 * @returns {Object} the modified layerGroup object 
 */
function processMarkerLayer (markerInfo, options) {
    let layerGroup = L.layerGroup([], options);
    // iterate over the marker info array, adding to the main marker layer but
    // *also* to another layer if the icon property is set. 
    for (const m of markerInfo) {
        // define a Leaflet marker object for each marker
        // we pass two parameters: a position (2-value array of lat & lng vals)
        // and an object containing marker propertie
        let marker =  L.marker (m.position, {
            // We set the icon 
            icon:   m.icon || layerGroup.options.defaultIcon || L.Icon(),
            title: m.title,
            description: m.description,
            windowContent: m.windowContent //this is obsolete
        });
        let t = assembleTexts(marker);
        marker.bindPopup(t.popup);
        // this seems to be unnecessary on modern browsers for some reason
        //marker.bindTooltip(t.tooltip);
        layerGroup.addLayer(marker);
    }
    return layerGroup;
}

/**
 * create a geoJSON layer and return the geoJSON layer object.
 * If the featureGroup has the non-standard property
 * 'description' it will be explicitly set on the returned object as well.
 * If an individual feature has the property feature.properties.title,
 * then the options.title property will be set on the resultant layer
 * for compatibility with marker layers.
 * The custom property `feature.properties.myColor` will also be used to set line and
 * fill colors.
 * 
 * @param {GeoJSON} jsonData
 * @returns {Object} the newly-created geoJSON layer 
 */
function processJSONLayer (jsonData) {
    return L.geoJSON(jsonData, {
        // the 'style' option is a *function* that modifies some
        // feature properties.  
        // cf https://leafletjs.com/reference-1.5.0.html#geojson-style
        style: function(feature) {
            let c = feature.properties.myColor;
            return {color: c, weight: 3, fillColor: c, fillOpacity: 0.5};
        },
        onEachFeature: function (feature, layer) {
            layer.options.description = '';
            if (feature.properties ) {
                if (feature.properties.title) {
                    layer.options.title = feature.properties.title;
                }
                if (feature.properties.description) {
                    layer.options.description = feature.properties.description;
                }
            }
            let t = assembleTexts(layer);
            layer.bindPopup(t.popup);
            layer.bindTooltip(t.tooltip, {sticky: true});
        },
        description: jsonData.description || "GeoJSON Objects"
    });
}

/**
 * create a layerGroup from an array of individual Layer objects.
 * If the non-standard options `windowContent`, `title`, and/or `description` have been
 * set, they will be used to create a popup window and tooltip now, and
 * to generate legend text in `addLayerToLegendHTML` later on.
 * The `options` parameter should include a `description` property,
 * (NOTE: this is *separate* from the description of the individual layers!!)
 * which will also be used by `addLayerToLegendHTML` and in the layers
 * control box. 
 * @param {} layerArray
 * @param {} options
 * @returns {} 
 */
function processManualLayers (layerArray, options = {description: 'Unnamed Layer'}) {
    for (const l of layerArray) {
        let t = assembleTexts(l);
        l.bindPopup(t.popup);
        l.bindTooltip(t.tooltip, {sticky: true});
    }
    return L.layerGroup(layerArray, options)
}


function assembleTexts (feature) {
    let opts = feature.options,
        tooltip = 'Untitled Tooltip',
        popup = '<h2>Untitled</h2>',
        legend = 'Untitled';
    
    if (opts.title) {
        popup = `<h2>${opts.title}</h2>` + (opts.description || '');
        tooltip = opts.title;
        legend = opts.title;
    }
    if (opts.windowContent) {
        popup = opts.windowContent;
    }
    return {tooltip: tooltip, popup: popup, legend: legend};
}
/**
 * For every element of `layerGroup`, add an entry to the innerHTML of
 * the element matched by `querySelector`, consisting of a div whose
 * `onclick` attribute is a call to `locateMapFeature` which navigates to, and
 * opens the popup window of, that feature.  The link text will be one of `options.infoHTML`,
 * `options.title`, or 'no title', in that order.
 * @param {Array} layerGroup
 * @param {string} querySelector
 * @returns {string} innerHTML content of the legend element 
 */
function addLayerToLegendHTML (layerGroup, el) {
    let output = `<div class="legend-content-group-wrapper"><h2>${layerGroup.options.description}</h2>`;
    for (let l in layerGroup._layers) {
        // this is hideously ugly! very roundabout way
        // to access anonymous marker from outside the map
        let current = layerGroup._layers[l];
        let info = assembleTexts(current).legend;
        output +=  `
<div class="pointer" onclick="locateMapFeature(projectMap._layers[${layerGroup._leaflet_id}]._layers[${l}])"> 
    ${info} 
</div>`;
    }
    output += '</div>'
    el.innerHTML += output;
    return el.innerHTML
}

/* a function that will run when the page loads.  It creates the map
   and adds the existing layers to it. You probably don't need to change this function; 
   instead, change data and variable names above, or change some of the helper functions that
   precede this function.
 */
async function initializeMap() {

    // this one line creates the actual map
    // it calls a simple 2-line function defined above
    projectMap = createMap('map_canvas');
    // set the legend location
    let legendEl = document.querySelector('#map_legend');

    let layerListObject = {};
    // add markers to map and to legend, then add a toggle switch to layers control panel
    for (let l of allLayers) {
        l.addTo(projectMap);
        addLayerToLegendHTML(l, legendEl);
        layerListObject[l.options.description] = l;
    }

   // add a layers control to the map, using the layer list object
    // assigned above
    L.control.layers(null, layerListObject).addTo(projectMap);

    // You'll want to comment this out before handing in, but it makes life a bit easier.
    // while you're developing
    coordHelp();
}

/**
 * pan to object if it's a marker; otherwise use the `fitBounds` method on the feature
 * Then open the marker popup.
 * @param {Object} marker
 */
function locateMapFeature (marker) {
    marker.getLatLng ? projectMap.panTo(marker.getLatLng(), {animate: true, duration: 1.5}).setZoom(16) : projectMap.fitBounds(marker.getBounds()); 
    marker.openPopup();
}

function coordHelp () {
    projectMap.on('click', function(e) {
        console.log("Lat, Lon : [ " + e.latlng.lat + ", " + e.latlng.lng + " ]")
    });
}

function resetMap (map) {
    map.setView(myCenter, myZoom).closePopups()
}
