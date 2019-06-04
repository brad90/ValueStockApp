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
        console.log("has the datat been added", data);
        // this.calculateCompanyPE({data)
      })
    })
  })
}


module.exports = CompanyCalculations;
