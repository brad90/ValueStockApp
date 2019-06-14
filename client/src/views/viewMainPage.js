const PubSub = require('../helpers/pub_sub.js')
const RequestHelper = require('../helpers/request_helper.js')

const ViewMainPage = function (containerMain, containerGrid) {
  this.containerMain = containerMain
  this.containerGrid = containerGrid
}

ViewMainPage.prototype.bindEvents = function () {
  this.viewAllButtonClick()
  this.navHomeButtonClick()
  this.navViewAllButtonClick()
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


module.exports = ViewMainPage;
