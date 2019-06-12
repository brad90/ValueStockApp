const PubSub = require('../helpers/pub_sub.js')
const RequestHelper = require('../helpers/request_helper.js')
const GetCompanyDataDB = function (){
  this.request = new RequestHelper('http://localhost:3000/api/stocks')
}


GetCompanyDataDB.prototype.bindEvents = function () {
  this.getCompanyDataDB()
};

GetCompanyDataDB.prototype.getCompanyDataDB = function () {
  this.request.get()
  .then((data) => {
    PubSub.publish("all-company-data:All-company-tickers", data)
  })
}

GetCompanyDataDB.prototype.getCompanyFullDataRatios = function () {
  this.request.get()
  .then((data) => {
    PubSub.publish("GetCompanyDataDB:Full-company-data", data)
  })
}



module.exports = GetCompanyDataDB;
