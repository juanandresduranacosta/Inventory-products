export interface ContractNetworkingAccount {
    loginOutput?: ContractNetworkingAccountOutput;
    login(email: string, password: string): void;
}

export interface ContractNetworkingAccountOutput {
    loginOutputSuccessful(): void;
    loginOutputFailure(): void;
}