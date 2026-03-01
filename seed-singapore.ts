/**
 * Seeder: Singapore Address Data
 * Hierarchy: Province (SG) → City (Region) → District (Planning Area) → Subdistrict (Subzone + Postal Code)
 *
 * Usage:
 *   npx tsx seed-singapore.ts
 *
 * Requires Payload Admin running at http://localhost:3001
 */

const API_URL = 'http://localhost:3000/api' // Payload Admin (admin app) runs on port 3000
const ADMIN_EMAIL = 'cecep.azhtech@gmail.com'
const ADMIN_PASSWORD = '12345678'

// ─────────────────────────────────────────────
// Singapore Complete Address Data
// ─────────────────────────────────────────────

const singaporeData = {
  name: 'Singapore',
  code: 'SG',
  regions: [
    {
      name: 'Central Region',
      planningAreas: [
        {
          name: 'Bishan',
          subzones: [
            { name: 'Bishan East', postalCode: '579818' },
            { name: 'Bishan North', postalCode: '579102' },
            { name: 'Marymount', postalCode: '574434' },
            { name: 'Sin Ming', postalCode: '575722' },
            { name: 'Tagore', postalCode: '787911' },
          ],
        },
        {
          name: 'Bukit Merah',
          subzones: [
            { name: 'Alexandra Hill', postalCode: '119936' },
            { name: 'Alexandra North', postalCode: '159947' },
            { name: 'Bukit Ho Swee', postalCode: '162081' },
            { name: 'Bukit Merah', postalCode: '150001' },
            { name: 'Commonwealth', postalCode: '149544' },
            { name: 'Henderson Hill', postalCode: '151009' },
            { name: 'Kampong Tiong Bahru', postalCode: '168730' },
            { name: 'Mount Faber', postalCode: '099201' },
            { name: 'Redhill', postalCode: '157361' },
            { name: 'Telok Blangah Drive', postalCode: '100006' },
            { name: 'Telok Blangah Rise', postalCode: '109455' },
            { name: 'Tiong Bahru', postalCode: '168732' },
          ],
        },
        {
          name: 'Bukit Timah',
          subzones: [
            { name: 'Bukit Timah', postalCode: '269730' },
            { name: 'Coronation Road', postalCode: '269476' },
            { name: 'Farrer', postalCode: '259536' },
            { name: 'Gombak', postalCode: '599489' },
            { name: 'Hillcrest', postalCode: '288906' },
            { name: 'Swiss Club', postalCode: '288150' },
            { name: 'Ulu Pandan', postalCode: '596208' },
          ],
        },
        {
          name: 'Downtown Core',
          subzones: [
            { name: 'Anson', postalCode: '079903' },
            { name: 'Bayfront', postalCode: '018971' },
            { name: 'Beach Road', postalCode: '189673' },
            { name: 'Bugis', postalCode: '188065' },
            { name: 'Chinatown', postalCode: '058457' },
            { name: 'City Hall', postalCode: '179369' },
            { name: 'Clarke Quay', postalCode: '179021' },
            { name: 'Marina Centre', postalCode: '039798' },
            { name: 'Nicoll Highway', postalCode: '188888' },
            { name: 'Phillip Street', postalCode: '048694' },
            { name: 'Raffles Place', postalCode: '048624' },
            { name: 'Shenton Way', postalCode: '068805' },
            { name: 'Tanjong Pagar', postalCode: '088535' },
          ],
        },
        {
          name: 'Geylang',
          subzones: [
            { name: 'Aljunied', postalCode: '389852' },
            { name: 'Geylang East', postalCode: '389688' },
            { name: 'Kallang Way', postalCode: '349168' },
            { name: 'Kampong Ubi', postalCode: '408562' },
            { name: 'MacPherson', postalCode: '348550' },
            { name: 'Pelton Canal', postalCode: '389457' },
            { name: 'Sims', postalCode: '387431' },
            { name: 'Tai Seng', postalCode: '534116' },
          ],
        },
        {
          name: 'Kallang',
          subzones: [
            { name: 'Bendemeer', postalCode: '330001' },
            { name: 'Boon Keng', postalCode: '330021' },
            { name: 'Crawford', postalCode: '209014' },
            { name: 'Geylang Bahru', postalCode: '330063' },
            { name: 'Kolam Ayer', postalCode: '327536' },
            { name: 'Lavender', postalCode: '210001' },
            { name: 'Old Airport Road', postalCode: '390001' },
            { name: 'Tanjong Rhu', postalCode: '436881' },
            { name: 'Tyrwhitt', postalCode: '207571' },
          ],
        },
        {
          name: 'Marine Parade',
          subzones: [
            { name: 'Amber', postalCode: '439984' },
            { name: 'Bayshore', postalCode: '469960' },
            { name: 'Katong', postalCode: '428739' },
            { name: 'Kembangan', postalCode: '418924' },
            { name: 'Marine Parade', postalCode: '449287' },
            { name: 'Mountbatten', postalCode: '398024' },
            { name: 'Siglap', postalCode: '455827' },
            { name: 'Tanjong Katong', postalCode: '437158' },
            { name: 'Telok Kurau', postalCode: '423540' },
          ],
        },
        {
          name: 'Museum',
          subzones: [
            { name: 'Bras Basah', postalCode: '180001' },
            { name: 'Dhoby Ghaut', postalCode: '238882' },
            { name: 'Fort Canning', postalCode: '179618' },
            { name: 'Selegie', postalCode: '188308' },
          ],
        },
        {
          name: 'Newton',
          subzones: [
            { name: 'Cairnhill', postalCode: '229878' },
            { name: 'Goodwood Park', postalCode: '258899' },
            { name: 'Monk\'s Hill', postalCode: '229560' },
            { name: 'Newton Circus', postalCode: '307683' },
            { name: 'Orange Grove', postalCode: '258352' },
            { name: 'Scotts', postalCode: '228210' },
          ],
        },
        {
          name: 'Novena',
          subzones: [
            { name: 'Balestier', postalCode: '329676' },
            { name: 'Dunearn', postalCode: '308210' },
            { name: 'Hillcrest Novena', postalCode: '308421' },
            { name: 'Malcolm', postalCode: '308181' },
            { name: 'Moulmein', postalCode: '308130' },
            { name: 'Mount Pleasant', postalCode: '574443' },
            { name: 'Toa Payoh North', postalCode: '310001' },
            { name: 'Watten', postalCode: '287945' },
          ],
        },
        {
          name: 'Orchard',
          subzones: [
            { name: 'Boulevard', postalCode: '248649' },
            { name: 'Claymore', postalCode: '229570' },
            { name: 'Grange', postalCode: '239675' },
            { name: 'Nassim', postalCode: '258683' },
            { name: 'Somerset', postalCode: '238164' },
            { name: 'Tanglin', postalCode: '247964' },
          ],
        },
        {
          name: 'Outram',
          subzones: [
            { name: 'China Square', postalCode: '049835' },
            { name: 'Neil Road', postalCode: '088816' },
            { name: 'People\'s Park', postalCode: '058625' },
            { name: 'Upper Pickering', postalCode: '058290' },
          ],
        },
        {
          name: 'Queenstown',
          subzones: [
            { name: 'Ayer Rajah', postalCode: '139954' },
            { name: 'Commonwealth', postalCode: '141001' },
            { name: 'Ghim Moh', postalCode: '270001' },
            { name: 'Holland Drive', postalCode: '270002' },
            { name: 'Kent Ridge', postalCode: '119082' },
            { name: 'Margaret Drive', postalCode: '149300' },
            { name: 'Mei Chin', postalCode: '140001' },
            { name: 'Queensway', postalCode: '149053' },
            { name: 'Tanglin Halt', postalCode: '141002' },
            { name: 'Wessex', postalCode: '139214' },
          ],
        },
        {
          name: 'River Valley',
          subzones: [
            { name: 'Leonie Hill', postalCode: '239201' },
            { name: 'Martin', postalCode: '239065' },
            { name: 'Oxley', postalCode: '238940' },
            { name: 'Paterson', postalCode: '238888' },
            { name: 'Robertson Quay', postalCode: '238236' },
          ],
        },
        {
          name: 'Rochor',
          subzones: [
            { name: 'Bencoolen', postalCode: '189655' },
            { name: 'Farrer Park', postalCode: '217567' },
            { name: 'Kampong Bugis', postalCode: '199579' },
            { name: 'Kampong Kapor', postalCode: '208601' },
            { name: 'Little India', postalCode: '218231' },
            { name: 'Sungei Road', postalCode: '208505' },
          ],
        },
        {
          name: 'Singapore River',
          subzones: [
            { name: 'Boat Quay', postalCode: '049864' },
            { name: 'Clarke Quay SR', postalCode: '179024' },
            { name: 'Robertson Quay SR', postalCode: '238236' },
          ],
        },
        {
          name: 'Southern Islands',
          subzones: [
            { name: 'Kusu Island', postalCode: '098942' },
            { name: 'Lazarus Island', postalCode: '098942' },
            { name: 'Sentosa', postalCode: '098942' },
            { name: 'Sisters Islands', postalCode: '498952' },
            { name: 'St John\'s Island', postalCode: '098942' },
          ],
        },
        {
          name: 'Tanglin',
          subzones: [
            { name: 'Chatsworth', postalCode: '249759' },
            { name: 'Nassim Tanglin', postalCode: '258683' },
            { name: 'Ridout', postalCode: '248374' },
            { name: 'Tyersall', postalCode: '259569' },
            { name: 'Windsor', postalCode: '259942' },
          ],
        },
        {
          name: 'Toa Payoh',
          subzones: [
            { name: 'Bidadari', postalCode: '340164' },
            { name: 'Braddell', postalCode: '579776' },
            { name: 'Lorong 1 Toa Payoh', postalCode: '319758' },
            { name: 'Lorong 2 Toa Payoh', postalCode: '310002' },
            { name: 'Lorong 4 Toa Payoh', postalCode: '310004' },
            { name: 'Lorong 5 Toa Payoh', postalCode: '310005' },
            { name: 'Lorong 7 Toa Payoh', postalCode: '310007' },
            { name: 'Lorong 8 Toa Payoh', postalCode: '310008' },
            { name: 'Toa Payoh Central', postalCode: '319198' },
            { name: 'Toa Payoh West', postalCode: '310098' },
            { name: 'Woodleigh', postalCode: '357872' },
          ],
        },
      ],
    },
    {
      name: 'East Region',
      planningAreas: [
        {
          name: 'Bedok',
          subzones: [
            { name: 'Bayshore', postalCode: '469960' },
            { name: 'Bedok North', postalCode: '460001' },
            { name: 'Bedok Reservoir', postalCode: '470001' },
            { name: 'Bedok South', postalCode: '469001' },
            { name: 'Frankel', postalCode: '458219' },
            { name: 'Kembangan', postalCode: '418924' },
            { name: 'Siglap Bedok', postalCode: '455801' },
            { name: 'Upper East Coast', postalCode: '466792' },
          ],
        },
        {
          name: 'Changi',
          subzones: [
            { name: 'Changi Airport', postalCode: '819643' },
            { name: 'Changi Point', postalCode: '499870' },
            { name: 'Changi Village', postalCode: '499752' },
          ],
        },
        {
          name: 'Changi Bay',
          subzones: [
            { name: 'Changi Bay', postalCode: '499970' },
          ],
        },
        {
          name: 'Pasir Ris',
          subzones: [
            { name: 'Flora Drive', postalCode: '506924' },
            { name: 'Loyang East', postalCode: '508946' },
            { name: 'Loyang West', postalCode: '508721' },
            { name: 'Pasir Ris Central', postalCode: '518457' },
            { name: 'Pasir Ris Drive', postalCode: '510006' },
            { name: 'Pasir Ris Park', postalCode: '519145' },
            { name: 'White Sands', postalCode: '518457' },
          ],
        },
        {
          name: 'Paya Lebar',
          subzones: [
            { name: 'Airport Road', postalCode: '390001' },
            { name: 'Aljunied Paya Lebar', postalCode: '389936' },
            { name: 'Paya Lebar East', postalCode: '409051' },
            { name: 'Tai Seng Paya Lebar', postalCode: '534116' },
          ],
        },
        {
          name: 'Tampines',
          subzones: [
            { name: 'Simei', postalCode: '529948' },
            { name: 'Tampines East', postalCode: '521001' },
            { name: 'Tampines North', postalCode: '521817' },
            { name: 'Tampines West', postalCode: '520001' },
            { name: 'Xilin', postalCode: '506786' },
          ],
        },
      ],
    },
    {
      name: 'North Region',
      planningAreas: [
        {
          name: 'Central Water Catchment',
          subzones: [
            { name: 'Central Water Catchment', postalCode: '575552' },
          ],
        },
        {
          name: 'Lim Chu Kang',
          subzones: [
            { name: 'Lim Chu Kang', postalCode: '718788' },
          ],
        },
        {
          name: 'Mandai',
          subzones: [
            { name: 'Mandai East', postalCode: '729824' },
            { name: 'Mandai Estate', postalCode: '729647' },
            { name: 'Mandai West', postalCode: '729755' },
            { name: 'Singapore Zoo', postalCode: '729826' },
          ],
        },
        {
          name: 'Sembawang',
          subzones: [
            { name: 'Admiralty', postalCode: '739977' },
            { name: 'Canberra', postalCode: '750001' },
            { name: 'Sembawang Central', postalCode: '757038' },
            { name: 'Sembawang Crescent', postalCode: '758944' },
            { name: 'Sembawang Hills', postalCode: '756001' },
            { name: 'Sembawang Straits', postalCode: '759538' },
          ],
        },
        {
          name: 'Simpang',
          subzones: [
            { name: 'Simpang North', postalCode: '758001' },
            { name: 'Simpang South', postalCode: '757001' },
          ],
        },
        {
          name: 'Sungei Kadut',
          subzones: [
            { name: 'Sungei Kadut East', postalCode: '728653' },
            { name: 'Sungei Kadut Loop', postalCode: '729500' },
            { name: 'Sungei Kadut North', postalCode: '729636' },
          ],
        },
        {
          name: 'Woodlands',
          subzones: [
            { name: 'Greenwood Park', postalCode: '739064' },
            { name: 'Marsiling', postalCode: '730001' },
            { name: 'Midview', postalCode: '738068' },
            { name: 'North Coast', postalCode: '738001' },
            { name: 'Senoko North', postalCode: '758001' },
            { name: 'Senoko South', postalCode: '758168' },
            { name: 'Woodgrove', postalCode: '738570' },
            { name: 'Woodlands East', postalCode: '730002' },
            { name: 'Woodlands Regional Centre', postalCode: '738099' },
            { name: 'Woodlands South', postalCode: '730003' },
            { name: 'Woodlands West', postalCode: '730004' },
          ],
        },
        {
          name: 'Yishun',
          subzones: [
            { name: 'Khatib', postalCode: '760001' },
            { name: 'Lower Seletar', postalCode: '768001' },
            { name: 'Nee Soon', postalCode: '768446' },
            { name: 'Northland', postalCode: '768963' },
            { name: 'Springleaf', postalCode: '769001' },
            { name: 'Yishun Central', postalCode: '768001' },
            { name: 'Yishun East', postalCode: '760004' },
            { name: 'Yishun North', postalCode: '760003' },
            { name: 'Yishun South', postalCode: '760002' },
            { name: 'Yishun West', postalCode: '760005' },
          ],
        },
      ],
    },
    {
      name: 'North-East Region',
      planningAreas: [
        {
          name: 'Ang Mo Kio',
          subzones: [
            { name: 'Ang Mo Kio Town Centre', postalCode: '560001' },
            { name: 'Cheng San', postalCode: '569933' },
            { name: 'Chong Boon', postalCode: '560002' },
            { name: 'Kebun Bahru', postalCode: '567001' },
            { name: 'Tagore AMK', postalCode: '787911' },
            { name: 'Teck Ghee', postalCode: '560003' },
            { name: 'Townsville', postalCode: '569001' },
            { name: 'Yio Chu Kang', postalCode: '545006' },
          ],
        },
        {
          name: 'Hougang',
          subzones: [
            { name: 'Hougang Central', postalCode: '530001' },
            { name: 'Hougang East', postalCode: '530002' },
            { name: 'Hougang North', postalCode: '530003' },
            { name: 'Hougang West', postalCode: '530004' },
            { name: 'Kovan', postalCode: '548001' },
            { name: 'Lorong Ah Soo', postalCode: '530005' },
          ],
        },
        {
          name: 'North-Eastern Islands',
          subzones: [
            { name: 'Coney Island', postalCode: '816002' },
            { name: 'Pulau Tekong', postalCode: '818237' },
            { name: 'Pulau Ubin', postalCode: '817682' },
          ],
        },
        {
          name: 'Punggol',
          subzones: [
            { name: 'Coney Island East', postalCode: '816001' },
            { name: 'Northshore', postalCode: '821001' },
            { name: 'Punggol Canal', postalCode: '820001' },
            { name: 'Punggol Field', postalCode: '820002' },
            { name: 'Punggol Town Centre', postalCode: '828761' },
            { name: 'Sim Drive', postalCode: '820003' },
            { name: 'Waterway East', postalCode: '821002' },
            { name: 'Waterway West', postalCode: '821003' },
          ],
        },
        {
          name: 'Seletar',
          subzones: [
            { name: 'Seletar', postalCode: '798380' },
            { name: 'Seletar Hills', postalCode: '798001' },
          ],
        },
        {
          name: 'Sengkang',
          subzones: [
            { name: 'Anchorvale', postalCode: '540001' },
            { name: 'Compassvale', postalCode: '540002' },
            { name: 'Fernvale', postalCode: '797560' },
            { name: 'Lorong Halus', postalCode: '534001' },
            { name: 'Rivervale', postalCode: '540003' },
            { name: 'Sengkang Town Centre', postalCode: '545025' },
          ],
        },
        {
          name: 'Serangoon',
          subzones: [
            { name: 'Lorong Chuan', postalCode: '556933' },
            { name: 'Serangoon Central', postalCode: '550001' },
            { name: 'Serangoon Garden', postalCode: '556001' },
            { name: 'Serangoon North', postalCode: '550002' },
            { name: 'Serangoon Stadium', postalCode: '550003' },
            { name: 'Upper Aljunied', postalCode: '534001' },
          ],
        },
      ],
    },
    {
      name: 'West Region',
      planningAreas: [
        {
          name: 'Boon Lay',
          subzones: [
            { name: 'Boon Lay Place', postalCode: '640001' },
            { name: 'Samulun', postalCode: '619001' },
            { name: 'Shipyard', postalCode: '627001' },
          ],
        },
        {
          name: 'Bukit Batok',
          subzones: [
            { name: 'Bukit Batok Central', postalCode: '650001' },
            { name: 'Bukit Batok East', postalCode: '650002' },
            { name: 'Bukit Batok North', postalCode: '650003' },
            { name: 'Bukit Batok South', postalCode: '650004' },
            { name: 'Bukit Batok West', postalCode: '650005' },
            { name: 'Guilin', postalCode: '650006' },
            { name: 'Hillview', postalCode: '669062' },
            { name: 'Toh Keng', postalCode: '650007' },
            { name: 'Toh Yi Estate', postalCode: '590001' },
          ],
        },
        {
          name: 'Bukit Panjang',
          subzones: [
            { name: 'Bangkit', postalCode: '670001' },
            { name: 'Dairy Farm', postalCode: '679001' },
            { name: 'Fajar', postalCode: '670002' },
            { name: 'Jelebu', postalCode: '678001' },
            { name: 'Keat Hong', postalCode: '680001' },
            { name: 'Lompang', postalCode: '670003' },
            { name: 'Pending', postalCode: '670004' },
            { name: 'Saujana', postalCode: '670005' },
            { name: 'Segar', postalCode: '670006' },
            { name: 'Senja', postalCode: '670007' },
          ],
        },
        {
          name: 'Choa Chu Kang',
          subzones: [
            { name: 'Choa Chu Kang Avenue 5', postalCode: '680002' },
            { name: 'Choa Chu Kang Central', postalCode: '680003' },
            { name: 'Choa Chu Kang North', postalCode: '680004' },
            { name: 'Peng Siang', postalCode: '680005' },
            { name: 'Teck Whye', postalCode: '680006' },
            { name: 'Yew Tee', postalCode: '688001' },
          ],
        },
        {
          name: 'Clementi',
          subzones: [
            { name: 'Clementi Central', postalCode: '120001' },
            { name: 'Clementi East', postalCode: '129954' },
            { name: 'Clementi North', postalCode: '120002' },
            { name: 'Clementi South', postalCode: '120003' },
            { name: 'Clementi West', postalCode: '120004' },
            { name: 'Clementi Woods', postalCode: '129588' },
            { name: 'Faber', postalCode: '120005' },
            { name: 'Pandan', postalCode: '128408' },
            { name: 'Toh Tuck', postalCode: '596734' },
            { name: 'West Coast', postalCode: '120006' },
          ],
        },
        {
          name: 'Jurong East',
          subzones: [
            { name: 'International Business Park', postalCode: '609934' },
            { name: 'Jurong East Central', postalCode: '600001' },
            { name: 'Jurong Gateway', postalCode: '608549' },
            { name: 'Lakeside Jurong', postalCode: '648886' },
            { name: 'Penjuru Crescent', postalCode: '608966' },
            { name: 'Taman Jurong', postalCode: '600002' },
            { name: 'Teban Gardens', postalCode: '600003' },
            { name: 'Yuhua', postalCode: '640001' },
          ],
        },
        {
          name: 'Jurong West',
          subzones: [
            { name: 'Ama Keng', postalCode: '619001' },
            { name: 'Boon Lay Jurong', postalCode: '640002' },
            { name: 'Hong Kah North', postalCode: '640003' },
            { name: 'Jurong West Central', postalCode: '640004' },
            { name: 'Kian Teck', postalCode: '619400' },
            { name: 'Lakeside Village', postalCode: '649001' },
            { name: 'Nanyang', postalCode: '637661' },
            { name: 'Pioneer', postalCode: '640005' },
            { name: 'Wenya', postalCode: '640006' },
            { name: 'Yunnan', postalCode: '640007' },
          ],
        },
        {
          name: 'Pioneer',
          subzones: [
            { name: 'Pioneer Sector', postalCode: '628001' },
            { name: 'Tuas', postalCode: '638001' },
            { name: 'Tuas South', postalCode: '637001' },
          ],
        },
        {
          name: 'Tengah',
          subzones: [
            { name: 'Forest Hill', postalCode: '680010' },
            { name: 'Garden Tengah', postalCode: '680011' },
            { name: 'Park Tengah', postalCode: '680012' },
            { name: 'Plantation Tengah', postalCode: '680013' },
            { name: 'Tengah New Town', postalCode: '680014' },
          ],
        },
        {
          name: 'Western Islands',
          subzones: [
            { name: 'Jurong Island', postalCode: '627001' },
            { name: 'Pulau Bukom', postalCode: '098942' },
            { name: 'Pulau Pesek', postalCode: '619001' },
          ],
        },
        {
          name: 'Western Water Catchment',
          subzones: [
            { name: 'Bahar', postalCode: '688001' },
            { name: 'Cleantech Park', postalCode: '637141' },
            { name: 'Murai', postalCode: '698001' },
          ],
        },
      ],
    },
  ],
}

// ─────────────────────────────────────────────
// Helper Utilities
// ─────────────────────────────────────────────

async function post(endpoint: string, token: string, body: object) {
  const res = await fetch(`${API_URL}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`POST /${endpoint} failed: ${JSON.stringify(data)}`)
  return data.doc
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

// ─────────────────────────────────────────────
// Main Seeder
// ─────────────────────────────────────────────

async function seedSingapore() {
  console.log('='.repeat(60))
  console.log('  Singapore Address Seeder')
  console.log('='.repeat(60))

  // ── Login ────────────────────────────────────
  console.log('\n[1/4] Logging in to Payload CMS...')
  let token: string
  try {
    const loginRes = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    })
    if (!loginRes.ok) throw new Error(`HTTP ${loginRes.status}`)
    const loginData = await loginRes.json()
    token = loginData.token
    console.log('    ✔ Login successful')
  } catch (err: any) {
    console.error('    ✗ Login failed:', err.message)
    return
  }

  // ── Province ─────────────────────────────────
  console.log('\n[2/4] Creating Province: Singapore')
  let province: any
  try {
    province = await post('provinces', token, { name: singaporeData.name, code: singaporeData.code })
    console.log(`    ✔ Province created  (ID: ${province.id})`)
  } catch (err: any) {
    console.error('    ✗ Province failed:', err.message)
    return
  }

  // ── Regions (Cities) ──────────────────────────
  console.log('\n[3/4] Creating Regions (Cities)...')
  let totalDistricts = 0
  let totalSubdistricts = 0

  for (const region of singaporeData.regions) {
    let city: any
    try {
      city = await post('cities', token, {
        name: region.name,
        type: 'Kota',
        province: province.id,
      })
      console.log(`\n    ✔ Region: ${region.name}  (ID: ${city.id})`)
    } catch (err: any) {
      console.error(`    ✗ Region "${region.name}" failed:`, err.message)
      continue
    }

    // ── Districts (Planning Areas) ──────────────
    for (const area of region.planningAreas) {
      let district: any
      try {
        district = await post('districts', token, {
          name: area.name,
          city: city.id,
        })
        console.log(`       + District: ${area.name}  (ID: ${district.id})`)
        totalDistricts++
      } catch (err: any) {
        console.error(`       ✗ District "${area.name}" failed:`, err.message)
        continue
      }

      // ── Subdistricts (Subzones) ─────────────
      for (const subzone of area.subzones) {
        try {
          const sub = await post('subdistricts', token, {
            name: subzone.name,
            district: district.id,
            postalCode: subzone.postalCode,
          })
          console.log(`            - ${subzone.name}  (${subzone.postalCode})  [ID: ${sub.id}]`)
          totalSubdistricts++
        } catch (err: any) {
          console.error(`            ✗ Subzone "${subzone.name}" failed:`, err.message)
        }
        // Small delay to avoid overwhelming the API
        await sleep(50)
      }
    }
  }

  // ── Summary ──────────────────────────────────
  console.log('\n' + '='.repeat(60))
  console.log('  ✅ Singapore Seeding Complete!')
  console.log('='.repeat(60))
  console.log(`  Province   : 1  (Singapore)`)
  console.log(`  Regions    : ${singaporeData.regions.length}`)
  console.log(`  Districts  : ${totalDistricts}`)
  console.log(`  Subdistricts: ${totalSubdistricts}`)
  console.log('='.repeat(60))
}

seedSingapore()
