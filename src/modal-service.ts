import {
    ApplicationRef,
    ComponentFactoryResolver,
    ComponentRef,
    EmbeddedViewRef,
    Injectable,
    Injector
} from '@angular/core';
import {ModalComponent} from './modal-component';
import {ComponentFactory} from '@angular/core/src/linker/component_factory';

export interface CreatedModals {
    component: ComponentRef<any>;
    modalElement: HTMLElement;
}

@Injectable()
export class ModalService {
    componentRefArray: CreatedModals[] = [];

    constructor(private applicationRef: ApplicationRef,
                private injector: Injector,
                private factoryResolver: ComponentFactoryResolver) {
    }

    addDynamicComponent(dynamicComponent, data?: any, callback?: (response) => any) {
        const factory: ComponentFactory<ModalComponent> = this.factoryResolver.resolveComponentFactory(ModalComponent);

        const index: number = this.componentRefArray.length;
        const component: ComponentRef<ModalComponent> = factory.create(this.injector);

        component.instance.data = data;
        component.instance.dynamicComponent = dynamicComponent;
        component.instance.index = index;
        component.instance.service = this;
        component.instance.callback = callback;

        this.applicationRef.attachView(component.hostView);

        const domElem: HTMLElement = (component.hostView as EmbeddedViewRef<any>)
            .rootNodes[0] as HTMLElement;

        document.body.appendChild(domElem);
        this.componentRefArray.push({
            component,
            modalElement: domElem
        });
    }

    removeComponentFromBody(i) {
        this.applicationRef.detachView(this.componentRefArray[i].component.hostView);
        this.componentRefArray[i].component.destroy();
        this.componentRefArray[i].modalElement.remove();
        if (i === this.componentRefArray.length - 1) {
            this.componentRefArray.splice(i, 1);
        } else {
            this.componentRefArray[i] = undefined;
        }
    }
}
