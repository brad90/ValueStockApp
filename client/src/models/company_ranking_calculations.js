const PubSub = require('../helpers/pub_sub.js')
const RequestHelper = require('../helpers/request_helper.js')

const CompanyRankingCalculation = function(){};

CompanyRankingCalculation.prototype.isTheStockGoodOrBad = function(){
  PubSub.subscribe("all-company-data:All-company-ratios", (event) => {
    const fullCompanyData = event.detail
    console.log(event.detail);
    fullCompanyData.forEach(data => {
      console.log(data);
      const ratioEvaluation = { }
      ratioEvaluation['pe-evaluation'] = this.isPEGood(data)
      ratioEvaluation['pb-evaluaton'] = this.isPBGood(data)
      ratioEvaluation['de-evaluaton'] = this.isDEGood(data)
      ratioEvaluation['cr-evaluaton'] = this.isCRGood(data)
      ratioEvaluation['roe-evaluaton'] = this.isROEGood(data)
      ratioEvaluation['peg-evaluaton'] = this.isPEGGood(data)
      ratioEvaluation['total-evaluaton'] = this.isPEGGood(data) + this.isPBGood(data) + this.isDEGood(data) + this.isCRGood(data) + this.isROEGood(data) + this.isPEGGood(data)

    })
  })
}











CompanyRankingCalculation.prototype.isPEGood = function (companydata){
  const PEratio = companydata.PE;
  const latestPE = PEratio[0].PE;
  const differenceFromIdealPE = Math.abs(22.0 - latestPE) ;
  return differenceFromIdealPE;
};

CompanyRankingCalculation.prototype.isPBGood = function (companydata){
  const PBratio = companydata.PB;
  const latestPB = PBratio[0].PB;
  const differenceFromIdealPB = Math.abs(1.0 - latestPB);
  return differenceFromIdealPB;
};

CompanyRankingCalculation.prototype.isDEGood = function (companydata){
  const DEratio = companydata.DE;
  const latestDE = DEratio[0].DE;
  const differenceFromIdealDE = Math.abs(1.5 - latestDE);
  return differenceFromIdealDE;
};

CompanyRankingCalculation.prototype.isCRGood = function (companydata){
  const CRratio = companydata.CR;
  const latestCR = CRratio[0].CR;
  const differenceFromIdealCR = Math.abs(1.2 - latestCR);
  return differenceFromIdealCR;
};

CompanyRankingCalculation.prototype.isROEGood = function (companydata){
  const ROEratio = companydata.ROE;
  const latestROE = ROEratio[0].ROE;
  const differenceFromIdealROE = Math.abs(15.0 - latestROE);
  return differenceFromIdealROE;
};

CompanyRankingCalculation.prototype.isPEGGood = function (companydata){
  const PEGratio = companydata.PEG;
  const latestPEG = PEGratio[0].PEG;
  const differenceFromIdealPEG = Math.abs(1.0 - latestPEG);
  return differenceFromIdealPEG;
};

module.exports = CompanyRankingCalculation;
