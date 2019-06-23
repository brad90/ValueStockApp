
const PubSub = require('../helpers/pub_sub.js')
const RequestHelper = require('../helpers/request_helper.js')
const GetCompanyDataDB = require('./getCompanyDataDB.js')
const RankingCalculations = require('./rankingCalculations.js')
const GetCompanyDataApi = function (keyMetriclUrl, growthUrl, generalUrl, financialsUrl){
  this.keyMetricsUrl = keyMetriclUrl
  this.growthUrl = growthUrl
  this.generalUrl = generalUrl
  this.financialsUrl = financialsUrl
  this.request = new RequestHelper('http://localhost:3000/api/stocks')
}

// Initialising classes
const getCompanyDataDB = new GetCompanyDataDB()
const rankingCalculations = new RankingCalculations()

// Variables in functions further in codebase.
let companyInfoWithApiNumber = 0
let companyInfoWithApi
let ShareholderEquity
let totalNumberOfCompanies



// Tested - Working - Bind Events is Initialising the function below.
GetCompanyDataApi.prototype.bindEvents = function () {
  this.getEachCompaniesInfo()
};


GetCompanyDataApi.prototype.getEachCompaniesInfo = function (){
  PubSub.subscribe("getCompanyDataDB:All-db-companies", (event) => {

    const companies = event.detail
    totalNumberOfCompanies = companies.length;

    if(companies[0].total_evaluation === undefined){

      console.log("api 1");
      let topRange = 20
      let bottomRange = 0
      let i = 1
      while(bottomRange < totalNumberOfCompanies+ 60 ){

        let companies20 = companies.slice(bottomRange, topRange)
        for(company in companies20){
          setTimeout(this.fetchApiInfoHistorical(companies20[company]), i*10000)
          // setTimeout(this.fetchApiInfoGrowth(companies20[company]), i*10000)
          // // setTimeout(this.fetchApiInfoGeneral(companies20[company]), i*10000)
          // setTimeout(this.fetchApiInfoFinancials(companies20[company]), i*10000)
        }
        topRange += 20
        bottomRange += 20
        i += 1
      }
    }else{
      getCompanyDataDB.getCompanyFullDataRatios()
      rankingCalculations.isTheStockGoodOrBad()
    }
  })
};



// Functions patch information back to the db.
// Function fetches the data from the historical API.
GetCompanyDataApi.prototype.fetchApiInfoHistorical = function(company){

  const requestCompanyDataFromApi1 = new RequestHelper (this.keyMetricsUrl + company.ticker)
  requestCompanyDataFromApi1.get()
  .then((data) => {
    data["PE"] = this.getCompanyPE(data)
    data["PB"] = this.getCompanyPB(data)
    data["DE"] = this.getCompanyDE(data)
    data["CR"] = this.getCompanyCR(data)
    data["EY"] = this.getCompanyEY(data)
    data["SEPS"] = this.getCompanySEP(data)
    data["dividend"] = this.getCompanyDividend(data)
    delete data.symbol
    delete data.metrics
    this.request.patch(company._id, data)
  })


  const requestCompanyDataFromApi3 = new RequestHelper (this.growthUrl + company.ticker)
  requestCompanyDataFromApi3.get()
  .then((data) => {
    data["PEG"] = this.getCompanyPEG(data)
    delete data.growth
    delete data.symbol
    this.request.patch(company._id, data)
  })

  const requestCompanyDataFromApi4 = new RequestHelper (this.financialsUrl+ company.ticker)
  requestCompanyDataFromApi4.get()
  .then((data) => {
    data["NI"] = this.getCompanyNI(data)
    delete data.financials
    delete data.symbol
    this.request.patch(company._id, data)
    .then((data) => {
      PubSub.publish("fullcompanyinfo", data)
    })
  })
  
};



// // Function fetches the data from the general API.
// GetCompanyDataApi.prototype.fetchApiInfoGeneral = function(company){
//   const requestCompanyDataFromApi2 = new RequestHelper (this.generalUrl + company.ticker)
//   requestCompanyDataFromApi2.get()
//   .then((data) => {
//     data["sector"] = data.profile.sector
//     data["currentPrice"] = data.profile.price
//     delete data.symbol
//     delete data.profile
//     this.request.patch(company._id, data)
//   })
// };
//
// // Function fetches the data from the growth API.
// GetCompanyDataApi.prototype.fetchApiInfoGrowth = function(company){
//   const requestCompanyDataFromApi3 = new RequestHelper (this.growthUrl + company.ticker)
//   requestCompanyDataFromApi3.get()
//   .then((data) => {
//     data["PEG"] = this.getCompanyPEG(data)
//     delete data.growth
//     delete data.symbol
//     this.request.patch(company._id, data)
//   })
// };
//
// // Function fetches the data from the financial API.
// GetCompanyDataApi.prototype.fetchApiInfoFinancials= function(company){
//   const requestCompanyDataFromApi4 = new RequestHelper (this.financialsUrl+ company.ticker)
//   requestCompanyDataFromApi4.get()
//   .then((data) => {
//     data["NI"] = this.getCompanyNI(data)
//     delete data.financials
//     delete data.symbol
//     this.request.patch(company._id, data)
//     .then((data) => {
//       companyInfoWithApi = data
//     })
//   // })
// };

GetCompanyDataApi.prototype.getCompanyPE = function(data){
  const yearlyPE = []
  data.metrics.forEach(function(year){
    const PEratioYearly = { }
    PEratioYearly["date"] = year.date
    PEratioYearly["PE"] =  year["PE ratio"]
    yearlyPE.push (PEratioYearly)
  })
  return yearlyPE
};

// Fetches Price on book earning.
GetCompanyDataApi.prototype.getCompanyPB = function(data){
  const yearlyPB = []
  data.metrics.forEach(function(year){
    const PBratioYearly = { }
    PBratioYearly["date"] =  year.date
    PBratioYearly["PB"] = year["Book Value per Share"]
    yearlyPB.push (PBratioYearly)
  })
  return yearlyPB
};

// Fetches return on earnings.
GetCompanyDataApi.prototype.getCompanyNI = function(data){
  const yearlyNI = []
  data.financials.forEach(function(year){
    const NIratioYearly = { }
    NIratioYearly["date"] =  year.date
    NIratioYearly["NI"] = year["Net Income"]
    yearlyNI.push(NIratioYearly)
  })
  return yearlyNI
};

// Fetches debt to earnings ratio.
GetCompanyDataApi.prototype.getCompanyDE = function(data){
  const yearlyDE = []
  data.metrics.forEach(function(year){
    const DEratioYearly = { }
    DEratioYearly["date"] =  year.date
    DEratioYearly["DE"] =  year["Debt to Equity"]
    yearlyDE.push (DEratioYearly)
  })
  return yearlyDE
};

// Fetches price earnings to growth.
GetCompanyDataApi.prototype.getCompanyPEG = function(data){
  const yearlyPEG = []
  data.growth.forEach(function(year){
    const PEGRatioYearly = { }
    PEGRatioYearly["date"] =  year.date
    PEGRatioYearly["PEG"] = year["5Y Revenue Growth (per Share)"]
    yearlyPEG.push(PEGRatioYearly)
  })
  return yearlyPEG
};

// Fetches share price equity.
GetCompanyDataApi.prototype.getCompanySEP = function(data){
  const yearlySEP = []
  data.metrics.forEach(function(year){
    const SEPRatioYearly = { }
    SEPRatioYearly["date"] =  year.date
    SEPRatioYearly["SEP"] = year["Shareholders Equity per Share"]
    yearlySEP.push(SEPRatioYearly)
  })
  return yearlySEP
};

// Fetches current ratio.
GetCompanyDataApi.prototype.getCompanyCR = function(data){
  const yearlyCR = []
  data.metrics.forEach(function(year){
    const CRRatioYearly = { }
    CRRatioYearly["date"] =  year.date
    CRRatioYearly["CR"] = year["Debt to Assets"]
    yearlyCR.push(CRRatioYearly)
  })
  return yearlyCR
};


GetCompanyDataApi.prototype.getCompanyDividend = function(data){
  const yearlyDiv = []
  data.metrics.forEach(function(year){
    const DivRatioYearly = { }
    DivRatioYearly["date"] =  year.date
    DivRatioYearly["dividend"] = year["Dividend Yield"]
    yearlyDiv.push(DivRatioYearly)
  })
  return yearlyDiv
};

GetCompanyDataApi.prototype.getCompanyEY = function(data){
  const yearlyEY = []
  data.metrics.forEach(function(year){
    const EyRatioYearly = { }
    EyRatioYearly["date"] =  year.date
    EyRatioYearly["EY"] = year["Earnings Yield"]
    yearlyEY.push(EyRatioYearly)
  })
  return yearlyEY
};



module.exports = GetCompanyDataApi;
