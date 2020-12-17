import { RawParams, StateDeclaration } from 'ui-router-ng2';

import { ImageServiceOptions } from '../../../../shared/image/image-service-options.model';

export class ToastActionableOptions {
    toState: StateDeclaration;
    toParams: RawParams;
    imageOptions: ImageServiceOptions;
}
