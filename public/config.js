window.dashboardConfig = {
    signalRUrl: "https://func-hotpocket.azurewebsites.net/api",
    tableAccount: "https://sthotpocket.table.core.windows.net",
    tableName: "systemDashboard",
    clusterKey: "systemDashboard",
    partitionKey: "host",
    tableSas: "?sv=2018-03-28&si=dashboard&tn=systemdashboard&sig=X4t%2BXnQN%2FR923y8YzfF66eOX8uf6GA6tXVQSdqs0dEA%3D"
}

window.dashboardConfig.countries = [
    {
        name: "Australia",
        code: "AU",
        pos: { anchor: "tl", top: "82%", left: "88.5%" }
    },
    {
        name: "Canada",
        code: "CA",
        pos: { anchor: "tr", top: "30%", left: "18.5%" }
    },
    {
        name: "Netherlands",
        code: "NL",
        pos: { anchor: "tl", top: "35%", left: "49%" }
    },
    {
        name: "United States",
        code: "US",
        pos: { anchor: "tr", top: "43.5%", left: "18%" }
    },
    {
        name: "France",
        code: "FR",
        pos: { anchor: "br", top: "39.5%", left: "48.5%" }
    },
    {
        name: "Germany",
        code: "DE",
        pos: { anchor: "br", top: "37%", left: "49.5%" }
    },
    {
        name: "Korea",
        code: "KR",
        pos: { anchor: "bl", top: "44%", left: "85%" }
    },
    {
        name: "United Kingdom",
        code: "GB",
        pos: { anchor: "bl", top: "36%", left: "46.7%" }
    },
    {
        name: "Japan",
        code: "JP",
        pos: { anchor: "tl", top: "44%", left: "88.5%" }
    },
    {
        name: "Singapore",
        code: "SG",
        pos: { anchor: "tl", top: "65%", left: "79%" }
    },
    {
        name: "Sweden",
        code: "SE",
        pos: { anchor: "br", top: "28%", left: "51%" }
    },
    {
        name: "Mexico",
        code: "MX",
        pos: { anchor: "br", top: "55.8%", left: "17%" }
    },
    {
        name: "Sri Lanka",
        code: "LK",
        pos: { anchor: "tl", top: "62.8%", left: "71.5%" }
    },
    {
        name: "India",
        code: "IN",
        pos: { anchor: "tl", top: "57%", left: "71%" }
    },
    {
        name: "Russia",
        code: "RU",
        pos: { anchor: "tl", top: "25%", left: "71%" }
    },
    {
        name: "Saudi Arabia",
        code: "SA",
        pos: { anchor: "br", top: "54%", left: "61%" }
    },
    {
        name: "China",
        code: "CN",
        pos: { anchor: "tl", top: "48%", left: "76%" }
    }
];

// Unmapped countries will be assigned to this and will show in a map corner.
window.dashboardConfig.defCountry = {
    name: "Unrecognized",
    code: "Unrecognized",
    pos: { anchor: "tr", top: "82%", left: "10%" }
};
