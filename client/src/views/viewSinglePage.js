const PubSub = require('../helpers/pub_sub.js')
const RequestHelper = require('../helpers/request_helper.js')

const viewSinglePage = function (container, companySummaryBox){
    this.container = container
    this.companySummaryBox = companySummaryBox
}

viewSinglePage.prototype.bindEvents= function () {

    PubSub.subscribe("ViewBoxSummary: selected-company-single-page", (event) => {
        console.log(event.detail)
        const button = document.querySelectorAll('ticker-symbol-box-summary')
        this.companySummaryBox.classList.add('visibility-hidden')
        this.container.classList.remove('visibility-hidden')
    })

    viewSinglePage.prototype.news = function (company) {
        const tickerSymbol = document.createElement('h2')
        tickerSymbol.textContent = company.ticker
        tickerSymbol.classList.add('ticker-symbol-box-summary')
        return tickerSymbol
    };

    viewSinglePage.prototype.tickerSymbol2 = function (company) {
        const tickerSymbol2 = document.createElement('h2')
        tickerSymbol2.textContent = company.industry
        tickerSymbol2.classList.add('ticker-symbol-box-summary')
        return tickerSymbol2
    };

    viewSinglePage.prototype.companySummaryReadMoreButton = function (company) {
        const readMoreButton = document.createElement('button')
        readMoreButton.classList.add('summaryBoxButton')
        readMoreButton.innerHTML = ('value','Read More')
        readMoreButton.value = (company._id)
        readMoreButton.addEventListener('click',(event) => {
            PubSub.publish("ViewBoxSummary: selected-company-single-page", event.target.value);
        })
        return readMoreButton
    };

}


module.exports =  viewSinglePage;
