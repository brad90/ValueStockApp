const PubSub = require('../helpers/pub_sub.js')
const RequestHelper = require('../helpers/request_helper.js')
const GetCompanyDataDB = require('./getCompanyDataDB.js')
const GridSummaryDisplay = function (){
  this.request = new RequestHelper('http://localhost:3000/api/stocks')
}

GridSummaryDisplay.prototype.bindEvents = function(){

  const sortedCompanies = PubSub.subscribe("GetCompanyDataDB:Full-company-data" , (event) => {

    const fullCompanyRatioData = event.detail
    const noNullValues = [];

    for(company in fullCompanyRatioData ){
      if(fullCompanyRatioData[company].total_evaluation != null){
        noNullValues.push(fullCompanyRatioData[company])
      }
    };

    noNullValues.sort(function (a,b) {
        return parseInt(a.total_evaluation) - parseInt(b.total_evaluation)
    })
    console.log(noNullValues);
    PubSub.publish("Company-ranking-calculations:Sorted-company-ratios", noNullValues)
  })
};


module.exports = GridSummaryDisplay;
