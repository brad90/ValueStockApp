const PubSub = require('../helpers/pub_sub.js')
const RequestHelper = require('../helpers/request_helper.js')
// import ApexCharts from 'apexcharts'

const ViewMainPage = function (containerMain, containerGrid, containerGraph) {
  this.containerMain = containerMain
  this.containerGrid = containerGrid
  this.containerGraph = containerGraph
}

ViewMainPage.prototype.bindEvents = function () {
  this.viewAllButtonClick()
  this.navHomeButtonClick()
  this.navViewAllButtonClick()
  this.topStockGraph()
};


ViewMainPage.prototype.viewAllButtonClick = function () {

  const targetButtonAll = document.querySelector('#fold-best-button')
  targetButtonAll.addEventListener('click', (event)=>{

    this.containerMain.forEach(element => element.classList.add('visibility-hidden'))
    this.containerGrid.classList.remove('visibility-hidden')
  })
};


ViewMainPage.prototype.navHomeButtonClick = function () {

  const targetButtonAll = document.querySelector('#NavHome')
  targetButtonAll.addEventListener('click', (event)=>{

    this.containerMain.forEach(element => element.classList.remove('visibility-hidden'))
    this.containerGrid.classList.add('visibility-hidden')
  })
};


ViewMainPage.prototype.navViewAllButtonClick = function () {

  const targetButtonAll = document.querySelector('#NavViewAll')
  targetButtonAll.addEventListener('click', (event)=>{

    this.containerMain.forEach(element => element.classList.add('visibility-hidden'))
    this.containerGrid.classList.remove('visibility-hidden')
  })
};


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
    let chart = new ApexCharts(document.querySelector("#chart"), options
    chart.render()
  })
}


module.exports = ViewMainPage;
