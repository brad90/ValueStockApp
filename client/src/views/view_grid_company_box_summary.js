const PubSub = require('../helpers/pub_sub.js')
const RequestHelper = require('../helpers/request_helper.js')
const CompanyBoxSummary = require('./view_company_box_summary.js')

const CompanyGridBoxSummary = function (container) {
  this.container = container
};

CompanyGridBoxSummary.prototype.bindEvents = function () {
  PubSub.subscribe("Company-ranking-calculations:Sorted-company-ratios", (event) => {
    console.log(event.detail);
    const fullCompanyInfoArray = event.detail
    const companyBoxSummary = new CompanyBoxSummary(this.container)
    fullCompanyInfoArray.forEach(company => {
    const renderedSumaryBox = companyBoxSummary.render(company)
    this.container.appendChild(renderedSumaryBox)
    })
  })

  const button = document.addEventListener('click', (event) => {
    const id = event.target.value
    PubSub.publish('View_grid_company_box_summary: EventListener-read-more', id)
  })
};







module.exports = CompanyGridBoxSummary;
