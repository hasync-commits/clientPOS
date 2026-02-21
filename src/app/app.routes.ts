import { Routes } from '@angular/router';

import { SupplierOrderComponent } from './supplier/supplier-order/supplier-order.component';
import { SupplierListComponent } from './supplier/supplier-list/supplier-list.component';
import { PurchaseOrderComponent } from './purchase/purchase-order/purchase-order.component';
import { PurchaseListComponent } from './purchase/purchase-list/purchase-list.component';

import { PurchaseReportComponent } from './reports/purchase-report/purchase-report.component';

export const routes: Routes = [

    {path: 'supplierOrder', component: SupplierOrderComponent},
    {path: 'supplierList', component: SupplierListComponent},
    {path: 'purchaseOrder', component: PurchaseOrderComponent},
    {path: 'purchaseList', component: PurchaseListComponent},
    {path: 'purchaseReport', component: PurchaseReportComponent},


];
