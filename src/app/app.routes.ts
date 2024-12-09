import { Routes } from '@angular/router';
import { Component } from '@angular/core';

import { AdminTemplateComponent } from './components/template/admin-template/admin-template.component';
import { UserTemplateComponent } from './components/template/user-template/user-template.component';
import { LoginComponent } from './components/login/login.component';

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

//import { MangaCardListComponent } from './components/faixa/faixa-card-list/faixa-card-list.component';

export const routes: Routes = [
    {
        path: '',
        component: UserTemplateComponent,
        title: 'e-manga commerce',
        children: [

            {path: '', pathMatch: 'full', redirectTo: 'ecommerce'},
            //{path: 'ecommerce', component: MangaCardListComponent, title: 'Lista de Cards de Mangás'},

        ]
    },

    {
        path: 'admin',
        component: AdminTemplateComponent,
        title: 'Administração e-manga commerce',
        children: [

            {path: '', pathMatch: 'full', redirectTo: 'estados'},
            {path: 'login', component: LoginComponent, title: 'Login'},

            {path: 'estados', component: EstadoListComponent, title: 'Lista de Estados'},
            {path: 'estados/new', component: EstadoFormComponent, title: 'Novo Estado'},
            {path: 'estados/edit/:id', component: EstadoFormComponent, resolve: {estado: estadoResolver}},

            {path: 'municipios',component: MunicipioListComponent, title: 'Lista de Municipios'},
            {path: 'municipios/new',component: MunicipioFormComponent, title: 'Novo Municipio'},
            {path: 'municipios/edit/:id',component: MunicipioFormComponent, resolve: {municipio: municipioResolver}},
            
            {path: 'editoras',component: EditoraListComponent, title: 'Lista de Editoras'},
            {path: 'editoras/new',component: EditoraFormComponent, title: 'Nova Editora'},
            {path: 'editoras/edit/:idEditora',component: EditoraFormComponent, resolve: {editora: editoraResolver}},
            
            {path: 'formatos',component: FormatoListComponent, title: 'Lista de Formatos de Mangá'},
            {path: 'formatos/new',component: FormatoFormComponent, title: 'Novo Formato de Mangá'},
            {path: 'formatos/edit/:idFormato', component: FormatoFormComponent, title:'Editar Formato de Mangá', resolve: {formato: formatoResolver}},
        
            {path: 'generos',component: GeneroListComponent, title: 'Lista de Genero de Mangá'},
            {path: 'generos/new',component: GeneroFormComponent, title: 'Novo Genero de Mangá'},
            {path: 'generos/edit/:idMangaGenero', component: GeneroFormComponent, title:'Editar Genero de Mangá', resolve: {genero: generoResolver}},
        
            {path: 'idiomas',component: IdiomaListComponent, title: 'Lista de Idiomas'},
            {path: 'idiomas/new',component: IdiomaFormComponent, title: 'Novo Idioma'},
            {path: 'idiomas/edit/:idIdioma', component: IdiomaFormComponent, title:'Editar Idioma', resolve: {idioma: idiomaResolver}}
            
        ]
    }

];
