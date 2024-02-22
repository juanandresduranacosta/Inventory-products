import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { NestedTreeControl } from "@angular/cdk/tree";
import { MenuEntity } from '../../../3.transversal/3.0.entity/menu.entity';
import { MatTreeNestedDataSource } from "@angular/material/tree";
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LocalAuth } from '../../../2.repository/2.2.local/local.auth';

@Component({
    selector: 'root-page',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule, 
        NgxSpinnerModule, 
        MatSidenavModule, 
        MatTreeModule,
        MatIconModule,
        MatButtonModule,
        MatDividerModule,
        MatTooltipModule
    ],
    templateUrl: './root.page.html',
    styleUrl: './root.page.scss'
})
export class RootPage {

    isLogged: boolean = false;
    treeControl: NestedTreeControl<MenuEntity> = new NestedTreeControl<MenuEntity>(node => node.Children);
    dataMenu: MatTreeNestedDataSource<MenuEntity> = new MatTreeNestedDataSource<MenuEntity>();
    rootTitle: string = 'Monitor';
    notificationNumber: number = 10;

    constructor(
        private spinner: NgxSpinnerService, 
        private _router: Router,
        private _localAuth: LocalAuth
    ){
        //this.spinner.show();
        this.isLogged = this._localAuth.getIsAuthenticated();
        this.dataMenu.data = [{
            Id: 0,
            Name: 'Inicio',
            IsSelected: false,
            Icon: 'home_filled',
            Color: 'transparent',
            Url: '/'
        }/*,{
            Id: 1,
            Name: 'Dashboard',
            IsSelected: false,
            Icon: 'assessment',
            Color: 'transparent',
            Url: '/dashboard'
        }*/,{
            Id: 2,
            Name: 'Productos',
            IsSelected: false,
            Icon: 'inventory',
            Color: 'transparent',
            Url: '/products'
        }];
    }

    private changeMenuSelected(data: MenuEntity[], id: number){
        data.forEach(item => {
            item.IsSelected = false;
            if(item.Id == id){
                item.IsSelected = true;
            }
            if(item.Children){
                this.changeMenuSelected(item.Children, id);
            }
        });
    }

    setMenuById(id: number){
        this.changeMenuSelected(this.dataMenu.data, id);
    }

    hasChild = (_: number, node: MenuEntity) => !!node.Children && node.Children.length > 0;

    actionGoToPage(data: MenuEntity){
        this.changeMenuSelected(this.dataMenu.data, data.Id);
        data.IsSelected = true;
        if(data.Url){
            this._router.navigate([data.Url]);
        }
    }

    onExit(){
        this._localAuth.signOut();
    }
}