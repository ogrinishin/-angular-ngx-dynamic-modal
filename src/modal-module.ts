import {ModalService} from "./modal-service";
import {ModuleWithProviders, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

@NgModule({
    imports: [
        CommonModule,
    ],
    providers: [
        ModalService,
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
})
export class ModalModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: ModalModule,
            providers: [
                ModalService
            ]
        };
    }
}