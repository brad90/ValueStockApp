const PubSub = require('../helpers/pub_sub.js')
const RequestHelper = require('../helpers/request_helper.js')
// import ApexCharts from 'apexcharts'

const ViewMainPage = function (containerMain, containerGrid, containerGraph, ContainerRight, containerrighttwo) {
  this.containerMain = containerMain
  this.containerGrid = containerGrid
  this.containerGraph = containerGraph
  this.ContainerRight = ContainerRight
  this.containerRighttwo = containerrighttwo
}

ViewMainPage.prototype.bindEvents = function () {
  this.viewAllButtonClick()
  this.navHomeButtonClick()
  this.navViewAllButtonClick()
  this.renderBestShare()
  // this.topStockGraph()
};


ViewMainPage.prototype.viewAllButtonClick = function () {

  console.log(this.containerMain);

  const targetButtonAll = document.querySelector('#fold-best-button')
  targetButtonAll.addEventListener('click', (event)=>{
    console.log(this.containerGrid);

    this.containerMain.forEach(element => element.classList.add('visibility-hidden'))
    this.containerGrid.forEach(element => element.classList.remove('visibility-hidden'))
  })
};


ViewMainPage.prototype.navHomeButtonClick = function () {

  const targetButtonAll = document.querySelector('#NavHome')
  targetButtonAll.addEventListener('click', (event)=>{

    this.containerMain.forEach(element => element.classList.remove('visibility-hidden'))
    this.containerGrid.forEach(element => element.classList.add('visibility-hidden'))
  })
};


ViewMainPage.prototype.navViewAllButtonClick = function () {

  const targetButtonAll = document.querySelector('#NavViewAll')
  targetButtonAll.addEventListener('click', (event)=>{

    this.containerMain.forEach(element => element.classList.add('visibility-hidden'))
    this.containerGrid.forEach(element => element.classList.remove('visibility-hidden'))
  })
};

ViewMainPage.prototype.renderBestShare = function () {
  PubSub.subscribe("Company-ranking-calculations:Sorted-company-ratios", (event) => {
    console.log(this.ContainerRight2);

    const Topcompany1 = event.detail[0];
    const Topcompany2 = event.detail[1];
    const Topcompany3 = event.detail[2];
    const renderedSumaryBox1 = this.render(Topcompany1)
    const renderedSumaryBox2 = this.render(Topcompany2)
    // const renderedSumaryBox3 = this.render(Topcompany3)
    this.ContainerRight.appendChild(renderedSumaryBox1)
    this.containerRighttwo.appendChild(renderedSumaryBox2)
    // this.ContainerRight.appendChild(renderedSumaryBox3)

  })
}


ViewMainPage.prototype.render = function (company) {


  const companySummaryBox = document.createElement('div')
  companySummaryBox.classList.add('companysummaryboxmain')
  const tickerSymbol = this.tickerSymbol(company)
  const companyName = this.companyName(company)
  const industry = this.industry(company)
  const companySummaryBoxReadMoreButton = this.companySummaryReadMoreButton(company)
  const companyEvaluationGraph = this.companyEvaluationGraph(company)

  companySummaryBox.appendChild(tickerSymbol)
  companySummaryBox.appendChild(companyName)
  companySummaryBox.appendChild(industry)
  companySummaryBox.appendChild(companyEvaluationGraph)
  companySummaryBox.appendChild(companySummaryBoxReadMoreButton)

  return companySummaryBox
};

ViewMainPage.prototype.tickerSymbol = function (company) {
  const tickerSymbol = document.createElement('h2')
  tickerSymbol.textContent = company.ticker
  tickerSymbol.classList.add('ticker-symbol-box-summary')
  return tickerSymbol
};

ViewMainPage.prototype.companyName = function (company) {
  const companyName= document.createElement('h5')
  companyName.textContent = company.companyName.substring(0,35)
  companyName.classList.add('companyName-box-summary')
  console.log(companyName);
  return companyName
};

ViewMainPage.prototype.industry = function (company) {
  const industry= document.createElement('h5')
  industry.textContent = company.sector
  industry.classList.add('industry-box-summary')
  console.log(industry);
  return industry
};

ViewMainPage.prototype.companySummaryReadMoreButton = function (company) {
  const readMoreButton = document.createElement('button')
  readMoreButton.classList.add('summaryBoxButton')
  readMoreButton.innerHTML = ('value','Read More')
  readMoreButton.value = (company._id)
  readMoreButton.addEventListener('click',(event) => {
    PubSub.publish("ViewBoxSummary: selected-company-single-page", event.target.value);
  })
  return readMoreButton
};

ViewMainPage.prototype.companyEvaluationGraph = function (company){
  const graph = document.createElement('div')
  const graphPlaceholder = document.createElement('h1')
  graphPlaceholder.textContent ="+ " + company.total_evaluation.toFixed(2)
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
