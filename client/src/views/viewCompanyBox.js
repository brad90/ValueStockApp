const PubSub = require('../helpers/pub_sub.js')
const RequestHelper = require('../helpers/request_helper.js')
const Chart = require('chart.js');
const CompanyBoxSummary = function (container) {
  this.container
};


CompanyBoxSummary.prototype.render = function (company) {

  console.log(company);

  const companySummaryBox = document.createElement('div')
  companySummaryBox.classList.add('companysummarybox')
  const tickerSymbol = this.tickerSymbol(company)
  const companySummaryBoxReadMoreButton = this.companySummaryReadMoreButton(company)
  const companyEvaluationGraph = this.companyEvaluationGraph(company)

  companySummaryBox.appendChild(tickerSymbol)
  companySummaryBox.appendChild(companyEvaluationGraph)
  companySummaryBox.appendChild(companySummaryBoxReadMoreButton)

  return companySummaryBox
};


CompanyBoxSummary.prototype.tickerSymbol = function (company) {
  const tickerSymbol = document.createElement('h2')
  tickerSymbol.textContent = company.ticker
  tickerSymbol.classList.add('ticker-symbol-box-summary')
  return tickerSymbol
};

CompanyBoxSummary.prototype.tickerSymbol2 = function (company) {
  const tickerSymbol2 = document.createElement('h2')
  tickerSymbol2.textContent = company.industry
  tickerSymbol2.classList.add('ticker-symbol-box-summary')
  return tickerSymbol2
};

CompanyBoxSummary.prototype.companySummaryReadMoreButton = function (company) {
  const readMoreButton = document.createElement('button')
  readMoreButton.classList.add('summaryBoxButton')
  readMoreButton.innerHTML = ('value','Read More')
  readMoreButton.value = (company._id)
  readMoreButton.addEventListener('click',(event) => {
    PubSub.publish("ViewBoxSummary: selected-company-single-page", event.target.value);
  })
  return readMoreButton
};

CompanyBoxSummary.prototype.companyEvaluationGraph = function (company){
  const graph = document.createElement('div')
  const graphPlaceholder = document.createElement('h1')
  graphPlaceholder.textContent ="+ " + company.total_evaluation.toFixed(2)
  graphPlaceholder.classList.add('company-graph')
  return graphPlaceholder
}


// CompanyBoxSummary.prototype.companySelected = function () {
//   const targetCompanyButtonAll = document.querySelector('.summaryBoxButton')
//
//   this.companySummaryReadMoreButton().addEventListener('click', (event)=>{
//     console.log(event);
//
//     // companyButton.addEventListener('click', (event) => {
//     //   const id = event.target.value
//     //   PubSub.publish('View_grid_company_box_summary: EventListener-read-more', id)
//     //   this.container.classList.add('visibility-hidden')
//     // })
//     })
//   };



module.exports = CompanyBoxSummary;
