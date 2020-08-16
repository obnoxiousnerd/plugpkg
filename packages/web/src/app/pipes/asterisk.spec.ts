import { AsteriskPipe } from './asterisk.pipe';

describe('AsteriskPipe', () => {
  it('create an instance', () => {
    const pipe = new AsteriskPipe();
    expect(pipe).toBeTruthy();
  });
  it('changes all letters, numbers and symbols to stars', () => {
    const text = 'aA0!';
    const asteriskedText = new AsteriskPipe().transform(text);
    expect(text.length).toBe(asteriskedText.length);
    expect(asteriskedText).toBe('****');
  });
});
