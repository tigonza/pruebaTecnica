import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, forkJoin} from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

const apost = /&#x27;/gi
const slash = /&#x2F;/gi
const quote = /&quot;/gi



@Injectable({
  providedIn: 'root',
})
export class QueryService {
  current_best_stories:any[] = []
  current_selected_id:number
  current_story_title:string
  comments_bucket:StoryDetails[] =[]

  constructor(private http:HttpClient ) { }

  //Url para las 200 "mejores historias"
  item_url_base = "https://hacker-news.firebaseio.com/v0/item/";


  //Solicita Item por Id, retorna observable
  getItemById( id: number ) {
    return this.http.get(this.item_url_base+id+'.json', {responseType:'json'})
  }

  //Genera lista de los observables para cada historia
  generateHttpRequests(ids:number[]) {
    let url_list = []
    for (let i of ids){
      url_list.push(this.getItemById(i))
    }
    return url_list
  }

  //Crear Observable que consume API en subscribe
  //Al subscribir se hace la request y se actualiza el valor del observable
  current_stories = new Observable<Story[]>(s => {
    if (this.current_best_stories.length == 0){
      this.http.get('https://hacker-news.firebaseio.com/v0/beststories.json').subscribe(resp1 => {
        let r1:any=resp1
        forkJoin(this.generateHttpRequests(r1)).subscribe(r => {
          let counter =1
          for (let i of r){
            let r2:any = i
            let newStory:Story = {
              id: r2.id,
              position: counter,
              title: r2.title,
              url: r2.url,
              comments: r2.kids,
            }
            this.current_best_stories.push(newStory)
            counter++
          }
          s.next(this.current_best_stories)
        });
      });

    }
  });

  // Actualiza los comentarios de la ultima historia revisada.
  current_story_details = new Observable<StoryDetails>(s => {
    this.getItemById(this.current_selected_id).subscribe( sr => {
      let aux:any = sr
      this.current_story_title = aux.title
      forkJoin(this.generateHttpRequests(aux.kids)).subscribe(r => {
        let comments:string[] = []

        for (let i of r){
          let r2:any = i
          comments.push(this.processText(r2.text))
        }
        let storydetails:StoryDetails = {
          title: aux.title,
          id: aux.id,
          comments: comments,
          kids: aux.kids
        }
        this.comments_bucket.push(storydetails)
        s.next(storydetails)
      })
    });
  });

  processText(text:string){
    if (!text){
      return ''
    }
    let newtext=text.replace(apost, '\'')
    newtext = newtext.replace(quote, '\"')
    newtext = newtext.replace(/<p>/gi, '\n')
    newtext = newtext.replace(slash, '/')
    newtext = newtext.replace(/&gt;/, '>')

    // TODO: Grab links from text, turn them into hyperlinks(?),
    // Also finish finding all document specific expresions and transform them.

    // let linkRetrieval = false
    //   if (newtext.indexOf('<a') !=-1){
    //     let aux = newtext.split('<a')        
    // }
    

    return newtext
  }
}

export class Story {
  id: number;
  position: number;
  title: string;
  url: string;
  comments: number[];
}

export class StoryDetails {
  id: number;
  title: string;
  comments: string[];
  kids: number[];
}