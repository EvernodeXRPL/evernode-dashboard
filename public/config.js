window.dashboardConfig = {}

window.dashboardConfig.regions = [
    {
        id: "syd",
        name: "Sydney",
        country: "AU",
        pos: { anchor: "tl", top: "86%", left: "92.5%" }
    },
    {
        id: "yto",
        name: "Toronto",
        country: "CA",
        pos: { anchor: "tr", top: "40%", left: "22.5%" }
    },
    {
        id: "ams",
        name: "Amsterdam",
        country: "NL",
        pos: { anchor: "br", top: "35%", left: "48%" }
    },
    {
        id: "atl",
        name: "Atlanta",
        country: "US",
        pos: { anchor: "tr", top: "47.5%", left: "22%" }
    },
    {
        id: "cdg",
        name: "Paris",
        country: "FR",
        pos: { anchor: "tr", top: "39.5%", left: "48.5%" }
    },
    {
        id: "dfw",
        name: "Dallas",
        country: "US",
        pos: { anchor: "tr", top: "47%", left: "19%" }
    },
    {
        id: "ewr",
        name: "New Jersey",
        country: "US",
        pos: { anchor: "tr", top: "43%", left: "25.3%" }
    },
    {
        id: "fra",
        name: "Frankfurt",
        country: "DE",
        pos: { anchor: "br", top: "37%", left: "49.5%" }
    },
    {
        id: "icn",
        name: "Seoul",
        country: "KR",
        pos: { anchor: "tl", top: "44%", left: "85%" }
    },
    {
        id: "lax",
        name: "Los Angeles",
        country: "US",
        pos: { anchor: "tr", top: "47.5%", left: "12.5%" }
    },
    {
        id: "lhr",
        name: "London",
        country: "GB",
        pos: { anchor: "br", top: "36%", left: "46.7%" }
    },
    {
        id: "mia",
        name: "Miami",
        country: "US",
        pos: { anchor: "tr", top: "52%", left: "23%" }
    },
    {
        id: "nrt",
        name: "Tokyo",
        country: "JP",
        pos: { anchor: "tl", top: "44%", left: "88.5%" }
    },
    {
        id: "ord",
        name: "Chicago",
        country: "US",
        pos: { anchor: "tr", top: "42%", left: "21.8%" }
    },
    {
        id: "sea",
        name: "Seattle",
        country: "US",
        pos: { anchor: "br", top: "37.5%", left: "12.3%" }
    },
    {
        id: "sgp",
        name: "Singapore",
        country: "SG",
        pos: { anchor: "tl", top: "65%", left: "79%" }
    },
    {
        id: "sjc",
        name: "Silicon Valley",
        country: "US",
        pos: { anchor: "br", top: "31.8%", left: "11.5%" }
    },
    {
        id: "sto",
        name: "Stockholm",
        country: "SE",
        pos: { anchor: "br", top: "30.8%", left: "52%" }
    },
    {
        id: "mex",
        name: "Mexico City",
        country: "MX",
        pos: { anchor: "tr", top: "55.8%", left: "17%" }
    },
    {
        id: "col",
        name: "Colombo",
        country: "LK",
        pos: { anchor: "tl", top: "62.8%", left: "71.5%" },
        skipCycling: true
    }
];

window.dashboardConfig.specialRegionAssignments = [
    {
        idx: 41,
        regionId: "col"
    }
]