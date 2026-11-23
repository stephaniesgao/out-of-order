// Everyday comparisons: three familiar anchors, one medium fact, one surprise.
const q=(id,topic,title,answer,unit,difficulty,family,explanation,source=null,label='Work it out')=>({id,topic,title,answer,unit,difficulty,family,explanation,source,label});
export const QUESTIONS=[
q('die','games','Faces on a normal die',6,'faces','anchor','die','A normal die is a cube, with one face for each number from 1 to 6.'),
q('deck','games','Cards in a poker deck, without jokers',52,'cards','anchor','cards','Four suits, with thirteen cards in each: 4 × 13 = 52.','https://mathworld.wolfram.com/Cards.html','Wolfram MathWorld'),
q('chessboard','games','Small squares on a chessboard',64,'squares','anchor','chess','A chessboard has 8 rows and 8 columns: 8 × 8 = 64.','https://new.uschess.org/sites/default/files/media/documents/us-chess-rule-book-online-only-edition-chapters-1-2-9-10-11-2024.pdf','US Chess'),
q('eggs','food','Eggs in a dozen',12,'eggs','anchor','dozen','A dozen means twelve. A baker’s dozen is different: thirteen.'),
q('litre','kitchen','Millilitres in a litre',1000,'millilitres','anchor','volume','A millilitre is one thousandth of a litre, so a litre holds 1,000 millilitres.'),
q('alphabet','words','Letters in the English alphabet',26,'letters','anchor','alphabet','Count A through Z: there are 26 letters.'),
q('minute','time','Seconds in a minute',60,'seconds','anchor','time','A minute contains sixty seconds.'),
q('leap-year','time','Days in a leap year',366,'days','anchor','time','A leap year adds 29 February to the usual 365 days: 365 + 1 = 366.'),
q('stop-sign','everyday','Sides on a standard stop sign',8,'sides','anchor','shapes','A standard stop sign is an octagon: a shape with eight sides.'),
q('football-match','sport','Minutes in a football match, before added time',90,'minutes','anchor','football','Two halves of 45 minutes make 90 minutes. Added time and extra time are not included.','https://www.theifab.com/laws/latest/the-duration-of-the-match/','IFAB'),
q('football-team','sport','Players per football team on the pitch at kick-off',11,'players','anchor','football','A full side in standard association football has eleven players, including the goalkeeper. Substitutes are not counted.','https://www.theifab.com/laws/latest/the-players/','IFAB'),
q('basketball','sport','Players per basketball team on court at once',5,'players','anchor','basketball','In standard five-a-side basketball, each team has five players on court.','https://assets.fiba.basketball/image/upload/documents-corporate-wabc-start-coaching-eng-coach-workbook.pdf','FIBA'),
q('cube','everyday','Faces on a cube',6,'faces','anchor','die','A cube has a top, a bottom, and four sides: six faces altogether.'),
q('triangle','everyday','Sides on a triangle',3,'sides','anchor','shapes','A triangle has three straight sides.'),
q('square','everyday','Corners on a square',4,'corners','anchor','shapes','A square has four corners, one where each pair of sides meets.'),
q('day-hours','time','Hours in a day',24,'hours','anchor','time','An ordinary calendar day has 24 hours.'),
q('week-days','time','Days in a week',7,'days','anchor','time','Monday through Sunday: seven days.'),
q('year-days','time','Days in a year that is not a leap year',365,'days','anchor','time','An ordinary year has 365 days. Leap years add one more.'),
q('century','time','Years in a century',100,'years','anchor','time','A century is one hundred years: ten decades.'),
q('decade','time','Years in a decade',10,'years','anchor','time','A decade is ten years.'),
q('piano','music','Keys on a full-size piano',88,'keys','medium','piano','A standard full-size piano has 88 keys. Smaller keyboards can have fewer.','https://usa.yamaha.com/musical-instruments/pianos/products/p-series/p-225/specs.html','Yamaha'),
q('piano-white','music','White keys on a full-size piano',52,'white keys','medium','piano','A standard 88-key piano has 52 white keys and 36 black keys. Seven full groups of seven white keys, plus the extra A, B and final C, give 49 + 3 = 52.','https://en.wikipedia.org/wiki/Piano','Piano reference'),
q('piano-black','music','Black keys on a full-size piano',36,'black keys','medium','piano','The black keys repeat in groups of two and three. Across a standard 88-key piano, there are 36 black keys.','https://en.wikipedia.org/wiki/Piano','Piano reference'),
q('adult-teeth','body','Teeth in a full adult set, including wisdom teeth',32,'teeth','medium','human-teeth','A complete adult set has sixteen teeth in each jaw, including four wisdom teeth. Not everyone keeps or develops all of them.','https://www.mouthhealthy.org/all-topics-a-z/eruption-charts','American Dental Association'),
q('baby-teeth','body','Teeth in a complete set of baby teeth',20,'teeth','medium','human-teeth','A complete set of baby teeth has ten in the top jaw and ten in the bottom: twenty altogether.','https://www.mouthhealthy.org/all-topics-a-z/baby-teeth.aspx/','American Dental Association'),
q('scrabble','games','Tiles in a standard English Scrabble set',100,'tiles','medium','scrabble','The standard English-language game has 100 tiles, including the two blank tiles.','https://www.hasbro.com/common/instruct/scrabble.pdf','Hasbro'),
q('monopoly','games','Spaces around a classic Monopoly board',40,'spaces','medium','monopoly','There are ten spaces along each side when each corner is counted once: forty around the board.','https://mms.businesswire.com/media/20150121006051/en/448463/1/80_Things_You_Didn%27t_Know_About_Monopoly_FINAL.pdf?download=1','Hasbro'),
q('week-hours','time','Hours in a week',168,'hours','medium','time','Seven days, each with 24 hours: 7 × 24 = 168.'),
q('octopus-hearts','animals','Hearts in an octopus',3,'hearts','surprise','octopus','An octopus has three hearts: two pump blood to the gills, and the third pumps it around the body.','https://education.nationalgeographic.org/resource/animals-101-octopuses/','National Geographic'),
q('giraffe-neck','animals','Neck bones in a giraffe',7,'neck bones','surprise','giraffe','Usually seven, just like most mammals. A giraffe’s neck bones are much longer.','https://vanat.ahc.umn.edu/museum/pages/GiraffeCerVert1a.html','University of Minnesota'),
q('dog-teeth','animals','Teeth in a full adult dog’s set',42,'teeth','surprise','dog','A full adult dog’s set normally has 42 permanent teeth.','https://www.merckvetmanual.com/dog-owners/digestive-disorders-of-dogs/dental-development-of-dogs','Merck Veterinary Manual'),
q('bee-eyes','animals','Eyes on a honeybee',5,'eyes','surprise','bee','Two large compound eyes and three small simple eyes make five in total.','https://extension.arizona.edu/sites/extension.arizona.edu/files/pubs/az2011-2022.pdf','University of Arizona')
];

// Challenging but approachable: familiar objects, estimates, and short reasoning.
export const HARD_START='2026-11-24';
const extra=[
q('cat-teeth','animals','Teeth in a full adult cat’s set',30,'teeth','surprise','cat','A complete adult cat dentition has 30 permanent teeth.','https://www.merckvetmanual.com/cat-owners/digestive-disorders-of-cats/dental-development-of-cats','Merck Veterinary Manual'),
q('jenga','games','Wooden blocks in a classic Jenga set',54,'blocks','surprise','jenga','The classic tower starts with 18 layers of three blocks.','https://www.hasbro.com/common/instruct/jenga.pdf','Hasbro rules'),
q('liberty-height','places','Statue of Liberty, ground to torch, in metres (rounded)',93,'metres','surprise','liberty','The statue and pedestal together reach about 92.99 metres, rounded here to 93.','https://www.nps.gov/stli/learn/historyculture/statue-statistics.htm','National Park Service'),
q('big-ben-height','places','Elizabeth Tower (Big Ben), in metres (rounded)',96,'metres','surprise','big-ben','The tower is 96.3 metres tall, rounded here to the nearest metre. Big Ben is the bell inside.','https://www.parliament.uk/about/living-heritage/building/palace/architecture/palacestructure/towers-of-parliament/','UK Parliament'),
q('london-eye','places','Height of the London Eye, in metres',135,'metres','surprise','london-eye','The observation wheel reaches 135 metres.','https://www.londoneye.com/plan-your-visit/information-and-support/faqs/','London Eye'),
q('eiffel-height','places','Eiffel Tower including its antenna, in metres',330,'metres','surprise','eiffel','The antenna installed in March 2022 brought the tower to 330 metres.','https://www.toureiffel.paris/en/news/history-and-culture/300-330-meters-story-towers-height','Eiffel Tower'),
q('wimbledon-draw','sport','Players starting Wimbledon’s men’s singles main draw',128,'players','surprise','tennis','Seven knockout rounds take a full draw of 128 players down to one champion. Qualifying is separate.','https://assets.wimbledon.com/archive/draws/pdfs/draws/2025_MS_A4.pdf','Wimbledon'),
q('skeleton','body','Bones in the usual textbook adult human skeleton',206,'bones','surprise','skeleton','The conventional count is 206 named bones. Individual anatomy can vary.','https://training.seer.cancer.gov/anatomy/skeletal/review.html','National Cancer Institute'),
q('die-total','games','Total dots across every face of a normal die',21,'dots','reasoning','die','Add 1 + 2 + 3 + 4 + 5 + 6, or pair the opposite faces: three pairs of seven.'),
q('domino-set','games','Tiles in a double-six domino set, including blanks',28,'tiles','reasoning','domino','There are seven possible values, from blank to six. Count each unordered pair, including doubles: 7 + 6 + 5 + 4 + 3 + 2 + 1 = 28.'),
q('deck-red-pips','games','Suit symbols on all red number cards, 2 through 10',108,'symbols','reasoning','cards','Count the central suit symbols, excluding corner indices. One suit has 2 + 3 + … + 10 = 54; hearts and diamonds together make 108.'),
q('handshakes','everyday','Handshakes if 12 people each greet everyone else once',66,'handshakes','reasoning','handshakes','Each of 12 people greets 11 others, but that counts each handshake twice: 12 × 11 ÷ 2 = 66.'),
q('weekend-hours','time','Hours from Friday at 6 pm to Monday at 9 am',63,'hours','reasoning','time','Friday 6 pm to Sunday 6 pm is 48 hours. Add 15 more hours to Monday 9 am: 63. Assume no clock change.'),
q('quarter-hours','time','Quarter-hour slots in a whole day',96,'slots','reasoning','time','Four fifteen-minute slots fit in each hour. Multiply 24 × 4 = 96.'),
q('two-days-hours','time','Hours in two days and three quarters of a day',66,'hours','reasoning','time','Two full days make 48 hours. Three quarters of 24 is 18: 48 + 18 = 66.'),
q('square-foot','everyday','Square inches in one square foot',144,'square inches','reasoning','area','A foot is 12 inches long. A one-foot square is 12 × 12 = 144 square inches.'),
q('tiles-border','everyday','Tiles around the edge of a 20-by-20 square patio',76,'tiles','reasoning','patio','Count 20 on the top and bottom, then 18 on each side so corners count once: 20 + 20 + 18 + 18 = 76.'),
q('triangular-stack','food','Oranges in a triangular display with 12 in its bottom row',78,'oranges','reasoning','oranges','The rows contain 1 through 12 oranges. Pair first with last: 12 × 13 ÷ 2 = 78.'),
q('domino-dots','games','Total dots across a complete double-six domino set',168,'dots','reasoning','domino','Include the blank tiles and doubles. Each value from 0 to 6 appears on eight tile halves: once beside each other value, and twice on its double. The sum is 8 × (0 + 1 + 2 + 3 + 4 + 5 + 6) = 168.'),
q('stair-climb','everyday','Steps climbed going from floor 1 to floor 9, 18 per floor',144,'steps','reasoning','stairs','There are eight gaps between floors 1 and 9: 8 × 18 = 144.'),
q('pizza-pairs','food','Different two-topping pizzas using 16 toppings',120,'combinations','reasoning','pizza','Choose two different toppings; order does not matter. There are 16 × 15 ÷ 2 = 120 pairs.'),
q('photo-prints','everyday','Photos in a 15-by-15 grid with its centre photo removed',224,'photos','reasoning','photos','The full grid holds 15 × 15 = 225 photos. Removing one leaves 224.'),
q('sum-clock','everyday','Sum of all the hour numbers on an ordinary clock face',78,'total','reasoning','clock','Add 1 through 12: six pairs that each total thirteen make 78.'),
q('ribbon','everyday','Centimetres left from 3 metres of ribbon after cutting off 85 cm',215,'centimetres','reasoning','ribbon','Three metres is 300 centimetres: 300 − 85 = 215.')
];
export const HARD_QUESTIONS=[...QUESTIONS.filter(f=>f.difficulty==='medium'||f.id==='dog-teeth'),...extra];
export const ALL_QUESTIONS=[...QUESTIONS,...extra];
