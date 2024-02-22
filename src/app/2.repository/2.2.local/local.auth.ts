import { Inject, Injectable, InjectionToken } from "@angular/core";
import { UtilLocalStorageKeys } from "../../3.transversal/3.1.util/util.constant";

export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
    providedIn: 'root',
    factory: () => localStorage
});
  
@Injectable({
    providedIn: 'root'
})
export class LocalAuth {

    constructor(@Inject(BROWSER_STORAGE) private _storage: Storage) {}

    setDataUserAndPassword(user: string, password: string): void{
        this._storage.setItem(UtilLocalStorageKeys.authenticationUserKey, user);
        this._storage.setItem(UtilLocalStorageKeys.authenticationPasswordKey, password);
    }

    getDataUserAndPassword(): string[] {
        const userLocalStorage: string | null = this._storage.getItem(UtilLocalStorageKeys.authenticationUserKey);
        const passwordLocalStorage: string | null = this._storage.getItem(UtilLocalStorageKeys.authenticationPasswordKey);
        if(userLocalStorage == null || userLocalStorage == '' || passwordLocalStorage == null || passwordLocalStorage == ''){
            return [];
        }
        return [userLocalStorage, passwordLocalStorage];
    }

    setToken(token: string): void {
        this._storage.setItem(UtilLocalStorageKeys.authenticationKey, token);
    }

    getToken(): string | null {
        let dataLocalStorage: string | null = this._storage.getItem(UtilLocalStorageKeys.authenticationKey);
        if(dataLocalStorage == null || dataLocalStorage == ''){
            return null;
        }
        return dataLocalStorage;
    }

    getIsAuthenticated(): boolean {
        let data = this._storage.getItem(UtilLocalStorageKeys.authenticationKey);
        if(data != null && data != ''){
            return true;
        }
        return false;
    }

    signOut(){
        this._storage.clear();
    }

}