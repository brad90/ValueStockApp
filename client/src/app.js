const GetCompanyDataApi = require ('./models/getCompanyDataApi.js')
const GridSummaryDisplay = require('./models/gridSummaryDisplay.js')
const GetCompanyDataDB = require('./models/getCompanyDataDB.js')
const RankingCalculations = require('./models/rankingCalculations.js')
const SinglePage = require('./models/singlePage.js')

const CompanyGridBoxSummaryView = require('./views/view_grid_company_box_summary.js')
const SinglePageView = require('./views/view_single_page_company_info_render.js')


document.addEventListener("DOMContentLoaded",() => {

  const getCompanyDataDB = new GetCompanyDataDB()
  // Below: publishing inital ticker info from db and then returning total company info after calcs added.
  getCompanyDataDB.bindEvents();

  // Below: Returning ratios from the APIs and adding them to the objects feilds in the database.
  const keyMetrics = 'https://financialmodelingprep.com/api/v3/company-key-metrics/';
  const growthStockInfo = 'https://financialmodelingprep.com/api/v3/financial-statement-growth/'
  const companyCalculations = new GetCompanyDataApi(keyMetrics, growthStockInfo)
  companyCalculations.bindEvents()

  getCompanyDataDB.getCompanyFullDataRatios()
  const rankingCalculations = new RankingCalculations()
  rankingCalculations.isTheStockGoodOrBad()

  const gridSummaryDisplay = new GridSummaryDisplay()
  gridSummaryDisplay.bindEvents()

  // Below: Rendering the screen with the company info.
  const companyGridBoxSummaryContainer = document.querySelector('#company-grid-summary')
  const companyGridBoxSummaryView = new CompanyGridBoxSummaryView(companyGridBoxSummaryContainer)
  companyGridBoxSummaryView.bindEvents()

  const singlePageModel = new SinglePage()
  singlePageModel.bindEvents()

  const container = document.querySelector('#company-single-page')
  const singlePageView = new SinglePageView(container)
  singlePageView.bindEvents()

});
