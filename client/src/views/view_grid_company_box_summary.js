const PubSub = require('../helpers/pub_sub.js')
const RequestHelper = require('../helpers/request_helper.js')
const CompanyBoxSummary = require('./view_company_box_summary.js')

const CompanyGridBoxSummary = function (container) {
  this.container = container
};

CompanyGridBoxSummary.prototype.bindEvents = function () {
  PubSub.subscribe("all-company-data:All-company-ratios", (event) => {
    const fullCompanyInfoArray = event.detail
    const companyBoxSummary = new CompanyBoxSummary(this.container)
    fullCompanyInfoArray.forEach(company => {
    const renderedSumaryBox = companyBoxSummary.render(company)
    this.container.appendChild(renderedSumaryBox)
    })
  })
};


module.exports = CompanyGridBoxSummary;
