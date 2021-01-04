class PerformanceCalculator {
  constructor(performance, play) {
    this.performance = performance;
    this.play = play;
  }

  get amount() {
    throw new Error('subclass responsibility');
  }

  get volumeCredits() {
    return Math.max(this.performance.audience - 30, 0);
  }
}

class TragedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 40000;
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30);
    }
    return result;
  }
}

class ComedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 30000;
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20);
    }
    result += 300 * this.performance.audience;
    return result;
  }

  get volumeCredits() {
    return super.volumeCredits + Math.floor(this.performance.audience / 5);
  }
}

const createStatementData = (invoice, plays) => {
  const createPerformanceCalculator = (performance, play) => {
    switch (play.type) {
      case 'tragedy':
        return new TragedyCalculator(performance, play);
      case 'comedy':
        return new ComedyCalculator(performance, play);
      default:
        throw new Error(`unknown type: ${play.type}`);
    }
  };
  const playFor = (performance) => plays[performance.playID];

  const enrichPerformance = (performance) => {
    const calculator = createPerformanceCalculator(
      performance,
      playFor(performance)
    );
    const result = { ...performance };
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;
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
