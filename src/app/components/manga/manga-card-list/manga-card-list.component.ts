import { NgFor } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardActions, MatCardContent, MatCardFooter, MatCardModule, MatCardTitle } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrencyPipe } from '@angular/common';

import { Manga } from '../../../models/manga.model';
import { MangaService } from '../../../services/manga.service';
import { CarrinhoService } from '../../../services/carrinho.service';

type Card = {
  idManga: number,
  nome: string,
  valor: number,
  classificacaoIndicativa: string,
  editora: string,
  genero: string,
  formato: string,
  idioma: string,
  estoque: number,
  imageUrl: string,
}

@Component({
  selector: 'app-manga-card-list',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, NgFor, 
    MatCardActions, MatCardContent, MatCardTitle, MatCardFooter, CurrencyPipe],
  templateUrl: './manga-card-list.component.html',
  styleUrls: ['./manga-card-list.component.css']
})
export class MangaCardListComponent implements OnInit {
  mangas: Manga[] = [];
  cards = signal<Card[]>([]);

  constructor(private mangaService: MangaService,
              private carrinhoService: CarrinhoService,
              private snackBar: MatSnackBar
  ) {

  }
  ngOnInit(): void {
    this.carregarMangas();
  }

  carregarMangas() {
    // buscando as mangas
    this.mangaService.findAll(0,10).subscribe (data => {
      this.mangas = data;
      this.carregarCards();
    })
  }

  carregarCards() {
    const cards: Card[] = [];
    this.mangas.forEach(manga => {
      cards.push({
        idManga: manga.idManga,
        nome: manga.nome,
        valor: manga.valor,
        classificacaoIndicativa: manga.classificacaoIndicativa.label,
        editora: manga.editora.nome,
        formato: manga.formato.formato,
        genero: manga.genero.genero,
        idioma: manga.idioma.idioma,
        estoque: manga.estoque,
        imageUrl: this.mangaService.getUrlImage(manga.nomeImagem)
      })
    });
    this.cards.set(cards);
  }

  adicionarAoCarrinho(card: Card) {
    this.showSnackbarTopPosition('Produto adicionado ao carrinho');
    this.carrinhoService.adicionar({
      id: card.idManga,
      nome: card.nome,
      preco: card.valor,
      quantidade: 1,
      nomeImagem: card.imageUrl
    });
  }

  showSnackbarTopPosition(content: any) {
    this.snackBar.open(content, 'fechar', {
      duration: 3000,
      verticalPosition: "top",
      horizontalPosition: "center"
    });
  }

}