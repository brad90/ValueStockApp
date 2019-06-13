const PubSub = require('../helpers/pub_sub.js')
const RequestHelper = require('../helpers/request_helper.js')

const ViewMainPage = function (containerMain, containerGrid) {
  this.containerMain = containerMain
  this.containerGrid = containerGrid
}

ViewMainPage.prototype.bindEvents = function () {
  this.viewAllButtonClick()
};


ViewMainPage.prototype.viewAllButtonClick = function () {

  const targetButtonAll = document.querySelector('#fold-best-button')
  targetButtonAll.addEventListener('click', (event)=>{

    this.containerMain.forEach(element => element.classList.add('visibility-hidden'))
    this.containerGrid.classList.remove('visibility-hidden')
  })
};


module.exports = ViewMainPage;
