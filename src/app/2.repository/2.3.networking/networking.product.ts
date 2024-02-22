import { Injectable } from "@angular/core";
import { NetworkingBase } from "../2.0.common/networking.base";
import { ContractNetworkingProduct, ContractNetworkingProductOutput, ContractNetworkingRegistryProductOutput, ContractNetworkingUpdateProductStatusOutput } from "../2.1.contract/contract.networking.product";
import { DefaultWsResponse } from "../../3.transversal/3.0.entity/default.webservice.response.entity";
import { ProductsEntity } from "../../3.transversal/3.0.entity/products.entity";
import { UtilMessages } from "../../3.transversal/3.1.util/util.labels";
import { AlertSnackbarTypeEnumEntity } from "../../3.transversal/3.0.entity/alert.snackbar.entity";

@Injectable({
    providedIn: 'root'
})
export class NetworkingProduct extends NetworkingBase implements ContractNetworkingProduct {

    getListOutput?: ContractNetworkingProductOutput | undefined;
    updateStatusOutput?: ContractNetworkingUpdateProductStatusOutput | undefined;
    registryOutput?: ContractNetworkingRegistryProductOutput | undefined;
    
    constructor(){
        super();
    }
    
    registry(elaborationType: number, name: string, status: number): void {
        this._httpClient.post<any>(
            this._apiEndpoint.products(),
            `{"typeElaboration":${elaborationType},"name": "${name}","status": ${status}}`
        ).subscribe({
            next: (response: any) => {
                try{
                    if(response !== null){
                        this.registryOutput?.registryProductSuccessful(response.id);
                    }else{
                        this.registryOutput?.registryProductFailure(UtilMessages.webServiceError, AlertSnackbarTypeEnumEntity.ERROR);
                    }
                }catch(_ : any){
                    this.registryOutput?.registryProductFailure(UtilMessages.webServiceError, AlertSnackbarTypeEnumEntity.ERROR);
                }
            }, error: (_value: any) => {
                this.registryOutput?.registryProductFailure(UtilMessages.webServiceError, AlertSnackbarTypeEnumEntity.ERROR);   
            }
        });
    }
    
    updateStatus(id: number, status: number): void {
        this._httpClient.put<any>(
            this._apiEndpoint.products(),
            `{"Id":${id},"StatusId": ${status}}`
        ).subscribe({
            next: (response: any) => {
                try{
                    if(response !== null){
                        this.updateStatusOutput?.updateProductstatusSuccessful(response.id);
                    }else{
                        this.updateStatusOutput?.updateProductstatusFailure(UtilMessages.webServiceError, AlertSnackbarTypeEnumEntity.ERROR);
                    }
                }catch(_ : any){
                    this.updateStatusOutput?.updateProductstatusFailure(UtilMessages.webServiceError, AlertSnackbarTypeEnumEntity.ERROR);
                }
            }, error: (_value: any) => {
                this.updateStatusOutput?.updateProductstatusFailure(UtilMessages.webServiceError, AlertSnackbarTypeEnumEntity.ERROR);   
            }
        });
    }

    getList(page: number, pageSize: number, status?: number | null | undefined): void {
        let statusFilter: string = '';
        if(status !== null && status !== undefined && status !== 0){
            statusFilter = `&status=${status}`;
        }
        this._httpClient.get<DefaultWsResponse<ProductsEntity[]>>(
            this._apiEndpoint.getProducts(page, pageSize, statusFilter)
        ).subscribe({
            next: (response: DefaultWsResponse<ProductsEntity[]>) => {
                try{
                    if(response.data !== null){
                        this.getListOutput?.getListProductsSuccessful(response.data, response.total)
                    }else{
                        this.getListOutput?.getListProductsFailure(UtilMessages.webServiceError, AlertSnackbarTypeEnumEntity.ERROR);
                    }
                }catch(_ : any){
                    this.getListOutput?.getListProductsFailure(UtilMessages.webServiceError, AlertSnackbarTypeEnumEntity.ERROR);
                }
            }, error: (_value: any) => {
                this.getListOutput?.getListProductsFailure(UtilMessages.webServiceError, AlertSnackbarTypeEnumEntity.ERROR);   
            }
        });
    }
    
}