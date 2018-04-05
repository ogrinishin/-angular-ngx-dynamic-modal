import {ModalService} from './modal-service';
import {
    animate,
    Component, ComponentFactoryResolver, Directive, ElementRef, Input, OnInit, state, style, transition, trigger, ViewChild,
    ViewContainerRef
} from '@angular/core';

@Directive({
    selector: '[ad-host]',
})
export class AdDirective {
    constructor(public viewContainerRef: ViewContainerRef) {
    }
}

@Component({
    selector: 'modal-wrapper',
    template: `
        <div class="modal" [id]="id">
            <div [@backgroundAnim]="{value: state, params: {transition: transition}}"
                 #background class="modal__background" (click)="close($event)">
                <div [@window]="{value: states, params: {transition: transition}}" class="modal__window">
                    <ng-template ad-host></ng-template>
                </div>
            </div>
        </div>
    `,
    animations: [
        trigger('window', [
            state('inactive', style({
                transform: 'translate3d(0, 50px, 0)',
                opacity: '0'
            })),
            state('active', style({
                transform: 'translate3d(0, 0, 0)',
                opacity: '1'
            })),
            transition('inactive => active', animate('{{transition}}ms ease-in')),
            transition('active => inactive', animate('{{transition}}ms ease-out'))
        ]),
        trigger('backgroundAnim', [
            state('inactive', style({
                background: 'transparent'
            })),
            state('active', style({
                background: 'rgba(0, 0, 0, 0.18)'
            })),
            transition('inactive => active', animate('{{transition}}ms ease-in')),
            transition('active => inactive', animate('{{transition}}ms ease-out'))
        ])
    ],
    styles: [
            `.modal__background {
            position: fixed;
            left: 0;
            background: transparent;
            top: 0;
            z-index: 1;
            width: 100vw;
            height: 100vh;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
        }`,
            `.modal__window {
            cursor: auto;
            background: #fff;
            padding: 15px;
            border-radius: 6px;
            overflow: auto;
            max-width: 90%;
            max-height: 90%;
            transform: translate3d(0, 50px, 0);
            transition: 150ms;
            opacity: 0;
        }`
    ]
})
export class ModalComponent implements OnInit {
    service: ModalService;
    @Input() data: any;
    @Input() dynamicComponent: any;
    @Input() index: any;
    callback: (response) => any;
    @ViewChild(AdDirective) adHost: AdDirective;
    @ViewChild('background') background: ElementRef;
    state: string = 'inactive';
    states: string = 'inactive';
    transition: number = 150;
    id: string;

    private closingCounter: number = 0;

    constructor(private componentFactoryResolver: ComponentFactoryResolver) {
    }

    close(event?) {
        if (!event || event.target == this.background.nativeElement) {
            this.state = 'inactive';
            this.states = 'inactive';
            this.closingCounter++;
            const closingCounterScoped = this.closingCounter;
            setTimeout(() => {
                console.log(closingCounterScoped === this.closingCounter);
                if ((!event || event.target == this.background.nativeElement) && closingCounterScoped === this.closingCounter) this.service.removeComponentFromBody(this.index);
            }, this.transition);
        }
    }

    ngOnInit() {
        setTimeout(() => {
            this.state = 'active';
            this.states = 'active';
        });
        this.id = 'modal-' + this.index;
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.dynamicComponent);

        let componentRef = this.adHost.viewContainerRef.createComponent(componentFactory);
        (<any>componentRef.instance).data = this.data;
        (<any>componentRef.instance).close = this.close.bind(this);
        if (this.callback) (<any>componentRef.instance).applyCallback = this.callback.bind(this);
    }
}

export class ModalExtended {
    close(): void {
    };

    applyCallback(response): void {
    };


}