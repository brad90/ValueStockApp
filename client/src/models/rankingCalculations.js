const PubSub = require('../helpers/pub_sub.js')
const RequestHelper = require('../helpers/request_helper.js')
const getCompanyDataDB = require('./getCompanyDataDB.js')


const RankingCalculations= function(){
  this.request = new RequestHelper('http://localhost:3000/api/stocks')
};


RankingCalculations.prototype.isTheStockGoodOrBad = function(){
  PubSub.subscribe("all-company-data:All-company-ratios", (event) => {
    const companies= event.detail
    companies.forEach(data => {
      

      const ratioEvaluation = { }
      ratioEvaluation['pe_evaluation'] = this.isPEGood(data)
      ratioEvaluation['pb_evaluaton'] = this.isPBGood(data)
      ratioEvaluation['de_evaluaton'] = this.isDEGood(data)
      ratioEvaluation['cr_evaluaton'] = this.isCRGood(data)
      ratioEvaluation['roe_evaluaton'] = this.isROEGood(data)
      ratioEvaluation['peg_evaluaton'] = this.isPEGGood(data)
      const total_evaluation = this.isPEGGood(data) + this.isPBGood(data) + this.isDEGood(data) + this.isCRGood(data) + this.isROEGood(data) + this.isPEGGood(data)
      ratioEvaluation['total_evaluation'] = total_evaluation.toFixed(2)
      this.request.patch(data._id, ratioEvaluation)
    })
  })
};



RankingCalculations.prototype.isPEGood = function (companydata){
  const PEratio = companydata.PE[0];
  const latestPE = PEratio.PE;
  const differenceFromIdealPE = Math.abs(22.0 - latestPE) ;
  return differenceFromIdealPE;
};

RankingCalculations.prototype.isPBGood = function (companydata){
  const PBratio = companydata.PB;
  const latestPB = PBratio[0].PB;
  const differenceFromIdealPB = Math.abs(1.0 - latestPB);
  return differenceFromIdealPB;
};

RankingCalculations.prototype.isDEGood = function (companydata){
  const DEratio = companydata.DE;
  const latestDE = DEratio[0].DE;
  const differenceFromIdealDE = Math.abs(1.5 - latestDE);
  return differenceFromIdealDE;
};

RankingCalculations.prototype.isCRGood = function (companydata){
  const CRratio = companydata.CR;
  const latestCR = CRratio[0].CR;
  const differenceFromIdealCR = Math.abs(1.2 - latestCR);
  return differenceFromIdealCR;
};

RankingCalculations.prototype.isROEGood = function (companydata){
  const ROEratio = companydata.ROE;
  const latestROE = ROEratio[0].ROE;
  const differenceFromIdealROE = Math.abs(15.0 - latestROE);
  return differenceFromIdealROE;
};

RankingCalculations.prototype.isPEGGood = function (companydata){
  const PEGratio = companydata.PEG;
  const latestPEG = PEGratio[0].PEG;
  const differenceFromIdealPEG = Math.abs(1.0 - latestPEG);
  return differenceFromIdealPEG;
};

module.exports = RankingCalculations;
