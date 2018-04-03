import {
    ApplicationRef,
    ComponentFactoryResolver,
    ComponentRef,
    EmbeddedViewRef,
    Injectable,
    Injector
} from '@angular/core';

export interface CreatedModals {
    component: ComponentRef<any>;
    modalElement: HTMLElement;
}

export interface ModalData {
    data: any;
    index: number;
}

@Injectable()
export class ModalService {
    componentRefArray: CreatedModals[] = [];

    constructor(private applicationRef: ApplicationRef,
                private injector: Injector,
                private factoryResolver: ComponentFactoryResolver) {
    }

    addDynamicComponent(dynamicComponent: any, data?: any) {
        const factory = this.factoryResolver.resolveComponentFactory(dynamicComponent),
            index = this.componentRefArray.length,
            component = factory.create(this.injector);

        (<any>component.instance).modalData = {data, index: index};
        (<any>component.instance).service = this;
        this.applicationRef.attachView(component.hostView);

        const domElem = (component.hostView as EmbeddedViewRef<any>)
            .rootNodes[0] as HTMLElement;

        this.createDOMCover(domElem, index, component);
    }

    createDOMCover(domElem: HTMLElement, index: number, component: any) {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.id = `modal-${index}`;
        const modalBackground = document.createElement('div');
        modalBackground.classList.add('modal__background');
        const self = this;
        modalBackground.addEventListener('click', function (e) {
            if (Object.is((e.target as HTMLElement), this)) {
                self.removeComponentFromBody(index);
                this.parentElement.remove();
            }
        });
        const modalWindow = document.createElement('div');
        modalWindow.classList.add('modal__window');

        modalWindow.appendChild(domElem);
        modalBackground.appendChild(modalWindow);
        modal.appendChild(modalBackground);
        document.body.appendChild(modal);
        this.componentRefArray.push({
            component,
            modalElement: modal
        });
    }

    removeComponentFromBody(i: number) {
        this.applicationRef.detachView(this.componentRefArray[i].component.hostView);
        this.componentRefArray[i].component.destroy();
        this.componentRefArray[i].modalElement.remove();
    }
}
