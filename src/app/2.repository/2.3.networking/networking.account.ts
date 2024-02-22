import { Injectable } from "@angular/core";
import { NetworkingBase } from "../2.0.common/networking.base";
import { ContractNetworkingAccount, ContractNetworkingAccountOutput } from "../2.1.contract/contract.networking.account";
import { LocalAuth } from "../2.2.local/local.auth";
import { AuthenticationEntity } from "../../3.transversal/3.0.entity/authentication.entity";

@Injectable({
    providedIn: 'root'
})
export class NetworkingAccount extends NetworkingBase implements ContractNetworkingAccount {

    loginOutput?: ContractNetworkingAccountOutput;

    constructor(private _localAuthentication: LocalAuth){ 
        super();
    }

    login(email: string, password: string): void {
        this._httpClient.post<AuthenticationEntity>(
            this._apiEndpoint.authenticationEndpoint(), 
            `{"email":"${email}","password":"${password}"}`
        ).subscribe({
            next: (value: AuthenticationEntity) => {
                try{
                    this._localAuthentication.setToken(value.jwt);
                    this._localAuthentication.setDataUserAndPassword(email, password);
                    this.loginOutput?.loginOutputSuccessful();
                }catch(_: any){
                    this.loginOutput?.loginOutputFailure();
                }
            },
            error: (_: any) => {
                this.loginOutput?.loginOutputFailure();
            }
        });
    }

}