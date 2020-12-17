import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CoverUploadComponent } from './cover-upload.component';
import { FileUploadInputDirective } from './file-upload-input.directive';
import { FileUploadPreviewItemComponent } from './file-upload-preview/file-upload-preview-item/file-upload-preview-item.component';
import { FileUploadPreviewListComponent } from './file-upload-preview/file-upload-preview-list/file-upload-preview-list.component';
import { FileUploadPreviewDirective } from './file-upload-preview/file-upload-preview.directive';
import { FileUploadService } from './file-upload.service';
import { HelperUploadCoverService } from './helper-upload-cover.service';
import { HelperUploadShardService } from './helper-upload-shard.service';
import { UserInterfaceModule } from '../../../modules/user.interface/user.interface.module';

const components = [
    CoverUploadComponent,
    FileUploadInputDirective,
    FileUploadPreviewDirective,
    FileUploadPreviewListComponent,
    FileUploadPreviewItemComponent
];

@NgModule({
    declarations: components,
    exports: components,
    imports: [
        CommonModule,
        UserInterfaceModule
    ],
    providers: [
        FileUploadService,
        HelperUploadCoverService,
        HelperUploadShardService
    ]
})
export class FileUploadModule {}
