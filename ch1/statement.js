const renderPlainText = (data) => {
  const usd = (aNumber) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(aNumber);
  };

  const totalAmount = () => {
    let result = 0;

    for (let i = 0; i < data.performances.length; i += 1) {
      const perf = data.performances[i];
      result += perf.amount;
    }
    return result;
  };

  const totalVolumeCredits = () => {
    let result = 0;
    for (let i = 0; i < data.performances.length; i += 1) {
      const perf = data.performances[i];

      result += perf.volumeCredits;
    }

    return result;
  };

  let result = `Statement for ${data.customer}\n`;
  for (let i = 0; i < data.performances.length; i += 1) {
    const perf = data.performances[i];
    result += `  ${perf.play.name}: ${usd(perf.amount / 100)} (${
      perf.audience
    } seats)\n`;
  }

  result += `Amount owed is ${usd(totalAmount() / 100)}\n`;
  result += `You earned ${totalVolumeCredits()} credits\n`;
  return result;
};

const createStatementData = (invoice, plays) => {
  const playFor = (performance) => plays[performance.playID];

  const amountFor = (performance) => {
    let result = 0;
    switch (performance.play.type) {
      case 'tragedy':
        result = 40000;
        if (performance.audience > 30) {
          result += 1000 * (performance.audience - 30);
        }
        break;
      case 'comedy':
        result = 30000;
        if (performance.audience > 20) {
          result += 10000 + 500 * (performance.audience - 20);
        }
        result += 300 * performance.audience;
        break;
      default:
        throw new Error(`unknown type: ${performance.play.type}`);
    }
    return result;
  };

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
    const result = { ...performance };
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
    return result;
  };

  const totalAmount = (data) => {
    let result = 0;

    for (let i = 0; i < data.performances.length; i += 1) {
      const perf = data.performances[i];
      result += perf.amount;
    }
    return result;
  };

  const totalVolumeCredits = (data) => {
    let result = 0;
    for (let i = 0; i < data.performances.length; i += 1) {
      const perf = data.performances[i];

      result += perf.volumeCredits;
    }

    return result;
  };

  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);
  return statementData;
};

const statement = (invoice, plays) => {
  return renderPlainText(createStatementData(invoice, plays));
};

module.exports = {
  statement,
};
