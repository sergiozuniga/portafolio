import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../interfaces/producto.interface';

@Injectable()
export class ProductosService {

  cargando = true;
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];

  constructor( private http: HttpClient ) { 

    this.cargarProductos();

  }

  private cargarProductos() {

    return new Promise( (resolve, reject ) => {
      this.http.get('https://myportafolio-4eb1a.firebaseio.com/productos_idx.json')
          .subscribe( (resp: Producto[]) => {
            this.productos = resp;
            setTimeout(() => {
              this.cargando = false;
              resolve();
            }, 2000 );
          });
    });
  }

  public getProducto(id: string){

    return this.http.get(`https://myportafolio-4eb1a.firebaseio.com/productos/${ id }.json`);
  
  }

  public buscarProducto( texto:string ){

    if (this.productos.length === 0){
      this.cargarProductos().then( () => {
        this.filtarProductos(texto);
      });  
    } else {
      this.filtarProductos(texto);
    }
  }

  private filtarProductos( texto: string ){
 
    this.productosFiltrados = [];
    texto = texto.toLocaleLowerCase();
    this.productos.forEach( producto => {
      const tituloLower = producto.titulo.toLocaleLowerCase();
      if ((producto.categoria.indexOf( texto ) >= 0) || (tituloLower.indexOf( texto ) >= 0)){
        this.productosFiltrados.push( producto );
      }
    });
  }
}
