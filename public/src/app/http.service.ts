import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http' ;


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private _http: HttpClient) {
    this.getCakes();
   }

   getCakes(){
     return this._http.get('/cakes')
   }
   postCake(newCake){
     return this._http.post('/cakes', newCake)
   }
   findCake(cake_select){
     return this._http.get('/cakes/'+cake_select._id)
   }
   postComment(newComment){
     return this._http.post('/rating', newComment)
   }
}
