import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QueryService, StoryDetails } from '../query.service';

export interface Section {
  name: string;
  updated: Date;
}

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./story.component.scss']
})

export class StoryComponent implements OnInit {
  storyDetails:StoryDetails
  storyId:number
  data:any
  title:string
  ready:boolean=false

  constructor( private route: ActivatedRoute, private queryService:QueryService, private cdr:ChangeDetectorRef) {}

  ngOnInit(): void {
    this.storyId = Number(this.route.snapshot.paramMap.get('id'));
    this.queryService.current_selected_id = this.storyId
    this.queryService.current_story_details.subscribe(x => {
      this.storyDetails = x
      this.title = this.queryService.current_story_title
      this.data = this.storyDetails.comments
      this.ready=true
      this.cdr.detectChanges()

    });
  } 

}
