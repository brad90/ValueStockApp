const PubSub = require('../helpers/pub_sub.js')
const RequestHelper = require('../helpers/request_helper.js')
const GetCompanyDataDB = require('./getCompanyDataDB.js')


const RankingCalculations= function(){
    this.request = new RequestHelper('http://localhost:3000/api/stocks')
};

let fullCompanyInfoNumber = 0
let fullCompanyInfo

RankingCalculations.prototype.bindEvents = function(){
    this.isTheStockGoodOrBad()
};


RankingCalculations.prototype.isTheStockGoodOrBad = function(){
    PubSub.subscribe("fullcompanyinfo", (event) => {
        const allCompanies = event.detail
    
        let totalNumberOfCompanies = allCompanies.length

        allCompanies.forEach(data => {
            const ratioEvaluation = { }
            const total_evaluation = this.isPEGGood(data) + this.isPBGood(data) + this.isDEGood(data) + this.isROEGood(data) + this.isPEGGood(data) + this.isEYGood(data)
            ratioEvaluation['total_evaluation'] = total_evaluation
            ratioEvaluation['pe_evaluation'] = this.isPEGood(data)
            ratioEvaluation['pb_evaluaton'] = this.isPBGood(data)
            ratioEvaluation['de_evaluaton'] = this.isDEGood(data)
            ratioEvaluation['cr_evaluaton'] = this.isCRGood(data)
            ratioEvaluation['roe_evaluaton'] = this.isROEGood(data)
            ratioEvaluation['ey_evaluaton'] = this.isEYGood(data)
            ratioEvaluation['peg_evaluaton'] = this.isPEGGood(data)
            this.request.patch(data._id, ratioEvaluation)
            .then((data) => {
                fullCompanyInfo = data
                fullCompanyInfoNumber += 1
            }).then(() => {
                if(fullCompanyInfoNumber == totalNumberOfCompanies){
                    PubSub.publish("fullCompanyInfoWithTotal", fullCompanyInfo)
                }
            })
        })
    })
};




RankingCalculations.prototype.isPEGood = function(companydata){
    let PEratio = companydata.PE
    if(PEratio != undefined){
        PEratio = PEratio[0]
        const latestPE = PEratio.PE;
        const differenceFromIdealPE = Math.abs(22.0 - latestPE)
        return differenceFromIdealPE;
    }
    console.log('error');
};

RankingCalculations.prototype.isPBGood = function(companydata){
    let PBratio = companydata.PB
    if(PBratio != undefined){
        PBratio = PBratio[0]
        const latestPB = PBratio.PB;
        const differenceFromIdealPB = Math.abs(1.0 - latestPB)
        return differenceFromIdealPB;
    }
    console.log('error');
};

RankingCalculations.prototype.isDEGood = function(companydata){
    let DEratio = companydata.DE
    if(DEratio != undefined){
        DEratio = DEratio[0]
        const latestDE = DEratio.DE;
        const differenceFromIdealDE = Math.abs(1.5 - latestDE)
        return differenceFromIdealDE;
    }
    console.log('error');
};

RankingCalculations.prototype.isEYGood = function (companydata){
    let EYratio = companydata.EY
    if(EYratio != undefined){
        EYratio = EYratio[0]
        const latestEY = EYratio.EY;
        const differenceFromIdealEY = Math.abs(1.5 - latestEY)
        return differenceFromIdealEY;
    }
    console.log('error');
};

RankingCalculations.prototype.isCRGood = function (companydata){
    let CRratio = companydata.CR
    if(CRratio != undefined){
        CRratio = CRratio[0]
        const latestCR = CRratio.CR
        const differenceFromIdealCR = Math.abs(1.5 - latestCR)
        return differenceFromIdealCR;
    }
    console.log('error');
};

RankingCalculations.prototype.isROEGood = function (companydata){
    let NIratio = companydata.ROE
    if(NIratio != undefined){
        NIratio = NIratio[0].NI
        const latestROE = NIratio
        const differenceFromIdealROE = Math.abs(0.15 - latestROE);
        return differenceFromIdealROE;
    }
    console.log('error');
};

RankingCalculations.prototype.isPEGGood = function (companydata){
    let PEGratio = companydata.PEG
    if(PEGratio != undefined){
        PEGratio = PEGratio[0]
        const latestPEG = PEGratio.PEG;
        const differenceFromIdealPEG = Math.abs(1.0 - latestPEG);
        return differenceFromIdealPEG;
    }
    console.log('error');
};

module.exports = RankingCalculations;
