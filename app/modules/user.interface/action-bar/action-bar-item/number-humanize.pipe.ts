//      * INPUT: {{ 123 | numberHumanize }}
//      * OUTPUT: '123'

//      * INPUT: {{ 1234 | numberHumanize }}
//      * OUTPUT: '1.2k'

//      * INPUT: {{ 1234567 | numberHumanize }}
//      * OUTPUT: '1.2m'

import { Pipe, PipeTransform } from '@angular/core';

import * as numeral from 'numeral';

@Pipe({
    name: 'numberHumanize'
})
export class NumberHumanize implements PipeTransform {
    transform(input: number) {
        const minInput = 1000;
        if (input >= minInput) {
            let humanized = numeral(input).format('0.0a');

            const humanizedSplitted = humanized.split('.');
            const suffix = humanizedSplitted[1].match('^0(\\D)$');
            if (suffix !== null) {
                humanized = humanizedSplitted[0] + suffix[1];
            }

            return humanized;
        } else {
            return input.toString();
        }
    }
}
