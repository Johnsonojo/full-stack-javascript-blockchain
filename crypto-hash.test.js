const cryptoHash = require('./crypto.hash');

describe('cryptoHash()', () => {
  const shaOutput =
    '0e90b114d4d67232220f7444ab9c02edfd3cc6d4678496f206cd304d8ecda3ce';

  it('should generate a sha-256 output', () => {
    expect(cryptoHash('ademi')).toEqual(shaOutput);
  });

  it('produces the same hash with the same given inputs in any order', () => {
    expect(cryptoHash('foo', 'bar', 'duh')).toEqual(
      cryptoHash('bar', 'duh', 'foo')
    );
  });
});
