const PubSub = require('../helpers/pub_sub.js')
const RequestHelper = require('../helpers/request_helper.js')
const StockBoxSummary = require('./viewCompanyBox.js')


const ViewCompanyGridPage = function (container , allGridItemsView) {
    this.container = container
    this.allcontainers = allGridItemsView
};


ViewCompanyGridPage.prototype.bindEvents = function () {
    this.render()
    this.sectorSelector()
};


// <---------------- Set up Variables --------------------->
let fullCompanyInfoArray
const stockBoxSummary = new StockBoxSummary(this.container)


ViewCompanyGridPage.prototype.render = function () {
    PubSub.subscribe("Company-ranking-calculations:Sorted-company-ratios", (event) => {
        fullCompanyInfoArray = event.detail
        fullCompanyInfoArray.forEach(company => {
            const renderedStockBox = stockBoxSummary.render(company)
            this.container.appendChild(renderedStockBox)
        })
    })
};


ViewCompanyGridPage.prototype.sectorSelector = function(){
    const selector = document.querySelector("#selector")
    selector.addEventListener("change", (event) => {
        this.allcontainers.forEach(element => element.classList.remove('visibility-hidden'))
        this.container.innerHTML = ""
        const selection = event.target.value
        fullCompanyInfoArray.forEach(company => {
            if(selection === company.sector){
                const renderedStockBox = stockBoxSummary.render(company)
                this.container.appendChild(renderedStockBox)
            }else if(selection === "All"){
                const renderedStockBox = stockBoxSummary.render(company)
                this.container.appendChild(renderedStockBox)
            }
        })
    })
};


module.exports = ViewCompanyGridPage;
