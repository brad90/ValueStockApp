
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
    console.log(companies);
    totalNumberOfCompanies = companies.length;

    if(companies[0].total_evaluation === undefined){

      let topRange = 20
      let bottomRange = 0
      let i = 1
      // while(bottomRange < totalNumberOfCompanies+ 60 ){

        // let companies20 = companies.slice(bottomRange, topRange)
        for(company in companies){

          // setTimeout(this.fetchApiInfoHistorical(companies20[company]), i*50000)
          this.sleep(10000)
          this.fetchApiInfoHistorical(companies[company])
          console.log("hello");
          // setTimeout(this.fetchApiInfoGrowth(companies20[company]), i*50000)
          // setTimeout(this.fetchApiInfoGeneral(companies20[company]), i*10000)
          // setTimeout(this.fetchApiInfoFinancials(companies20[company]), i*50000)
        }
        // topRange += 20
        // bottomRange += 20
        // i += 1
      // }
    }else{
      getCompanyDataDB.getCompanyFullDataRatios()
      rankingCalculations.isTheStockGoodOrBad()
    }
  })
};


GetCompanyDataApi.prototype.sleep = function(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}


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
    data["ROE"] = this.getCompanyROE(data)
    delete data.symbol
    delete data.metrics
    this.request.patch(company._id, data)
    // }).then((data) => {
    //   companyInfoWithApi = data
    //   companyInfoWithApiNumber += 1
    // }).then(() => {
    //   if(companyInfoWithApiNumber === totalNumberOfCompanies){
    //   PubSub.publish("fullcompanyinfo", companyInfoWithApi)}
    // })
  })

  const requestCompanyDataFromApi2 = new RequestHelper (this.generalUrl + company.ticker)
  requestCompanyDataFromApi2.get()
  .then((data) => {
    data["sector"] = data.profile.sector
    data["currentPrice"] = data.profile.price
    delete data.symbol
    delete data.profile
    this.request.patch(company._id, data)
  })


  const requestCompanyDataFromApi3 = new RequestHelper (this.growthUrl + company.ticker)
  requestCompanyDataFromApi3.get()
  .then((data) => {
    data["PEG"] = this.getCompanyPEG(data)
    delete data.growth
    delete data.symbol
    this.request.patch(company._id, data)
    .then((data) => {
      companyInfoWithApi = data
      companyInfoWithApiNumber += 1
    }).then(() => {
      if(companyInfoWithApiNumber === totalNumberOfCompanies){
      PubSub.publish("fullcompanyinfo", companyInfoWithApi)}
    })
    })



  // const requestCompanyDataFromApi4 = new RequestHelper (this.financialsUrl+ company.ticker)
  // requestCompanyDataFromApi4.get()
  // .then((data) => {
  //   data["NI"] = this.getCompanyNI(data)
  //   delete data.financials
  //   delete data.symbol
  //   this.request.patch(company._id, data)
  //   .then((data) => {
  //     companyInfoWithApi = data
  //     companyInfoWithApiNumber += 1
  //   }).then(() => {
  //     if(companyInfoWithApiNumber === totalNumberOfCompanies){
  //     PubSub.publish("fullcompanyinfo", companyInfoWithApi)}
  //   })
  // })
};



// Function fetches the data from the general API.
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
//       companyInfoWithApiNumber += 1
//     }).then(() => {
//       if(companyInfoWithApiNumber === totalNumberOfCompanies){
//       PubSub.publish("fullcompanyinfo", companyInfoWithApi)}
//     })
//   })
// };

GetCompanyDataApi.prototype.getCompanyPE = function(data){

    
    const yearlyPE = []
    const PEratioYearly = { }
    PEratioYearly["date"] = data.metrics[0].date

    PEratioYearly["PE"] =  data.metrics[0]["PE ratio"]
    yearlyPE.push (PEratioYearly)
    return yearlyPE
};

// Fetches Price on book earning.
GetCompanyDataApi.prototype.getCompanyPB = function(data){
    const yearlyPB = []
    const PBratioYearly = { }
    PBratioYearly["date"] =  data.metrics[0].date
    PBratioYearly["PB"] = data.metrics[0]["Book Value per Share"]
    yearlyPB.push (PBratioYearly)
    return yearlyPB
};

// Fetches return on earnings.
GetCompanyDataApi.prototype.getCompanyROE = function(data){
    const yearlyNI = []
    const NIratioYearly = { }
    NIratioYearly["date"] =  data.metrics[0].date
    NIratioYearly["NI"] = data.metrics[0]["ROE"]
    yearlyNI.push(NIratioYearly)
    return yearlyNI
};

// Fetches debt to earnings ratio.
GetCompanyDataApi.prototype.getCompanyDE = function(data){
  const yearlyDE = []

    const DEratioYearly = { }
    DEratioYearly["date"] = data.metrics[0].date
    DEratioYearly["DE"] =  data.metrics[0]["Debt to Equity"]
    yearlyDE.push (DEratioYearly)
    return yearlyDE
};

// Fetches price earnings to growth.
GetCompanyDataApi.prototype.getCompanyPEG = function(data){
  const yearlyPEG = []
    const PEGRatioYearly = { }
    PEGRatioYearly["date"] =   data.growth[0].date
    PEGRatioYearly["PEG"] = data.growth[0]["5Y Revenue Growth (per Share)"]
    yearlyPEG.push(PEGRatioYearly)
  return yearlyPEG
};

// Fetches share price equity.
GetCompanyDataApi.prototype.getCompanySEP = function(data){
    const yearlySEP = []
    const SEPRatioYearly = { }
    SEPRatioYearly["date"] =  data.metrics[0].date
    SEPRatioYearly["SEP"] = data.metrics[0]["Shareholders Equity per Share"]
    yearlySEP.push(SEPRatioYearly)
    return yearlySEP
};

// Fetches current ratio.
GetCompanyDataApi.prototype.getCompanyCR = function(data){
  const yearlyCR = []
    const CRRatioYearly = { }
    CRRatioYearly["date"] =  data.metrics[0].date
    CRRatioYearly["CR"] = data.metrics[0]["Debt to Assets"]
    yearlyCR.push(CRRatioYearly)

  return yearlyCR
};


GetCompanyDataApi.prototype.getCompanyDividend = function(data){
  const yearlyDiv = []
    const DivRatioYearly = { }
    DivRatioYearly["date"] =  data.metrics[0].date
    DivRatioYearly["dividend"] = data.metrics[0]["Dividend Yield"]
    yearlyDiv.push(DivRatioYearly)
  return yearlyDiv
};

GetCompanyDataApi.prototype.getCompanyEY = function(data){
  const yearlyEY = []
    const EyRatioYearly = { }
    EyRatioYearly["date"] =  data.metrics[0].date
    EyRatioYearly["EY"] = data.metrics[0]["Earnings Yield"]
    yearlyEY.push(EyRatioYearly)
  return yearlyEY
};
















//
// GetCompanyDataApi.prototype.getCompanyPE = function(data){
//   const yearlyPE = []
//   data.metrics.forEach(function(year){
//     const PEratioYearly = { }
//     PEratioYearly["date"] = year.date
//     PEratioYearly["PE"] =  year["PE ratio"]
//     yearlyPE.push (PEratioYearly)
//   })
//   return yearlyPE
// };
//
// // Fetches Price on book earning.
// GetCompanyDataApi.prototype.getCompanyPB = function(data){
//   const yearlyPB = []
//   data.metrics.forEach(function(year){
//     const PBratioYearly = { }
//     PBratioYearly["date"] =  year.date
//     PBratioYearly["PB"] = year["Book Value per Share"]
//     yearlyPB.push (PBratioYearly)
//   })
//   return yearlyPB
// };
//
// // Fetches return on earnings.
// GetCompanyDataApi.prototype.getCompanyNI = function(data){
//   const yearlyNI = []
//   data.financials.forEach(function(year){
//     const NIratioYearly = { }
//     NIratioYearly["date"] =  year.date
//     NIratioYearly["NI"] = year["Net Income"]
//     yearlyNI.push(NIratioYearly)
//   })
//   return yearlyNI
// };
//
// // Fetches debt to earnings ratio.
// GetCompanyDataApi.prototype.getCompanyDE = function(data){
//   const yearlyDE = []
//   data.metrics.forEach(function(year){
//     const DEratioYearly = { }
//     DEratioYearly["date"] =  year.date
//     DEratioYearly["DE"] =  year["Debt to Equity"]
//     yearlyDE.push (DEratioYearly)
//   })
//   return yearlyDE
// };
//
// // Fetches price earnings to growth.
// GetCompanyDataApi.prototype.getCompanyPEG = function(data){
//   const yearlyPEG = []
//   data.growth.forEach(function(year){
//     const PEGRatioYearly = { }
//     PEGRatioYearly["date"] =  year.date
//     PEGRatioYearly["PEG"] = year["5Y Revenue Growth (per Share)"]
//     yearlyPEG.push(PEGRatioYearly)
//   })
//   return yearlyPEG
// };
//
// // Fetches share price equity.
// GetCompanyDataApi.prototype.getCompanySEP = function(data){
//   const yearlySEP = []
//   data.metrics.forEach(function(year){
//     const SEPRatioYearly = { }
//     SEPRatioYearly["date"] =  year.date
//     SEPRatioYearly["SEP"] = year["Shareholders Equity per Share"]
//     yearlySEP.push(SEPRatioYearly)
//   })
//   return yearlySEP
// };
//
// // Fetches current ratio.
// GetCompanyDataApi.prototype.getCompanyCR = function(data){
//   const yearlyCR = []
//   data.metrics.forEach(function(year){
//     const CRRatioYearly = { }
//     CRRatioYearly["date"] =  year.date
//     CRRatioYearly["CR"] = year["Debt to Assets"]
//     yearlyCR.push(CRRatioYearly)
//   })
//   return yearlyCR
// };
//
//
// GetCompanyDataApi.prototype.getCompanyDividend = function(data){
//   const yearlyDiv = []
//   data.metrics.forEach(function(year){
//     const DivRatioYearly = { }
//     DivRatioYearly["date"] =  year.date
//     DivRatioYearly["dividend"] = year["Dividend Yield"]
//     yearlyDiv.push(DivRatioYearly)
//   })
//   return yearlyDiv
// };
//
// GetCompanyDataApi.prototype.getCompanyEY = function(data){
//   const yearlyEY = []
//   data.metrics.forEach(function(year){
//     const EyRatioYearly = { }
//     EyRatioYearly["date"] =  year.date
//     EyRatioYearly["EY"] = year["Earnings Yield"]
//     yearlyEY.push(EyRatioYearly)
//   })
//   return yearlyEY
// };



module.exports = GetCompanyDataApi;
