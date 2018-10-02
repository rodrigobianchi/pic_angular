import { Component, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { AnuncioService } from '../../services/anuncio.service';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Anuncio } from '../../models/anuncio.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  private subjectPesquisa: Subject<string> = new Subject<string>();
  private anuncios: Observable<Anuncio[]>;

  constructor(private anuncioService: AnuncioService) { }

  ngOnInit() {
    this.subjectPesquisa.pipe( // 1 - Pipe concatena operadores a serem executados
      debounceTime(2000), // 2  -Executa a ação após 3 segundos
      distinctUntilChanged(), // 3 - Faz pesquisa distintas
      map((termo: string) => { // 4 - Fazer validações no texto digitado
        if (termo.trim() === '') {
          return new Observable<Anuncio[]>();
        }

        // 5 - Executa pesquisa com o termo digitado
        return this.anuncioService.findByNome(termo);
      }),
    ).subscribe(resultado => {
      console.log(resultado);
      this.anuncios = resultado;
    })
  }

  public pesquisa(termoBusca: string): void {
    this.subjectPesquisa.next(termoBusca);
  }

  public limparPesquisa(): void {
    this.subjectPesquisa.next('');
  }

}
