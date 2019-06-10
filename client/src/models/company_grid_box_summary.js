const PubSub = require('../helpers/pub_sub.js')
const RequestHelper = require('../helpers/request_helper.js')
const CompanyGridBoxSummary = function (){
  this.request = new RequestHelper('http://localhost:3000/api/stocks')
}

CompanyGridBoxSummary.prototype.bindEvents = function(){

  const sortedCompanies = PubSub.subscribe("companyRankingCalculations: company-data-including-evaluation", (event) => {
    const fullCompanyRatioData = event.detail
    fullCompanyRatioData.sort(function (a,b) {
      return parseInt(a.total_evaluation) - parseInt(b.total_evaluation)
    })
    PubSub.publish("Company-ranking-calculations: Sorted-company-ratios", fullCompanyRatioData)
  });

};


module.exports = CompanyGridBoxSummary;
