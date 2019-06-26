const PubSub = require('../helpers/pub_sub.js')
const RequestHelper = require('../helpers/request_helper.js')
const Chart = require('chart.js');

const CompanyBoxSummary = function (container) {
    this.container = container
};


CompanyBoxSummary.prototype.render = function (company) {


    const StockSummaryBox = document.createElement('div')
    const tickerSymbol = this.tickerSymbol(company)
    const companyName = this.companyName(company)
    const sector = this.sector(company)
    const readMoreButton = this.readMoreButton(company)
    const companyEvaluation = this.companyEvaluation(company)

    StockSummaryBox.appendChild(tickerSymbol)
    StockSummaryBox.appendChild(companyName)
    StockSummaryBox.appendChild(sector)
    StockSummaryBox.appendChild(companyEvaluation)
    StockSummaryBox.appendChild(readMoreButton)
    StockSummaryBox.classList.add('companysummarybox')

    return StockSummaryBox
};


CompanyBoxSummary.prototype.tickerSymbol = function (company) {
    const tickerSymbol = document.createElement('h2')
    tickerSymbol.textContent = company.ticker
    tickerSymbol.classList.add('ticker-symbol-box-summary')
    return tickerSymbol
};

CompanyBoxSummary.prototype.companyName = function (company) {
    const companyName = document.createElement('h5')
    companyName.textContent = company.companyName.substring(0,35)
    companyName.classList.add('companyName-box-summary')
    return companyName
};

CompanyBoxSummary.prototype.sector = function (company) {
    const sector = document.createElement('h5')
    sector.textContent = company.sector
    sector.classList.add('industry-box-summary')
    return sector
};

CompanyBoxSummary.prototype.readMoreButton = function (company) {
    const readMoreButton = document.createElement('button')
    readMoreButton.classList.add('summaryBoxButton')
    readMoreButton.innerHTML = ('value','Read More')
    readMoreButton.value = (company._id)
    return readMoreButton
};

CompanyBoxSummary.prototype.companyEvaluation = function (company){
    const graph = document.createElement('div')
    const companyEvaluation = document.createElement('h1')
    companyEvaluation.textContent ="+ " + company.total_evaluation.toFixed(2)
    companyEvaluation.classList.add('company-graph')
    return companyEvaluation
};



module.exports = CompanyBoxSummary;
