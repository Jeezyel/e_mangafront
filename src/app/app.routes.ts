import { Routes } from '@angular/router';
import { Component } from '@angular/core';

import { HomeTemplateComponent } from './components/template/home-template/home-template.component';
import { AdminTemplateComponent } from './components/template/admin-template/admin-template.component';
import { UserTemplateComponent } from './components/template/user-template/user-template.component';

import { SelectProfileComponent } from './components/select-profile/select-profile.component';
import { LoginComponent } from './components/login/login.component';

import { AdminGuard } from './guards/admin.guard';
import { UserGuard } from './guards/user.guard';

import { UsuarioListComponent } from './components/usuario/usuario-list/usuario-list.component';
import { UsuarioFormComponent } from './components/usuario/usuario-form/usuario-form.component';
import { usuarioResolver } from './components/usuario/resolver/usuario-resolver';

import { EstadoListComponent } from './components/estado/estado-list/estado-list.component';
import { EstadoFormComponent } from './components/estado/estado-form/estado-form.component';
import { estadoResolver } from './components/estado/resolver/estado-resolver';

import { MunicipioListComponent } from './components/municipio/municipio-list/municipio-list.component';
import { MunicipioFormComponent } from './components/municipio/municipio-form/municipio-form.component';
import { municipioResolver } from './components/municipio/resolver/municipio-resolver';

import { EditoraListComponent } from './components/editora/editora-list/editora-list.component';
import { EditoraFormComponent } from './components/editora/editora-form/editora-form.component';
import { editoraResolver } from './components/editora/resolver/editora-resolver';

import { FormatoListComponent } from './components/formatoManga/formato-list/formato-list.component';
import { FormatoFormComponent } from './components/formatoManga/formato-form/formato-form.component';
import { formatoResolver } from './components/formatoManga/resolver/formato-resolver';

import { GeneroListComponent } from './components/genero/genero-list/genero-list.component';
import { GeneroFormComponent } from './components/genero/genero-form/genero-form.component';
import { generoResolver } from './components/genero/resolver/genero-resolver';

import { IdiomaListComponent } from './components/idioma/idioma-list/idioma-list.component';
import { IdiomaFormComponent } from './components/idioma/idioma-form/idioma-form.component';
import { idiomaResolver } from './components/idioma/resolver/idioma-resolver';

import { EnderecoListComponent } from './components/endereco/endereco-list/endereco-list.component';
import { EnderecoFormComponent } from './components/endereco/endereco-form/endereco-form.component';
import { enderecoResolver } from './components/endereco/resolver/endereco-resolver';

import { TelefoneListComponent } from './components/telefone/telefone-list/telefone-list.component';
import { TelefoneFormComponent } from './components/telefone/telefone-form/telefone-form.component';
import { telefoneResolver } from './components/telefone/resolver/telefone-resolver';

import { MangaCardListComponent } from './components/manga/manga-card-list/manga-card-list.component';
import { MangaListComponent } from './components/manga/manga-list/manga-list.component';
import { MangaFormComponent } from './components/manga/manga-form/manga-form.component';
import { mangaResolver } from './components/manga/resolver/manga-resolver';

import { CarrinhoComponent } from './components/carrinho/carrinho.component';
import { PedidoFormComponent } from './components/pedido/pedido-form/pedido-form.component';

export const routes: Routes = [

    {
        path: '',
        component: HomeTemplateComponent,
        title: 'e-manga',
        children: [
            {path: '', pathMatch: 'full', redirectTo: 'ecommerce'},
            {path: 'ecommerce', component: MangaCardListComponent, title: 'Lista de Cards de Mangás' },

            {path: 'select-profile', component: SelectProfileComponent, title: 'Selecione o Perfil' },
            {path: 'login', component: LoginComponent, title: 'Login'},
            {path: 'usuario/new',component: UsuarioFormComponent, title: 'Novo Usuário'},

            {path: 'carrinho', component: CarrinhoComponent, title: 'Carrinho'},
        ],
    }, 
    {
        path: 'user',
        component: UserTemplateComponent,
        canActivate: [UserGuard],
        title: 'Perfil de Usuário',
        children: [

            {path: '', pathMatch: 'full', redirectTo: 'usuário'},

            {path: 'usuario', component: UsuarioListComponent, title: 'Minha conta'},
            {path: 'usuario/edit/:id', component: UsuarioFormComponent, title:'Editar Usuário', resolve: {usuario: usuarioResolver}},
            
            //{path: 'pedidos', component: PedidoListComponent, title: 'Meus pedidos'},
            {path: 'pedidos/new', component: PedidoFormComponent, title: 'Novo Pedido'}
        
        ],
    },
    {
        path: 'admin',
        component: AdminTemplateComponent,
        canActivate: [AdminGuard],
        title: 'Perfil de Administrativo',
        children: [

            {path: '', pathMatch: 'full', redirectTo: 'estados'},

            {path: 'usuario',component: UsuarioListComponent, title: 'Minha conta'},
            {path: 'usuario/edit/:id', component: UsuarioFormComponent, title:'Editar Usuário', resolve: {usuario: usuarioResolver}},

            {path: 'estados',component: EstadoListComponent, title: 'Lista de Estados'},
            {path: 'estados/new',component: EstadoFormComponent, title: 'Novo Estado'},
            {path: 'estados/edit/:id', component: EstadoFormComponent, title:'Editar Estado', resolve: {estado: estadoResolver}},
        
            {path: 'municipios',component: MunicipioListComponent, title: 'Lista de Municipios'},
            {path: 'municipios/new',component: MunicipioFormComponent, title: 'Novo Municipio'},
            {path: 'municipios/edit/:id',component: MunicipioFormComponent, resolve: {municipio: municipioResolver}},
        
            {path: 'enderecos',component: EnderecoListComponent, title: 'Lista de Endereços'},
            {path: 'enderecos/new',component: EnderecoFormComponent, title: 'Novo Endereço'},
            {path: 'enderecos/edit/:idEndereco',component: EnderecoFormComponent, resolve: {endereco: enderecoResolver}},
        
            {path: 'telefones',component: TelefoneListComponent, title: 'Lista de Telefones'},
            {path: 'telefones/new',component: TelefoneFormComponent, title: 'Novo Telefone'},
            {path: 'telefones/edit/:idTelefone', component: TelefoneFormComponent, title:'Editar Telefone', resolve: {telefone: telefoneResolver}},    
        
            {path: 'editoras',component: EditoraListComponent, title: 'Lista de Editoras'},
            {path: 'editoras/new',component: EditoraFormComponent, title: 'Nova Editora'},
            {path: 'editoras/edit/:idEditora',component: EditoraFormComponent, resolve: {editora: editoraResolver}},
        
            {path: 'formatos',component: FormatoListComponent, title: 'Lista de Formatos de Mangá'},
            {path: 'formatos/new',component: FormatoFormComponent, title: 'Novo Formato de Mangá'},
            {path: 'formatos/edit/:idFormato', component: FormatoFormComponent, title:'Editar Formato de Mangá', resolve: {formato: formatoResolver}},
        
            {path: 'generos',component: GeneroListComponent, title: 'Lista de Genero de Mangá'},
            {path: 'generos/new',component: GeneroFormComponent, title: 'Novo Genero de Mangá'},
            {path: 'generos/edit/:idMangaGenero', component: GeneroFormComponent, title:'Editar Genero de Mangá', resolve: {genero: generoResolver}},
        
            {path: 'idiomas',component: IdiomaListComponent, title: 'Lista de Idiomas de Mangá'},
            {path: 'idiomas/new',component: IdiomaFormComponent, title: 'Novo Idiomas de Mangá'},
            {path: 'idiomas/edit/:idIdioma', component: IdiomaFormComponent, title:'Editar Idioma de Mangá', resolve: {idioma: idiomaResolver}},
        
            {path: 'mangas',component: MangaListComponent, title: 'Lista de Mangás'},
            {path: 'mangas/new',component: MangaFormComponent, title: 'Novo Mangá'},
            {path: 'mangas/edit/:idManga', component: MangaFormComponent, title:'Editar Mangá', resolve: {manga: mangaResolver}}
            
        ]
    },

    // Rota coringa para páginas não encontradas
    {path: '**', redirectTo: '/ecommerce', pathMatch: 'full' }

];
