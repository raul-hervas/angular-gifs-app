import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchGifsResponse } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey : string = 'XFGEypyP1X3I6I3V1tqrY3Y3LDQtBrhs';
  private urlApi : string = 'https://api.giphy.com/v1/gifs';
  private _historial : string[] = [];
  
  public resultados : Gif[] = [];

  get historial(){
    return [...this._historial]
  }

  constructor(private http : HttpClient) {
    this._historial = JSON.parse(localStorage.getItem("historial")!) || [];
    this.resultados = JSON.parse(localStorage.getItem("resultados")!) || [];
  }

  buscarGifts(query: string)
  {
    if(query.trim().length > 0){
      if(!this._historial.includes(query))
      {
        this._historial.unshift(query.trim().toLocaleLowerCase());
        this._historial =  this._historial.splice(0,10);
        localStorage.setItem("historial", JSON.stringify(this._historial));
      }

      const params = new HttpParams()
        .set("api_key", this.apiKey)
        .set("q", query)
        .set("limit", '50');

      this.http
          .get<SearchGifsResponse>(`${this.urlApi}/search`, { params })
          .subscribe( respuesta => { 
            this.resultados = respuesta.data; 
            localStorage.setItem("resultados", JSON.stringify(this.resultados));
          });

      /*
      fetch('https://api.giphy.com/v1/gifs/search?api_key=XFGEypyP1X3I6I3V1tqrY3Y3LDQtBrhs&q=manzana&limit=10').then(function(resultado){
        resultado.json().then( data=> { console.log(data); });
      });*/
      

    }
  }

}

