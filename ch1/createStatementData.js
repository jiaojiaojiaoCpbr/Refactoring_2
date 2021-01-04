class PerformanceCalculator {
  constructor(performance, play) {
    this.performance = performance;
    this.play = play;
  }

  get amount() {
    let result = 0;
    switch (this.play.type) {
      case 'tragedy':
        result = 40000;
        if (this.performance.audience > 30) {
          result += 1000 * (this.performance.audience - 30);
        }
        break;
      case 'comedy':
        result = 30000;
        if (this.performance.audience > 20) {
          result += 10000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        break;
      default:
        throw new Error(`unknown type: ${this.play.type}`);
    }
    return result;
  }
}

const createStatementData = (invoice, plays) => {
  const playFor = (performance) => plays[performance.playID];

  const volumeCreditsFor = (performance) => {
    let result = 0;
    // add volume credits
    result += Math.max(performance.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if (performance.play.type === 'comedy') {
      result += Math.floor(performance.audience / 5);
    }

    return result;
  };

  const enrichPerformance = (performance) => {
    const calculator = new PerformanceCalculator(
      performance,
      playFor(performance)
    );
    const result = { ...performance };
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredits = volumeCreditsFor(result);
    return result;
  };

  const totalAmount = (data) => {
    return data.performances.reduce((acc, perf) => acc + perf.amount, 0);
  };

  const totalVolumeCredits = (data) => {
    return data.performances.reduce((acc, perf) => acc + perf.volumeCredits, 0);
  };

  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);
  return statementData;
};

module.exports = {
  createStatementData,
};
