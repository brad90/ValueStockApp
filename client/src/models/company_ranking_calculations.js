const PubSub = require('../helpers/pub_sub.js')
const RequestHelper = require('../helpers/request_helper.js')

const CompanyRankingCalculation = function(){};

CompanyRankingCalculation.prototype.isTheStockGoodOrBad = function(){
  PubSub.subscribe("all-company-data:All-company-ratios", (event) => {
    const fullCompanyData = event.detail
    fullCompanyData.forEach(data => {
      const ratioEvaluation = { }
      ratioEvaluation['pe-evaluation'] = this.isPEGood(data)
      ratioEvaluation['pb-evaluaton'] = this.isPBGood(data)
      ratioEvaluation['de-evaluaton'] = this.isDEGood(data)
      ratioEvaluation['cr-evaluaton'] = this.isCRGood(data)
      ratioEvaluation['roe-evaluaton'] = this.isROEGood(data)
      ratioEvaluation['peg-evaluaton'] = this.isPEGGood(data)
      console.log(ratioEvaluation);
    })
  })
}


CompanyRankingCalculation.prototype.isPEGood = function (companydata){
  const PEratio = companydata.PE;
  const latestPE = PEratio[0].PE;
  const differenceFromIdealPE = 22.0 - latestPE;
  return latestPE;
};

CompanyRankingCalculation.prototype.isPBGood = function (companydata){
  const PBratio = companydata.PB;
  const latestPB = PBratio[0].PB;
  const differenceFromIdealPB = 1 - latestPB;
  return latestPB;
};

CompanyRankingCalculation.prototype.isDEGood = function (companydata){
  const DEratio = companydata.DE;
  const latestDE = DEratio[0].DE;
  const differenceFromIdealDE = 1.5 - latestDE
  return latestDE;
};

CompanyRankingCalculation.prototype.isCRGood = function (companydata){
  const CRratio = companydata.CR;
  const latestCR = CRratio[0].CR;
  const differenceFromIdealCR = 1.2 - latestCR
  return latestCR;
};

CompanyRankingCalculation.prototype.isROEGood = function (companydata){
  const ROEratio = companydata.ROE;
  const latestROE = ROEratio[0].ROE;
  const differenceFromIdealCR = 15 - latestROE
  return latestROE;
};

CompanyRankingCalculation.prototype.isPEGGood = function (companydata){
  const PEGratio = companydata.PEG;
  const latestPEG = PEGratio[0].PEG;
  const differenceFromIdealCR = 1- latestPEG
  return latestPEG;
};

module.exports = CompanyRankingCalculation;
