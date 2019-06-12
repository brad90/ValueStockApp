const PubSub = require('../helpers/pub_sub.js')
const RequestHelper = require('../helpers/request_helper.js')
const GetCompanyDataDB = require('./getCompanyDataDB.js')


const RankingCalculations= function(){
  this.request = new RequestHelper('http://localhost:3000/api/stocks')
};


RankingCalculations.prototype.isTheStockGoodOrBad = function(){
  PubSub.subscribe("GetCompanyDataDB:Full-company-data", (event) => {
    const companies= event.detail
    companies.forEach(data => {
      console.log(data);

      const ratioEvaluation = { }
      ratioEvaluation['pe_evaluation'] = this.isPEGood(data)
      ratioEvaluation['pb_evaluaton'] = this.isPBGood(data)
      ratioEvaluation['de_evaluaton'] = this.isDEGood(data)
      ratioEvaluation['cr_evaluaton'] = this.isCRGood(data)
      ratioEvaluation['roe_evaluaton'] = this.isROEGood(data)
      ratioEvaluation['peg_evaluaton'] = this.isPEGGood(data)
      const total_evaluation = this.isPEGGood(data) + this.isPBGood(data) + this.isDEGood(data) + this.isCRGood(data) + this.isROEGood(data) + this.isPEGGood(data)
      ratioEvaluation['total_evaluation'] = total_evaluation
      this.request.patch(data._id, ratioEvaluation)
    })
  })
};



RankingCalculations.prototype.isPEGood = function (companydata){

  console.log(companydata);

  let PEratio = companydata.PE;
  if(PEratio != undefined){
    PEratio = PEratio[0]
    const latestPE = PEratio.PE;
    // const differenceFromIdealPE = Math.abs(22.0 - latestPE) ;
    const differenceFromIdealPE = parseFloat(latestPE).toFixed(2) ;
    return differenceFromIdealPE;
  }
  console.log('error');
};

RankingCalculations.prototype.isPBGood = function (companydata){
  let PBratio = companydata.PB
  if(PBratio != undefined){
    PBratio = PBratio[0]
    const latestPB = PBratio.PB;
    const differenceFromIdealPB = parseFloat(latestPB).toFixed(2);
    // const differenceFromIdealPB = Math.abs(1.0 - latestPB);
    return differenceFromIdealPB;
  }
  console.log('error');
};

RankingCalculations.prototype.isDEGood = function (companydata){
  let DEratio = companydata.DE;
  if(DEratio != undefined){
    DEratio = DEratio[0]
    const latestDE = DEratio.DE;
    // const differenceFromIdealDE = Math.abs(1.5 - latestDE);
    const differenceFromIdealDE =  parseFloat(latestDE).toFixed(2);
    return differenceFromIdealDE;
  }
  console.log('error');
};

RankingCalculations.prototype.isCRGood = function (companydata){
  let CRratio = companydata.CR;
  if(CRratio != undefined){
    CRratio = CRratio[0]
    const latestCR = CRratio.CR;
    // const differenceFromIdealCR = Math.abs(1.2 - latestCR);
    const differenceFromIdealCR = parseFloat(latestCR).toFixed(2);
    return differenceFromIdealCR;
  }
  console.log('error');
};

RankingCalculations.prototype.isROEGood = function (companydata){
  let ROEratio = companydata.ROE;
  if(ROEratio != undefined){
    ROEratio = ROEratio[0]
    const latestROE = ROEratio.ROE;
    // const differenceFromIdealROE = Math.abs(0.15 - latestROE);
    const differenceFromIdealROE = parseFloat(latestROE).toFixed(2);
    return differenceFromIdealROE;
  }
  console.log('error');
};

RankingCalculations.prototype.isPEGGood = function (companydata){
  let PEGratio = companydata.PEG
  if(PEGratio != undefined){
    PEGratio = PEGratio[0]
    const latestPEG = PEGratio.PEG;
    // const differenceFromIdealPEG = Math.abs(1.0 - latestPEG);
    const differenceFromIdealPEG = parseFloat(latestPEG).toFixed(2);
    return differenceFromIdealPEG;
  }
  console.log('error');
};

module.exports = RankingCalculations;