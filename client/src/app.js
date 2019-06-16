const GetCompanyDataApi = require ('./models/getCompanyDataApi.js')
const GridSummaryDisplay = require('./models/gridSummaryDisplay.js')
const GetCompanyDataDB = require('./models/getCompanyDataDB.js')
const RankingCalculations = require('./models/rankingCalculations.js')
const SinglePage = require('./models/singlePage.js')


const ViewCompanyGridPage = require('./views/viewCompanyGridPage.js')
const ViewCompanyBox = require('./views/viewCompanyBox.js')
const SinglePageView = require('./views/viewSinglePage.js')
const ViewMainPage = require('./views/viewMainPage.js')


document.addEventListener("DOMContentLoaded",() => {

  const getCompanyDataDB = new GetCompanyDataDB()
  getCompanyDataDB.bindEvents();

  const keyMetrics = 'https://financialmodelingprep.com/api/v3/company-key-metrics/';
  const growthStockInfo = 'https://financialmodelingprep.com/api/v3/financial-statement-growth/'
  const generalInfo = 'https://financialmodelingprep.com/api/v3/company/profile/'

  const companyCalculationsAPI = new GetCompanyDataApi(keyMetrics, growthStockInfo, generalInfo)
  companyCalculationsAPI.bindEvents()




  const gridSummaryDisplay = new GridSummaryDisplay()
  gridSummaryDisplay.bindEvents()

  // Below: Rendering the screen with the company info.
  const companyGridBoxSummaryContainer = document.querySelector('#company-grid-summary')
  const viewCompanyBox = new ViewCompanyBox(companyGridBoxSummaryContainer)
  const viewCompanyGridPage = new ViewCompanyGridPage(companyGridBoxSummaryContainer)
  viewCompanyGridPage.bindEvents()


  const viewMainPageContainerFold = document.querySelectorAll(".mainpage")
  console.log(viewMainPageContainerFold);
  const viewMainPageContainerGrid = document.querySelector("#company-grid-summary")
  const viewMainPage = new ViewMainPage(viewMainPageContainerFold, viewMainPageContainerGrid)
  viewMainPage.bindEvents()


  const singlePageModel = new SinglePage()
  singlePageModel.bindEvents()

  const container = document.querySelector('#company-single-page')
  const summaryCompany= document.querySelector("#company-grid-summary")
  const singlePageView = new SinglePageView(container, summaryCompany)
  singlePageView.bindEvents()

});
