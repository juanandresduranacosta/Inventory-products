import { Component, WritableSignal, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UtilControlValidator } from '../../../../3.transversal/3.1.util/util.control.validator';
import { AlertSnackbarTypeEnumEntity } from '../../../../3.transversal/3.0.entity/alert.snackbar.entity';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AlertSnackbarComponent } from '../../../1.0.component/alert.snackbar.component/alert.snackbar.component';
import { UtilDefaultAlertSnackbarDuration } from '../../../../3.transversal/3.1.util/util.constant';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ElaborationTypeEnum, ElaborationTypeFilterEnum } from '../../../../3.transversal/3.4.enum/elaboration.type.enum';
import { ProductStatusEnum, ProductStatusFilterEnum } from '../../../../3.transversal/3.4.enum/product.status.enum';
import { ContractNetworkingRegistryProductOutput } from '../../../../2.repository/2.1.contract/contract.networking.product';
import { NetworkingProduct } from '../../../../2.repository/2.3.networking/networking.product';

@Component({
    selector: 'products-page-add',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatTooltipModule,
        MatIconModule,
        MatSelectModule,
        MatNativeDateModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        FormsModule,
        MatSnackBarModule,
        AlertSnackbarComponent,
        MatProgressBarModule
    ],
    templateUrl: './products.page.add.html',
    styleUrl: './products.page.add.scss'
})
export class ProductsPageAdd  implements ContractNetworkingRegistryProductOutput {

    showProgressBar: WritableSignal<boolean> = signal(false);
    private _dialogRef: MatDialogRef<ProductsPageAdd> = inject(MatDialogRef<ProductsPageAdd>);
    private _formBuilder: FormBuilder = inject(FormBuilder);
    private _networkingProduct: NetworkingProduct = inject(NetworkingProduct);
    private _nit: string = inject(MAT_DIALOG_DATA);
    private _snackBar: MatSnackBar = inject(MatSnackBar);

    elaborationTypeEnum = ElaborationTypeEnum;
    productStatusEnum = ProductStatusEnum;

    elaborationTypeFilterEnum = ElaborationTypeFilterEnum;
    productStatusFilterEnum = ProductStatusFilterEnum;

    form: FormGroup = this._formBuilder.group({
        elaborationType: new FormControl('', Validators.required),
        name: new FormControl('', Validators.required),
        status: new FormControl('', Validators.required)
    });

    constructor(){
        this._dialogRef.disableClose = true;
        this._networkingProduct.registryOutput = this;
    }

    onRegistry(){
        this.form.markAllAsTouched();
        if(this.form.valid){
            this.showProgressBar.set(true);
            this._networkingProduct.registry(
                this.form.value.elaborationType,
                this.form.value.name,
                this.form.value.status
            );
        }
    }

    closeDialog = (status: boolean): void => this._dialogRef.close(status);

    controlValidator = (control: AbstractControl): boolean => UtilControlValidator.isValid(control);

    registryProductSuccessful(id: number): void {
        this.showProgressBar.set(false);
        this.closeDialog(true);
        this._snackBar.openFromComponent(AlertSnackbarComponent, {
            duration: UtilDefaultAlertSnackbarDuration,
            data: {
                buttonText: 'Cerrar',
                dialogType: AlertSnackbarTypeEnumEntity.SUCCESSFUL,
                informationText: 'El producto se registró correctamente.'
            }
        });
    }

    registryProductFailure(message: string, type: AlertSnackbarTypeEnumEntity): void {
        this.showProgressBar.set(false);
        this.closeDialog(false);
        this._snackBar.openFromComponent(AlertSnackbarComponent, {
            duration: UtilDefaultAlertSnackbarDuration,
            data: {
                buttonText: 'Cerrar',
                dialogType: type,
                informationText: message
            }
        });
    }

}