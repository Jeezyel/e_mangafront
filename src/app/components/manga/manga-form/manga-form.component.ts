import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { Location, NgFor, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { HttpErrorResponse } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';

import { Manga } from '../../../models/manga.model';
import { MangaService } from '../../../services/manga.service';
import { Editora } from '../../../models/editora.model';
import { EditoraService } from '../../../services/editora.service';
import { Genero } from '../../../models/genero.model';
import { GeneroService } from '../../../services/genero.service';
import { Formato } from '../../../models/formato.model';
import { FormatoService } from '../../../services/formato.service';
import { Idioma } from '../../../models/idioma.model';
import { IdiomaService } from '../../../services/idioma.service';
import { ClassificacaoIndicativa } from '../../../models/classificacao-indicativa.model';

@Component({
  selector: 'app-manga-form',
  standalone: true,
  imports: [
    NgIf, 
    ReactiveFormsModule, 
    MatFormFieldModule,
    MatInputModule, 
    MatButtonModule, 
    MatCardModule, 
    MatToolbarModule,
    RouterModule, 
    MatSelectModule, 
    MatIconModule
  ],
  templateUrl: './manga-form.component.html',
  styleUrls: ['./manga-form.component.css']
})
export class MangaFormComponent implements OnInit {
  
  formGroup: FormGroup;
  editoras: Editora [] = [];
  generos: Genero [] = [];
  formatos: Formato [] = [];
  idiomas: Idioma [] = [];
  classificacaoIndicativas: ClassificacaoIndicativa[] = [];
  fileName: string = '';
  selectedFile: File | null = null; 
  imagePreview: string | ArrayBuffer | null = null;

  constructor( 
    private formBuilder: FormBuilder,
    private mangaService: MangaService,
    private editoraService: EditoraService,
    private generoService: GeneroService,
    private formatoService: FormatoService,
    private IdiomaService: IdiomaService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {
    const manga: Manga = activatedRoute.snapshot.data['manga'];
    const editora: Editora = activatedRoute.snapshot.data['editora'];
    const genero: Genero = activatedRoute.snapshot.data['genero'];
    const formato: Formato = activatedRoute.snapshot.data['formato'];
    const idioma: Idioma = activatedRoute.snapshot.data['idioma'];
    const classificacaoIndicativa: ClassificacaoIndicativa = activatedRoute.snapshot.data['classificacaoIndicativa'];

    this.formGroup = this.formBuilder.group({
      idManga: [manga?.idManga || null],
      nome: [manga?.nome || null, [Validators.required]],
      valor: [manga?.valor || null, [Validators.required]],
      editora: [manga?.editora?.idEditora || null, [Validators.required]], 
      genero: [Array.isArray(manga?.genero) 
        ? manga.genero.map((g: Genero) => g.idMangaGenero) 
        : [manga?.genero?.idMangaGenero],[Validators.required]],
      formato: [manga?.formato?.idFormato || null, [Validators.required]],
      idioma: [manga?.idioma?.idIdioma || null, [Validators.required]],
      classificacaoIndicativa: [manga?.classificacaoIndicativa?.id || null, [Validators.required]],
      estoque: [manga?.estoque || null, [Validators.required]]
  });
  }

  ngOnInit(): void {
    this.getEditoraForSelect(),
    this.getGeneroForSelect(),
    this.getFormatoForSelect(),
    this.getIdiomaForSelect(),
    this.mangaService.findClassificacaoIndicativa().subscribe(data => {
      this.classificacaoIndicativas = data;
    });
  }

  getEditoraForSelect(): void{
    this.editoraService.findAll(0, 100).subscribe({
      next: (data) => {
        console.log('Editoras carregadas:', data); // Verifica os estados carregados.
        this.editoras = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao carregar editoras:', error);
      }
    });
  }

  getGeneroForSelect(): void{
    this.generoService.findAll(0, 100).subscribe({
      next: (data) => {
        console.log('Genero carregados:', data); // Verifica os estados carregados.
        this.generos = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao carregar generos:', error);
      }
    });
  }

  getFormatoForSelect(): void{
    this.formatoService.findAll(0, 100).subscribe({
      next: (data) => {
        console.log('Formatos carregados:', data); // Verifica os estados carregados.
        this.formatos = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao carregar formatos:', error);
      }
    });
  }

  getIdiomaForSelect(): void{
    this.IdiomaService.findAll(0, 100).subscribe({
      next: (data) => {
        console.log('Idiomas carregados:', data); // Verifica os estados carregados.
        this.idiomas = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao carregar idiomas:', error);
      }
    });
  }

  salvar(): void {
    const page = 0; // Página inicial
    const size = 10; // Número de itens por página
    
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
        const manga = this.formGroup.value;

        const data = {
            idManga: manga.idManga || null,
            nome: manga.nome,
            valor: manga.valor,
            idEditora: manga.editora?.idEditora, // ID da editora
            idFormato: manga.formato?.idFormato, // ID do formato
            idMangaGenero: Array.isArray(manga.genero) 
              ? manga.genero.map((g: any)=>g.idMangaGenero) 
              : [manga.genero?.idMangaGenero], // Gênero como array
            idIdioma: manga.idioma?.idIdioma, // ID do idioma
            id: manga.classificacaoIndicativa?.id, // ID da classificação indicativa
            estoque: manga.estoque,
        };

        console.log('Payload enviado:', data);

        const operacao = manga.idManga == null
            ? this.mangaService.create(data)
            : this.mangaService.update({ ...data, idManga: manga.idManga });

        operacao.subscribe({
            next: () => {
                this.mangaService.findAll(page, size); // Atualiza a listagem
                this.router.navigate(['/mangas'], { queryParams: { success: true } });
            },
            error: (error: HttpErrorResponse) => {
                console.error('Erro ao salvar:', error);
                this.tratarErros(error);
            }
        });
    }
  }

  voltarPagina() {
    this.location.back();
  }

  tratarErros(error: HttpErrorResponse): void {
    if (error.status === 400 && error.error?.errors) {
      error.error.errors.forEach((validationError: any) => {
        const formControl = this.formGroup.get(validationError.fieldName);
        if (formControl) {
          formControl.setErrors({ apiError: validationError.message });
        }
      });
    } else if (error.status < 400) {
      alert(error.error?.message || 'Erro genérico no envio do formulário.');
    } else if (error.status >= 500) {
      alert('Erro interno do servidor. Por favor, tente novamente mais tarde.');
    }
  }

  carregarImagemSelecionada(event: any) {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      this.fileName = this.selectedFile.name;
      // carregando image preview
      const reader = new FileReader();
      reader.onload = e => this.imagePreview = reader.result;
      reader.readAsDataURL(this.selectedFile);
    }

  }

  //private uploadImage(mangaId: number) {
    //if (this.selectedFile) {
      //this.mangaService.uploadImage(mangaId, this.selectedFile.name, this.selectedFile)
      //.subscribe({
        //next: () => {
          //this.voltarPagina();
        //},
        //error: err => {
          //console.log('Erro ao fazer o upload da imagem');
          // tratar o erro
        //}
      //})
    //} else {
      //this.voltarPagina();
    //}
  //}

  excluir() {
    if (this.formGroup.valid) {
      const manga = this.formGroup.value;
      if (manga.id != null) {
        this.mangaService.delete(manga).subscribe({
          next: () => {
            this.router.navigateByUrl('/mangas');
          },
          error: (err) => {
            console.log('Erro ao Excluir' + JSON.stringify(err));
          }
        });
      }
    }
  }

  errorMessages: { [controlName: string]: { [errorName: string]: string } } = {
    nome: {
      required: 'O nome deve ser informado.',
      minlength: 'O nome deve conter ao menos 2 letras.',
      maxlength: 'O nome deve conter no máximo 10 letras.',
      apiError: ' '
    },
    valor: {
      required: 'O preço deve ser informado.',
      apiError: ' '
    },
    editora: {
      required: 'A descricao deve ser informada.',
      apiError: ' '
    },
    genero: {
      required: 'A descricao deve ser informada.',
      apiError: ' '
    },
    formato: {
      required: 'A descricao deve ser informada.',
      apiError: ' '
    },
    idioma: {
      required: 'A descricao deve ser informada.',
      apiError: ' '
    },
    estoque: {
      required: 'O estoque deve ser informado.',
      apiError: ' '
    },
    classificacaoindicativa: {
      required: 'A descricao deve ser informada.',
      apiError: ' '
    }
  }

  getErrorMessage(controlName: string, errors: ValidationErrors | null | undefined): string {
    if (!errors) {
      return '';
    }
    for (const errorName in errors) {
      if (errors.hasOwnProperty(errorName) && this.errorMessages[controlName][errorName]) {
        return this.errorMessages[controlName][errorName];
      }
    }

    return 'invalid field';
  }

}