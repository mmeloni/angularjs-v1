import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBannerComponent } from './top-banner.component';

@NgModule({
    declarations: [ TopBannerComponent ],
    exports: [ TopBannerComponent ],
    imports: [ CommonModule ]
})
export class TopBannerModule {}
