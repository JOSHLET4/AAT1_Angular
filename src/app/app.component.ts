import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { forkJoin, map, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule],
})
export class AppComponent implements OnInit {
  iconos: string[] = [];
  selecciones: number[] = [];
  parejaIndex: number[] = [];
  encontradas: boolean[] = [];
  dogImages: string[] = [];
  cartasVisibles: boolean[] = [];
  juegoTerminado: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.iniciarNuevoJuego();
  }

  iniciarNuevoJuego() {
    this.getDogImages(12).subscribe((images) => {
      this.dogImages = images;
      this.iconos = [...this.dogImages, ...this.dogImages];
      this.iconos = this.shuffleArray(this.iconos);
      this.parejaIndex = Array.from(Array(this.iconos.length).keys());
      this.encontradas = Array(this.iconos.length).fill(false);
      this.selecciones = [];
      this.cartasVisibles = Array(this.iconos.length).fill(false);
      this.juegoTerminado = false;
      this.mostrarImágenes();
    });
  }

  mostrarImágenes() {
    this.cartasVisibles = Array(this.iconos.length).fill(true);

    setTimeout(() => {
      this.cartasVisibles = Array(this.iconos.length).fill(false);
    }, 5000);
  }

  getDogImages(count: number) {
    const requests = Array(count)
      .fill(null)
      .map(() =>
        this.http
          .get<any>('https://dog.ceo/api/breeds/image/random')
          .pipe(map((response) => response.message))
      );
    return forkJoin(requests).pipe(
      tap((images) => console.log('All dog images fetched:', images)),
      tap({
        error: (err) => console.error('Error fetching dog images', err),
      })
    );
  }

  seleccionarTarjeta(index: number) {
    if (
      this.selecciones.length < 2 &&
      !this.selecciones.includes(index) &&
      !this.encontradas[index]
    ) {
      this.selecciones.push(index);
      this.cartasVisibles[index] = true;

      if (this.selecciones.length === 2) {
        setTimeout(() => {
          if (
            this.iconos[this.selecciones[0]] ===
            this.iconos[this.selecciones[1]]
          ) {
            this.encontradas[this.selecciones[0]] = true;
            this.encontradas[this.selecciones[1]] = true;
          } else {
            this.cartasVisibles[this.selecciones[0]] = false;
            this.cartasVisibles[this.selecciones[1]] = false;
          }
          this.selecciones = [];
          this.checkForWin();
        }, 1000);
      }
    }
  }

  checkForWin() {
    if (this.encontradas.every((isFound) => isFound)) {
      this.juegoTerminado = true;
    }
  }

  shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  reiniciarJuego() {
    this.iniciarNuevoJuego();
  }
}
