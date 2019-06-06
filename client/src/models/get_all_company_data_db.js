const PubSub = require('../helpers/pub_sub.js')
const RequestHelper = require('../helpers/request_helper.js')
const FullCompanyData = function (){
  this.request = new RequestHelper('http://localhost:3000/api/stocks')
}


FullCompanyData.prototype.bindEvents = function () {
  this.getCompanyTickers()
  this.getCompanyFullData()
};


FullCompanyData.prototype.getCompanyTickers = function () {
  this.request.get()
  .then((data) => {
    PubSub.publish("all-company-data:All-company-tickers", data)
  })
}

FullCompanyData.prototype.getCompanyFullData = function () {
  this.request.get()
  .then((data) => {
    PubSub.publish("all-company-data:All-company-ratios", data)
  })
}



module.exports = FullCompanyData;
