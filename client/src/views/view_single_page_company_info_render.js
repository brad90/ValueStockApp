const PubSub = require('../helpers/pub_sub.js')

const SinglePageView = function (container) {
  this.container = container;
};

SinglePageView.prototype.bindEvents = function(){
  this.render()
};

SinglePageView.prototype.render = function(){
  PubSub.subscribe("company_full_detail_single_page: Publishing-only-one-company", (event) => {
    const singularCompanyInfo = event.detail
    console.log(singularCompanyInfo);
    // this.hideDashboard()
    // this.hideAboveTheFold()
  })
};

SinglePageView.prototype.hideDashboard = function() {
  const dashBoard = document.querySelector('#company-grid-summary')
  dashBoard.classList.add("visibility-hidden")

};

SinglePageView.prototype.hideAboveTheFold = function() {
  const aboveTheFold = document.querySelector('#above-the-fold-container')
  const containerLeftFold = document.querySelector('#container-left')
  const containerRightFold = document.querySelector('#container-right')
  aboveTheFold.classList.add("visibility-hidden")
  containerLeftFold.classList.add("visibility-hidden")
  containerRightFold.classList.add("visibility-hidden")

}

module.exports = SinglePageView;
