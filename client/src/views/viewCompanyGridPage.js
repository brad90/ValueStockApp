const PubSub = require('../helpers/pub_sub.js')
const RequestHelper = require('../helpers/request_helper.js')
const CompanyBoxSummary = require('./viewCompanyBox.js')

const ViewCompanyGridPage = function (container) {
  this.container = container
};


ViewCompanyGridPage.prototype.bindEvents = function () {
  this.render()
  this.sectorSelector()
};

let fullCompanyInfoArray


ViewCompanyGridPage.prototype.render = function () {

  PubSub.subscribe("Company-ranking-calculations:Sorted-company-ratios", (event) => {
    fullCompanyInfoArray = event.detail
    const companyBoxSummary = new CompanyBoxSummary(this.container)
    fullCompanyInfoArray.forEach(company => {
      const renderedSumaryBox = companyBoxSummary.render(company)
      this.container.appendChild(renderedSumaryBox)
    })
  })
};


ViewCompanyGridPage.prototype.sectorSelector = function(){

  const companyBoxSummary = new CompanyBoxSummary(this.container)
  console.log("hello");
  const selector = document.querySelector("#selector")
  console.log(selector);

  document.addEventListener("change", (event) => {
    console.log(event.target.value)
    this.container.innerHTML = ""
    const selection = event.target.value
    fullCompanyInfoArray.forEach(company => {
      if(selection === company.sector){
        console.log("hello")
        const renderedSumaryBox = companyBoxSummary.render(company)
        this.container.appendChild(renderedSumaryBox)
      }
    })
  })
  // })
};






// const companyButton = document.querySelectorAll('.box-summary-read-more-button')
// console.log(companyButton);












module.exports = ViewCompanyGridPage;
