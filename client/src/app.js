const CompanyCalculations = require ('./models/get_company_ratios_api.js')
const CompanyGridBoxSummaryView = require('./views/view_grid_company_box_summary.js')
const CompanyGridBoxSummaryModel = require('./models/company_grid_box_summary.js')
const FullCompanyData = require('./models/get_all_company_data_db.js')
const CompanyEvaluation = require('./models/company_ranking_calculations.js')


document.addEventListener("DOMContentLoaded",() => {

  const fullCompanyData = new FullCompanyData()
  // Below: publishing inital ticker info from db and then returning total company info after calcs added.
  fullCompanyData.bindEvents();

  // Below: Returning ratios from the APIs and adding them to the objects feilds in the database.
  const historicalStockInfo = 'https://financialmodelingprep.com/api/v3/financial-ratios/';
  const growthStockInfo = 'https://financialmodelingprep.com/api/v3/financial-statement-growth/'
  const companyCalculations = new CompanyCalculations(historicalStockInfo, growthStockInfo)
  const companyGridBoxSummaryModel = new CompanyGridBoxSummaryModel()
  companyCalculations.bindEvents()
  companyGridBoxSummaryModel.bindEvents()

  // Below: Rendering the screen with the company info.
  const companyGridBoxSummaryContainer = document.querySelector('#company-grid-summary')
  const companyGridBoxSummaryView = new CompanyGridBoxSummaryView(companyGridBoxSummaryContainer)
  companyGridBoxSummaryView.bindEvents()

  const companyEvaluation = new CompanyEvaluation()
  companyEvaluation.isTheStockGoodOrBad()

});
