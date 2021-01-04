const { createStatementData } = require('./createStatementData');

const renderPlainText = (data) => {
  const usd = (aNumber) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(aNumber);
  };

  let result = `Statement for ${data.customer}\n`;

  result = data.performances.reduce(
    (accumulator, perf) =>
      `${accumulator}  ${perf.play.name}: ${usd(perf.amount / 100)} (${
        perf.audience
      } seats)\n`,
    result
  );

  result += `Amount owed is ${usd(data.totalAmount / 100)}\n`;
  result += `You earned ${data.totalVolumeCredits} credits\n`;
  return result;
};

const statement = (invoice, plays) => {
  return renderPlainText(createStatementData(invoice, plays));
};

module.exports = {
  statement,
};
