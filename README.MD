# Angular dynamic modal
Simple creating of modal from any (REALLY ANY) component

## Installation
```sh
npm install ngx-dynamic-modal --save
```

## Usage
### Angular 2+

####Module with needed parent component
```typescript
import {ModalModule} from 'ngx-dynamic-modal';
@NgModule({
    imports: [ModalModule]
})
export class AppModule{};
```

####Parent component
```typescript
import {ModalService} from 'ngx-dynamic-modal';
import {ChildComponent} from './child-component';

@Component({
    //...
})
export class ParentComponent {
    constructor(private modalService: ModalService) {}

    callback(res) {
        console.log(res)
    }

    openModal() {
        const data = {a: 1, b: 2};
        this.modalService.addDynamicComponent(ChildComponent, {data}, (res) => {
            this.callback(res)
        })
    }
};
```
####Child component
```typescript
import {ModalComponent} from 'ngx-dynamic-modal';

@Component({
    //...
})
export class ChildComponent extends ModalExtended implements OnInit {

    constructor(){
        super();
    }

    ngOnInit() {
        //get data
        console.log(this.data); //{a: 1, b: 2}
    }

    onExit(){
        //to run callback
        this.applyCallback('any data');
        //to destroy modal component
        this.close();
    }
};
```

