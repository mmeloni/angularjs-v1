import { NumberToLimitedPipe } from './number-to-limited.pipe';

describe('NumberToLimitedPipe:', () => {
    let pipe;
    let mockPipeOptions;
    const maxInput = 9;

    beforeEach(() => {
        mockPipeOptions = {
            input: 9,
            suffix: 'foo'
        };

        pipe = new NumberToLimitedPipe();
    });

    it('should return the original number as a string if <= 9', () => {
        let transformed = pipe.transform(
            mockPipeOptions.input,
            mockPipeOptions.suffix
        );
        expect(transformed).toBe(mockPipeOptions.input.toString());
        expect(typeof transformed).toBe('string');
    });

    it('should return the limited number as a string if > 9', () => {
        const newInput = 111;
        let transformed = pipe.transform(
            newInput,
            mockPipeOptions.suffix
        );
        expect(transformed).toBe([maxInput, mockPipeOptions.suffix].join(''));

        transformed = pipe.transform(
            newInput,
            'bar'
        );
        expect(transformed).toBe([maxInput, 'bar'].join(''));
    });

    it('should use the default suffix if not specified', () => {
        const newInput = 111;
        let transformed = pipe.transform(
            newInput
        );
        expect(transformed).toBe([maxInput, '+'].join(''));
    });
});
