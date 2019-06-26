//<-----------   Requiring Models   ----------->
const GetStockDataApiModel = require ('./models/getCompanyDataApi.js')
const GetStockDataDBModel = require('./models/getCompanyDataDB.js')
const GridSummaryDisplayModel = require('./models/gridSummaryDisplay.js')
const RankingCalculationsModel = require('./models/rankingCalculations.js')

//<-----------   Requiring Views   ----------->
const MainPageView = require('./views/viewMainPage.js')
const StockGridPageView = require('./views/viewCompanyGridPage.js')
const StockBoxView = require('./views/viewCompanyBox.js')



document.addEventListener("DOMContentLoaded",() => {

    // <-------------- Getting data from the local database ---------------- >
    const getStockDataDB = new GetStockDataDBModel();
    getStockDataDB.bindEvents();



    // <-------------- Getting data from the external API ---------------- >
    const KeyMetricsStockURL = 'https://financialmodelingprep.com/api/v3/company-key-metrics/';
    const growthInfoStockURL = 'https://financialmodelingprep.com/api/v3/financial-statement-growth/';
    const generalInfoStockURL = 'https://financialmodelingprep.com/api/v3/company/profile/';
    const financialsInfoStockURL = 'https://financialmodelingprep.com/api/v3/financials/income-statement/';
    const companyCalculationsAPI = new GetStockDataApiModel(KeyMetricsStockURL, growthInfoStockURL, generalInfoStockURL, financialsInfoStockURL);
    companyCalculationsAPI.bindEvents();



    // <-------------- Calculates company value  ---------------- >
    const rankingCalculationsModel = new RankingCalculationsModel();
    rankingCalculationsModel.bindEvents();

    // <-------------- Sorts the companies by value & provides data for render  ---------------- >
    const gridSummaryDisplayModel = new GridSummaryDisplayModel();
    gridSummaryDisplayModel.bindEvents();


    // <-------------- All companies ranked in order page view  ---------------- >
    const companyGridBoxSummaryContainer = document.querySelector('#company-grid-summary');
    const allGridItemsView = document.querySelectorAll(".company-grid-summary");

    const stockGridPageView = new StockGridPageView(companyGridBoxSummaryContainer, allGridItemsView);
    const stockBoxView = new StockBoxView(companyGridBoxSummaryContainer);
    stockGridPageView.bindEvents()


    // <-------------- Main page view  ---------------- >
    const allMainPageItemsView = document.querySelectorAll(".mainpage");
    const mainPageGraphView = document.querySelectorAll("#myGraph");

    const mainPageContainerRightView = document.querySelector('#topStocks');
    const viewMainPageContainerRightTwo = document.querySelector("#topStockstwo");
    const mainPageView = new MainPageView(
        allMainPageItemsView,
        allGridItemsView,
        mainPageGraphView,
        mainPageContainerRightView,
        viewMainPageContainerRightTwo
    );
    mainPageView.bindEvents();





    // <-------------- Extensions to project if time found  ---------------- >
    // const singlePageModel = new SinglePage()
    // singlePageModel.bindEvents()

    // const container = document.querySelector('#company-single-page')
    // const summaryCompany= document.querySelector("#company-grid-summary")
    // const singlePageView = new SinglePageView(container, summaryCompany)
    // singlePageView.bindEvents()

});
