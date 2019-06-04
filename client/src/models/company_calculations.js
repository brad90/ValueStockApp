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
        data["id"] = company._id
        this.calculateCompanyPE(data)
        this.calculateCompanyPB(data)
      })
    })
  })
}


CompanyCalculations.prototype.calculateCompanyPE = function(data){
  const companyPE = data.ratios.map(year => year.investmentValuationRatios.priceEarningsRatio)
  return companyPE
}

CompanyCalculations.prototype.calculateCompanyPB = function(data){
  const companyPB = data.ratios.map(year => year.investmentValuationRatios.priceToBookRatio)
  return companyPB
}

module.exports = CompanyCalculations;
