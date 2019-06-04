const PubSub = require('../helpers/pub_sub.js')
const RequestHelper = require('../helpers/request_helper.js')
const CompanyGridBoxSummary = function (url){
  this.historicalUrl = url
  this.request = new RequestHelper('http://localhost:3000/api/stocks')
}


module.exports = CompanyGridBoxSummary;
