import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
    selector: '[wnFileUploadPreview]'
})
export class FileUploadPreviewDirective implements OnChanges {
    @Input() wnFileUploadPreview: File;
    // William: I couldn't find out how to make Angular detect the new img and apply CSS properties defined in the parent component.
    // So to get the job done, I'm here passing style properties as a input.
    // You are welcome to improve this if you know a solution
    @Input() wnFileUploadPreviewStyle: string;

    private imgElement: HTMLImageElement;

    constructor(private element: ElementRef) {
        this.initImgElement();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes[ 'wnFileUploadPreview' ] !== undefined && changes[ 'wnFileUploadPreview' ].currentValue !== null) {
            this.updatePreview(changes[ 'wnFileUploadPreview' ].currentValue);
        }
    }

    private updatePreview(file: File) {
        this.imgElement.addEventListener('load', () => {
            URL.revokeObjectURL(this.imgElement.getAttribute('src'));
            this.imgElement.setAttribute('style', this.wnFileUploadPreviewStyle);
        });

        this.imgElement.setAttribute('src', URL.createObjectURL(file));
    }

    private initImgElement() {
        this.imgElement = document.createElement('img');
        this.imgElement.setAttribute('style', 'display: none;');

        this.element.nativeElement.appendChild(this.imgElement);
    }
}
