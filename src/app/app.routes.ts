import { Routes } from '@angular/router';

import { SupplierOrderComponent } from './supplier/supplier-order/supplier-order.component';
import { SupplierListComponent } from './supplier/supplier-list/supplier-list.component';


export const routes: Routes = [

    {path: 'supplierOrder', component: SupplierOrderComponent},
    {path: 'supplierList', component: SupplierListComponent}

];
