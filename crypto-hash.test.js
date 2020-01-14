const cryptoHash = require('./crypto.hash');

describe('cryptoHash()', () => {
  const shaOutput =
    'cef19622547f3effdd0f713d667e962215daaac9d6ec867fdbb68a33d1bf752c';

  it('should generate a sha-256 output', () => {
    expect(cryptoHash('adesewa')).toEqual(shaOutput);
  });

  it('produces the same hash with the same given inputs in any order', () => {
    expect(cryptoHash('foo', 'bar', 'duh')).toEqual(
      cryptoHash('bar', 'duh', 'foo')
    );
  });
});
