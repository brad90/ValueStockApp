const PubSub = require('../helpers/pub_sub.js')
const RequestHelper = require('../helpers/request_helper.js')
const CompanyCalculations = function (url){
  this.historicalUrl = url
  this.request = new RequestHelper('http://localhost:3000/api/stocks')
}





CompanyCalculations.prototype.bindEvents = function () {
  this.getEachCompaniesInfo()
  // this.getCompanyInfo()
};


CompanyCalculations.prototype.getEachCompaniesInfo = function (){
  PubSub.subscribe("allCompanyData:All-company-tickers", (event) => {
    const companyTickers = event.detail
    companyTickers.forEach( company => {
      const requestCompanyData = new RequestHelper (this.historicalUrl + company.ticker)
      requestCompanyData.get()
      .then((data) => {
        data["id"] = company._id;
        data["PE"] = this.calculateCompanyPE(data)
        data["PB"] = this.calculateCompanyPB(data)
        data["ROE"] = this.calculateCompanyROE(data)
        data["DE"] = this.calculateCompanyDE(data)
        console.log(data);
      })
    })
  })
}


CompanyCalculations.prototype.calculateCompanyPE = function(data){
  console.log(data);
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

module.exports = CompanyCalculations;
