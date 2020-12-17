import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User } from '../../shared/user/user.model';
import { Shard } from '../../shared/shard/shard.model';
import { ModalService } from '../../web/commons/modal/modal-commons/modal.service';
import { ShardService } from '../../shared/shard/shard.service';
import { LoadingStateService } from '../../loading-state.service';

@Directive({
    selector: '[wnShardDetailOpen]'
})
export class ShardDetailOpenDirective implements OnInit {
    @Input() wnShardDetailOpen: number; // shardId
    @Input() wnShardDetailUser: User; // currentUser

    private getShardById$: Observable<Shard>;
    private isLoading: boolean = false;

    constructor(private modalService: ModalService,
                private shardService: ShardService,
                private elementRef: ElementRef,
                private loadingStateService: LoadingStateService) {
        elementRef.nativeElement.style.cursor = 'pointer';
    }

    ngOnInit() {
        if (this.getShardById$ === undefined) {
            this.getShardById$ = this.shardService.getShardById$(this.wnShardDetailOpen).publishLast().refCount();
        }
    }

    @HostListener('click', [ '$event' ]) onClick(event: Event) {
        if (this.isLoading === true) { // prevent re-fireing the upstream click event if currently loading
            event.stopPropagation();
        } else {
            this.isLoading = true;
            this.loadingStateService.startLoading();

            this.getShardById$.subscribe(
                (shard: Shard) => {
                    this.modalService.openShardDetail(shard, this.wnShardDetailUser);
                },
                () => {
                    //
                },
                () => {
                    this.isLoading = false;
                    this.loadingStateService.stopLoading();
                });
        }
    }
}
