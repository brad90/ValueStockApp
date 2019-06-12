const PubSub = require('../helpers/pub_sub.js')
const RequestHelper = require('../helpers/request_helper.js')
const GetCompanyDataApi = function (historicalUrl, growthUrl){
  this.historicalUrl = historicalUrl
  this.growthUrl = growthUrl
  this.request = new RequestHelper('http://localhost:3000/api/stocks')
}

GetCompanyDataApi.prototype.bindEvents = function () {
  this.getEachCompaniesInfo()
};

GetCompanyDataApi.prototype.getEachCompaniesInfo = function (){
  PubSub.subscribe("all-company-data:All-company-ratios", (event) => {
    const companies = event.detail
    console.log(companies.length);

    let range = 0
    let i = 0

    while(range < companies.length){
      setTimeout(this.fetchApiInfoHistorical(companies, i), 1000)
      setTimeout(this.fetchApiInfoCurrent(companies, i), 1000)
      range += 1
      i += 1
    }
  })
};


    // companies.forEach(company => {
    //   const requestCompanyData = new RequestHelper (this.historicalUrl + company.ticker)
    //   requestCompanyData.get()
    //   .then((data) => {
    //     data["PE"] = this.calculateCompanyPE(data)
    //     data["PB"] = this.calculateCompanyPB(data)
    //     data["ROE"] = this.calculateCompanyROE(data)
    //     data["DE"] = this.calculateCompanyDE(data)
    //     data["CR"] = this.calculateCompanyCurrentRatio(data)
    //     delete data.ratios
    //     delete data.symbol
    //     this.request.patch(company._id, data)
    //   })


    //     const requestCompanyGrowthData = new RequestHelper (this.growthUrl + company.ticker)
    //     requestCompanyGrowthData.get()
    //     .then((data) => {
    //       data['PEG'] = this.calculateCompanyPEG(data)
    //       delete data.growth
    //       delete data.symbol
    //       this.request.patch(company._id, data)
    //     })
    //   })



GetCompanyDataApi.prototype.fetchApiInfoHistorical = function(companies, index){
  const requestCompanyData = new RequestHelper (this.historicalUrl + companies[index].ticker)
  requestCompanyData.get()
  .then((data) => {
    console.log(companies[index].ticker);
    data["PE"] = this.calculateCompanyPE(data)
    data["PB"] = this.calculateCompanyPB(data)
    data["ROE"] = this.calculateCompanyROE(data)
    data["DE"] = this.calculateCompanyDE(data)
    data["CR"] = this.calculateCompanyCurrentRatio(data)
    delete data.ratios
    delete data.symbol
    this.request.patch(companies[index]._id, data)
  })
};

GetCompanyDataApi.prototype.fetchApiInfoCurrent = function(companies, index){
  const requestCompanyGrowthData = new RequestHelper (this.growthUrl + companies[index].ticker)
  requestCompanyGrowthData.get()
  .then((data) => {
    data['PEG'] = this.calculateCompanyPEG(data)
    delete data.growth
    delete data.symbol
    this.request.patch(companies[index]._id, data)
  })
};


GetCompanyDataApi.prototype.calculateCompanyPE = function(data){
  const CompanyYearlyPE = []
  data.ratios.forEach(function(year){
    const PEratioYearly = { }
    PEratioYearly['date'] =  year.date
    PEratioYearly['PE'] =  year.investmentValuationRatios.priceEarningsRatio
    CompanyYearlyPE.push (PEratioYearly)
  })
  return  CompanyYearlyPE
};

GetCompanyDataApi.prototype.calculateCompanyPB = function(data){
  const CompanyYearlyPB = []
  data.ratios.forEach(function(year){
    const PBratioYearly = { }
    PBratioYearly['date'] =  year.date
    PBratioYearly['PB'] =  year.investmentValuationRatios.priceToBookRatio
    CompanyYearlyPB.push (PBratioYearly)
  })
  return CompanyYearlyPB
};

GetCompanyDataApi.prototype.calculateCompanyROE = function(data){
  const CompanyYearlyROE = []
  data.ratios.forEach(function(year){
    const ROEratioYearly = { }
    ROEratioYearly['date'] =  year.date
    ROEratioYearly['ROE'] =  year.profitabilityIndicatorRatios.returnOnEquity
    CompanyYearlyROE.push (ROEratioYearly)
  })
  return CompanyYearlyROE
};

GetCompanyDataApi.prototype.calculateCompanyDE = function(data){
  const CompanyYearlyDE = []
  data.ratios.forEach(function(year){
    const DEratioYearly = { }
    DEratioYearly['date'] =  year.date
    DEratioYearly['DE'] =  year.debtRatios.debtEquityRatio
    CompanyYearlyDE.push (DEratioYearly)
  })
  return CompanyYearlyDE
};

GetCompanyDataApi.prototype.calculateCompanyCurrentRatio = function(data){
  const yearlyCurrentRatio = []
  data.ratios.forEach(function(year){
    const currentRatioYearly = { }
    currentRatioYearly['date'] =  year.date
    currentRatioYearly['CR'] =  year.liquidityMeasurementRatios.currentRatio
    yearlyCurrentRatio.push (currentRatioYearly)
  })
  return yearlyCurrentRatio
};

GetCompanyDataApi.prototype.calculateCompanyPEG = function(data){
  const yearlyCurrentPEG = []
  data.growth.forEach(function(year){
    const PEGRatioYearly = { }
    PEGRatioYearly['date'] =  year.date
    PEGRatioYearly['PEG'] =  year['5Y Shareholders Equity Growth (per Share)']
    yearlyCurrentPEG.push (PEGRatioYearly)
  })
  return yearlyCurrentPEG
};





module.exports = GetCompanyDataApi;
