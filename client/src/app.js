const CompanyCalculations = require ('./models/company_calculations.js')
const CompanyGridBoxSummary = require('./views/view_grid_company_box_summary.js')
const FullCompanyData = require('./models/all_company_data.js')


document.addEventListener("DOMContentLoaded",() => {

  const historicalStockInfo = 'https://financialmodelingprep.com/api/v3/financial-ratios/'
  const fullCompanyData = new FullCompanyData(historicalStockInfo)
  fullCompanyData.bindEvents();


  const companyCalculations = new CompanyCalculations(historicalStockInfo)
  companyCalculations.bindEvents()

  const companyGridBoxSummaryContainer = document.querySelector('#company-grid-summary')
  const companyGridBoxSummary = new CompanyGridBoxSummary(companyGridBoxSummaryContainer)
  companyGridBoxSummary.bindEvents()

});
