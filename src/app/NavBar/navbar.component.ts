import { Component, OnInit } from '@angular/core';
import { faWineBottle,faTh,faHistory,faCalendarDay,faSync,faList,faCoins } from '@fortawesome/free-solid-svg-icons';


@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavBarComponent implements OnInit {
    faCoins=faCoins
    faList=faList
    faSync=faSync
    faCalendarDay=faCalendarDay
    faHistory=faHistory
    faTh=faTh
    faWineBottle=faWineBottle
    constructor() { }

    ngOnInit(): void { }
}
