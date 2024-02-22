import { Component, ViewChild, WritableSignal, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AlertSnackbarTypeEnumEntity } from '../../../../3.transversal/3.0.entity/alert.snackbar.entity';
import { UtilDefaultAlertSnackbarDuration, UtilDefaultFormatDate, UtilDefaultPageOptions } from '../../../../3.transversal/3.1.util/util.constant';
import { RootPage } from '../../root.page/root.page';
import { UtilTableConfig } from '../../../../3.transversal/3.1.util/util.table.config';
import { PaginationEntity } from '../../../../3.transversal/3.0.entity/pagination.entity';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductsPageAdd } from '../products.page.add/products.page.add';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AlertSnackbarComponent } from '../../../1.0.component/alert.snackbar.component/alert.snackbar.component';
import { ContractNetworkingProductOutput, ContractNetworkingUpdateProductStatusOutput } from '../../../../2.repository/2.1.contract/contract.networking.product';
import { ProductsContextualMenuEntity, ProductsEntity } from '../../../../3.transversal/3.0.entity/products.entity';
import { NetworkingProduct } from '../../../../2.repository/2.3.networking/networking.product';
import { ProductStatusEnum, ProductStatusFilterEnum } from '../../../../3.transversal/3.4.enum/product.status.enum';

@Component({
    selector: 'products-page-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatTooltipModule,
        MatTableModule,
        MatPaginatorModule,
        RootPage,
        MatProgressBarModule,
        MatButtonModule,
        MatNativeDateModule,
        MatSelectModule,
        MatDialogModule,
        ProductsPageAdd,
        MatMenuModule,
        MatDividerModule,
        MatSnackBarModule
    ],
    templateUrl: './products.page.list.html',
    styleUrl: './products.page.list.scss',
    animations: [
        trigger('filterInOut', [
            state('showFilter', style({
                overflow: 'hidden',
                height: '150px'
            })),
            state('hideFilter', style({
                overflow: 'hidden',
                height: '50px'
            })),
            transition('showFilter => hideFilter', animate('200ms ease-in-out')),
            transition('hideFilter => showFilter', animate('200ms ease-in-out'))
        ]),
        trigger('tableInOut', [
            state('showTable', style({
                overflow: 'hidden',
                height: 'calc(100% - 170px)'
            })),
            state('hideTable', style({
                overflow: 'hidden',
                height: 'calc(100% - 70px)'
            })),
            transition('showTable => hideTable', animate('200ms ease-in-out')),
            transition('hideTable => showTable', animate('200ms ease-in-out'))
        ]),
        trigger('filterFormInOut', [      
            state('showFilterForm', style({
                overflow: 'hidden',
                height: '100px'
            })),
            state('hideFilterForm', style({
                overflow: 'hidden',
                height: '0px'
            }))
        ])
    ]
})
export default class ProductsPageList implements 
    ContractNetworkingProductOutput,
    ContractNetworkingUpdateProductStatusOutput
{

    @ViewChild('cmpPaginator') paginator!: MatPaginator;
    @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
    
    productStatusFilterEnum = ProductStatusFilterEnum;

    filterOpened: string = 'hideFilter';
    tableOpened: string = 'hideTable';
    filterFormOpened: string = 'hideFilterForm';
    showFilterButton: boolean = false;
    showProgressBar: WritableSignal<boolean> = signal(false);

    FORMAT_DATE: string = UtilDefaultFormatDate;

    listDataColumn: string[] = ['id', 'typeElaboration', 'name', 'status', 'creationDate', 'action'];
    listData: ProductsEntity[] = [];

    menuTopLeftPosition =  {x: 0, y: 0}; 
    private _defaultPageOptions: PaginationEntity = UtilDefaultPageOptions;

    private _networkingProduct: NetworkingProduct = inject(NetworkingProduct);
    private _rootPage: RootPage = inject(RootPage);
    private _formBuilder: FormBuilder = inject(FormBuilder);
    private _dialog: MatDialog = inject(MatDialog);
    private _snackBar: MatSnackBar = inject(MatSnackBar);

    form: FormGroup = this._formBuilder.group({
        status: new FormControl('')
    });

    constructor(){
        this._rootPage.rootTitle = 'Productos';
        this._rootPage.setMenuById(2);
        this._networkingProduct.getListOutput = this;
        this._networkingProduct.updateStatusOutput = this;

        this.showProgressBar.set(true);
        this._defaultPageOptions = {
            length: 0,
            pageIndex: 0,
            pageSize: 15,
            pageSizeOptions: [5, 10, 15, 20],
            showFirstLastButtons: true
        };
        this._networkingProduct.getList((this._defaultPageOptions.pageIndex + 1), this._defaultPageOptions.pageSize);
    }

    onShowFilter(): void {
        this.showFilterButton = !this.showFilterButton;
        this.filterOpened = this.filterOpened === 'hideFilter' ? 'showFilter' : 'hideFilter';
        this.tableOpened = this.tableOpened === 'hideTable' ? 'showTable' : 'hideTable';
        this.filterFormOpened = this.filterFormOpened === 'hideFilterForm' ? 'showFilterForm' : 'hideFilterForm';
    }

    onProducts(): void {
        this._dialog.open(
            ProductsPageAdd, { 
                disableClose: true
            }
        ).afterClosed().subscribe(result => {
            if(result){
                this.onRealod();
            }
        });
    }

    onChangePage(event: PageEvent): void {
        this.showProgressBar.set(true);

        this._defaultPageOptions.length = event.length;
        this._defaultPageOptions.pageIndex = event.pageIndex;
        this._defaultPageOptions.pageSize = event.pageSize;

        this._networkingProduct.getList(
            (this._defaultPageOptions.pageIndex + 1),
            this._defaultPageOptions.pageSize
        );
    }

    onExecuteFilter(): void {
        this.showProgressBar.set(true);
        this._defaultPageOptions.pageIndex = 0;
        this._networkingProduct.getList(
            (this._defaultPageOptions.pageIndex + 1),
            this._defaultPageOptions.pageSize,
            this.form.value.status !== null && this.form.value.status !== ''? this.form.value.status : 0
        );
    }

    onClearFilter(): void {
        this.form.reset();
        this.showProgressBar.set(true);
        this._defaultPageOptions.pageIndex = 0;
        this._networkingProduct.getList(
            (this._defaultPageOptions.pageIndex + 1),
            this._defaultPageOptions.pageSize
        );
    }

    onRealod(): void {
        if(this.showFilterButton){
            this.onExecuteFilter();
        }else{
            this.onClearFilter();
        }
    }

    onRightClick(event: MouseEvent, item: ProductsEntity): void {
        event.preventDefault();
        this.menuTopLeftPosition.x = event.clientX; 
        this.menuTopLeftPosition.y = event.clientY;

        let newProductData: ProductsContextualMenuEntity = {
            id: item.id,
            typeElaboration: item.typeElaboration,
            name: item.name,
            status: item.status,
            creationDate: item.creationDate,
            updateDate: item.updateDate,
            creationUser: item.creationUser,
            disabledCheckOutProcess: true,
            disabledDefective: true
        }

        if(newProductData.status === ProductStatusEnum.Defectuoso){
            newProductData.disabledDefective = true;
        }else{
            newProductData.disabledDefective = false;
        }
        
        if(newProductData.status === ProductStatusEnum.EnProcesoDeSalida){
            newProductData.disabledCheckOutProcess = true;
        }else{
            newProductData.disabledCheckOutProcess = false;
        }

        this.menuTrigger.menuData = { item: newProductData };
        this.menuTrigger.openMenu(); 
    }

    onMarkAs(productId: number, status: number){
        this._networkingProduct.updateStatus(productId, status);
        this.showProgressBar.set(true);
    }

    getListProductsSuccessful(data: ProductsEntity[], total: number): void {
        this.listData = data;
        UtilTableConfig.configPaginator(this.paginator, this._defaultPageOptions, total);
        this.showProgressBar.set(false);
    }

    getListProductsFailure(message: string, type: AlertSnackbarTypeEnumEntity): void {
        this.showProgressBar.set(false);
        this._snackBar.openFromComponent(AlertSnackbarComponent, {
            duration: UtilDefaultAlertSnackbarDuration,
            data: {
                buttonText: 'OK',
                dialogType: type,
                informationText: message
            }
        });
    }

    updateProductstatusSuccessful(id: number): void {
        this.showProgressBar.set(false);
        this._snackBar.openFromComponent(AlertSnackbarComponent, {
            duration: UtilDefaultAlertSnackbarDuration,
            data: {
                buttonText: 'OK',
                dialogType: AlertSnackbarTypeEnumEntity.SUCCESSFUL,
                informationText: `El registro con código #${id} se actualizó de forma correcta!`
            }
        });
        this.onRealod();
    }

    updateProductstatusFailure(message: string, type: AlertSnackbarTypeEnumEntity): void {
        this.showProgressBar.set(false);
        this._snackBar.openFromComponent(AlertSnackbarComponent, {
            duration: UtilDefaultAlertSnackbarDuration,
            data: {
                buttonText: 'OK',
                dialogType: type,
                informationText: message
            }
        });
    }

}