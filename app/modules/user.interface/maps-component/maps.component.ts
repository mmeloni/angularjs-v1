import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, Output, SimpleChange, ViewEncapsulation } from '@angular/core';

import { Feature, Map, geom, interaction, layer, proj, source, style  } from 'openlayers';

@Component({
    selector: 'wn-maps',
    styleUrls: ['./maps.component.scss'],
    templateUrl: './maps.component.html'
})
export class MapsComponent implements AfterViewInit, OnChanges {
    @Input() coordinates: string;
    @Input() icon: string;

    private host: ElementRef;
    private map: any;
    private zoom: number = 9;
    constructor(element: ElementRef) {
        this.host = element;
    }

    ngAfterViewInit(): any {
        const coords = this.coordinates.split(',');
        const rasterLayer = new layer.Tile({
            preload: 8,
            source: new source.OSM()
        });

        this.map = new Map({
            controls: [],
            interactions: interaction.defaults({ mouseWheelZoom: false, dragPan: false, doubleClickZoom: false }),
            layers: [
                rasterLayer,
                new layer.Tile({
                    source: new source.OSM()
                })
            ]
        });

        this.centerMap(parseFloat(coords[0]), parseFloat(coords[1]));
        this.map.setTarget(this.host.nativeElement.firstElementChild);
        this.map.updateSize();
    }

    ngOnChanges(changes: any): any {
        if (changes.coordinates.currentValue.toString() !== '0,0') {
            const coords = this.coordinates.split(',');
            const vectorLayer = this.setPoint(parseFloat(coords[0]), parseFloat(coords[1]));
            this.addPoint(vectorLayer);
            this.centerMap(parseFloat(coords[0]), parseFloat(coords[1]));
        }
    }

    centerMap(long, lat) {
        this.map.getView().setCenter(proj.transform([long, lat], 'EPSG:4326', 'EPSG:3857'));
        this.map.getView().setZoom(this.zoom);
    }

    addPoint(vectorLayer) {
        this.map.addLayer(vectorLayer);
    }

    setPoint(lon, lat): any {

        let iconFeatures = [];

        const iconFeature = new Feature({
            geometry: new geom.Point(proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'))
        });

        iconFeatures.push(iconFeature);

        const vectorSource = new source.Vector({
            features: iconFeatures
        });

        const iconStyle = new style.Style({
            image: new style.Icon(({
                src: '/assets/img/pin-place.png'
            }))
        });

        return new layer.Vector({
            source: vectorSource,
            style: iconStyle
        });
    }

    get Map(): any {
        return this.map;
    }

}
