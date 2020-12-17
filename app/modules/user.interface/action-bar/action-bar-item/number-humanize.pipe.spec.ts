import { NumberHumanize } from './number-humanize.pipe';

describe('NumberHumanize:', () => {
    let pipe;

    beforeEach(() => {
        pipe = new NumberHumanize();
    });

    it('should return the original number as a string if < 1000', () => {
        const mockInput = 999;
        let transformed = pipe.transform(mockInput);
        expect(transformed).toBe(mockInput.toString());
        expect(typeof transformed).toBe('string');
    });

    it('should return the humanized number as a string with "k" suffix and 1 decimal if >= 1,000 and < 1,000,000', () => {
        const mockInput = 1234;
        let transformed = pipe.transform(mockInput);
        expect(transformed).toBe('1.2k');

        const newInput = 900444;
        transformed = pipe.transform(newInput);
        expect(transformed).toBe('900.4k');
    });

    it('should return the humanized number as a string with "m" suffix and 1 decimal if >= 1,000,000 and < 1,000,000,000', () => {
        const mockInput = 12340000;
        let transformed = pipe.transform(mockInput);
        expect(transformed).toBe('12.3m');

        const newInput = 900444000;
        transformed = pipe.transform(newInput);
        expect(transformed).toBe('900.4m');
    });

    it('should return the humanized number as a string with "b" suffix and 1 decimal if >= 1,000,000,000 and < 1,000,000,000,000', () => {
        const mockInput = 12340000000;
        let transformed = pipe.transform(mockInput);
        expect(transformed).toBe('12.3b');

        const newInput = 900444000000;
        transformed = pipe.transform(newInput);
        expect(transformed).toBe('900.4b');
    });

    it('should not return a decimal point when the decimal is 0', () => {
        const mockInput = 200000;
        let transformed = pipe.transform(mockInput);
        expect(transformed).toBe('200k');
    });
});
