import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../../../../shared/user/user.service';

@Component({
    selector: 'wn-modal-plan-shard',
    styleUrls: [ './modal-plan-shard.component.scss' ],
    templateUrl: 'modal-plan-shard.component.html'
})
export class ModalPlanShardComponent implements OnInit {
    @Input() componentData;
    styleBackgroundImage: any;
    loggedUser: any;

    constructor(private userService: UserService) {
        //
    }

    ngOnInit() {
        if (this.componentData.backgroundImageUrl !== undefined) {
            this.styleBackgroundImage = { backgroundImage: this.callFormatToCss(this.componentData.backgroundImageUrl) };
        }
        this.loggedUser = this.userService.getUser();
    }

    private callFormatToCss(img) {
        return `url('${img}')`;
    }
}
