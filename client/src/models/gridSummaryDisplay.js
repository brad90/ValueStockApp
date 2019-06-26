

const PubSub = require('../helpers/pub_sub.js')
const RequestHelper = require('../helpers/request_helper.js')
const GetCompanyDataDB = require('./getCompanyDataDB.js')
const GridSummaryDisplay = function (){
  this.request = new RequestHelper('http://localhost:3000/api/stocks')
}

GridSummaryDisplay.prototype.bindEvents = function(){

  let numberOfPublishes = 0


  const sortedCompanies = PubSub.subscribe("fullCompanyInfoWithTotal", (event) => {

      const fullCompanyRatioData = event.detail
      const noNullValues = [];

      for(company in fullCompanyRatioData ){
        if(fullCompanyRatioData[company].total_evaluation != null){
          noNullValues.push(fullCompanyRatioData[company])
        }
      }
      const sortedCompanies = this.sortCompanies(noNullValues)
      PubSub.publish("Company-ranking-calculations:Sorted-company-ratios", sortedCompanies)
  })
};


GridSummaryDisplay.prototype.sortCompanies = function(companies){

  let number = 0
  while(number < companies.length){
  companies.sort(function (a,b) {return parseFloat(a.total_evaluation) - parseFloat(b.total_evaluation)})
  number += 1}
  return companies
}



module.exports = GridSummaryDisplay;
