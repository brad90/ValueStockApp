
const PubSub = require('../helpers/pub_sub.js')
const RequestHelper = require('../helpers/request_helper.js')


const viewSinglePage = function(container, companySummaryBox){
  this.container = container
  this.companySummaryBox = companySummaryBox
}

viewSinglePage.prototype.bindEvents= function () {

  PubSub.subscribe("ViewBoxSummary: selected-company-single-page", (event) => {
    console.log(event.detail)
    console.log(this.container)
    console.log(this.companySummaryBox);
    const button = document.querySelectorAll('ticker-symbol-box-summary')
    this.companySummaryBox.classList.add('visibility-hidden')
    this.container.classList.remove('visibility-hidden')
  })

}


module.exports =  viewSinglePage;
