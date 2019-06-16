

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
    PubSub.publish("getCompanyDataDB:All-db-companies", data)
  })
}


GetCompanyDataDB.prototype.getCompanyDataApi = function () {

  this.request.get()
  .then((data) => {
    PubSub.publish("getCompanyDataDB:All-db-companies-Api", data)
  })
}

GetCompanyDataDB.prototype.getCompanyFullDataRatios = function () {
  this.request.get()
  .then((data) => {
    PubSub.publish("fullCompanyInfoWithTotal", data)
  })
}


// GetCompanyDataDB.prototype.getCompanyFullDataRatiosSummary = function () {
//   this.request.get()
//   .then((data) => {
//     PubSub.publish("Company-ranking-calculations:Sorted-company-ratios", data)
//   })
// }




module.exports = GetCompanyDataDB;
