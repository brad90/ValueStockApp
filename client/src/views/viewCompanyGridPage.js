const PubSub = require('../helpers/pub_sub.js')
const RequestHelper = require('../helpers/request_helper.js')
const CompanyBoxSummary = require('./viewCompanyBox.js')

const ViewCompanyGridPage = function (container) {
  this.container = container
};



ViewCompanyGridPage.prototype.bindEvents = function () {
  this.render()
};


ViewCompanyGridPage.prototype.render = function () {
  PubSub.subscribe("Company-ranking-calculations:Sorted-company-ratios", (event) => {

    const fullCompanyInfoArray = event.detail
    const companyBoxSummary = new CompanyBoxSummary(this.container)
    fullCompanyInfoArray.forEach(company => {
      const renderedSumaryBox = companyBoxSummary.render(company)
      this.container.appendChild(renderedSumaryBox)
    })
  })
};




// const companyButton = document.querySelectorAll('.box-summary-read-more-button')
// console.log(companyButton);












module.exports = ViewCompanyGridPage;
