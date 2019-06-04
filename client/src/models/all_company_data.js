const PubSub = require('../helpers/pub_sub.js')
const RequestHelper = require('../helpers/request_helper.js')
const FullCompanyData = function (url){
  this.historicalUrl = url
  this.request = new RequestHelper('http://localhost:3000/api/stocks')
}


FullCompanyData.prototype.bindEvents = function () {
  this.getCompanyTickers()
  this.getCompanyInfo()
};


FullCompanyData.prototype.getCompanyTickers = function () {
  console.log(this.request);
  this.request.get()
  .then((data) => {
    console.log(data);
    PubSub.publish("allCompanyData:All-company-tickers", data)
    ;
  })
}

FullCompanyData.prototype.getCompanyInfo = function () {
  const companyRequest = new RequestHelper(this.historicalUrl + 'AAPL')
  companyRequest.get()
  .then((data) => {
    console.log(data);
  })
}


module.exports = FullCompanyData;
