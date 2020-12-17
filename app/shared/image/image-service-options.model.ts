import { ConfigurationService } from '../config/configuration.service';

export class ImageServiceOptions {
    default?: string = ConfigurationService.defaultImages.shard;
    format?: string = 'single';
    type?: string = 'shard';
    id: number;
}
