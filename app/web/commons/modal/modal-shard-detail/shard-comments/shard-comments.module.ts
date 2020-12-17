import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ShardCommentsFormComponent } from './shard-comments-form/shard-comments-form.component';
import { ShardCommentsItemComponent } from './shard-comments-list/shard-comments-item/shard-comments-item.component';
import { ShardCommentsListComponent } from './shard-comments-list/shard-comments-list.component';
import { ShardCommentsComponent } from './shard-comments.component';
import { ShardCommentsService } from './shard-comments.service';
import { UserInterfaceModule } from '../../../../../modules/user.interface/user.interface.module';

const components = [
    ShardCommentsComponent,
    ShardCommentsListComponent,
    ShardCommentsFormComponent,
    ShardCommentsItemComponent
];

@NgModule({
    declarations: components,
    exports: components,
    imports: [
        CommonModule,
        UserInterfaceModule,
        FormsModule
    ],
    providers: [
        ShardCommentsService
    ]
})
export class ShardCommentsModule {
}
