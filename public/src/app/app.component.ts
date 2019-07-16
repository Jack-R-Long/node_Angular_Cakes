import {HttpService} from './http.service' ;
import { Component, OnInit} from '@angular/core'  //Add oninit 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  cakes = [];
  newCake : any;
  show_Cake: boolean;
  cakeInfo:any;
  newComment: any;
	
	constructor(private _httpService: HttpService){
	}
	ngOnInit(){
    this.getFromService()
    this.newCake = {name: "", image: ""};
    this.newComment = {rating: null, comment: "", cake_id: null};
    this.show_Cake = false;
	}
	getFromService(){
		let observable = this._httpService.getCakes()
		observable.subscribe(data => {
			console.log("Got our data")
      this.cakes = data['data']
		})
  }
  createCake(){
    let observable = this._httpService.postCake(this.newCake)
    observable.subscribe(data =>{
      console.log("Posted cake and returned")
      //reset newCake object
      this.newCake = {name: "", image: ""};
      this.getFromService()
    })
  }
  createComment(){
    let observable = this._httpService.postComment(this.newComment)
    observable.subscribe(data =>{
      console.log("Posted comment and returned")
      console.log(data)
      //reset new comment object 
      this.newComment = {rating: null, comment: "", cake_id: null}
      this.getFromService()
    })
  }
  cakeShow(cake_select){
    let observable = this._httpService.findCake(cake_select)
    observable.subscribe(data =>{
      console.log("Found selected cake and returned")
      // console.log(data)
      this.cakeInfo = data['data']
      this.show_Cake = true;  
    })
  }
}