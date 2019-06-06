const PubSub = require('../helpers/pub_sub.js')
const RequestHelper = require('../helpers/request_helper.js')
const CompanyCalculations = function (historicalUrl, growthUrl){
  this.historicalUrl = historicalUrl
  this.growthUrl = growthUrl
  this.request = new RequestHelper('http://localhost:3000/api/stocks')
}

CompanyCalculations.prototype.bindEvents = function () {
  this.getEachCompaniesInfo()
};


CompanyCalculations.prototype.getEachCompaniesInfo = function (){
  PubSub.subscribe("all-company-data:All-company-tickers", (event) => {
    const companyTickers = event.detail
    companyTickers.forEach( company => {
      const requestCompanyData = new RequestHelper (this.historicalUrl + company.ticker)
      requestCompanyData.get()
      .then((data) => {
        delete data.symbol
        data["PE"] = this.calculateCompanyPE(data)
        data["PB"] = this.calculateCompanyPB(data)
        data["ROE"] = this.calculateCompanyROE(data)
        data["DE"] = this.calculateCompanyDE(data)
        data["CR"] = this.calculateCompanyCurrentRatio(data)

        delete data.ratios
        this.request.patch(company._id, data)
        })


      const requestCompanyGrowthData = new RequestHelper (this.growthUrl + company.ticker)
      requestCompanyGrowthData.get()
      .then((data) => {
        delete data.symbol
        data['PEG'] = this.calculateCompanyPEG(data)
        delete data.growth
        this.request.patch(company._id, data)
      })
    })
  })
}


CompanyCalculations.prototype.calculateCompanyPE = function(data){
  const CompanyYearlyPE = []
  data.ratios.forEach(function(year){
    const PEratioYearly = { }
    PEratioYearly['date'] =  year.date
    PEratioYearly['PE'] =  year.investmentValuationRatios.priceEarningsRatio
    CompanyYearlyPE.push (PEratioYearly)
  })
  return  CompanyYearlyPE
};

CompanyCalculations.prototype.calculateCompanyPB = function(data){
  const CompanyYearlyPB = []
  data.ratios.forEach(function(year){
    const PBratioYearly = { }
    PBratioYearly['date'] =  year.date
    PBratioYearly['PB'] =  year.investmentValuationRatios.priceToBookRatio
    CompanyYearlyPB.push (PBratioYearly)
  })
  return CompanyYearlyPB
};

CompanyCalculations.prototype.calculateCompanyROE = function(data){
  const CompanyYearlyROE = []
  data.ratios.forEach(function(year){
    const ROEratioYearly = { }
    ROEratioYearly['date'] =  year.date
    ROEratioYearly['ROE'] =  year.profitabilityIndicatorRatios.returnOnEquity
    CompanyYearlyROE.push (ROEratioYearly)
  })
  return CompanyYearlyROE
};

CompanyCalculations.prototype.calculateCompanyDE = function(data){
  const CompanyYearlyDE = []
  data.ratios.forEach(function(year){
    const DEratioYearly = { }
    DEratioYearly['date'] =  year.date
    DEratioYearly['DE'] =  year.debtRatios.debtEquityRatio
    CompanyYearlyDE.push (DEratioYearly)
  })
  return CompanyYearlyDE
};

CompanyCalculations.prototype.calculateCompanyCurrentRatio = function(data){
  const yearlyCurrentRatio = []
  data.ratios.forEach(function(year){
    const currentRatioYearly = { }
    currentRatioYearly['date'] =  year.date
    currentRatioYearly['CR'] =  year.liquidityMeasurementRatios.currentRatio
    yearlyCurrentRatio.push (currentRatioYearly)
  })
  return yearlyCurrentRatio
};

CompanyCalculations.prototype.calculateCompanyPEG = function(data){
  const yearlyCurrentPEG = []
  data.growth.forEach(function(year){
    const PEGRatioYearly = { }
    PEGRatioYearly['date'] =  year.date
    PEGRatioYearly['PEG'] =  year['5Y Shareholders Equity Growth (per Share)']
    yearlyCurrentPEG.push (PEGRatioYearly)
  })
  return yearlyCurrentPEG
};





module.exports = CompanyCalculations;
