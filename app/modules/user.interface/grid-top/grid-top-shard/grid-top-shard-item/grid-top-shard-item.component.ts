import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageServiceOptions } from '../../../../../shared/image/image-service-options.model';
import { ShardService } from '../../../../../shared/shard/shard.service';
import { UserService } from '../../../../../shared/user/user.service';
import { ModalService } from '../../../../../web/commons/modal/modal-commons/modal.service';
import { User } from '../../../../../shared/user/user.model';
import { ConfigurationService } from '../../../../../shared/config/configuration.service';

@Component({
    selector: 'wn-grid-top-shard-item',
    styleUrls: [ './grid-top-shard-item.component.scss' ],
    templateUrl: 'grid-top-shard-item.component.html'
})
export class GridTopShardItemComponent implements OnInit {
    @Input() componentData: any;
    @Input() variant: string = 'grid';
    @Input() translations: any;

    shardBackgroundOptions: ImageServiceOptions;
    shardIconClasses: string;

    // turkish workaround to avoid linting errors about template variables that are not declarated as class property
    popoverUser: any;
    popoverPlace: any;

    // NOTE SIMO: PORTED IN NEW LIKE BUTTON COMPONENT AND HELPER SERVICES, delete it when spreading component everywhere
    likeIconClasses: string;
    currentUser: User;

    private currentUserNid: number;

    constructor(private ngbModal: NgbModal,
                private shardService: ShardService,
                private userService: UserService,
                private modalService: ModalService) {
        this.plan = this.plan.bind(this);

        // NOTE SIMO: PORTED IN NEW LIKE BUTTON COMPONENT AND HELPER SERVICES, delete it when spreading component everywhere
        this.toggleLike = this.toggleLike.bind(this);
        this.currentUser = this.userService.getUser();
        this.currentUserNid = this.currentUser.nid;
    }

    ngOnInit() {
        this.shardBackgroundOptions = new ImageServiceOptions();
        this.shardBackgroundOptions.id = this.componentData.masterId;

        const shardIconSuffix = ConfigurationService.linkedPlaceType[ this.componentData.bit ];

        this.shardIconClasses = `wn-icon wn-icon-${shardIconSuffix} wn-icon-${shardIconSuffix}-color`;

        // NOTE SIMO: PORTED IN NEW LIKE BUTTON COMPONENT AND HELPER SERVICES, delete it when spreading component everywhere
        this.likeIconClasses = this.componentData.likeUser === true ? this.setButtonToLike() : this.setButtonToUnlike();
    }

    plan() {
        this.modalService.openPlan(this.componentData);
    }

    // NOTE SIMO: PORTED IN NEW LIKE BUTTON COMPONENT AND HELPER SERVICES, delete it when spreading component everywhere
    toggleLike() {
        const shardId = this.componentData.id;
        this.updateByIsLiked();
        this.shardService.toggleLike(shardId)
            .then((response) => {
                if (response.status === true) {
                    this.likeIconClasses = this.setButtonToLike();
                } else {
                    this.likeIconClasses = this.setButtonToUnlike();
                }
            })
            .catch((error) => {
                this.updateByIsLiked();
            });
    }

    private updateByIsLiked() {
        this.componentData.likeUser = !this.componentData.likeUser;
        this.likeIconClasses = this.toggleSetButton(this.componentData.likeUser);
    }

    private toggleSetButton(isLiked: Boolean) {
        if (isLiked === true) {
            return this.setButtonToUnlike();
        } else {
            return this.setButtonToLike();
        }
    }

    private setButtonToUnlike() {
        return 'wn-icon wn-icon-like wn-icon-like-color';
    }

    private setButtonToLike() {
        return 'wn-icon wn-icon-like';
    }
}
