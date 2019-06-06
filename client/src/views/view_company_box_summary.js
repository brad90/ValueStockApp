const PubSub = require('../helpers/pub_sub.js')
const RequestHelper = require('../helpers/request_helper.js')

const CompanyBoxSummary = function (container) {
  this.container
};


CompanyBoxSummary.prototype.render = function (company) {

  const companySummaryBox = document.createElement('div')
  companySummaryBox.classList.add('company-summary-box')
  const tickerSymbol = this.tickerSymbol(company)
  const companySummaryBoxReadMoreButton = this.companySummaryReadMoreButton()
  const companyEvaluationGraph = this.companyEvaluationGraph()

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

CompanyBoxSummary.prototype.companySummaryReadMoreButton = function () {
  const readMoreButton = document.createElement('button')
  readMoreButton.classList.add('box-summary-read-more-button')
  readMoreButton.innerHTML = ('value','Read More')
  return readMoreButton
};

CompanyBoxSummary.prototype.companyEvaluationGraph = function (){
  const graph = document.createElement('div')
  graph.classList.add('company-graph')
  return graph
}



module.exports = CompanyBoxSummary;