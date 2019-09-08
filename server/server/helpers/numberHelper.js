const numberHelper = {
  round: (decimal, digits = 2) => {
    return parseFloat(decimal.toFixed(2));
  },
  toCents: (num = 0) => (num * 100)
};

module.exports = numberHelper;
