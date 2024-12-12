import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

import { ItemCarrinho } from '../../models/item-carrinho.model';
import { CarrinhoService } from '../../services/carrinho.service';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './carrinho.component.html',
  styleUrl: './carrinho.component.css'
})
export class CarrinhoComponent implements OnInit {
  
  carrinhoItens: ItemCarrinho[] = [];

  constructor(private carrinhoService: CarrinhoService,
              private router: Router )
  {  }
  
  ngOnInit(): void {
    this.carrinhoService.carrinho$.subscribe(itens => { 
      this.carrinhoItens = itens;
    });
  }

  removerItem(item: ItemCarrinho) {
    this.carrinhoService.removerItem(item);
  }

  calcularTotal(): number {
    return this.carrinhoItens.reduce((total, item) => total + item.quantidade * item.preco, 0);
  }

  finalizarCompra() {

    // verifidcar se estah logado

    // 

  }

}