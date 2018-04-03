import {ModalData, ModalService} from "./modal-service";

export class ModalComponent {

    modalData: ModalData;
    service: ModalService;

    destroy() {
        this.service.removeComponentFromBody(this.modalData.index);
    }
}