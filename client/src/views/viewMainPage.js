const PubSub = require('../helpers/pub_sub.js')
const RequestHelper = require('../helpers/request_helper.js')
// import ApexCharts from 'apexcharts'

const ViewMainPage = function ( allMainPageItemsView, containerForAllStockGrid, containerGraph, containerBestStock1, containerBestStock2){
    this.containerMainItems = allMainPageItemsView
    this.containerGrid = containerForAllStockGrid
    this.containerGraph = containerGraph
    this.containerBestStock1 = containerBestStock1
    this.containerBestStock2 = containerBestStock2
};



ViewMainPage.prototype.bindEvents = function() {
    this.viewAllButtonClick()
    this.navHomeButtonClick()
    this.navViewAllButtonClick()
    this.renderBestShare()

};

// <---------------- Event Listeners -------------------------->

ViewMainPage.prototype.viewAllButtonClick = function () {
    const targetButton = document.querySelector('#fold-best-button')
    targetButton.addEventListener("click", (event) => {
        this.containerMainItems.forEach(element => element.classList.add("visibility-hidden"))
        this.containerGrid.forEach(element => element.classList.remove('visibility-hidden'))
    })
};


ViewMainPage.prototype.navHomeButtonClick = function () {
    const targetButtonNav = document.querySelector('#NavHome')
    targetButtonNav.addEventListener('click', (event) => {
        this.containerMainItems.forEach(element => element.classList.remove('visibility-hidden'))
        this.containerGrid.forEach(element => element.classList.add('visibility-hidden'))
    })
};


ViewMainPage.prototype.navViewAllButtonClick = function () {
    const targetButtonNav = document.querySelector('#NavViewAll')
    targetButtonNav.addEventListener('click', (event) => {
        this.containerMainItems.forEach(element => element.classList.add('visibility-hidden'))
        this.containerGrid.forEach(element => element.classList.remove('visibility-hidden'))
    })
};


// <---------------- Rendering Best Companies -------------------------->

ViewMainPage.prototype.renderBestShare = function () {
    PubSub.subscribe("Company-ranking-calculations:Sorted-company-ratios", (event) => {
        const Topcompany1 = event.detail[0];
        const Topcompany2 = event.detail[1];
        const renderedSumaryBox1 = this.render(Topcompany1)
        const renderedSumaryBox2 = this.render(Topcompany2)
        this.containerBestStock1.appendChild(renderedSumaryBox1)
        this.containerBestStock2.appendChild(renderedSumaryBox2)
    })
};




ViewMainPage.prototype.render = function (company) {

    const companySummaryBox = document.createElement('div')

    const tickerSymbol = this.tickerSymbol(company)
    const companyName = this.companyName(company)
    const sector = this.sector(company)
    const readMoreButton = this.readMoreButton(company)
    const evaluationGraph = this.evaluationGraph(company)

    companySummaryBox.appendChild(tickerSymbol)
    companySummaryBox.appendChild(companyName)
    companySummaryBox.appendChild(sector)
    companySummaryBox.appendChild(evaluationGraph)
    companySummaryBox.appendChild(readMoreButton)

    companySummaryBox.classList.add('companysummaryboxmain')

    return companySummaryBox
};





ViewMainPage.prototype.tickerSymbol = function (company) {
    const tickerSymbol = document.createElement('h2')
    tickerSymbol.textContent = company.ticker
    tickerSymbol.classList.add('ticker-symbol-box-summary')
    return tickerSymbol
};

ViewMainPage.prototype.companyName = function (company) {
    const companyName = document.createElement('h5')
    companyName.textContent = company.companyName.substring(0,35)
    companyName.classList.add('companyName-box-summary')
    return companyName
};

ViewMainPage.prototype.sector = function (company) {
    const sector = document.createElement('h5')
    sector.textContent = company.sector
    sector.classList.add('industry-box-summary')
    return sector
};

ViewMainPage.prototype.readMoreButton = function (company) {
    const readMoreButton = document.createElement('button')
    readMoreButton.classList.add('summary-box-button')
    readMoreButton.innerHTML = ('value','Read More')
    readMoreButton.value = (company._id)
    readMoreButton.addEventListener('click', (event) => { PubSub.publish("ViewBoxSummary: selected-company-single-page", event.target.value)})
    return readMoreButton
};

ViewMainPage.prototype.evaluationGraph = function (company) {
    const graph = document.createElement('div')
    const graphPlaceholder = document.createElement('h1')
    graphPlaceholder.textContent = "+ " + company.total_evaluation.toFixed(2)
    graphPlaceholder.classList.add('company-graph')
    return graphPlaceholder
}





















ViewMainPage.prototype.topStockGraph = function () {

    PubSub.subscribe("Company-ranking-calculations:Sorted-company-ratios", (event) =>{

        const allCompanyInfo = event.detail
        const bestStock = allCompanyInfo[0]
        const bestEy = bestStock.ey_evaluaton
        const bestPB = bestStock.pb_evaluaton
        const bestPE = bestStock.pe_evaluation
        const bestPEG = bestStock.peg_evaluaton
        const bestROE = bestStock.roe_evaluaton

        // <apexcharts
        //   width="100%"
        //   height="350"
        //   type="bar"
        //   :options="chartOptions"
        //   :series="series"
        // ></apexcharts>


        var  options = {

            chart: {
                type: 'radar'
            },
            series: [
                {
                    name: "Radar Series 1",
                    data: [bestEy.toFixed(1), bestPB.toFixed(2), bestPE.toFixed(1), bestPEG.toFixed(1), bestROE.toFixed(1)]
                }
            ],
            labels: ['EY', 'PB', 'PE', 'PEG', 'ROE']
        }
        let chart = new ApexCharts(document.querySelector("#chart"), options)
        chart.render()
    })
}


module.exports = ViewMainPage;
