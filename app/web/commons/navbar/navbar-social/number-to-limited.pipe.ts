//      * INPUT: {{ 123 | numberToLimited }}
//      * OUTPUT: '9+'

//      * INPUT: {{ 123 | numberToLimited:'foo' }}
//      * OUTPUT: '9foo'

//      * INPUT: {{ 8 | numberToLimited }}
//      * OUTPUT: '8'

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'numberToLimited'
})
export class NumberToLimitedPipe implements PipeTransform {
    transform(input: number, suffix: string = '+') {
        const maxInput = 9;
        if (input <= maxInput) {
            return input.toString();
        } else {
            input = maxInput;
            return [input, suffix].join('');
        }
    }
}
