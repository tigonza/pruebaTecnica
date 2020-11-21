import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TopComponent } from './top/top.component';
import { BrowserModule } from '@angular/platform-browser';
import { StoryComponent } from './story/story.component';




const appRoutes: Routes = [
  { path: 'top',  component:  TopComponent},
  { path: '404',  component:  PageNotFoundComponent},
  { path: 'story/:id', component:  StoryComponent},
  { path: '',   redirectTo: '/top', pathMatch: 'full' },
  { path: '**', redirectTo: '/404' },
];




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(
      appRoutes, { useHash: true }
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
