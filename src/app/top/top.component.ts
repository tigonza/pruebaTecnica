import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { QueryService } from '../query.service';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./top.component.scss']
})
export class TopComponent implements OnInit {
  @Input() displayedColumns:string[] = []
  title = 'Prueba Tecnica: Hacker News';
  public ready:boolean = false

  get runChangeDetection() {
    this.table.renderRows();
    console.log('change')
    return true;
  }
  topStories:any
  
  dataSource:any
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('myTable') table: MatTable<any>; 
 

  constructor(private queryService:QueryService, private cdr:ChangeDetectorRef){ 
    this.displayedColumns.push('n°', 'title', 'comments');
  }
  
  ngOnInit(){
    //Checks for existing best_stories data on the query service
    if (this.queryService.current_best_stories.length>0) {
      this.dataSource = new MatTableDataSource<any>(this.queryService.current_best_stories)
      this.ready=true
      
      //for changes to apply and redraw, it is necesary to call upon detectChanges, since the 
      //change detection strategy is OnPush, it will not do it by itself.
      this.cdr.detectChanges()

      //Timeout so the pagination doesnt bug out.
      setTimeout(() => this.dataSource.paginator = this.paginator);

    }
    
    //Subscribe to the http response observable for the bulk of the best stories
    this.queryService.current_stories.subscribe(r => {
      if (!this.ready){
        this.dataSource = new MatTableDataSource<any>(r)
        this.ready=true
        

        this.cdr.detectChanges()
        setTimeout(() => this.dataSource.paginator = this.paginator);

      }
    });
  }


  //TitleClick redirects user to story url.
  titleClick(url: string){
    window.location.href = url
  }

}
