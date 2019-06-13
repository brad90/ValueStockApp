


const PubSub = require('../helpers/pub_sub.js')
const RequestHelper = require('../helpers/request_helper.js')

const SinglePage = function(){
  this.request = new RequestHelper('http://localhost:3000/api/stocks')
};


SinglePage.prototype.bindEvents = function(){
  this.buttonSelected()
}

SinglePage.prototype.buttonSelected = function () {
  PubSub.subscribe('View_grid_company_box_summary: EventListener-read-more', (event) => {
    const id = event.detail
    this.request.get(id)
    .then((data) => {
      PubSub.publish("company_full_detail_single_page: Publishing-only-one-company", data)
    })
  })
};

module.exports = SinglePage;
