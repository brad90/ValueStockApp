const PubSub = require('../helpers/pub_sub.js')
const RequestHelper = require('../helpers/request_helper.js')
const CompanyBoxSummary = require('./viewCompanyBox.js')

const ViewCompanyGridPage = function (container , allcontainers) {
  this.container = container
  this.allcontainers = allcontainers
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
  const selector = document.querySelector("#selector")

  document.addEventListener("change", (event) => {
    this.allcontainers.forEach(element => element.classList.remove('visibility-hidden'))
    this.container.innerHTML = ""
    const selection = event.target.value
    fullCompanyInfoArray.forEach(company => {
      if(selection === company.sector){
        const renderedSumaryBox = companyBoxSummary.render(company)
        this.container.appendChild(renderedSumaryBox)

      }else if(selection === "All"){
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
