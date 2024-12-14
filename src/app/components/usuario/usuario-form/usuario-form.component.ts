import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

import { Usuario } from '../../../models/usuario.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule
  ],
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit {
  formGroup!: FormGroup;
  idUsuario?: number;
  isAdmin: boolean = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.idUsuario = this.route.snapshot.params['id'];
    this.isAdmin = this.authService.isAdmin();

    if (this.idUsuario) {
      this.usuarioService.findById(this.idUsuario).subscribe((usuario) => {
        this.populateForm(usuario);
      });
    }
  }

  initForm(): void {
    this.formGroup = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      senha: ['', Validators.required]
    });
  }

  populateForm(usuario: Usuario): void {
    this.formGroup.patchValue({
      nome: usuario.nome,
      email: usuario.email,
      username: usuario.username,
      senha: '' // Senha não preenchida ao editar
    });
  }

  salvar(): void {
    if (this.formGroup.valid) {
      const usuario = this.formGroup.value;

      if (!this.isAdmin) {
        usuario.perfis = [{ id: 2, label: 'USER' }]; // Perfil USER
      }

      if (this.idUsuario) {
        usuario.id = this.idUsuario;
        this.usuarioService.update(usuario).subscribe(() => {
          this.router.navigate(['/usuarios']);
        });
      } else {
        this.usuarioService.create(usuario).subscribe(() => {
          this.router.navigate(['/usuarios']);
        });
      }
    }
  }

  excluir(): void {
    if (this.idUsuario) {
      this.usuarioService.delete(this.idUsuario).subscribe(() => {
        this.router.navigate(['/usuarios']);
      });
    }
  }
}