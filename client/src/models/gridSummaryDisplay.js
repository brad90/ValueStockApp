const PubSub = require('../helpers/pub_sub.js')
const RequestHelper = require('../helpers/request_helper.js')
const GetCompanyDataDB = require('./getCompanyDataDB.js')
const GridSummaryDisplay = function (){
  this.request = new RequestHelper('http://localhost:3000/api/stocks')
}

GridSummaryDisplay.prototype.bindEvents = function(){

  const getCompanyDataDB  = new GetCompanyDataDB();
  getCompanyDataDB.getCompanyFullDataRatios()

  const sortedCompanies = PubSub.subscribe("GetCompanyDataDB:Full-company-data" , (event) => {
    
    const fullCompanyRatioData = event.detail
    fullCompanyRatioData.sort(function (a,b) {
      return parseInt(a.total_evaluation) - parseInt(b.total_evaluation)
    })
    PubSub.publish("Company-ranking-calculations:Sorted-company-ratios", fullCompanyRatioData)
  })
};


module.exports = GridSummaryDisplay;
