


const PubSub = require('../helpers/pub_sub.js')
const RequestHelper = require('../helpers/request_helper.js')
const GetCompanyDataDB = require('./getCompanyDataDB.js')
const RankingCalculations = require('./rankingCalculations.js')
const GetCompanyDataApi = function (keyMetriclUrl, growthUrl, generalUrl){
  this.keyMetrics = keyMetriclUrl
  this.growthUrl = growthUrl
  this.generalUrl = generalUrl
  this.request = new RequestHelper('http://localhost:3000/api/stocks')
}

const getCompanyDataDB = new GetCompanyDataDB()
const rankingCalculations = new RankingCalculations()
let companyInfoWithApiNumber = 0
let companyInfoWithApi = null




GetCompanyDataApi.prototype.bindEvents = function () {
  this.getEachCompaniesInfo()
};



GetCompanyDataApi.prototype.getEachCompaniesInfo = function (){
  PubSub.subscribe("getCompanyDataDB:All-db-companies", (event) => {

    const companies = event.detail
    if(companies[0].total_evaluation === undefined){
      let topRange = 20
      let bottomRange = 0
      let i = 1
      while(bottomRange < companies.length + 60){
        let companies20 = companies.slice(bottomRange, topRange)
        for(company in companies20){
          setTimeout(this.fetchApiInfoHistorical(companies20[company]), i*2000)
          setTimeout(this.fetchApiInfoCurrent(companies20[company]), i*2000)
          setTimeout(this.fetchApiGenralInfo(companies20[company]), i*2000)
        }
        topRange += 20
        bottomRange += 20
        i += 1
      }
    }
      getCompanyDataDB.getCompanyFullDataRatios()
      rankingCalculations.isTheStockGoodOrBad()
  })
};


GetCompanyDataApi.prototype.fetchdbInfo = function(company){
  const getCompanyDataDB = new GetCompanyDataDB()
  const rankingCalculations = new RankingCalculations()
  getCompanyDataDB.getCompanyDataApi()
  rankingCalculations.isTheStockGoodOrBad()
}

GetCompanyDataApi.prototype.fetchApiInfoHistorical = function(company){
  const requestCompanyData = new RequestHelper (this.keyMetrics + company.ticker)
  requestCompanyData.get()
  .then((data) => {
    data["PE"] = this.calculateCompanyPE(data)
    data["PB"] = this.calculateCompanyPB(data)
    data["ROE"] = this.calculateCompanyROE(data)
    data["DE"] = this.calculateCompanyDE(data)
    // data["CR"] = this.calculateCompanyCurrentRatio(data)
    delete data.symbol
    delete data.metrics
    this.request.patch(company._id, data)
    .then((data) => {
      companyInfoWithApiNumber += 1
      companyInfoWithApi = data
    }).then(() => {
      if(companyInfoWithApiNumber == 441){
        PubSub.publish("full-company-info",companyInfoWithApi)
      }
    })
  })
};

GetCompanyDataApi.prototype.fetchApiGenralInfo= function(company){
  const requestCompanyData = new RequestHelper (this.generalUrl + company.ticker)
  requestCompanyData.get()
  .then((data) => {
    data["sector"] = data.profile.sector
    data["currentPrice"] = data.profile.price
    delete data.symbol
    delete data.profile
    this.request.patch(company._id, data)
  })
};

GetCompanyDataApi.prototype.fetchApiInfoCurrent = function(company){
  const requestCompanyGrowthData = new RequestHelper (this.growthUrl + company.ticker)
  requestCompanyGrowthData.get()
  .then((data) => {
    data['PEG'] = this.calculateCompanyPEG(data)
    delete data.growth
    delete data.symbol
    this.request.patch(company._id, data)
  })
};

GetCompanyDataApi.prototype.calculateCompanyPE = function(data){
  const CompanyYearlyPE = []
  data.metrics.forEach(function(year){
    const PEratioYearly = { }
    PEratioYearly['date'] = year.date
    PEratioYearly['PE'] =  year["PE ratio"]
    CompanyYearlyPE.push (PEratioYearly)
  })
  return  CompanyYearlyPE
};

GetCompanyDataApi.prototype.calculateCompanyPB = function(data){
  const CompanyYearlyPB = []
  data.metrics.forEach(function(year){
    const PBratioYearly = { }
    PBratioYearly['date'] =  year.date
    PBratioYearly["BookValuePerShare"] = year["Book Value per Share"]
    CompanyYearlyPB.push (PBratioYearly)
  })
  return CompanyYearlyPB
};

GetCompanyDataApi.prototype.calculateCompanyROE = function(data){
  const CompanyYearlyROE = []
  data.metrics.forEach(function(year){
    const ROEratioYearly = { }
    ROEratioYearly['date'] =  year.date
    ROEratioYearly['ROE'] =  year["ROE"]
    CompanyYearlyROE.push (ROEratioYearly)
  })
  return CompanyYearlyROE
};

GetCompanyDataApi.prototype.calculateCompanyDE = function(data){
  const CompanyYearlyDE = []
  data.metrics.forEach(function(year){
    const DEratioYearly = { }
    DEratioYearly['date'] =  year.date
    DEratioYearly['DE'] =  year["Debt to Equity"]
    CompanyYearlyDE.push (DEratioYearly)
  })
  return CompanyYearlyDE
};

// GetCompanyDataApi.prototype.calculateCompanyCurrentRatio = function(data){
//   const yearlyCurrentRatio = []
//   data.ratios.forEach(function(year){
//     const currentRatioYearly = { }
//     currentRatioYearly['date'] =  year.date
//     currentRatioYearly['CR'] =  year.liquidityMeasurementRatios.currentRatio
//     yearlyCurrentRatio.push (currentRatioYearly)
//   })
//   return yearlyCurrentRatio
// };

GetCompanyDataApi.prototype.calculateCompanyPEG = function(data){
  const yearlyCurrentPEG = []
  data.growth.forEach(function(year){
    const PEGRatioYearly = { }
    PEGRatioYearly['date'] =  year.date
    PEGRatioYearly['PEG'] = year["5Y Revenue Growth (per Share)"]
    yearlyCurrentPEG.push(PEGRatioYearly)
  })
  return yearlyCurrentPEG
};





module.exports = GetCompanyDataApi;
